import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

// ---- HTTP + caching helpers --------------------------------------------------
const API_TIMEOUT_MS = 10_000; // 10s network timeout for GETs
const http = axios.create({ timeout: API_TIMEOUT_MS });

const SHEETOPS_DRAFT_API_KEY = 'sk_live_19edc003b192dda12ec805b38754abe4b5a9';
const SHEETOPS_VOTES_API_KEY = 'sk_live_40bd24a37303db3ee9ac84bc1c04afb0fcde';
const SHEETOPS_DRAFT_CONNECTION_ID = 17;
const SHEETOPS_VOTES_CONNECTION_ID = 18;
const SHEETOPS_BASE_URL = `https://api.sheetops.app/v1/connections/${SHEETOPS_DRAFT_CONNECTION_ID}`;
const SHEETOPS_VOTES_BASE_URL = `https://api.sheetops.app/v1/connections/${SHEETOPS_VOTES_CONNECTION_ID}`;
const SHEETOPS_DEFAULT_TAB = 'Draft';
const sheetOpsHeaders = (baseUrl = SHEETOPS_BASE_URL) => {
  const key = baseUrl === SHEETOPS_VOTES_BASE_URL ? SHEETOPS_VOTES_API_KEY : SHEETOPS_DRAFT_API_KEY;
  if (!key) return {};
  return {
    Authorization: `Bearer ${key}`,
  };
};
const sheetOpsHeadersForUrl = (url) => {
  if (typeof url !== 'string' || !url.startsWith('https://api.sheetops.app')) return {};
  return sheetOpsHeaders(url.includes(`/connections/${SHEETOPS_VOTES_CONNECTION_ID}/`) ? SHEETOPS_VOTES_BASE_URL : SHEETOPS_BASE_URL);
};
const getSheetOpsRowsUrl = (tab = SHEETOPS_DEFAULT_TAB) => `${SHEETOPS_BASE_URL}/rows?tab=${encodeURIComponent(tab)}`;
const DRAFT_SHEET_URL = getSheetOpsRowsUrl('Draft');
const VOTES_API = SHEETOPS_VOTES_BASE_URL;
const PLAYERS_URL = '/players.json';

// E2E online guard
const isOnline = () => (typeof navigator === 'undefined' ? true : navigator.onLine !== false);

import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
// --- Lightweight client cache (memory + localStorage) ---
// Reduces GET spam while keeping correctness via forceNetwork in critical paths.
const MEMORY_CACHE = new Map();
const PENDING = new Map();
const CACHE_PREFIX = 'fantasy:cache:';
const encodeKey = (url) => `${CACHE_PREFIX}${encodeURIComponent(url)}`;

function readLS(url) {
  try {
    const raw = localStorage.getItem(encodeKey(url));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.ts !== 'number') return null;
    return parsed;
  } catch {
    return null;
  }
}
function writeLS(url, payload) {
  try {
    // payload may include { ts, data, headers, etag }
    localStorage.setItem(encodeKey(url), JSON.stringify(payload));
  } catch {}
}

/**
 * cachedGet(url, { ttlMs, forceNetwork })
 * - ttlMs: how long a cached record is fresh
 * - forceNetwork: always revalidate (sends If-None-Match when possible)
 * Returns: { data, headers }
 */
async function cachedGet(url, { ttlMs = 15000, forceNetwork = false } = {}) {
  if (PENDING.has(url)) return PENDING.get(url); // de-dupe concurrent callers

  const now = Date.now();
  const mem = MEMORY_CACHE.get(url);
  const ls = !forceNetwork ? readLS(url) : readLS(url); // we may still want its ETag when forcing

  // Fresh memory
  if (!forceNetwork && mem && now - mem.ts < ttlMs) {
    return { data: mem.data, headers: mem.headers || {} };
  }
  // Fresh localStorage
  if (!forceNetwork && ls && now - ls.ts < ttlMs) {
    MEMORY_CACHE.set(url, ls);
    return { data: ls.data, headers: ls.headers || {} };
  }

  // Prepare network revalidation
  const previous = mem || ls || null;
  const prevEtag = previous?.etag || null;

  const p = (async () => {
    if (!isOnline() && previous) {
      // Offline + stale: serve last copy
      return { data: previous.data, headers: previous.headers || {} };
    }
    try {
      const headers = {};
      if (prevEtag) headers['If-None-Match'] = prevEtag;
      const resp = await http.get(url, {
        headers: { ...headers, ...sheetOpsHeadersForUrl(url) },
        validateStatus: (s) => (s >= 200 && s < 300) || s === 304,
      });

      // 304 => not modified, extend cache freshness if we had previous
      if (resp.status === 304 && previous) {
        const headersOut = { date: resp.headers?.date || resp.headers?.Date || null };
        const packed = { ts: Date.now(), data: previous.data, headers: headersOut, etag: prevEtag || null };
        MEMORY_CACHE.set(url, packed);
        writeLS(url, packed);
        return { data: previous.data, headers: headersOut };
      }

      // 200 => new data, persist with ETag if present
      const headersOut = { date: resp.headers?.date || resp.headers?.Date || null };
      const newEtag = resp.headers?.etag || resp.headers?.ETag || null;
      const packed = { ts: Date.now(), data: resp.data, headers: headersOut, etag: newEtag };
      MEMORY_CACHE.set(url, packed);
      writeLS(url, packed);
      return { data: resp.data, headers: headersOut };
    } catch (e) {
      // Network error: serve last known if possible
      if (previous) return { data: previous.data, headers: previous.headers || {} };
      throw e;
    }
  })().finally(() => { PENDING.delete(url); });

  PENDING.set(url, p);
  return p;
}


const extractRows = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.rows)) return data.rows;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

const getDraftTeamField = (rows = []) => {
  const row = rows.find((item) => item && typeof item === 'object');
  if (!row) return 'Player';
  const keys = Object.keys(row);
  return keys.find((key) => key.toLowerCase() === 'player')
    || keys.find((key) => key.toLowerCase() === 'draftl')
    || keys.find((key) => !/^round\s+\d+$/i.test(key))
    || 'Player';
};

const getDraftTeamName = (row, teamField = 'Player') => row?.[teamField] || row?.Player || row?.DraftL || '';

const getDraftRoundPicks = (row = {}) => Object.entries(row)
  .filter(([key]) => /^round\s+\d+$/i.test(key))
  .sort(([a], [b]) => Number(a.match(/\d+/)?.[0] || 0) - Number(b.match(/\d+/)?.[0] || 0))
  .map(([, value]) => value || '—');

