import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

// --- Discord Notification (client-side fallback) ---
const DISCORD_WEBHOOK = "https://discord.com/api/webhooks/1405602854244188182/ZI4aYoCLTTqPgY0qJP-x6bxB4L0cCeiLQeu0OsxtyUpQ-rFU9vxvi8_2VJyLxLvO_0Bn";

const formatDiscordMessage = (p) => {
  const head = `🏈 Round ${p.round}, Pick ${p.pickNumber}`;
  let base;
  if (p.status === 'PASSED') base = `${head} — **${p.team}** passes.`;
  else if (p.status === 'TEST') base = `${head} — **${p.team}** selects **${p.pick}** (test).`;
  else base = `${head} — **${p.team}** selects **${p.pick}**.`;
  const next = p.nextUp ? `\n➡️ Up next: **${p.nextUp}**` : '';
  return base + next;
};

async function notifyDiscord(payload) {
  // Try app endpoint first (if you later add a real /api/notifyPick). If 404 or network error, fall back to direct webhook.
  try {
    await axios.post('/api/notifyPick', payload);
    console.info('[notifyDiscord] sent via /api/notifyPick');
    return true;
  } catch (e) {
    try {
      await axios.post(DISCORD_WEBHOOK, { content: formatDiscordMessage(payload) }, { headers: { 'Content-Type': 'application/json' } });
      console.info('[notifyDiscord] sent via direct Discord webhook');
      return true;
    } catch (err) {
      console.warn('[notifyDiscord] direct webhook failed', err);
      return false;
    }
  }
}
// --- SMS Notification helpers (non-blocking) ---
const getAppUrl = () => (typeof window !== 'undefined' ? window.location.origin : '');
const formatTurnSMS = (p) => {
  const base = `You're on the clock: Round ${p.round}, Pick ${p.pickNumber} — ${p.team}`;
  const link = getAppUrl();
  return link ? `${base}. Submit: ${link}` : base;
};
// async function notifyTurnSMS(to, payload) {
//   try {
//     if (!to) return { ok: false, error: 'Missing destination number' };
//     const isLocal = (typeof window !== 'undefined') && (/^(localhost|127\.0\.0\.1)$/.test(window.location.hostname));
//     const API_BASE = isLocal ? 'http://localhost:3001' : '';
//     const resp = await axios.post(`${API_BASE}/api/notifyTurn`, { to, message: formatTurnSMS(payload) });
//     const data = resp?.data || {};
//     return { ok: !!data.ok && !data.dryRun, dryRun: !!data.dryRun, sid: data.sid, error: data.error, raw: data };
//   } catch (e) {
//     return { ok: false, error: e?.message || 'Network error' };
//   }
// }


const DRAFT_SHEET_URL = 'https://api.sheetbest.com/sheets/a472779a-3b0e-4c78-8379-4f470c15c00e';
const VOTES_API = 'https://api.sheetbest.com/sheets/6ea852be-9b86-4b65-91ed-c0f6756f3744';
const PLAYERS_URL = `${DRAFT_SHEET_URL.replace(/\/$/, '')}/tabs/Players`;
// Explicit snake-draft order (display + turn control)
// Note: uses provided spellings; mapped to actual sheet names via normalization
const RAW_DRAFT_ORDER = [
  'Callie',
  'Utsav',
  'Tariq',
  'Simon',
  'Christian',
  'Dad',
  'Dustin',
  'Cisco',
  'Angelo',
  'Daisy',
  'River',
  'Raphy',
];

const getDraftLogUrl = (suffix = '') => `${DRAFT_SHEET_URL.replace(/\/$/, '')}/tabs/DraftLog${suffix}`;

const normalize = str => str?.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, ' ').trim();
// Static phone book (normalized keys). Kept in code so SMS works without SheetBest.
const STATIC_PHONE_BOOK = Object.freeze({
  callie: '+16194033562',
  christian: '+19193256775',
  cisco: '+16193070620',
  dad: '+16193069767',
  daisy: '+19713367265',
  dustin: '+16193020433',
  angelo: '+16195049092',
  raphy: '+16194049740',
  david: '+16196728028',
  simon: '+16196164790',
  tariq: '+12096237026',
  utsav: '+16196469110',
});

const fmtDuration = (ms) => {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${h}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
};


// ---- Feature flags ----
const AUTO_PASS_ENABLED = true; // Enable auto-pass: the ONLY way a team is passed is when time expires

// Base: 30 minutes per pick; Exception: Dustin gets 60 minutes
const BASE_PICK_MINUTES = 30;
const EXCEPTION_MINUTES = Object.freeze({ dustin: 60 });
const getPickWindowMinutes = (teamName, round) => EXCEPTION_MINUTES[normalize(teamName || '')] || BASE_PICK_MINUTES;

// --- PIN (draft code) helpers -------------------------------------------------
const getPinsUrl = (suffix = '') => `${VOTES_API.replace(/\/$/, '')}/tabs/Pins${suffix}`;

const toHex = (buffer) =>
  Array.prototype.map.call(new Uint8Array(buffer), (x) => x.toString(16).padStart(2, '0')).join('');

async function sha256Hex(str) {
  const enc = new TextEncoder();
  const data = enc.encode(str);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return toHex(hash);
}

function makeSalt(len = 8) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let s = '';
  const arr = new Uint8Array(len);
  (crypto.getRandomValues ? crypto.getRandomValues(arr) : arr.fill(Math.floor(Math.random() * 256))).forEach((n) => {
    s += chars[n % chars.length];
  });
  return s;
}

async function saltedHash(pin, salt) {
  return sha256Hex(`${salt}:${pin}`);
}

