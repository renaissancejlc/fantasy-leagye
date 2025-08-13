import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';


const DRAFT_SHEET_URL = 'https://api.sheetbest.com/sheets/2d64a4bb-aedf-478d-abb1-504cd6fa2d1f';
const VOTES_API = 'https://api.sheetbest.com/sheets/6ea852be-9b86-4b65-91ed-c0f6756f3744';
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
  'Kevin',
  'Daisy',
  'River',
  'Raphy',
];

const getDraftLogUrl = (suffix = '') => `${DRAFT_SHEET_URL.replace(/\/$/, '')}/tabs/DraftLog${suffix}`;

const normalize = str => str?.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, ' ').trim();

const fmtDuration = (ms) => {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${h}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
};

const getPickWindowHours = (round) => (round <= 3 ? 24 : 12);

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

  // Global tick for per-pick clock
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);


  // DraftLog tab readiness
  const [logsReady, setLogsReady] = useState(true);
  useEffect(() => {
    axios
      .get(getDraftLogUrl(''))
      .then(() => setLogsReady(true))
      .catch(() => setLogsReady(false));
  }, []);

  // Poll DraftLog for last submitted time
  const [draftLogRows, setDraftLogRows] = useState([]);
  useEffect(() => {
    if (!logsReady) return;
    const fetchLog = () => {
      axios
        .get(getDraftLogUrl(''))
        .then((res) => setDraftLogRows(Array.isArray(res.data) ? res.data : []))
        .catch(() => {});
    };
    fetchLog();
    const i = setInterval(fetchLog, 10000);
    return () => clearInterval(i);
  }, [logsReady]);

  useEffect(() => {
    const draftDate = new Date('2025-08-14T09:30:00-07:00');
    const updateCountdown = () => {
      const now = new Date();
      const diff = draftDate - now;

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

    const timer = setInterval(updateCountdown, 1000);
    updateCountdown();
    return () => clearInterval(timer);
  }, []);

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

  const lastSubmittedAt = React.useMemo(() => {
    let max = null;
    for (const r of draftLogRows) {
      const t = r?.submittedAt || r?.submitted_at || r?.timestamp;
      if (t) {
        const d = new Date(t);
        if (!isNaN(+d) && (!max || d > max)) max = d;
      }
    }
    return max;
  }, [draftLogRows]);

  const draftStart = React.useMemo(() => new Date('2025-08-14T09:30:00-07:00'), []);
  const clockStart = React.useMemo(() => {
    return overallPick <= 1 ? draftStart : (lastSubmittedAt || draftStart);
  }, [overallPick, lastSubmittedAt, draftStart]);

  const pickWindowHours = getPickWindowHours(currentRound);
  const clockDeadline = React.useMemo(() => new Date(clockStart.getTime() + pickWindowHours * 3600 * 1000), [clockStart, pickWindowHours]);
  const pickMsLeft = Math.max(0, clockDeadline.getTime() - now.getTime());
  const draftNotStarted = timeLeft.total > 0;

  const [passInFlight, setPassInFlight] = useState(false);
  useEffect(() => {
    // Only run after draft starts
    if (timeLeft.total > 0) return;
    if (!logsReady) return;
    if (pickMsLeft > 0) return;
    if (passInFlight) return;

    const teamIdx = playersPicks.findIndex((p) => normalize(p.name) === normalize(onTheClock));
    if (teamIdx === -1) return;
    const currentCell = playersPicks[teamIdx]?.picks?.[currentRound - 1];
    if (currentCell && currentCell !== '—') return; // already filled

    (async () => {
      try {
        setPassInFlight(true);
        const roundCol = `Round ${currentRound}`;
        // Re-validate emptiness against latest sheet
        const latest = await axios.get(DRAFT_SHEET_URL);
        const sheetTeamIdx = latest.data.findIndex((r) => normalize(r.Player) === normalize(onTheClock));
        const latestRow = latest.data[sheetTeamIdx] || {};
        if (latestRow[roundCol] && latestRow[roundCol] !== '—') { setPassInFlight(false); return; }

        // Mark PASS in sheet
        await axios.patch(`${DRAFT_SHEET_URL.replace(/\/$/, '')}/search`, { [roundCol]: 'PASS' }, { params: { Player: onTheClock } });
        // Log the pass
        await axios.post(getDraftLogUrl(''), {
          pickNumber: overallPick,
          round: currentRound,
          team: onTheClock,
          pick: 'PASS',
          status: 'PASSED',
          submittedAt: new Date().toISOString(),
          windowHours: pickWindowHours,
        });

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
    })();
  }, [pickMsLeft, playersPicks, onTheClock, currentRound, overallPick, logsReady, timeLeft.total]);

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
    await axios.post(getPinsUrl(''), { voter, salt, pinHash, updatedAt: new Date().toISOString() });
    setPinRecord({ voter, salt, pinHash });
    setPinMode('verify');
  };

  const submitPick = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (!voterName) { setSubmitError('Select your name.'); return; }
    if (!pickInput.trim()) { setSubmitError('Enter your pick.'); return; }

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

    // PIN enforcement
    try {
      setIsSubmitting(true);
      if (pinRecord) {
        if (pinInput.length < 4) { setPinError('Enter your PIN'); setIsSubmitting(false); return; }
        const ok = await verifyPinAgainstRecord(pinInput, pinRecord);
        if (!ok) { setPinError('Incorrect PIN'); setIsSubmitting(false); return; }
      } else {
        if (newPin.length < 4 || newPin !== newPinConfirm) {
          setPinError('Create a PIN (min 4) and confirm it.');
          setIsSubmitting(false);
          return;
        }
        await createOrUpdatePin(voterName, newPin);
      }

      // Refresh sheet before we write (prevent race)
      const latest = await axios.get(DRAFT_SHEET_URL);
      const formatted = latest.data.map(row => ({
        name: row.Player,
        picks: Object.entries(row)
          .filter(([key]) => key !== 'Player')
          .map(([, value]) => value || '—')
      }));

      const teamIdx = formatted.findIndex(p => normalize(p.name) === normalize(voterName));
      if (teamIdx === -1) { setSubmitError('Name not found in draft sheet.'); setIsSubmitting(false); return; }

      const roundCol = `Round ${currentRound}`;

      // Duplicate pick check
      const allPicks = formatted.flatMap(p => p.picks).filter(x => x && x !== '—').map(normalize);
      if (allPicks.includes(normalize(pickInput))) {
        setSubmitError('That player is already drafted.');
        setIsSubmitting(false);
        return;
      }

      // Ensure target cell is empty
      const rowObj = latest.data[teamIdx] || {};
      if (rowObj[roundCol] && rowObj[roundCol] !== '—') {
        setSubmitError('This pick was just taken. Refresh and try again.');
        setIsSubmitting(false);
        return;
      }

      // Write the pick to the sheet (PATCH by search on Player)
      await axios.patch(`${DRAFT_SHEET_URL.replace(/\/$/, '')}/search`, { [roundCol]: pickInput.trim() }, { params: { Player: voterName } });

      // Log the pick in DraftLog
      await axios.post(getDraftLogUrl(''), {
        pickNumber: overallPick,
        round: currentRound,
        team: voterName,
        pick: pickInput.trim(),
        status: 'PICKED',
        submittedAt: new Date().toISOString(),
        windowHours: getPickWindowHours(currentRound),
      });

      // Optimistic UI update
      setPlayersPicks(prev => prev.map(p => (
        normalize(p.name) === normalize(voterName)
          ? { ...p, picks: p.picks.map((v, i) => (i === (currentRound - 1) ? pickInput.trim() : v)) }
          : p
      )));

      setPickInput('');
      setPinInput('');
    } catch (err) {
      console.error(err);
      setSubmitError('Could not submit your pick.');
    } finally {
      setIsSubmitting(false);
    }
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
          {!logsReady && (
            <div className="mb-4 text-center">
              <div className="inline-block bg-red-600/20 border-l-4 border-red-500 px-4 py-3 rounded-md shadow text-left text-sm max-w-xl mx-auto">
                <strong className="text-red-400 font-semibold block mb-1">DraftLog Setup Required</strong>
                <span className="text-white">
                  Create a <span className="font-semibold text-lime-300">DraftLog</span> tab with headers:
                  <code className="ml-1 bg-black/40 px-2 py-0.5 rounded">pickNumber,round,team,pick,status,submittedAt,windowHours</code>
                </span>
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
                  <span className="ml-2 text-gray-400 normal-case">({getPickWindowHours(currentRound)}h window)</span>
                </>
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
              <input
                value={pickInput}
                onChange={(e) => setPickInput(e.target.value)}
                placeholder="Type the player name"
                className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-lime-400"
                required
              />
              <p className="text-[11px] text-gray-500 mt-1">Duplicates are automatically blocked.</p>
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
              disabled={isSubmitting || !voterName || !pickInput || !logsReady || draftNotStarted}
              className={`w-full uppercase font-extrabold tracking-wider px-6 py-3 rounded-lg shadow-lg transition-all border-2 ${
                isSubmitting || !voterName || !pickInput || !logsReady || draftNotStarted
                  ? 'bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed'
                  : 'bg-black text-lime-300 border-lime-400 hover:bg-lime-400 hover:text-black'
              }`}
            >
              Submit Pick
            </button>
          </form>

          {/* Backup link to edit sheet directly (commissioner use) */}
          <div className="text-center mt-4">
            <a
              href="https://docs.google.com/spreadsheets/d/1NDVTuhiF8lpWKFLAvP83Llu8Owkq25bx3bHKvvC4bag/edit?usp=sharing"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-lime-300 hover:text-lime-200 underline text-sm"
            >
              Raw Draft Picks Sheet (Commissioner)
            </a>
          </div>
        </div>

        <div className="overflow-x-auto max-w-full mb-16 bg-gradient-to-r from-black via-gray-900 to-black p-2 rounded-xl">
          <h2 className="text-3xl font-bold text-white mb-6 uppercase tracking-wide">Player Picks</h2>
          <p className="text-sm text-gray-300 mb-2 italic">
            Duplicate picks will appear <span className="text-red-400 font-semibold">highlighted in red</span>.
          </p>
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
                    const isDuplicate = duplicatePicks.has(normalize(pick));
                    return (
                      <td
                        key={roundIdx}
                        className={`px-3 py-2 text-center ${isDuplicate ? 'bg-red-600 text-white font-bold' : ''}`}
                      >
                        {pick}
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