const validateDraftBoard = (rows = [], teamOrder = [], rounds = 3, teamField = getDraftTeamField(rows)) => {
  const normalizedTeams = rows.map((row) => normalize(getDraftTeamName(row, teamField))).filter(Boolean);
  const expectedTeams = teamOrder.map(normalize);
  const missingTeams = expectedTeams.filter((team) => !normalizedTeams.includes(team));
  const duplicateTeams = normalizedTeams.filter((team, index) => normalizedTeams.indexOf(team) !== index);
  const orderedRows = teamOrder.map((team) => rows.find(
    (row) => normalize(getDraftTeamName(row, teamField)) === normalize(team)
  ));

  if (missingTeams.length || duplicateTeams.length || orderedRows.some((row) => !row)) {
    return { valid: false, error: 'The draft sheet team list is missing or contains duplicate teams.' };
  }

  const cells = [];
  for (let round = 1; round <= rounds; round += 1) {
    for (const row of orderedRows) cells.push(String(row?.[`Round ${round}`] || '').trim());
  }
  const firstEmpty = cells.findIndex((cell) => !cell || cell === '—');
  const filledCount = firstEmpty === -1 ? cells.length : firstEmpty;
  if (firstEmpty !== -1 && cells.slice(firstEmpty + 1).some((cell) => cell && cell !== '—')) {
    return { valid: false, error: 'The draft sheet has a filled pick after an empty pick. Fix the board order before continuing.' };
  }

  const selectedPlayers = cells.slice(0, filledCount).filter((pick) => normalize(pick) !== 'pass').map(normalize);
  if (new Set(selectedPlayers).size !== selectedPlayers.length) {
    return { valid: false, error: 'The draft sheet contains the same player more than once.' };
  }
  return { valid: true, filledCount };
};

const sheetOpsAppend = (tab, row, baseUrl = SHEETOPS_BASE_URL) => axios.post(
  `${baseUrl}/append`,
  { tab, row },
  { headers: sheetOpsHeaders(baseUrl) }
);

const sheetOpsPatchByPlayer = (tab, player, data, teamField = 'Player') => axios.patch(
  `${SHEETOPS_BASE_URL}/rows`,
  {
    tab,
    match: { [teamField]: player },
    updates: data,
  },
  { headers: sheetOpsHeaders(SHEETOPS_BASE_URL) }
);

const sheetOpsDeleteRows = (tab, where, baseUrl = SHEETOPS_BASE_URL) => axios.delete(
  `${baseUrl}/rows`,
  {
    headers: sheetOpsHeaders(baseUrl),
    data: { tab, match: where },
  }
);

// Clear all caches (for debugging / manual reset)
function clearAllCaches() {
  try {
    for (const k of Object.keys(localStorage)) {
      if (k && k.startsWith(CACHE_PREFIX)) localStorage.removeItem(k);
    }
  } catch {}
  MEMORY_CACHE.clear();
}

// Cache TTLs (tune as needed)
const PLAYERS_TTL_MS = 12 * 60 * 60 * 1000; // 12h - players list changes rarely
const SHEET_TTL_MS   = 30 * 1000;           // 30s - picks change often
const LOG_TTL_MS     = 20 * 1000;           // 20s - recap log
const REFRESH_THROTTLE_MS = 15 * 1000;    // 15s - throttle manual refresh requests