export default function DraftPage() {
  const [timeLeft, setTimeLeft] = useState({
    total: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [playersPicks, setPlayersPicks] = useState([]);
  const [duplicatePicks, setDuplicatePicks] = useState(new Set());
  // Logging is optional; allow dismissing the warning banner
  const [showLogWarning, setShowLogWarning] = useState(true);

  // Submit flow state
  const [voterName, setVoterName] = useState(localStorage.getItem('fantasy:draftVoter') || '');
  useEffect(() => { if (voterName) localStorage.setItem('fantasy:draftVoter', voterName); }, [voterName]);
  const [pickInput, setPickInput] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // PIN state
  const [pinRecord, setPinRecord] = useState(null);
  const [pinMode, setPinMode] = useState('verify'); // 'verify' | 'set' | 'change'
  const [pinInput, setPinInput] = useState('');
  const [newPin, setNewPin] = useState('');
  const [newPinConfirm, setNewPinConfirm] = useState('');
  const [pinError, setPinError] = useState('');
  // Confirm modal state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingPickLabel, setPendingPickLabel] = useState('');

  // --- Player autocomplete (pulls from SheetBest: /tabs/Players) ---
  const [playerNames, setPlayerNames] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(0);
  const pickInputRef = useRef(null);
  // Map normalized player name -> position (from Players tab)
  const [playerPosIndex, setPlayerPosIndex] = useState({});
// Phone book seeded in code; failures in SMS are non-blocking
const [phoneBook, setPhoneBook] = useState(STATIC_PHONE_BOOK);

  useEffect(() => {
    // Expect a sheet with a tab named "Players" and a column named Name or Player
    axios
      .get(PLAYERS_URL)
      .then((res) => {
        const rows = Array.isArray(res.data) ? res.data : [];
        const names = Array.from(
          new Set(
            rows
              .map((r) => (r.Name || r.Player || r.name || r.player || '').toString().trim())
              .filter(Boolean)
          )
        );
        setPlayerNames(names);

        // Build normalized name -> position index (first occurrence wins)
        const index = {};
        for (const r of rows) {
          const nm = (r.Name || r.Player || r.name || r.player || '').toString().trim();
          if (!nm) continue;
          const pos = (r.Pos || r.POS || r.position || r.Position || '').toString().trim();
          const key = normalize(nm);
          if (pos && index[key] == null) {
            index[key] = pos; // keep the first-seen position only
          }
        }
        setPlayerPosIndex(index);
        if (res && res.headers) updateOffsetFromHeaders(res.headers);
      })
      .catch(() => {
        setPlayerNames([]); // graceful: no suggestions if tab missing
      });
  }, []);

  const normStr = (s = '') => s.toLowerCase();
  const buildSuggestions = (q) => {
    const query = normStr(q || '');
    if (query.length < 2 || !playerNames.length) {
      setSuggestions([]);
      setShowSuggestions(false);
      setHighlightIdx(0);
      return;
    }
    const starts = [];
    const contains = [];
    for (const name of playerNames) {
      const n = normStr(name);
      if (n.startsWith(query) || n.split(' ').some((t) => t.startsWith(query))) starts.push(name);
      else if (n.includes(query)) contains.push(name);
      if (starts.length >= 8 && contains.length >= 8) break;
    }
    const out = [...starts, ...contains.filter((c) => !starts.includes(c))].slice(0, 12);
    setSuggestions(out);
    setShowSuggestions(true);
    setHighlightIdx(0);
  };

  const chooseSuggestion = (name) => {
    setPickInput(name);
    setPendingPickLabel(name);
    setShowSuggestions(false);
    // focus stays in the input for fast submit
    if (pickInputRef.current) pickInputRef.current.focus();
  };

  // --- Test Notification state + helper ---
  const [testSending, setTestSending] = useState(false);
  const [testMessage, setTestMessage] = useState('');
  const [testSmsSending, setTestSmsSending] = useState(false);
  const [testSmsMessage, setTestSmsMessage] = useState('');

  const sendTestNotification = async () => {
    try {
      setTestMessage('');
      setTestSending(true);
      const payload = {
        pickNumber: overallPick,
        round: currentRound,
        team: voterName || onTheClock || 'Test Team',
        pick: pendingPickLabel || pickInput || 'Test Player',
        status: 'TEST',
        nextUp: computeNextUp(),
        submittedAt: isoNow(),
      };
      await notifyDiscord(payload);
      setTestMessage('✅ Test notification sent. Check Discord.');
    } catch (e) {
      setTestMessage('⚠️ Could not send test. Check network or /api/notifyPick.');
    } finally {
      setTestSending(false);
      setTimeout(() => setTestMessage(''), 5000);
    }
  };
  // const sendTestSMS = async () => {
  //   try {
  //     setTestSmsMessage('');
  //     setTestSmsSending(true);
  //     const payload = {
  //       pickNumber: overallPick,
  //       round: currentRound,
  //       team: voterName || onTheClock || 'Test Team',
  //     };
  //     const result = await notifyTurnSMS('+16198858867', payload);
  //     if (result?.ok) {
  //       setTestSmsMessage(`✅ Test SMS accepted by Twilio. SID: ${result.sid || 'n/a'}`);
  //     } else if (result?.dryRun) {
  //       setTestSmsMessage('ℹ️ Test ran in DRY RUN. Set TWILIO_SID, TWILIO_TOKEN, TWILIO_FROM in .env.local and restart the SMS server.');
  //     } else {
  //       const detail = result?.error || result?.raw?.twilio?.message || 'Unknown error';
  //       setTestSmsMessage(`⚠️ Could not send test SMS. ${detail}`);
  //     }
  //   } catch (e) {
  //     setTestSmsMessage('⚠️ Could not send test SMS. Check /api/notifyTurn.');
  //   } finally {
  //     setTestSmsSending(false);
  //     setTimeout(() => setTestSmsMessage(''), 7000);
  //   }
  // };
  const completeSubmit = async (pickLabel) => {
    try {
      setIsSubmitting(true);
      // Re-check time window at confirmation time
      if (pickMsLeft <= 0) {
        setSubmitError('Time expired — pick was passed.');
        setConfirmOpen(false);
        return;
      }

      // PIN enforcement
      if (pinRecord) {
        if (pinInput.length < 4) { setPinError('Enter your PIN'); return; }
        const ok = await verifyPinAgainstRecord(pinInput, pinRecord);
        if (!ok) { setPinError('Incorrect PIN'); return; }
      } else {
        if (newPin.length < 4 || newPin !== newPinConfirm) {
          setPinError('Create a PIN (min 4) and confirm it.');
          return;
        }
        await createOrUpdatePin(voterName, newPin);
      }

      // Refresh sheet before we write (prevent race)
      const latest = await axios.get(DRAFT_SHEET_URL);
      if (latest && latest.headers) updateOffsetFromHeaders(latest.headers);
      const formatted = latest.data.map(row => ({
        name: row.Player,
        picks: Object.entries(row)
          .filter(([key]) => key !== 'Player')
          .map(([, value]) => value || '—')
      }));

      const teamIdx = formatted.findIndex(p => normalize(p.name) === normalize(voterName));
      if (teamIdx === -1) { setSubmitError('Name not found in draft sheet.'); return; }

      const roundCol = `Round ${currentRound}`;

      // Duplicate pick check
      const allPicks = formatted.flatMap(p => p.picks).filter(x => x && x !== '—').map(normalize);
      if (allPicks.includes(normalize(pickLabel))) {
        setSubmitError('That player is already drafted.');
        return;
      }

      // Ensure target cell is empty
      const rowObj = latest.data[teamIdx] || {};
      if (rowObj[roundCol] && rowObj[roundCol] !== '—') {
        setSubmitError('This pick was just taken. Refresh and try again.');
        return;
      }

      // Write the pick to the sheet (PATCH by search on Player)
      await axios.patch(`${DRAFT_SHEET_URL.replace(/\/$/, '')}/search`, { [roundCol]: pickLabel }, { params: { Player: voterName } });

      // Log the pick in DraftLog (best-effort, non-blocking)
      try {
        await axios.post(getDraftLogUrl(''), {
          pickNumber: overallPick,
          round: currentRound,
          team: voterName,
          pick: pickLabel,
          status: 'PICKED',
          submittedAt: isoNow(),
windowHours: getPickWindowMinutes(voterName, currentRound) / 60,        });
      } catch (e) {
        console.warn('DraftLog write failed (non-blocking). Proceeding without log.');
      }

      // Notify Discord (await so we don't accidentally lose the call on fast state changes)
      const sent = await notifyDiscord({
        pickNumber: overallPick,
        round: currentRound,
        team: voterName,
        pick: pickLabel,
        status: 'PICKED',
        nextUp: computeNextUp(),
        submittedAt: isoNow(),
      });
      // Fire-and-forget SMS; do not block submission if it fails
      // void notifyNextUpSMS(computeNextUp());
      if (!sent) console.warn('[notifyDiscord] pick notification failed');
      // Anchor locally so the next pick's timer starts now even if logs lag a bit
setLocalSubmitAt(new Date(effectiveNow.getTime()));

      // Optimistic UI update
      setPlayersPicks(prev => prev.map(p => (
        normalize(p.name) === normalize(voterName)
          ? { ...p, picks: p.picks.map((v, i) => (i === (currentRound - 1) ? pickLabel : v)) }
          : p
      )));

      setPickInput('');
      setPinInput('');
      setConfirmOpen(false);
    } catch (err) {
      console.error(err);
      setSubmitError('Could not submit your pick.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Global tick for per-pick clock
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
// --- Authoritative time via HTTP Date calibration (no external API) ---
// We calibrate against the HTTP Date header from SheetBest/other calls,
// then apply that offset to the local clock.
const [timeOffsetMs, setTimeOffsetMs] = useState(0);
const effectiveNow = new Date(now.getTime() + timeOffsetMs);
const isoNow = () => new Date(Date.now() + timeOffsetMs).toISOString();
// Local anchor for last submission time to avoid cascade passes if DraftLog polling lags
const [localSubmitAt, setLocalSubmitAt] = useState(null);

  // Helper: update offset using any axios response headers
const updateOffsetFromHeaders = (headers) => {
  try {
    const serverDate = headers?.date || headers?.Date;
    if (!serverDate) return;
    const serverMs = new Date(serverDate).getTime();
    if (!isNaN(serverMs)) {
      const offset = serverMs - Date.now();
      // Smooth changes to avoid jumpy UI
      setTimeOffsetMs((prev) => (Number.isFinite(prev) ? Math.round(prev * 0.7 + offset * 0.3) : offset));
    }
  } catch {
    // ignore
  }
};

// --- Business-hours draft clock (Pacific Time) ---------------------------------
const ACTIVE_TZ = 'America/Los_Angeles';
const ACTIVE_START_HOUR = 9;  // 9:00 AM PT
const ACTIVE_END_HOUR = 19;  // 7:00 PM PT

// Parse a Date into Pacific local parts using Intl (works regardless of viewer's time zone)
function getTZParts(d, tz = ACTIVE_TZ) {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour12: false,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  });
  const parts = fmt.formatToParts(d).reduce((acc, p) => {
    if (p.type === 'year') acc.y = parseInt(p.value, 10);
    if (p.type === 'month') acc.m = parseInt(p.value, 10);
    if (p.type === 'day') acc.d = parseInt(p.value, 10);
    if (p.type === 'hour') acc.H = parseInt(p.value, 10);
    if (p.type === 'minute') acc.M = parseInt(p.value, 10);
    if (p.type === 'second') acc.S = parseInt(p.value, 10);
    return acc;
  }, {});
  return parts;
}

// Convert Pacific local date parts back to a real UTC Date
function localPartsToDate(p, tz = ACTIVE_TZ) {
  // Initial guess treats parts as if they were UTC
  let utcMs = Date.UTC(p.y, (p.m || 1) - 1, p.d, p.H || 0, p.M || 0, p.S || 0);
  let date = new Date(utcMs);
  // Align minutes difference between shown local time and target local time
  let shown = getTZParts(date, tz);
  const targetMin = (p.H || 0) * 60 + (p.M || 0);
  const shownMin = (shown.H || 0) * 60 + (shown.M || 0);
  date = new Date(date.getTime() + (targetMin - shownMin) * 60000);
  // Align any day difference (handles DST offsets cleanly)
  shown = getTZParts(date, tz);
  const baseTarget = Date.UTC(p.y, p.m - 1, p.d);
  const baseShown = Date.UTC(shown.y, shown.m - 1, shown.d);
  const dayDelta = Math.round((baseTarget - baseShown) / (24 * 3600 * 1000));
  if (dayDelta !== 0) {
    date = new Date(date.getTime() + dayDelta * 24 * 3600 * 1000);
  }
  return date;
}

// Given a start time, add N active minutes counting only 9am–7pm PT windows.
function computeActiveDeadline(startDate, minutesNeeded = 60, tz = ACTIVE_TZ) {
  const ONE_MIN = 60000;
  let cursor = new Date(startDate instanceof Date ? startDate.getTime() : new Date(startDate).getTime());
  let left = Math.max(0, Math.floor(minutesNeeded));
  let guard = 0;
  while (left > 0 && guard++ < 1000) {
    const p = getTZParts(cursor, tz);
    const windowStart = localPartsToDate({ y: p.y, m: p.m, d: p.d, H: ACTIVE_START_HOUR, M: 0, S: 0 }, tz);
    const windowEnd   = localPartsToDate({ y: p.y, m: p.m, d: p.d, H: ACTIVE_END_HOUR,   M: 0, S: 0 }, tz);

    // If we're before the window, jump to 9am. If after, jump to next day 9am.
    if (cursor < windowStart) {
      cursor = windowStart; // day hasn't started; start at 9:00
      continue;
    }
    if (cursor >= windowEnd) {
      // move to next day 9:00
      const nextDayStart = localPartsToDate({ y: p.y, m: p.m, d: p.d + 1, H: ACTIVE_START_HOUR, M: 0, S: 0 }, tz);
      cursor = nextDayStart;
      continue;
    }

    const availableMin = Math.floor((windowEnd.getTime() - cursor.getTime()) / ONE_MIN);
    if (left <= availableMin) {
      return new Date(cursor.getTime() + left * ONE_MIN);
    }
    // Consume today's remaining window and move to next day's window start
    left -= availableMin;
    const nextDayStart = localPartsToDate({ y: p.y, m: p.m, d: p.d + 1, H: ACTIVE_START_HOUR, M: 0, S: 0 }, tz);
    cursor = nextDayStart;
  }
  return cursor; // fallback
}

  // --- Draft start time (configurable; fallback static) ---
  const [startTime, setStartTime] = useState('2025-08-14T09:30:00-07:00');
  useEffect(() => {
    // Optionally fetch from a Config tab in Sheet.best:
    // axios.get(`${DRAFT_SHEET_URL.replace(/\/$/, '')}/tabs/Config`)
    //   .then(res => {
    //     const row = Array.isArray(res.data) ? res.data[0] : null;
    //     if (row?.startTime) setStartTime(row.startTime);
    //   })
    //   .catch(() => {});
    // Keep static fallback for now.
    setStartTime('2025-08-14T09:30:00-07:00');
  }, []);
  const draftStart = React.useMemo(() => new Date(startTime), [startTime]);


  // DraftLog tab readiness
  const [logsReady, setLogsReady] = useState(true);
  useEffect(() => {
    axios
      .get(getDraftLogUrl(''))
      .then((res) => { setLogsReady(true); if (res && res.headers) updateOffsetFromHeaders(res.headers); })
      .catch(() => setLogsReady(false));
  }, []);

  // Poll DraftLog for last submitted time
  const [draftLogRows, setDraftLogRows] = useState([]);
  useEffect(() => {
    if (!logsReady) return;
    const fetchLog = () => {
      axios
        .get(getDraftLogUrl(''))
        .then((res) => { setDraftLogRows(Array.isArray(res.data) ? res.data : []); if (res && res.headers) updateOffsetFromHeaders(res.headers); })
        .catch(() => {});
    };
    fetchLog();
    const i = setInterval(fetchLog, 10000);
    return () => clearInterval(i);
  }, [logsReady]);

  useEffect(() => {
    const update = () => {
      const draftDate = new Date(startTime);
      const current = effectiveNow;
      const diff = draftDate.getTime() - current.getTime();

      if (diff <= 0) {
        setTimeLeft({ total: 0 });
        return;
      }

      const total = diff;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ total, days, hours, minutes, seconds });
    };

    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
}, [startTime, now, timeOffsetMs]);

  useEffect(() => {
    const fetchDraftData = () => {
      axios.get(DRAFT_SHEET_URL)
        .then(response => {
          const formatted = response.data.map(row => ({
            name: row.Player,
            picks: Object.entries(row)
              .filter(([key]) => key !== 'Player')
              .map(([, value]) => value || '—')
          }));
          setPlayersPicks(formatted);

          const allPicks = formatted
            .flatMap(player => player.picks)
            .filter(pick => pick && pick !== '—')
            .map(normalize);

          const duplicates = allPicks.filter((item, index, self) => self.indexOf(item) !== index);
          setDuplicatePicks(new Set(duplicates));
          if (response && response.headers) updateOffsetFromHeaders(response.headers);
        })
        .catch(error => console.error("Error fetching draft data:", error));
    };

    fetchDraftData(); // initial fetch
    const interval = setInterval(fetchDraftData, 10000); // poll every 10 seconds

    return () => clearInterval(interval);
  }, []);

  const teamOrder = React.useMemo(() => {
    // Map normalized name -> actual sheet name
    const byNorm = new Map(playersPicks.map(p => [normalize(p.name), p.name]));
    // Return the provided order, translated to the exact sheet names if present
    return RAW_DRAFT_ORDER.map((n) => byNorm.get(normalize(n)) || n);
  }, [playersPicks]);
  const totalTeams = teamOrder.length;
  const rounds = React.useMemo(() => (playersPicks[0]?.picks?.length || 15), [playersPicks]);
  const filledCount = React.useMemo(() => playersPicks.reduce((acc, p) => acc + p.picks.filter(x => x && x !== '—').length, 0), [playersPicks]);
  const overallPick = filledCount + 1;
  const currentRound = Math.min(Math.ceil(overallPick / Math.max(totalTeams, 1)), rounds);
  const idxInRound = (overallPick - 1) % Math.max(totalTeams, 1);
  const orderThisRound = currentRound % 2 === 1 ? teamOrder : [...teamOrder].reverse();
  const onTheClock = orderThisRound[idxInRound] || '';
  // Compute the next team on the clock based on current state
const computeNextUp = React.useCallback(() => {
  if (!totalTeams) return '';
  let nextRound = currentRound;
  let nextIdx = idxInRound + 1;
  if (nextIdx >= totalTeams) {
    nextRound = currentRound + 1;
    nextIdx = 0;
  }
  const nextOrder = nextRound % 2 === 1 ? teamOrder : [...teamOrder].reverse();
  return nextOrder[nextIdx] || '';
}, [currentRound, idxInRound, teamOrder, totalTeams]);

// const notifyNextUpSMS = (name) => {
//   try {
//     const to = phoneBook[normalize(name || '')];
//     if (!to) return Promise.resolve(false);
//     const payload = { round: currentRound, pickNumber: overallPick + 1, team: name };
//     return notifyTurnSMS(to, payload);
//   } catch (_) {
//     return Promise.resolve(false);
//   }
// };

const lastSubmittedAt = React.useMemo(() => {
  let max = localSubmitAt ? new Date(localSubmitAt) : null;
  for (const r of draftLogRows) {
    const t = r?.submittedAt || r?.submitted_at || r?.timestamp;
    if (t) {
      const d = new Date(t);
      if (!isNaN(+d) && (!max || d > max)) max = d;
    }
  }
  return max;
}, [draftLogRows, localSubmitAt]);

// Latch a stable start time per pick so the countdown actually ticks down.
// We only re-latch when the pick rotates to a new team/round.
const pickId = `${currentRound}:${overallPick}:${normalize(onTheClock)}`;
const clockStartRef = useRef(null);
const lastPickIdRef = useRef(null);
useEffect(() => {
  if (lastPickIdRef.current === pickId) return;
  lastPickIdRef.current = pickId;
  const freshCutoffMs = 2 * 60 * 1000; // trust logs only if <2m old
  if (overallPick <= 1) {
    clockStartRef.current = draftStart;
  } else if (lastSubmittedAt && (effectiveNow.getTime() - lastSubmittedAt.getTime() < freshCutoffMs)) {
    clockStartRef.current = lastSubmittedAt;
  } else {
    clockStartRef.current = new Date(effectiveNow.getTime());
  }
}, [pickId, overallPick, lastSubmittedAt, draftStart]);

const clockStart = clockStartRef.current || draftStart;

const windowMinutes = getPickWindowMinutes(onTheClock, currentRound);
const clockDeadline = React.useMemo(
  () => computeActiveDeadline(clockStart, windowMinutes, ACTIVE_TZ),
  [clockStart, windowMinutes]
);
const pickMsLeft = Math.max(0, clockDeadline.getTime() - effectiveNow.getTime());

  // Use startTime for draft start logic (hasDraftStarted is true if draft start time is now or in the past)
  const hasDraftStarted = effectiveNow >= new Date(startTime);
  const draftNotStarted = !hasDraftStarted;
  const draftStarted = hasDraftStarted;

  const [passInFlight, setPassInFlight] = useState(false);
  // --- Auto-pass logic with updated checks ---
  // Helper: check if the current pick is expired
  function pickExpired() {
    // Defensive: if pickMsLeft is defined and <= 0, and after draft start
    return hasDraftStarted && pickMsLeft <= 0;
  }
  useEffect(() => {
    if (!AUTO_PASS_ENABLED) return; // <— hard-disable auto-pass
    // Helper function: check and auto-pass if needed
    const checkAndAutoPass = async () => {
      // Only run if draft has started or if current pick is truly expired
      if (!hasDraftStarted) return;
      if (!logsReady) return;
      if (!pickExpired()) return;
      if (passInFlight) return;

      // Determine if pick is already made
      const teamIdx = playersPicks.findIndex((p) => normalize(p.name) === normalize(onTheClock));
      if (teamIdx === -1) return;
      const currentCell = playersPicks[teamIdx]?.picks?.[currentRound - 1];
      // Prevent passing if current pick is already made
      if (currentCell && currentCell !== '—') return;

      try {
        setPassInFlight(true);
        const roundCol = `Round ${currentRound}`;
        // Re-validate emptiness against latest sheet
        const latest = await axios.get(DRAFT_SHEET_URL);
        if (latest && latest.headers) updateOffsetFromHeaders(latest.headers);
        const sheetTeamIdx = latest.data.findIndex((r) => normalize(r.Player) === normalize(onTheClock));
        const latestRow = latest.data[sheetTeamIdx] || {};
        if (latestRow[roundCol] && latestRow[roundCol] !== '—') { setPassInFlight(false); return; }

        // Mark PASS in sheet
        await axios.patch(`${DRAFT_SHEET_URL.replace(/\/$/, '')}/search`, { [roundCol]: 'PASS' }, { params: { Player: onTheClock } });
        // Log the pass (best-effort)
        try {
          await axios.post(getDraftLogUrl(''), {
            pickNumber: overallPick,
            round: currentRound,
            team: onTheClock,
            pick: 'PASS',
            status: 'PASSED',
            submittedAt: isoNow(),
            // Use windowMinutes / 60 for windowHours
            windowHours: windowMinutes / 60,
          });
        } catch (e) {
          console.warn('DraftLog pass log failed (non-blocking).');
        }

        // Notify Discord of PASS (await)
        const passSent = await notifyDiscord({
          pickNumber: overallPick,
          round: currentRound,
          team: onTheClock,
          pick: 'PASS',
          status: 'PASSED',
          nextUp: computeNextUp(),
          submittedAt: isoNow(),
        });
        if (!passSent) console.warn('[notifyDiscord] pass notification failed');
        // Fire-and-forget SMS; do not block if it fails
        // void notifyNextUpSMS(computeNextUp());
        // Prevent cascade by locally anchoring the next pick's start time to now
        setLocalSubmitAt(new Date(effectiveNow.getTime()));
        // Optimistic UI update
        setPlayersPicks((prev) => prev.map((p) => (
          normalize(p.name) === normalize(onTheClock)
            ? { ...p, picks: p.picks.map((v, i) => (i === currentRound - 1 ? 'PASS' : v)) }
            : p
        )));
      } catch (e) {
        console.error('Auto-pass failed', e);
      } finally {
        setPassInFlight(false);
      }
    };

    // Only trigger auto-pass if draft has started and current pick is expired
    if (hasDraftStarted && pickExpired()) {
      checkAndAutoPass();
    }
  }, [pickMsLeft, playersPicks, onTheClock, currentRound, overallPick, logsReady, timeLeft.total, hasDraftStarted, passInFlight]);

  useEffect(() => {
    setPinError('');
    setPinInput('');
    setNewPin('');
    setNewPinConfirm('');
    if (!voterName) { setPinRecord(null); setPinMode('verify'); return; }
    axios.get(getPinsUrl('/search'), { params: { voter: voterName } })
      .then((res) => {
        const rec = Array.isArray(res.data) && res.data[0] ? res.data[0] : null;
        setPinRecord(rec);
        setPinMode(rec ? 'verify' : 'set');
      })
      .catch(() => { setPinRecord(null); setPinMode('set'); });
  }, [voterName]);

  const getPinHashFromRecord = (rec) => rec?.pinHash || rec?.pinhash || rec?.hash;
  const getSaltFromRecord = (rec) => rec?.salt || '';

  const verifyPinAgainstRecord = async (pin, rec) => {
    if (!rec) return false;
    const salt = getSaltFromRecord(rec);
    const expected = getPinHashFromRecord(rec);
    const computed = await saltedHash(pin, salt);
    return expected === computed;
  };

  const createOrUpdatePin = async (voter, pin) => {
    const salt = makeSalt(8);
    const pinHash = await saltedHash(pin, salt);
    try { await axios.delete(getPinsUrl('/search'), { params: { voter } }); } catch (_) {}
    await axios.post(getPinsUrl(''), { voter, salt, pinHash, updatedAt: isoNow() });
    setPinRecord({ voter, salt, pinHash });
    setPinMode('verify');
  };

  const submitPick = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!voterName) { setSubmitError('Select your name.'); return; }
    if (!pickInput.trim()) { setSubmitError('Enter your pick.'); return; }
    // Disallow manual PASS. Only auto-pass on expiry.
    if (normalize(pickInput) === 'pass') {
      setSubmitError('Manual PASS is not allowed. A PASS only happens automatically when time expires.');
      return;
    }

    // Draft must have started
    if (draftNotStarted) {
      setSubmitError("Draft hasn't started yet.");
      return;
    }
    // Must be on the clock
    if (normalize(voterName) !== normalize(onTheClock)) {
      setSubmitError(`It's ${onTheClock || 'someone else'}'s turn.`);
      return;
    }
    // Time window must still be open
    if (pickMsLeft <= 0) {
      setSubmitError('Time expired — pick was passed.');
      return;
    }

    // Open styled confirmation modal (picks are FINAL once submitted)
    const pickLabel = pickInput.trim();
    setPendingPickLabel(pickLabel);
    setConfirmOpen(true);
    return;
  };

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <NavBar />

      <section className="px-6 py-20 text-center max-w-7xl mx-auto bg-gradient-to-br from-black via-gray-900 to-black rounded-2xl shadow-2xl border border-lime-500">
        <h1 className="text-6xl md:text-7xl font-extrabold uppercase tracking-wider mb-6 text-white drop-shadow-[0_0_20px_rgba(0,255,0,0.5)]">
          2025 Draft Day
        </h1>
       

        <div className="mt-14 mb-20 text-center">
          <h2 className="text-4xl md:text-5xl uppercase font-extrabold text-lime-300 tracking-tight mb-4">
            Draft Countdown
          </h2>
          {timeLeft.total > 0 ? (
            <div className="flex justify-center gap-8 md:gap-14 text-4xl md:text-5xl font-mono text-white">
              <div className="text-center">
                <div className="text-lime-300">{timeLeft.days}</div>
                <div className="text-xs md:text-sm uppercase text-gray-400">Days</div>
              </div>
              <div className="text-center">
                <div className="text-lime-300">{timeLeft.hours}</div>
                <div className="text-xs md:text-sm uppercase text-gray-400">Hours</div>
              </div>
              <div className="text-center">
                <div className="text-lime-300">{timeLeft.minutes}</div>
                <div className="text-xs md:text-sm uppercase text-gray-400">Minutes</div>
              </div>
              <div className="text-center">
                <div className="text-lime-300">{timeLeft.seconds}</div>
                <div className="text-xs md:text-sm uppercase text-gray-400">Seconds</div>
              </div>
            </div>
          ) : (
            <div className="text-5xl font-black text-red-500">The Draft Has Begun!</div>
          )}
        </div>

        <div className="max-w-2xl mx-auto">
          {/* DraftLog readiness banner */}
          {!logsReady && showLogWarning && (
            <div className="mb-4 text-center">
              <div className="inline-block bg-amber-600/20 border-l-4 border-amber-500 px-4 py-3 rounded-md shadow text-left text-sm max-w-xl mx-auto">
                <strong className="text-amber-400 font-semibold block mb-1">DraftLog Not Detected</strong>
                <span className="text-white block mb-2">
                  Picks will still work. DraftLog powers the per-pick clock & recap. To enable later, add a <span className="font-semibold text-lime-300">DraftLog</span> tab with headers:
                  <code className="ml-1 bg-black/40 px-2 py-0.5 rounded">pickNumber,round,team,pick,status,submittedAt,windowHours</code>
                </span>
                <button
                  type="button"
                  onClick={() => setShowLogWarning(false)}
                  className="text-xs uppercase tracking-wider text-amber-300 underline"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}
          {/* On the Clock banner */}
          <div className="mb-4 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold uppercase tracking-wide bg-lime-500/10 border-lime-400 text-lime-300">
              <span className="w-2 h-2 rounded-full bg-current inline-block" />
              On the Clock: <span className="ml-1 text-white">{onTheClock || '—'}</span> · Round {currentRound} · Pick {overallPick}
              {!draftNotStarted && (
                <>
                  <span className="mx-2">•</span>
                  <span className="text-gray-300 normal-case">Time Left:</span>
                  <span className={`ml-1 ${pickMsLeft > 0 ? 'text-white' : 'text-red-400'}`}>{pickMsLeft > 0 ? fmtDuration(pickMsLeft) : 'Expired'}</span>
<span className="ml-2 text-gray-400 normal-case">({windowMinutes === 60 ? '1h' : `${windowMinutes}m`} window; paused 7pm–9am PT)</span>                </>
              )}
            </div>
          </div>

          {/* Submit Pick Card */}
          <form onSubmit={submitPick} className="bg-black/60 border border-lime-400/40 rounded-xl p-6 shadow-lg space-y-4">
            <div>
              <label className="block text-xs uppercase text-gray-400 mb-1">Your Name</label>
              <select
                value={voterName}
                onChange={(e) => setVoterName(e.target.value)}
                className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-lime-400"
                required
              >
                <option value="" disabled>-- Select your team --</option>
                {teamOrder.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase text-gray-400 mb-1">Your Pick</label>
              <div className="relative">
                <input
                  ref={pickInputRef}
                  value={pickInput}
                  onChange={(e) => { setPickInput(e.target.value); buildSuggestions(e.target.value); }}
                  onFocus={() => buildSuggestions(pickInput)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 120)}
                  onKeyDown={(e) => {
                    if (!showSuggestions || suggestions.length === 0) return;
                    if (e.key === 'ArrowDown') { e.preventDefault(); setHighlightIdx((i) => (i + 1) % suggestions.length); }
                    else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlightIdx((i) => (i - 1 + suggestions.length) % suggestions.length); }
                    else if (e.key === 'Enter') { e.preventDefault(); chooseSuggestion(suggestions[highlightIdx]); }
                    else if (e.key === 'Escape') { setShowSuggestions(false); }
                  }}
                  placeholder="Type the player name"
                  autoComplete="off"
                  spellCheck={false}
                  className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-lime-400"
                  required
                />

                {/* Suggestions dropdown */}
                {showSuggestions && (
                  suggestions.length > 0 ? (
                    <ul className="absolute z-20 mt-1 w-full max-h-72 overflow-auto bg-gray-900 border border-gray-700 rounded-lg shadow-lg text-left">
                      {suggestions.map((name, i) => (
                        <li
                          key={`${name}-${i}`}
                          onMouseDown={(e) => { e.preventDefault(); chooseSuggestion(name); }}
                          className={`px-3 py-2 cursor-pointer ${i === highlightIdx ? 'bg-lime-500/20 text-lime-200' : 'hover:bg-gray-800'}`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-white">{name}</span>
                            {playerPosIndex[normalize(name)] && (
                              <span className="ml-3 text-[11px] px-2 py-0.5 rounded-full border border-gray-600 text-gray-300">
                                {playerPosIndex[normalize(name)]}
                              </span>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    pickInput && pickInput.length >= 2 && (
                      <div className="absolute z-20 mt-1 w-full bg-gray-900 border border-gray-700 rounded-lg shadow-lg text-left px-3 py-2 text-gray-400">
                        No matches
                      </div>
                    )
                  )
                )}
              </div>
              <p className="text-[11px] text-gray-500 mt-1">Duplicates are automatically blocked.</p>
              <p className="text-[11px] text-red-400 mt-1">Heads up: Picks are <span className="font-semibold">FINAL</span> once submitted.</p>
            </div>

            {/* PIN Security */}
            <div>
              <label className="block text-xs uppercase text-gray-400 mb-1">PIN</label>
              {pinMode === 'verify' && (
                <div className="space-y-2">
                  <input
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Enter your PIN"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-lime-400"
                  />
                  <button type="button" className="text-xs text-lime-300 underline" onClick={() => { setPinMode('change'); setPinError(''); setPinInput(''); }}>Change PIN</button>
                </div>
              )}
              {pinMode === 'set' && (
                <div className="space-y-2">
                  <input
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Create a 4+ digit PIN"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-lime-400"
                  />
                  <input
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Confirm PIN"
                    value={newPinConfirm}
                    onChange={(e) => setNewPinConfirm(e.target.value)}
                    className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-lime-400"
                  />
                  <p className="text-[11px] text-gray-500">You’ll set your PIN on first pick.</p>
                </div>
              )}
              {pinMode === 'change' && (
                <div className="space-y-2">
                  <input
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Current PIN"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-lime-400"
                  />
                  <input
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="New PIN (4+ digits)"
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value)}
                    className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-lime-400"
                  />
                  <input
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="Confirm new PIN"
                    value={newPinConfirm}
                    onChange={(e) => setNewPinConfirm(e.target.value)}
                    className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-lime-400"
                  />
                  <div>
                    <button
                      type="button"
                      disabled={isSubmitting}
                      onClick={async () => {
                        try {
                          setIsSubmitting(true);
                          setPinError('');
                          if (newPin.length < 4 || newPin !== newPinConfirm) {
                            setPinError('Enter matching new PINs (min 4).');
                          } else {
                            await createOrUpdatePin(voterName, newPin);
                            setPinMode('verify');
                            setPinInput('');
                            setNewPin('');
                            setNewPinConfirm('');
                          }
                        } catch (e) {
                          setPinError(e.message || 'Could not change PIN.');
                        } finally {
                          setIsSubmitting(false);
                        }
                      }}
                      className="text-xs px-3 py-2 border border-lime-400 rounded-lg"
                    >
                      Update PIN
                    </button>
                    <button type="button" className="text-xs ml-3 underline text-gray-400" onClick={() => { setPinMode('verify'); setPinError(''); setPinInput(''); setNewPin(''); setNewPinConfirm(''); }}>Cancel</button>
                  </div>
                </div>
              )}
              {pinError && <div className="text-red-400 text-xs mt-2">{pinError}</div>}
            </div>

            {submitError && <div className="text-red-400 text-sm">{submitError}</div>}

            <button
              type="submit"
              disabled={isSubmitting || !voterName || !pickInput || draftNotStarted}
              className={`w-full uppercase font-extrabold tracking-wider px-6 py-3 rounded-lg shadow-lg transition-all border-2 ${
                isSubmitting || !voterName || !pickInput || draftNotStarted
                  ? 'bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed'
                  : 'bg-black text-lime-300 border-lime-400 hover:bg-lime-400 hover:text-black'
              }`}
            >
              Submit Pick
            </button>
          </form>

          {confirmOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => !isSubmitting && setConfirmOpen(false)} />
              <div role="dialog" aria-modal="true" className="relative z-10 w-[92%] max-w-md bg-gradient-to-b from-gray-900 to-black border-2 border-lime-400 rounded-2xl shadow-2xl p-6 text-left">
                <div className="flex items-center gap-3 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-lime-400" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 100 20 10 10 0 000-20zM11 7h2v6h-2V7zm0 8h2v2h-2v-2z"/></svg>
                  <h3 className="text-xl font-extrabold uppercase tracking-wide">Confirm Pick</h3>
                </div>
                <p className="text-sm text-gray-300 mb-2">Team: <span className="text-white font-semibold">{voterName || '—'}</span></p>
                <div className="bg-black/60 border border-lime-500/40 rounded-lg px-4 py-3 mb-3">
                  <div className="text-xs uppercase text-gray-400">Your Selection</div>
                  <div className="text-lg font-bold text-white">{pendingPickLabel}</div>
                </div>
                <p className="text-xs text-red-400 mb-4">This pick is <span className="font-semibold">FINAL</span> once submitted.</p>
                {!draftNotStarted && (
                  <p className="text-xs text-gray-400 mb-4">
                    Time left: <span className={`${pickMsLeft > 0 ? 'text-white' : 'text-red-400'}`}>{pickMsLeft > 0 ? fmtDuration(pickMsLeft) : 'Expired'}</span>
                  </p>
                )}
                {submitError && <div className="text-red-400 text-xs mb-3">{submitError}</div>}
                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => !isSubmitting && setConfirmOpen(false)}
                    className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => completeSubmit(pendingPickLabel)}
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-lg bg-lime-500 text-black font-extrabold uppercase tracking-wide hover:bg-lime-400 disabled:opacity-50"
                  >
                    Confirm Pick
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Backup link to edit sheet directly (commissioner use) + Test Notification */}
          <div className="text-center mt-4">
            <div className="inline-flex items-center gap-3 flex-wrap justify-center">
              {/* <a
                href="https://docs.google.com/spreadsheets/d/1NDVTuhiF8lpWKFLAvP83Llu8Owkq25bx3bHKvvC4bag/edit?usp=sharing"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-lime-300 hover:text-lime-200 underline text-sm"
              >
                Raw Draft Picks Sheet
              </a>
              <button
                type="button"
                onClick={sendTestNotification}
                disabled={testSending}
                className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-lg border border-lime-400 text-lime-300 hover:bg-lime-400 hover:text-black transition disabled:opacity-50"
                title="Sends a test message to Discord via /api/notifyPick"
              >
                {testSending ? 'Sending…' : 'Send Test Notification'}
              </button> */}
              <a
                href="https://discord.gg/7Ud9D2XA"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-lg border border-indigo-400 text-indigo-300 hover:bg-indigo-400 hover:text-black transition"
                title="Join Discord to get notified when picks are made"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" className="opacity-90">
                  <path d="M20.317 4.369A19.791 19.791 0 0016.558 3c-.197.35-.42.82-.574 1.2a18.4 18.4 0 00-7.968 0c-.154-.38-.377-.85-.574-1.2A19.789 19.789 0 003.683 4.37C1.803 7.216 1.156 9.96 1.33 12.662c2.1 1.567 4.137 2.52 6.106 3.145.47-.646.892-1.338 1.257-2.067a11.71 11.71 0 01-1.905-.902c.16-.118.315-.242.464-.37 3.692 1.74 7.69 1.74 11.383 0 .149.129.304.252.464.37-.611.345-1.253.64-1.905.902.365.729.787 1.421 1.257 2.067 1.97-.625 4.006-1.578 6.106-3.145.252-3.958-.68-6.67-2.74-8.293zM9.5 12.5c-.9 0-1.625-.9-1.625-2s.725-2 1.625-2 1.625.9 1.625 2-.725 2-1.625 2zm5 0c-.9 0-1.625-.9-1.625-2s.725-2 1.625-2 1.625.9 1.625 2-.725 2-1.625 2z" fill="currentColor"/>
                </svg>
                Get notified through Discord
              </a>
              {/* <button
                type="button"
                onClick={sendTestSMS}
                disabled={testSmsSending}
                className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-lg border border-lime-400 text-lime-300 hover:bg-lime-400 hover:text-black transition disabled:opacity-50"
                title="Send a test SMS to 619-885-8867"
              >
                {testSmsSending ? 'Sending SMS…' : 'Send Test SMS'}
              </button> */}
            </div>
            {testMessage && (
              <div className="mt-2 text-sm text-gray-300" role="status" aria-live="polite">{testMessage}</div>
            )}
            {testSmsMessage && (
              <div className="mt-2 text-sm text-gray-300" role="status" aria-live="polite">{testSmsMessage}</div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto max-w-full mb-16 bg-gradient-to-r from-black via-gray-900 to-black p-2 rounded-xl">
          <h2 className="text-3xl font-bold text-white mb-6 uppercase tracking-wide">Player Picks</h2>

          <table className="min-w-[1200px] w-full bg-black/60 text-white font-mono backdrop-blur-md">
            <thead>
              <tr className="bg-lime-400/80 text-black uppercase font-bold text-xs tracking-wide">
                <th className="px-3 py-2 text-base tracking-tight text-center">Player</th>
                {Array.from({ length: 15 }, (_, i) => (
                  <th key={i} className="px-3 py-2 text-base tracking-tight text-center">Round {i + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {playersPicks.map(({ name, picks }, idx) => (
                <tr key={idx} className="even:bg-gray-800/50 hover:bg-lime-300/10 hover:scale-[1.01] transition-transform duration-150">
                  <td className="px-3 py-2 font-semibold">{name}</td>
                  {picks.map((pick, roundIdx) => {
                    const normPick = normalize(pick);
                    const isDuplicate = duplicatePicks.has(normPick);
                    const pos = playerPosIndex[normPick];
                    const displayPick = (pos && pick && pick !== '—' && normPick !== 'pass')
                      ? `${pick} (${pos})`
                      : pick;
                    return (
                      <td
                        key={roundIdx}
                        className={`px-3 py-2 text-center ${isDuplicate ? 'bg-red-600 text-white font-bold' : ''}`}
                      >
                        {displayPick}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
           <div className="text-center text-sm text-gray-400 italic mb-6">
        Note: This is a <span className="text-lime-400 font-semibold">snake order</span> draft.
      </div>
        </div>

      </section>



      <Footer />
    </div>
  );
}