async function notifyDiscord(payload) {
  try {
    await axios.post('/api/notifyPick', payload);
    console.info('[notifyDiscord] sent via /api/notifyPick');
    return true;
  } catch (e) {
    console.warn('[notifyDiscord] server notification failed', e);
    return false;
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


// Fixed standard draft order (same order in every round)
// Note: uses provided spellings; mapped to actual sheet names via normalization
const RAW_DRAFT_ORDER = [
  'River',
  'Julio',
  'Callie',
  'Kevin',
  'Dustin',
  'Raphy',
  'Daisy',
  'Tariq',
  'Dad',
  'Christian',
  'Utsav',
  'Simon',
];

const getDraftLogUrl = (suffix = '') => {
  if (suffix === '/search') return `${SHEETOPS_BASE_URL}/rows?tab=DraftLog`;
  return suffix ? `${SHEETOPS_BASE_URL}${suffix}` : getSheetOpsRowsUrl('DraftLog');
};

const normalize = str => str?.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, ' ').trim();
// Static phone book (normalized keys). Kept in code so SMS works without SheetBest.
const STATIC_PHONE_BOOK = Object.freeze({
  callie: '+16194033562',
  christian: '+19193256775',
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

const fmtShort = (ms) => {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(totalSec / 86400);
  const h = Math.floor((totalSec % 86400) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  if (d > 0) return `${d}d ${h}h`;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
};


// ---- Feature flags ----
// Disabled: a browser tab is not an authoritative scheduler. Stale/open tabs
// can otherwise race and repeatedly write PASS after a commissioner correction.
const AUTO_PASS_ENABLED = false;
const SERVER_AUTO_PASS_ENABLED = true;
const AUTO_REFRESH_ENABLED = true; // Read-only polling; all automatic writes are server-side

// Add a small grace window and a per-pick guard so one pick can only be auto-passed once
const AUTO_PASS_GRACE_MS = 15000; // 15s grace to avoid false passes from clock jitter
const PASSED_GUARD_KEY = (pid) => `fantasy:autoPassed:${pid}`;
function wasAutoPassDone(pid) { try { return localStorage.getItem(PASSED_GUARD_KEY(pid)) === '1'; } catch { return false; } }
function markAutoPassDone(pid) { try { localStorage.setItem(PASSED_GUARD_KEY(pid), '1'); } catch {} }

// Every picker gets 12 active hours; the clock pauses nightly from 11 PM to 8 AM PT.
const BASE_PICK_MINUTES = 12 * 60;
const EXCEPTION_MINUTES = Object.freeze({});
const getPickWindowMinutes = (teamName, round) => EXCEPTION_MINUTES[normalize(teamName || '')] || BASE_PICK_MINUTES;

// --- PIN (draft code) helpers -------------------------------------------------
const getVotesRowsUrl = (tab = 'Votes') => `${VOTES_API}/rows?tab=${encodeURIComponent(tab)}`;

const getPinsUrl = (suffix = '') => {
  if (suffix === '/search') return `${VOTES_API}/rows?tab=Pins`;
  return suffix ? `${VOTES_API}${suffix}` : getVotesRowsUrl('Pins');
};

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

  const DRAFT_YEAR = 2026;
  const DRAFT_START_ISO = '2026-08-15T09:30:00-07:00';
  const [previewMode, setPreviewMode] = useState(false);
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
  const [selectedPick, setSelectedPick] = useState('');
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

  // --- Player autocomplete (pulls from /players.json) ---
  const [playerNames, setPlayerNames] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightIdx, setHighlightIdx] = useState(0);
  const pickInputRef = useRef(null);
  // Map normalized player name -> position (from Players tab)
  const [playerPosIndex, setPlayerPosIndex] = useState({});
// Phone book seeded in code; failures in SMS are non-blocking
const [phoneBook, setPhoneBook] = useState(STATIC_PHONE_BOOK);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState(null);
  const [nextAllowedRefreshAt, setNextAllowedRefreshAt] = useState(0);

  useEffect(() => {
    // Expect a sheet with a tab named "Players" and a column named Name or Player
    axios
      .get(PLAYERS_URL)
      .then((res) => {
        const rows = extractRows(res.data);
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
          const pos = (r.Pos || r.POS || r.position || r.Position || r.pos || '').toString().trim();
          const key = normalize(nm);
          if (pos && index[key] == null) {
            index[key] = pos; // keep the first-seen position only
          }
        }
        setPlayerPosIndex(index);
        if (res && res.headers) updateOffsetFromHeaders(res.headers);
      })
      .catch((err) => {
        console.warn('Player list fetch failed; continuing without suggestions', err?.message || err);
        setPlayerNames([]); // graceful: no suggestions if tab missing
      });
  }, []);

  const normStr = (s = '') => s.toLowerCase();
  const buildSuggestions = (q) => {
    const query = normStr(q || '');
    if (query.length < 1 || !playerNames.length) {
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
    setSelectedPick(name);
    setPendingPickLabel(name);
    setShowSuggestions(false);
    // focus stays in the input for fast submit
    if (pickInputRef.current) pickInputRef.current.focus();
  };

  // --- Test SMS state (currently hidden) ---
  const [testSmsSending, setTestSmsSending] = useState(false);
  const [testSmsMessage, setTestSmsMessage] = useState('');
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
        setSubmitError('Time expired — automatic pass is pending.');
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
      const latest = await cachedGet(DRAFT_SHEET_URL, { ttlMs: SHEET_TTL_MS, forceNetwork: true });
      if (latest && latest.headers) updateOffsetFromHeaders(latest.headers);
      const latestRows = extractRows(latest.data);
      const teamField = getDraftTeamField(latestRows);
      const boardCheck = validateDraftBoard(latestRows, teamOrder, rounds, teamField);
      if (!boardCheck.valid) {
        setSubmitError(boardCheck.error);
        setConfirmOpen(false);
        return;
      }
      const formatted = latestRows.map(row => ({
        name: getDraftTeamName(row, teamField),
        picks: getDraftRoundPicks(row)
      }));

      // Recompute the authoritative turn from the freshly fetched sheet. Never
      // trust a stale browser render when deciding which cell to mutate.
      const latestOrdered = teamOrder.map((name) => (
        formatted.find((player) => normalize(player.name) === normalize(name))
        || { name, picks: Array(rounds).fill('—') }
      ));
      const latestFilledCount = boardCheck.filledCount;
      const latestOverallPick = latestFilledCount + 1;
      const latestRound = Math.min(Math.ceil(latestOverallPick / Math.max(totalTeams, 1)), rounds);
      const latestTeam = teamOrder[(latestOverallPick - 1) % Math.max(totalTeams, 1)] || '';
      if (
        latestOverallPick !== overallPick
        || latestRound !== currentRound
        || normalize(latestTeam) !== normalize(voterName)
      ) {
        setPlayersPicks(formatted);
        setSubmitError(`The draft advanced. It is now ${latestTeam || 'the next manager'}'s turn.`);
        setConfirmOpen(false);
        return;
      }

      const teamIdx = formatted.findIndex(p => normalize(p.name) === normalize(voterName));
      if (teamIdx === -1) { setSubmitError('Name not found in draft sheet.'); return; }

      const roundCol = `Round ${currentRound}`;
      const isPass = normalize(pickLabel) === 'pass';

      // Duplicate pick check
      const allPicks = formatted.flatMap(p => p.picks).filter(x => x && x !== '—').map(normalize);
      if (!isPass && allPicks.includes(normalize(pickLabel))) {
        setSubmitError('That player is already drafted.');
        return;
      }

      // Ensure target cell is empty
      const rowObj = latestRows[teamIdx] || {};
      if (rowObj[roundCol] && rowObj[roundCol] !== '—') {
        setSubmitError('This pick was just taken. Refresh and try again.');
        return;
      }

      // Write the pick to the sheet (PATCH by search on Player)
      const patchResponse = await sheetOpsPatchByPlayer('Draft', voterName, { [roundCol]: pickLabel }, teamField);
      const updatedRow = patchResponse?.data?.row || patchResponse?.data?.data?.[0] || null;
      if (!updatedRow || normalize(updatedRow[roundCol]) !== normalize(pickLabel)) {
        throw new Error('SheetOps did not confirm the requested draft cell update.');
      }

      // Log the pick in DraftLog (best-effort, non-blocking)
      try {
        await sheetOpsAppend('DraftLog', {
          pickNumber: overallPick,
          round: currentRound,
          team: voterName,
          pick: pickLabel,
          status: isPass ? 'PASSED' : 'PICKED',
          submittedAt: isoNow(),
          windowHours: getPickWindowMinutes(voterName, currentRound) / 60,
        });
      } catch (e) {
        console.warn('DraftLog write failed (non-blocking). Proceeding without log.');
      }

      // Notify Discord (await so we don't accidentally lose the call on fast state changes)
      const sent = await notifyDiscord({
        pickNumber: overallPick,
        round: currentRound,
        team: voterName,
        pick: pickLabel,
        status: isPass ? 'PASSED' : 'PICKED',
        nextUp: computeNextUp(),
        draftComplete: overallPick >= totalCells,
        totalPicks: totalCells,
        submittedAt: isoNow(),
        pin: pinRecord ? pinInput : newPin,
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
      setSelectedPick('');
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
// Hydrate localSubmitAt from localStorage on mount (resilience fallback, does NOT affect cross-device or DraftLog-authoritative behavior)
useEffect(() => {
  try {
    const saved = localStorage.getItem('fantasy:lastSubmitAt');
    if (saved) {
      const d = new Date(saved);
      if (!isNaN(+d)) setLocalSubmitAt(d);
    }
  } catch {}
}, []);

// Persist localSubmitAt to localStorage when it changes
useEffect(() => {
  try {
    if (localSubmitAt) {
      localStorage.setItem('fantasy:lastSubmitAt', new Date(localSubmitAt).toISOString());
    }
  } catch {}
}, [localSubmitAt]);

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

// --- Manual refresh helpers (no auto reload) ---
async function refreshDraftOnce(forceNetwork = false) {
  try {
    const response = await cachedGet(DRAFT_SHEET_URL, { ttlMs: SHEET_TTL_MS, forceNetwork });
    if (response && response.headers) updateOffsetFromHeaders(response.headers);
    const rows = extractRows(response.data);
    const teamField = getDraftTeamField(rows);
    const formatted = rows.map(row => ({
      name: getDraftTeamName(row, teamField),
      picks: getDraftRoundPicks(row)
    }));
    setPlayersPicks(formatted);
    const allPicks = formatted
      .flatMap(player => player.picks)
      .filter(pick => pick && pick !== '—' && normalize(pick) !== 'pass')
      .map(normalize);
    const duplicates = allPicks.filter((item, index, self) => self.indexOf(item) !== index);
    setDuplicatePicks(new Set(duplicates));
  } catch (error) {
    console.error('Error fetching draft data:', error);
  }
}

async function refreshLogOnce(forceNetwork = false) {
  if (!logsReady) return;
  try {
    const res = await cachedGet(getDraftLogUrl(''), { ttlMs: LOG_TTL_MS, forceNetwork });
    if (res && res.headers) updateOffsetFromHeaders(res.headers);
    setDraftLogRows(extractRows(res.data));
  } catch (err) {
    console.warn('DraftLog fetch failed; continuing without log rows', err?.message || err);
  }
}

async function refreshAll() {
  try {
    const now = Date.now();
    if (now < nextAllowedRefreshAt) {
      // Within throttle window; skip network and keep UI as-is
      return;
    }
    setNextAllowedRefreshAt(now + REFRESH_THROTTLE_MS);
    setRefreshing(true);
    // Revalidate both with If-None-Match; 304s won't download bodies
    await Promise.all([refreshDraftOnce(true), refreshLogOnce(true)]);
    setLastUpdatedAt(new Date());
  } finally {
    setRefreshing(false);
  }
}

// --- Business-hours draft clock (Pacific Time) ---------------------------------
const ACTIVE_TZ = 'America/Los_Angeles';
const ACTIVE_START_HOUR = 8;  // 8:00 AM PT
const ACTIVE_END_HOUR = 23;   // 11:00 PM PT

// Parse a Date into Pacific local parts using Intl (works regardless of viewer's time zone)
function getTZParts(d, tz = ACTIVE_TZ) {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour12: false,
    hourCycle: 'h23',
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
  const targetAsUtc = Date.UTC(p.y, (p.m || 1) - 1, p.d, p.H || 0, p.M || 0, p.S || 0);
  let guess = targetAsUtc;
  // Iteratively compare the desired wall-clock parts with the parts displayed
  // in Pacific Time. A second pass resolves dates that cross a DST boundary.
  for (let i = 0; i < 4; i += 1) {
    const shown = getTZParts(new Date(guess), tz);
    const shownAsUtc = Date.UTC(shown.y, shown.m - 1, shown.d, shown.H || 0, shown.M || 0, shown.S || 0);
    const correction = targetAsUtc - shownAsUtc;
    guess += correction;
    if (correction === 0) break;
  }
  return new Date(guess);
}

// Given a start time, add N active minutes counting only 8am–11pm PT windows.
function computeActiveDeadline(startDate, minutesNeeded = 60, tz = ACTIVE_TZ) {
  let cursor = new Date(startDate instanceof Date ? startDate.getTime() : new Date(startDate).getTime());
  let leftMs = Math.max(0, minutesNeeded * 60000);
  let guard = 0;
  while (leftMs > 0 && guard++ < 1000) {
    const p = getTZParts(cursor, tz);
    const windowStart = localPartsToDate({ y: p.y, m: p.m, d: p.d, H: ACTIVE_START_HOUR, M: 0, S: 0 }, tz);
    const windowEnd   = localPartsToDate({ y: p.y, m: p.m, d: p.d, H: ACTIVE_END_HOUR,   M: 0, S: 0 }, tz);

    // If before the window, jump to 8 AM. If after, jump to next day at 8 AM.
    if (cursor < windowStart) {
      cursor = windowStart;
      continue;
    }
    if (cursor >= windowEnd) {
      const nextDayStart = localPartsToDate({ y: p.y, m: p.m, d: p.d + 1, H: ACTIVE_START_HOUR, M: 0, S: 0 }, tz);
      cursor = nextDayStart;
      continue;
    }

    const availableMs = windowEnd.getTime() - cursor.getTime();
    if (leftMs <= availableMs) {
      return new Date(cursor.getTime() + leftMs);
    }
    leftMs -= availableMs;
    const nextDayStart = localPartsToDate({ y: p.y, m: p.m, d: p.d + 1, H: ACTIVE_START_HOUR, M: 0, S: 0 }, tz);
    cursor = nextDayStart;
  }
  return cursor; // fallback
}

// Count only active-time milliseconds between two instants. During the nightly
// pause this value remains unchanged, so the UI countdown visibly freezes.
function computeActiveDuration(startDate, endDate, tz = ACTIVE_TZ) {
  let cursor = new Date(startDate);
  const end = new Date(endDate);
  let totalMs = 0;
  let guard = 0;
  while (cursor < end && guard++ < 1000) {
    const p = getTZParts(cursor, tz);
    const windowStart = localPartsToDate({ y: p.y, m: p.m, d: p.d, H: ACTIVE_START_HOUR, M: 0, S: 0 }, tz);
    const windowEnd = localPartsToDate({ y: p.y, m: p.m, d: p.d, H: ACTIVE_END_HOUR, M: 0, S: 0 }, tz);
    if (cursor < windowStart) {
      cursor = new Date(Math.min(windowStart.getTime(), end.getTime()));
      continue;
    }
    if (cursor >= windowEnd) {
      cursor = localPartsToDate({ y: p.y, m: p.m, d: p.d + 1, H: ACTIVE_START_HOUR, M: 0, S: 0 }, tz);
      continue;
    }
    const segmentEnd = new Date(Math.min(windowEnd.getTime(), end.getTime()));
    totalMs += segmentEnd.getTime() - cursor.getTime();
    cursor = segmentEnd;
  }
  return totalMs;
}

  // --- Draft start time (configurable; fallback static) ---
  const [startTime, setStartTime] = useState(DRAFT_START_ISO);
  useEffect(() => {
    // Optionally fetch from a Config tab in Sheet.best:
    // axios.get(`${DRAFT_SHEET_URL.replace(/\/$/, '')}/tabs/Config`)
    //   .then(res => {
    //     const row = Array.isArray(res.data) ? res.data[0] : null;
    //     if (row?.startTime) setStartTime(row.startTime);
    //   })
    //   .catch(() => {});
    // Keep static fallback for now.
    setStartTime(DRAFT_START_ISO);
  }, [DRAFT_START_ISO]);
   const draftStart = React.useMemo(() => new Date(startTime), [startTime]);
  // DraftLog tab readiness
  const [logsReady, setLogsReady] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        const res = await cachedGet(getDraftLogUrl(''), { ttlMs: LOG_TTL_MS, forceNetwork: true });
        setLogsReady(extractRows(res.data).length >= 0);
        if (res && res.headers) updateOffsetFromHeaders(res.headers);
      } catch (err) {
        console.warn('DraftLog readiness check failed', err?.message || err);
        setLogsReady(false);
      }
    })();
  }, []);

  // Poll DraftLog for last submitted time (manual refresh only)
  const [draftLogRows, setDraftLogRows] = useState([]);
  useEffect(() => {
    if (!logsReady) return;
    refreshLogOnce();
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
    refreshDraftOnce(); // initial fetch only
  }, []);

  useEffect(() => {
    if (!AUTO_REFRESH_ENABLED) return undefined;
    const refreshId = setInterval(() => {
      void Promise.all([refreshDraftOnce(true), refreshLogOnce(true)]);
    }, 60 * 1000);
    return () => clearInterval(refreshId);
  }, [logsReady]);

  const teamOrder = React.useMemo(() => {
    // Map normalized name -> actual sheet name
    const byNorm = new Map(playersPicks.map(p => [normalize(p.name), p.name]));
    // Return the provided order, translated to the exact sheet names if present
    return RAW_DRAFT_ORDER.map((n) => byNorm.get(normalize(n)) || n);
  }, [playersPicks]);
  const totalTeams = teamOrder.length;
  const rounds = 3;
  const orderedPlayersPicks = React.useMemo(() => teamOrder.map((name) => (
    playersPicks.find((player) => normalize(player.name) === normalize(name)) || { name, picks: Array(rounds).fill('—') }
  )), [playersPicks, teamOrder]);
  const filledCount = React.useMemo(() => orderedPlayersPicks.reduce(
    (acc, player) => acc + player.picks.slice(0, rounds).filter((pick) => pick && pick !== '—').length,
    0
  ), [orderedPlayersPicks]);
  const overallPick = filledCount + 1;
  const currentRound = Math.min(Math.ceil(overallPick / Math.max(totalTeams, 1)), rounds);
  const idxInRound = (overallPick - 1) % Math.max(totalTeams, 1);
  const orderThisRound = teamOrder;
  const onTheClock = orderThisRound[idxInRound] || '';
  // ---- Draft completion state ----
  const totalCells = Math.max(totalTeams, 1) * rounds;
  const isDraftComplete = filledCount >= totalCells;
  const isOffseason = effectiveNow < draftStart;
  const liveDraftEnabled = !isOffseason && !isDraftComplete;
  const showPreviewExperience = previewMode && isOffseason;
// Compute the next team on the clock based on current state
const computeNextUp = React.useCallback(() => {
  if (!totalTeams || isDraftComplete) return '';
  let nextRound = currentRound;
  let nextIdx = idxInRound + 1;
  if (nextIdx >= totalTeams) {
    nextRound = currentRound + 1;
    nextIdx = 0;
  }
  if (nextRound > rounds) return '';
  const nextOrder = teamOrder;
  return nextOrder[nextIdx] || '';
}, [currentRound, idxInRound, teamOrder, totalTeams, isDraftComplete, rounds]);

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
  // The current clock must be anchored only by the immediately preceding pick.
  // Taking the newest timestamp from the whole log lets stray/future rows move
  // an unrelated clock, while preferring a browser fallback can reset it.
  const previousPickNumber = overallPick - 1;
  let authoritative = null;
  for (const r of draftLogRows) {
    if (Number(r?.pickNumber) !== previousPickNumber) continue;
    const t = r?.submittedAt || r?.submitted_at || r?.timestamp;
    if (t) {
      const d = new Date(t);
      if (!isNaN(+d) && d.getFullYear() === DRAFT_YEAR && (!authoritative || d > authoritative)) {
        authoritative = d;
      }
    }
  }
  if (authoritative) return authoritative;
  const local = localSubmitAt ? new Date(localSubmitAt) : null;
  return local && !isNaN(+local) ? local : null;
}, [draftLogRows, localSubmitAt, overallPick]);

// --- Local per-pick start fallback (used ONLY if DraftLog is unavailable) ---
const PICK_START_KEY = (pid) => `fantasy:pickStart:${pid}`;
function loadPickStart(pid) {
  try {
    const v = localStorage.getItem(PICK_START_KEY(pid));
    if (!v) return null;
    const d = new Date(v);
    return isNaN(+d) ? null : d;
  } catch { return null; }
}
function savePickStart(pid, date) {
  try {
    if (!date) return;
    localStorage.setItem(PICK_START_KEY(pid), new Date(date).toISOString());
  } catch {}
}

// Latch a stable, authoritative start time per pick so the countdown is always anchored by DraftLog (never resets on reload).
// We only re-latch when the pick rotates to a new team/round.
const pickId = `${currentRound}:${overallPick}:${normalize(onTheClock)}`;

useEffect(() => {
  // New pick -> clear any previous auto-pass guard
  try { localStorage.removeItem(PASSED_GUARD_KEY(pickId)); } catch {}
}, [pickId]);
const clockStartRef = useRef(null);
const lastPickIdRef = useRef(null);
useEffect(() => {
  // Compute the best available start for this pick
  const computeStart = () => {
    if (overallPick <= 1) return draftStart; // first pick anchors to configured start
    if (lastSubmittedAt) return lastSubmittedAt; // authoritative: DraftLog timestamp
    const stored = loadPickStart(pickId); // local, per-device fallback
    if (stored) return stored;
    // As a last resort, anchor to the calibrated now and persist locally.
    // NOTE: This fallback is only used when DraftLog is unreachable, so it won't be cross-device authoritative,
    // but it prevents a permanent "Expired" state on deploy.
    savePickStart(pickId, effectiveNow);
    return effectiveNow;
  };

  const nextStart = computeStart();

  if (lastPickIdRef.current !== pickId) {
    // New pick: latch start
    lastPickIdRef.current = pickId;
    clockStartRef.current = nextStart;
    // If we ended up using DraftLog, also persist locally for resiliency
    if (lastSubmittedAt) savePickStart(pickId, lastSubmittedAt);
  } else {
    // Same pick: DraftLog may arrive after the initial render. It is authoritative
    // even when its timestamp is earlier than the temporary browser fallback.
    if (
      lastSubmittedAt
      && (!clockStartRef.current || lastSubmittedAt.getTime() !== clockStartRef.current.getTime())
    ) {
      clockStartRef.current = lastSubmittedAt;
      savePickStart(pickId, lastSubmittedAt);
    }
  }
  // deps include effectiveNow so that first-view fallback can store immediately; this won't cause loops
}, [pickId, overallPick, lastSubmittedAt, draftStart, effectiveNow]);

const clockStart = clockStartRef.current || draftStart;

const windowMinutes = getPickWindowMinutes(onTheClock, currentRound);
const clockDeadline = React.useMemo(
  () => computeActiveDeadline(clockStart, windowMinutes),
  [clockStart, windowMinutes]
);
const rawPickMsLeft = effectiveNow < clockDeadline
  ? computeActiveDuration(effectiveNow, clockDeadline)
  : clockDeadline.getTime() - effectiveNow.getTime();
const pickMsLeft = Math.max(0, rawPickMsLeft);
// Free agency opens 24 hours after the final draft pick/pass is recorded.
const freeAgencyStart = isDraftComplete && lastSubmittedAt
  ? new Date(new Date(lastSubmittedAt).getTime() + 24 * 60 * 60 * 1000)
  : null;
const freeAgencyMsLeft = freeAgencyStart ? Math.max(0, freeAgencyStart.getTime() - effectiveNow.getTime()) : null;

  // Use draftStart (already a Date) for draft start logic (hasDraftStarted is true if draft start time is now or in the past)
  const hasDraftStarted = effectiveNow >= draftStart;
  const draftNotStarted = !hasDraftStarted;

  const [passInFlight, setPassInFlight] = useState(false);
  // --- Auto-pass logic with updated checks ---
  // Helper: check if the current pick is expired
  function pickExpired() {
    // Only treat as expired once we're past the deadline by the grace period
    return hasDraftStarted && (rawPickMsLeft <= -AUTO_PASS_GRACE_MS);
  }
  useEffect(() => {
    if (isDraftComplete) return; // stop auto-pass once draft is finished
    if (!AUTO_PASS_ENABLED) return; // <— hard-disable auto-pass
    if (!onTheClock) return;              // must have a valid team on the clock
    if (wasAutoPassDone(pickId)) return;  // ensure we only auto-pass once per pick id
    // Helper function: check and auto-pass if needed
    const checkAndAutoPass = async () => {
      // Only run if draft has started or if current pick is truly expired
      if (!hasDraftStarted) return;
      // Do NOT depend on DraftLog being available; still auto-pass and fall back to local clock.
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
        const latest = await cachedGet(DRAFT_SHEET_URL, { ttlMs: SHEET_TTL_MS, forceNetwork: true });
        if (latest && latest.headers) updateOffsetFromHeaders(latest.headers);
        const latestRows = extractRows(latest.data);
        const teamField = getDraftTeamField(latestRows);
        const boardCheck = validateDraftBoard(latestRows, teamOrder, rounds, teamField);
        if (!boardCheck.valid) {
          console.error('[autoPass] Refusing to mutate an invalid draft board:', boardCheck.error);
          setSubmitError(boardCheck.error);
          setPassInFlight(false);
          return;
        }
        const latestFormatted = latestRows.map((row) => ({
          name: getDraftTeamName(row, teamField),
          picks: getDraftRoundPicks(row),
        }));
        const latestOrdered = teamOrder.map((name) => (
          latestFormatted.find((player) => normalize(player.name) === normalize(name))
          || { name, picks: Array(rounds).fill('—') }
        ));
        const latestFilledCount = boardCheck.filledCount;
        const latestOverallPick = latestFilledCount + 1;
        const latestRound = Math.min(Math.ceil(latestOverallPick / Math.max(totalTeams, 1)), rounds);
        const latestTeam = teamOrder[(latestOverallPick - 1) % Math.max(totalTeams, 1)] || '';
        if (
          latestOverallPick !== overallPick
          || latestRound !== currentRound
          || normalize(latestTeam) !== normalize(onTheClock)
        ) {
          setPlayersPicks(latestFormatted);
          setPassInFlight(false);
          return;
        }
        const sheetTeamIdx = latestRows.findIndex((r) => normalize(getDraftTeamName(r, teamField)) === normalize(onTheClock));
        const latestRow = latestRows[sheetTeamIdx] || {};
        if (latestRow[roundCol] && latestRow[roundCol] !== '—') { setPassInFlight(false); return; }

        // Mark PASS in sheet
        const patchResponse = await sheetOpsPatchByPlayer('Draft', onTheClock, { [roundCol]: 'PASS' }, teamField);
        const updatedRow = patchResponse?.data?.row || patchResponse?.data?.data?.[0] || null;
        if (!updatedRow || normalize(updatedRow[roundCol]) !== 'pass') {
          throw new Error('SheetOps did not confirm the automatic pass update.');
        }
        // Log the pass (best-effort)
        try {
          await sheetOpsAppend('DraftLog', {
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
          draftComplete: overallPick >= totalCells,
          totalPicks: totalCells,
          submittedAt: isoNow(),
        });
        if (!passSent) console.warn('[notifyDiscord] pass notification failed');
        // Fire-and-forget SMS; do not block if it fails
        // void notifyNextUpSMS(computeNextUp());
        // Prevent cascade by locally anchoring the next pick's start time to now
        setLocalSubmitAt(new Date(effectiveNow.getTime()));
        // Mark this pick as handled so we never auto-pass it again
        markAutoPassDone(pickId);
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
  }, [rawPickMsLeft, playersPicks, onTheClock, currentRound, overallPick, logsReady, timeLeft.total, hasDraftStarted, passInFlight, isDraftComplete]);

  useEffect(() => {
    setPinError('');
    setPinInput('');
    setNewPin('');
    setNewPinConfirm('');
    if (!voterName) { setPinRecord(null); setPinMode('verify'); return; }

    axios.post('/api/draftPin', { action: 'status', team: voterName })
      .then((res) => {
        const exists = res?.data?.exists === true;
        setPinRecord(exists ? { exists: true } : null);
        setPinMode(exists ? 'verify' : 'set');
      })
      .catch((err) => {
        console.warn('SheetOps PIN fetch failed; falling back to set mode', err?.message || err);
        setPinRecord(null);
        setPinMode('set');
      });
  }, [voterName]);

  const getPinHashFromRecord = (rec) => rec?.pinHash || rec?.pinhash || rec?.hash;
  const getSaltFromRecord = (rec) => rec?.salt || '';

  const verifyPinAgainstRecord = async (pin, rec) => {
    if (!rec) return false;
    const response = await axios.post('/api/draftPin', { action: 'verify', team: voterName, pin });
    return response?.data?.valid === true;
  };

  const createOrUpdatePin = async (voter, pin) => {
    await axios.post('/api/draftPin', { action: 'create', team: voter, pin });
    setPinRecord({ exists: true });
    setPinMode('verify');
  };

  const submitPick = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (isDraftComplete) { setSubmitError('Draft is complete — no further picks.'); return; }
    if (!voterName) { setSubmitError('Select your name.'); return; }
    if (!pickInput.trim()) { setSubmitError('Enter your pick.'); return; }
    if (!selectedPick || normalize(selectedPick) !== normalize(pickInput)) {
      setSubmitError('Choose a rookie from the suggestion list, or use the PASS button.');
      return;
    }
    // Draft must have started
    if (draftNotStarted) {
      setSubmitError("Draft hasn't started yet.");
      return;
    }
    if (showPreviewExperience) {
      setSubmitError(`Preview mode is enabled. Live pick submissions open on August 15, ${DRAFT_YEAR} at 9:30 AM PT.`);
      return;
    }
    // Must be on the clock
    if (normalize(voterName) !== normalize(onTheClock)) {
      setSubmitError(`It's ${onTheClock || 'someone else'}'s turn.`);
      return;
    }
    // Time window must still be open
    if (pickMsLeft <= 0) {
      setSubmitError('Time expired — automatic pass is pending.');
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
      <style>{`
        @keyframes nprogress { 0% { transform: translateX(-100%); } 100% { transform: translateX(300%); } }
        .animate-nprogress { animation: nprogress 2s linear infinite; }
        @keyframes pulseGlow { 0%,100% { opacity: .6; } 50% { opacity: 1; } }
        .animate-pulseGlow { animation: pulseGlow 1.8s ease-in-out infinite; }
        @keyframes shimmerStripe { 0% { background-position: 0% 0; } 100% { background-position: 200% 0; } }
        .animate-shimmer { animation: shimmerStripe 1.8s linear infinite; }
        @keyframes dotwave { 0%,60%,100% { transform: translateY(0); opacity: .6; } 30% { transform: translateY(-2px); opacity: 1; } }
        .animate-dotwave { animation: dotwave 1.2s ease-in-out infinite; }
      `}</style>

      <section className="px-6 py-20 text-center max-w-7xl mx-auto bg-gradient-to-br from-black via-gray-900 to-black rounded-2xl shadow-2xl border border-lime-500">
        <h1 className="text-6xl md:text-7xl font-extrabold uppercase tracking-wider mb-6 text-white drop-shadow-[0_0_20px_rgba(0,255,0,0.5)]">
          {DRAFT_YEAR} Draft Day
        </h1>
       

        <div className="mt-14 mb-20 text-center">
          {/* <h2 className="text-4xl md:text-5xl uppercase font-extrabold text-lime-300 tracking-tight mb-4">
            Draft Countdown
          </h2> */}
          {timeLeft.total > 0 ? (
            <div className="space-y-6">
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

              {isOffseason && (
                <div className="max-w-3xl mx-auto space-y-4">
                  <div className="text-2xl md:text-3xl font-black text-lime-300">{DRAFT_YEAR} Draft Day is August 15, {DRAFT_YEAR} at 9:30 AM PT</div>
                  <div className="text-sm md:text-base text-gray-300">
                    The {DRAFT_YEAR - 1} draft is over. Live draft controls, pick submissions, DraftLog warnings, and on-the-clock updates stay disabled until the new draft begins.
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => setPreviewMode((v) => !v)}
                      className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-lg border border-lime-400 text-lime-300 hover:bg-lime-400 hover:text-black transition"
                    >
                      {previewMode ? 'Hide Preview Mode' : 'Preview 2026 Draft Experience'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : isDraftComplete ? (
            <div className="text-5xl font-black text-emerald-400"></div>
          ) : (
            <div className="text-5xl font-black text-red-500">The Draft Has Begun!</div>
          )}
        </div>

        {isDraftComplete && (
          <div className="mb-6 text-center">
            <div className="inline-flex flex-col items-center gap-3 bg-emerald-600/15 border border-emerald-400 text-emerald-200 px-5 py-4 rounded-xl">
              <div className="text-2xl md:text-3xl font-extrabold uppercase tracking-wide">Draft Complete</div>
              <div className="text-sm text-emerald-200/90">
                {lastSubmittedAt
                  ? `Completed on ${new Date(lastSubmittedAt).toLocaleString('en-US', { timeZone: ACTIVE_TZ, month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })} PT`
                  : 'All rounds are filled.'}
              </div>
              {freeAgencyStart && (
                <div className="text-sm text-emerald-100">
                  {freeAgencyMsLeft > 0
                    ? `Free agency opens in ${fmtShort(freeAgencyMsLeft)} (24 hours after the final pick).`
                    : 'Free agency is open. Standard FAAB bidding rules apply.'}
                </div>
              )}
              <a
                href="https://fantasy.espn.com/football/league/rosters?leagueId=135143"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-lg border border-emerald-400 hover:bg-emerald-400 hover:text-black transition"
                title="View ESPN rosters"
              >
                View ESPN Rosters
              </a>
            </div>
          </div>
        )}

        <div className="max-w-2xl mx-auto">
          {/* DraftLog readiness banner */}
          {!isOffseason && !logsReady && showLogWarning && (
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
                    {liveDraftEnabled && (
            <div className="mb-4 text-center">
              <div className="mx-auto w-full sm:w-auto inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 rounded-xl sm:rounded-full border text-xs sm:text-sm font-semibold uppercase tracking-normal sm:tracking-wide bg-lime-500/10 border-lime-400 text-lime-300 max-w-full whitespace-normal break-words">
                <span className="w-2 h-2 rounded-full bg-current inline-block" />
                On the Clock: <span className="ml-1 text-white">{onTheClock || '—'}</span> · Round {currentRound} · Pick {overallPick}
                {!draftNotStarted && (
                  <>
                    <span className="mx-2">•</span>
                    <span className="text-gray-300 normal-case">Time Left:</span>
                    <span className={`ml-1 ${pickMsLeft > 0 ? 'text-white' : 'text-red-400'}`}>{pickMsLeft > 0 ? fmtDuration(pickMsLeft) : 'EXPIRED'}</span>
                    <span className="ml-2 text-gray-400 normal-case">({windowMinutes % 60 === 0 ? `${windowMinutes / 60}h` : `${windowMinutes}m`} window)</span>
                  </>
                )}
              </div>
            </div>
          )}
          {showPreviewExperience && (
            <div className="mb-4 text-center">
              <div className="mx-auto w-full sm:w-auto inline-flex flex-wrap items-center justify-center gap-2 px-4 py-2 rounded-xl sm:rounded-full border text-xs sm:text-sm font-semibold uppercase tracking-normal sm:tracking-wide bg-indigo-500/10 border-indigo-400 text-indigo-300 max-w-full whitespace-normal break-words">
                <span className="w-2 h-2 rounded-full bg-current inline-block" />
                Preview Mode · Live draft disabled until August 15, {DRAFT_YEAR} at 9:30 AM PT
              </div>
            </div>
          )}

          
          {/* Submit Pick Card */}
          {(liveDraftEnabled || showPreviewExperience) && (
            <form onSubmit={submitPick} className="relative overflow-visible bg-gradient-to-b from-zinc-900/95 to-black/95 border border-lime-400/30 rounded-2xl p-5 sm:p-7 shadow-[0_24px_80px_rgba(0,0,0,0.45)] ring-1 ring-white/5 space-y-5">
              {SERVER_AUTO_PASS_ENABLED && !draftNotStarted && pickMsLeft <= 0 && (
                <div className="rounded-lg border border-amber-400/50 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
                  This pick has expired. The server is recording the pass; the next turn normally appears within five minutes.
                </div>
              )}
              {showPreviewExperience && (
                <div className="rounded-lg border border-indigo-400/40 bg-indigo-500/10 px-4 py-3 text-sm text-indigo-200">
                  Preview mode lets everyone see the draft UI early, but submissions, DraftLog activity, Discord alerts, and live draft pop-ups remain off until the real draft starts.
                </div>
              )}
              <div>
                <label className="block text-xs uppercase text-gray-400 mb-1">Your Name</label>
                <select
                  value={voterName}
                  onChange={(e) => setVoterName(e.target.value)}
                  className="w-full bg-black/70 text-white px-4 py-3.5 rounded-xl border border-zinc-700 shadow-inner focus:outline-none focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20 transition"
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
                    onChange={(e) => { setPickInput(e.target.value); setSelectedPick(''); buildSuggestions(e.target.value); }}
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
                    className="w-full bg-black/70 text-white px-4 py-3.5 rounded-xl border border-zinc-700 shadow-inner focus:outline-none focus:border-lime-400 focus:ring-2 focus:ring-lime-400/20 transition"
                    required
                  />

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
                      pickInput && pickInput.length >= 1 && (
                        <div className="absolute z-20 mt-1 w-full bg-gray-900 border border-gray-700 rounded-lg shadow-lg text-left px-3 py-2 text-gray-400">
                          No matches
                        </div>
                      )
                    )
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => { setPickInput('PASS'); setSelectedPick('PASS'); setShowSuggestions(false); }}
                  className={`mt-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-xl border transition-all ${
                    normalize(selectedPick) === 'pass'
                      ? 'border-amber-300 bg-amber-400 text-black shadow-[0_8px_20px_rgba(251,191,36,0.16)]'
                      : 'border-amber-400/40 bg-amber-400/5 text-amber-300 hover:bg-amber-400 hover:text-black hover:border-amber-400'
                  }`}
                >
                  {normalize(selectedPick) === 'pass' ? 'Pass Selected' : 'Pass This Pick'}
                </button>
                <p className="text-[11px] text-gray-500 mt-2">Search by name, then select a rookie from the list. Manual entries are blocked.</p>
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
                disabled={isSubmitting || !voterName || !pickInput || draftNotStarted || showPreviewExperience}
                className={`w-full uppercase font-extrabold tracking-wider px-6 py-4 rounded-xl shadow-lg transition-all border ${
                  isSubmitting || !voterName || !pickInput || draftNotStarted || showPreviewExperience
                    ? 'bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed'
                    : normalize(selectedPick) === 'pass'
                      ? 'bg-amber-400 text-black border-amber-300 hover:bg-amber-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(251,191,36,0.2)] active:translate-y-0'
                      : 'bg-lime-400 text-black border-lime-300 hover:bg-lime-300 hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(163,230,53,0.18)] active:translate-y-0'
                }`}
              >
                {showPreviewExperience
                  ? 'Live Draft Opens August 15 at 9:30 AM PT'
                  : normalize(selectedPick) === 'pass'
                    ? 'Submit Pass'
                    : 'Submit Pick'}
              </button>
            </form>
          )}

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
                    Time left: <span className={`${pickMsLeft > 0 ? 'text-white' : 'text-red-400'}`}>{pickMsLeft > 0 ? fmtDuration(pickMsLeft) : 'EXPIRED — AUTO-PASS PENDING'}</span>
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
          {/* Draft utility controls */}
          <div className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-950/80 p-3 sm:p-4 shadow-lg backdrop-blur-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-3">
              {/* Manual refresh (no auto reload) */}
              <button
                type="button"
                onClick={refreshAll}
                disabled={refreshing}
                className="group inline-flex shrink-0 items-center gap-2.5 rounded-xl border border-lime-400/50 bg-lime-400/10 px-4 py-2.5 text-sm font-bold text-lime-300 shadow-[0_0_0_1px_rgba(163,230,53,0.04)] transition-all hover:-translate-y-0.5 hover:border-lime-300 hover:bg-lime-400 hover:text-black hover:shadow-[0_10px_25px_rgba(163,230,53,0.14)] active:translate-y-0 disabled:cursor-wait disabled:opacity-60 disabled:hover:translate-y-0"
                title={`Fetch latest (throttled ${Math.round(REFRESH_THROTTLE_MS/1000)}s) • Uses ETag cache`}
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" className={`h-4 w-4 ${refreshing ? 'animate-spin' : 'transition-transform duration-500 group-hover:rotate-180'}`} fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 6v5h-5M4 18v-5h5M18.4 9A7 7 0 006.1 6.6L4 11m16 2-2.1 4.4A7 7 0 015.6 15" />
                </svg>
                {refreshing ? 'Syncing picks…' : 'Refresh picks'}
              </button>
              <div className="min-w-0 text-left">
                <div className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
                  <span className={`h-2 w-2 rounded-full ${refreshing ? 'animate-pulse bg-amber-400' : 'bg-lime-400 shadow-[0_0_8px_rgba(163,230,53,0.8)]'}`} />
                  {refreshing ? 'Checking for updates' : 'Draft board synced'}
                </div>
                <div className="mt-0.5 truncate text-[11px] text-zinc-500">
                  {lastUpdatedAt
                    ? `Updated ${new Date(lastUpdatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · cache up to ${Math.round(SHEET_TTL_MS / 1000)}s`
                    : 'Refresh to fetch the latest picks'}
                </div>
              </div>
              </div>
              <a
                href="https://discord.gg/Q9JufrVbq"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-indigo-400/50 bg-indigo-400/10 px-4 py-2.5 text-sm font-bold text-indigo-200 transition-all hover:-translate-y-0.5 hover:border-indigo-300 hover:bg-indigo-400 hover:text-black hover:shadow-[0_10px_25px_rgba(129,140,248,0.14)]"
                title="Join Discord to get notified when picks are made"
              >
                <svg aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" className="opacity-90">
                  <path d="M20.317 4.369A19.791 19.791 0 0016.558 3c-.197.35-.42.82-.574 1.2a18.4 18.4 0 00-7.968 0c-.154-.38-.377-.85-.574-1.2A19.789 19.789 0 003.683 4.37C1.803 7.216 1.156 9.96 1.33 12.662c2.1 1.567 4.137 2.52 6.106 3.145.47-.646.892-1.338 1.257-2.067a11.71 11.71 0 01-1.905-.902c.16-.118.315-.242.464-.37 3.692 1.74 7.69 1.74 11.383 0 .149.129.304.252.464.37-.611.345-1.253.64-1.905.902.365.729.787 1.421 1.257 2.067 1.97-.625 4.006-1.578 6.106-3.145.252-3.958-.68-6.67-2.74-8.293zM9.5 12.5c-.9 0-1.625-.9-1.625-2s.725-2 1.625-2 1.625.9 1.625 2-.725 2-1.625 2zm5 0c-.9 0-1.625-.9-1.625-2s.725-2 1.625-2 1.625.9 1.625 2-.725 2-1.625 2z" fill="currentColor"/>
                </svg>
                Discord alerts
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
                {Array.from({ length: rounds }, (_, i) => (
                  <th key={i} className="px-3 py-2 text-base tracking-tight text-center">Round {i + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orderedPlayersPicks.map(({ name, picks }, idx) => (
                <tr key={idx} className="even:bg-gray-800/50 hover:bg-lime-300/10 hover:scale-[1.01] transition-transform duration-150">
                  <td className="px-3 py-2 font-semibold">{name}</td>
                  {picks.slice(0, rounds).map((pick, roundIdx) => {
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
        This is a <span className="text-lime-400 font-semibold">three-round standard-order rookie draft</span>. The order stays the same every round.
      </div>
      {isDraftComplete && (
        <div className="text-center text-sm text-emerald-300 font-semibold mb-6">
          All picks are final and locked. Commissioner is inputting rosters in ESPN.
        </div>
      )}
        </div>

      </section>



      <Footer />
    </div>
  );
}
