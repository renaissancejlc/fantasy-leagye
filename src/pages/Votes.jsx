import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

// ---------------------------------------------------------------------------
// Configuration — no Vite env needed
// ---------------------------------------------------------------------------

// Optional: set this to your SheetBest (or API) endpoint to persist votes.
// Leave empty to use localStorage for development.
const VOTES_API = 'https://api.sheetbest.com/sheets/6ea852be-9b86-4b65-91ed-c0f6756f3744';

// Fixed season start (kickoff). Before this date = applies to THIS season.
// After this date = queued decision for NEXT season (but voting is locked in-season).
const SEASON_START_ISO = '2025-09-04T17:20:00-07:00';

// League members (one person, one vote per motion)
const members = [
  'Callie',
  'Christian',
  'Cisco',
  'Dad',
  'Daisy',
  'Dustin',
  'Kevin',
  'Raphy',
  'Reny- Test', // test user
  'River',
  'Simon',
  'Tariq',
  'Utsav'
];

// Sheet column keys for motion metadata (sheet uses 'propesedBy' typo)

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const normalize = (str) =>
  str?.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, ' ').trim();

const fmt = (d) =>
  new Date(d).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

// Date-only formatter (no time shown)
const fmtDate = (d) =>
  new Date(d).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });


// Treat YYYY-MM-DD as local midnight instead of UTC
const parseDateLocalIfDateOnly = (value) => {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split('-').map(Number);
    return new Date(y, m - 1, d, 0, 0, 0);
  }
  return new Date(value);
};

// --- PIN (voting code) helpers -------------------------------------------------
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


const seasonStart = new Date(SEASON_START_ISO);
const getSeasonBucket = (now = new Date()) =>
  now < seasonStart ? `${seasonStart.getFullYear()}` : `${seasonStart.getFullYear() + 1}`;

// ---------------------------------------------------------------------------
// Current Motion (first vote)
// ---------------------------------------------------------------------------
const CURRENT_MOTION = {
  id: 'add-second-wr',
  title: 'Add a 2nd WR to Starting Rosters',
  question:
    "Should we add a second wide receiver (WR2) slot to each team's weekly starting lineup?",
  createdAt: '2025-08-13',
  proposedBy: 'Raphy',
  expedited: false, // allow if opened within 3 days of kickoff
};

export default function Votes() {
  // Offseason vs In-season
  const [now, setNow] = useState(new Date());
  const isOffseason = now < seasonStart;
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // 3-day voting window from this motion's creation
  const VOTING_WINDOW_DAYS = 3;
  const motionOpenAt = useMemo(() => parseDateLocalIfDateOnly(CURRENT_MOTION.createdAt), []);
  const motionDeadline = useMemo(
    () => new Date(motionOpenAt.getTime() + VOTING_WINDOW_DAYS * 24 * 60 * 60 * 1000),
    [motionOpenAt]
  );
  // Motions must be opened no later than 3 days before season start, unless expedited
  const LATEST_MOTION_OPEN = useMemo(
    () => new Date(seasonStart.getTime() - 3 * 24 * 60 * 60 * 1000),
    []
  );
  const motionOpenAllowed = useMemo(
    () => CURRENT_MOTION.expedited === true || parseDateLocalIfDateOnly(CURRENT_MOTION.createdAt) <= LATEST_MOTION_OPEN,
    [LATEST_MOTION_OPEN]
  );
  const windowOpen = motionOpenAllowed && now >= motionOpenAt && now < motionDeadline;
  const remainingStr = useMemo(() => {
    const ms = motionDeadline.getTime() - now.getTime();
    if (ms <= 0) return '';
    const s = Math.floor(ms / 1000) % 60;
    const m = Math.floor(ms / (1000 * 60)) % 60;
    const h = Math.floor(ms / (1000 * 60 * 60)) % 24;
    const d = Math.floor(ms / (1000 * 60 * 60 * 24));
    const parts = [];
    if (d) parts.push(`${d}d`);
    if (d || h) parts.push(`${h}h`);
    parts.push(`${m}m`);
    parts.push(`${s}s`);
    return parts.join(' ');
  }, [motionDeadline, now]);

  // League members for the datalist
  const [leagueMembers, setLeagueMembers] = useState([]);
  useEffect(() => {
    setLeagueMembers(members);
  }, []);
  useEffect(() => {
    if (!leagueMembers.length) return;
    if (!leagueMembers.includes(voterName)) {
      setVoterName('');
    }
  }, [leagueMembers]);

  // Persisted identity
  const [voterName, setVoterName] = useState(
    localStorage.getItem('fantasy:voterName') || ''
  );
  useEffect(() => {
    if (voterName) localStorage.setItem('fantasy:voterName', voterName);
  }, [voterName]);

  // Votes (archive)
  const [allVotes, setAllVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchVotes = () => {
    setError('');
    axios
      .get(VOTES_API)
      .then((res) => {
        setAllVotes(Array.isArray(res.data) ? res.data : []);
        setLastUpdated(new Date());
      })
      .catch(() => setError('Could not load votes.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchVotes();
    const interval = setInterval(fetchVotes, 10000); // live refresh every 10s
    return () => clearInterval(interval);
  }, []);

  // Derived
  const motionVotes = useMemo(
    () => allVotes.filter((v) => v.motionId === CURRENT_MOTION.id),
    [allVotes]
  );

  const currentBucket = getSeasonBucket(now);
  const currentSeasonVotes = useMemo(
    () => motionVotes.filter((v) => `${v.seasonBucket}` === `${currentBucket}`),
    [motionVotes, currentBucket]
  );
  const nextSeasonVotes = useMemo(
    () => motionVotes.filter((v) => `${v.seasonBucket}` !== `${currentBucket}`),
    [motionVotes, currentBucket]
  );

  const hasVotedThisMotion = useMemo(() => {
    if (!voterName) return false;
    return motionVotes.some(
      (v) => normalize(v.voter) === normalize(voterName)
    );
  }, [motionVotes, voterName]);

  const myVoteRecord = useMemo(() => {
    if (!voterName) return null;
    return motionVotes.find((v) => normalize(v.voter) === normalize(voterName));
  }, [motionVotes, voterName]);

  const aggregate = (list) => {
    const total = list.length || 0;
    const yes = list.filter((v) => (v.choice || '').toLowerCase() === 'yes').length;
    const no = list.filter((v) => (v.choice || '').toLowerCase() === 'no').length;
    const abstain = list.filter((v) => (v.choice || '').toLowerCase() === 'abstain').length;
    return { total, yes, no, abstain };
  };

  const aCurrent = aggregate(currentSeasonVotes);
  const aNext = aggregate(nextSeasonVotes);


  // Archive: group by motion + season, show totals (not individual votes)
  const groupedResults = useMemo(() => {
    const map = new Map();
    for (const v of allVotes) {
      const key = `${v.motionId}__${v.seasonBucket}`;
      const existing = map.get(key) || {
        motionId: v.motionId,
        motionTitle: v.motionTitle || v.motionId,
        seasonBucket: v.seasonBucket,
        yes: 0,
        no: 0,
        abstain: 0,
        total: 0,
        lastTimestamp: null,
        openAt: null, // track when the motion was proposed/opened
      };

      // Tally choices
      const choice = (v.choice || '').toLowerCase();
      if (choice === 'yes') existing.yes += 1;
      else if (choice === 'no') existing.no += 1;
      else existing.abstain += 1;
      existing.total += 1;

      // Track last activity
      const ts = new Date(v.timestamp);
      if (!existing.lastTimestamp || ts > existing.lastTimestamp) existing.lastTimestamp = ts;

      // Track motion open date (prefer sheet column `dateProposed`, fallback to CURRENT_MOTION or first timestamp)
      const rawOpen = v.dateProposed || (v.motionId === CURRENT_MOTION.id ? CURRENT_MOTION.createdAt : null) || v.timestamp;
      const openAt = parseDateLocalIfDateOnly(rawOpen);
      if (!existing.openAt || openAt < existing.openAt) existing.openAt = openAt;

      map.set(key, existing);
    }
    const arr = Array.from(map.values());
    arr.forEach((r) => {
      // Determine deadline from the motion's openAt
      const openAt = r.openAt ? new Date(r.openAt) : null;
      const windowMs = 3 * 24 * 60 * 60 * 1000; // 3 days
      const deadline = openAt ? new Date(openAt.getTime() + windowMs) : null;
      r.deadline = deadline;

      const closed = deadline ? (new Date() >= deadline) : false;

      if (r.yes > r.no) r.outcome = closed ? 'Passed' : 'Projected to Pass';
      else if (r.no > r.yes) r.outcome = closed ? 'Failed' : 'Projected to Fail';
      else r.outcome = closed ? 'Tie' : 'Too Close to Call';
    });
    arr.sort((a, b) => (b.lastTimestamp?.getTime() || 0) - (a.lastTimestamp?.getTime() || 0));
    return arr;
  }, [allVotes, now]);

  const [pendingChoice, setPendingChoice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  // PIN state
  const [pinRecord, setPinRecord] = useState(null);
  const [pinMode, setPinMode] = useState('verify'); // 'verify' | 'set' | 'change'
  const [pinInput, setPinInput] = useState('');
  const [newPin, setNewPin] = useState('');
  const [newPinConfirm, setNewPinConfirm] = useState('');
  const [pinError, setPinError] = useState('');

  // Fetch PIN record for selected voter
  useEffect(() => {
    setPinError('');
    setPinInput('');
    setNewPin('');
    setNewPinConfirm('');
    if (!voterName) {
      setPinRecord(null);
      setPinMode('verify');
      return;
    }
    axios
      .get(getPinsUrl('/search'), { params: { voter: voterName } })
      .then((res) => {
        const rec = Array.isArray(res.data) && res.data[0] ? res.data[0] : null;
        setPinRecord(rec);
        setPinMode(rec ? 'verify' : 'set');
      })
      .catch(() => {
        setPinRecord(null);
        setPinMode('set');
      });
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
    // remove any existing row(s) for this voter, then create one
    try { await axios.delete(getPinsUrl('/search'), { params: { voter } }); } catch (_) {}
    await axios.post(getPinsUrl(''), { voter, salt, pinHash, updatedAt: new Date().toISOString() });
    setPinRecord({ voter, salt, pinHash });
    setPinMode('verify');
  };

  const changePin = async (currentPin, newPinValue) => {
    const ok = await verifyPinAgainstRecord(currentPin, pinRecord);
    if (!ok) throw new Error('Current PIN is incorrect.');
    await createOrUpdatePin(voterName, newPinValue);
  };

  const submitVote = async (e) => {
    e.preventDefault();
    if (!voterName || !pendingChoice) return;
    if (hasVotedThisMotion) return;
    if (!isOffseason) return; // hard lock in-season

    const payload = {
      motionId: CURRENT_MOTION.id,
      motionTitle: CURRENT_MOTION.title,
      voter: voterName,
      choice: pendingChoice, // 'Yes' | 'No' | 'Abstain'
      seasonBucket: getSeasonBucket(new Date()),
      timestamp: new Date().toISOString(),
      // Also store these simple metadata fields on each row
      propesedBy: CURRENT_MOTION.proposedBy,
      dateProposed: CURRENT_MOTION.createdAt,
    };

    try {
      setIsSubmitting(true);
      // PIN enforcement
      setPinError('');
      if (pinRecord) {
        if (pinInput.length < 4) { setPinError('Enter your PIN'); return; }
        const ok = await verifyPinAgainstRecord(pinInput, pinRecord);
        if (!ok) { setPinError('Incorrect PIN'); return; }
      } else {
        if (newPin.length < 4 || newPin !== newPinConfirm) {
          setPinError('Create a PIN (min 4 characters) and confirm it.');
          return;
        }
        await createOrUpdatePin(voterName, newPin);
      }

      await axios.post(VOTES_API, payload);
      setAllVotes((prev) => [...prev, payload]);
      setPendingChoice('');
    } catch {
      setError('Could not submit your vote. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeMyVote = async (e) => {
    e.preventDefault();
    if (!myVoteRecord) return;
    try {
      setIsSubmitting(true);
      // PIN enforcement for removal
      setPinError('');
      if (!pinRecord) { setPinError('Set your PIN first to remove your vote.'); return; }
      if (pinInput.length < 4) { setPinError('Enter your PIN'); return; }
      const ok = await verifyPinAgainstRecord(pinInput, pinRecord);
      if (!ok) { setPinError('Incorrect PIN'); return; }

      await axios.delete(`${VOTES_API.replace(/\/$/, '')}/search`, {
        params: {
          motionId: CURRENT_MOTION.id,
          voter: voterName,
        },
      });
      // Optimistically update UI
      const updated = allVotes.filter(
        (v) =>
          !(
            v.motionId === CURRENT_MOTION.id &&
            normalize(v.voter) === normalize(voterName)
          )
      );
      setAllVotes(updated);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Nike Gameday style progress bar
  const Bar = ({ label, value, total }) => {
    const pct = total > 0 ? Math.round((value / total) * 100) : 0;
    return (
      <div className="mb-3">
        <div className="flex justify-between text-xs uppercase tracking-wide text-gray-300">
          <span>{label}</span>
          <span>
            {value} • {pct}%
          </span>
        </div>
        <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden border border-lime-400/40">
          <div className="h-full bg-lime-400" style={{ width: `${pct}%` }} />
        </div>
      </div>
    );
  };

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <NavBar />

      <section className="px-6 py-16 md:py-20 max-w-7xl mx-auto bg-gradient-to-br from-black via-gray-900 to-black rounded-2xl shadow-2xl border border-lime-500">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-5xl md:text-6xl font-extrabold uppercase tracking-wider mb-4 text-white drop-shadow-[0_0_20px_rgba(0,255,0,0.35)]">
            League Votes
          </h1>

          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold uppercase tracking-wide ${
              isOffseason
                ? 'bg-lime-500/10 border-lime-400 text-lime-300'
                : 'bg-red-500/10 border-red-400 text-red-300'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-current inline-block" />
            {!isOffseason
              ? 'In-Season: Voting LOCKED (resumes offseason)'
              : !motionOpenAllowed
                ? 'Offseason: Motion Not Allowed (opened too close to kickoff)'
                : `Offseason • Ends ${new Date(SEASON_START_ISO).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}`}
          </div>
          <div className="text-xs text-gray-400 mt-2">
            Season start: {new Date(SEASON_START_ISO).toLocaleString()}
          </div>
        </div>

        {/* Current Motion */}
        <div className="grid md:grid-cols-2 gap-10">
          <div className="bg-black/50 rounded-xl border border-lime-400/40 p-6 md:p-8 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-wide text-lime-300">
                {CURRENT_MOTION.title}
              </h2>
              <span className="text-xs text-gray-400">
                Opened {fmtDate(motionOpenAt)} • Proposed by {CURRENT_MOTION.proposedBy}
              </span>
            </div>
            <p className="text-gray-200 mb-6 leading-relaxed">
              {CURRENT_MOTION.question}
            </p>

            {/* Motion-specific status banner */}
            <div className="mb-6">
              {!motionOpenAllowed ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold uppercase tracking-wide bg-amber-500/10 border-amber-400 text-amber-300">
                  <span className="w-2 h-2 rounded-full bg-current inline-block" />
                  Not Allowed: Opened too close to kickoff (needs expedited)
                </div>
              ) : windowOpen ? (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold uppercase tracking-wide bg-lime-500/10 border-lime-400 text-lime-300">
                  <span className="w-2 h-2 rounded-full bg-current inline-block" />
                  Voting OPEN • Closes in {remainingStr}
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold uppercase tracking-wide bg-gray-500/10 border-gray-400 text-gray-300">
                  <span className="w-2 h-2 rounded-full bg-current inline-block" />
                  Voting CLOSED • Closed {fmtDate(motionDeadline)}
                </div>
              )}
            </div>

            <form onSubmit={submitVote} className="space-y-4">
              <div>
                <label className="block text-xs uppercase text-gray-400 mb-1">
                  Your Name
                </label>
                <select
                  value={voterName}
                  onChange={(e) => setVoterName(e.target.value)}
                  className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-lime-400"
                  required
                >
                  <option value="" disabled>-- Select your name --</option>
                  {leagueMembers.map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
                <p className="text-[11px] text-gray-500 mt-1">
                  One person, one vote per motion. Use your league name.
                </p>
              </div>

              <div>
                <label className="block text-xs uppercase text-gray-400 mb-2">
                  Your Vote
                </label>
                <div className="flex flex-wrap gap-3">
                  {['Yes', 'No', 'Abstain'].map((opt) => (
                    <label
                      key={opt}
                      className={`cursor-pointer px-4 py-2 rounded-full border text-sm font-semibold tracking-wide ${
                        pendingChoice === opt
                          ? 'bg-lime-400 text-black border-lime-400'
                          : 'bg-gray-900 text-white border-gray-700 hover:border-lime-400/50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="vote"
                        value={opt}
                        className="hidden"
                        onChange={() => setPendingChoice(opt)}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              {/* PIN Security */}
              <div className="mt-2">
                <label className="block text-xs uppercase text-gray-400 mb-2">Security PIN</label>

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
                    <button
                      type="button"
                      className="text-xs text-lime-300 underline"
                      onClick={() => { setPinMode('change'); setPinError(''); setPinInput(''); }}
                    >
                      Change PIN
                    </button>
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
                              await changePin(pinInput, newPin);
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
                      <button
                        type="button"
                        className="text-xs ml-3 underline text-gray-400"
                        onClick={() => { setPinMode('verify'); setPinError(''); setPinInput(''); setNewPin(''); setNewPinConfirm(''); }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {pinError && <div className="text-red-400 text-xs mt-2">{pinError}</div>}
                {pinMode === 'set' && !pinError && <div className="text-gray-400 text-xs mt-2">You’ll set your PIN on first vote.</div>}
              </div>

              {myVoteRecord && (
                <div className="text-xs text-gray-400">
                  You previously voted{' '}
                  <span className="text-lime-300 font-semibold">
                    {myVoteRecord.choice}
                  </span>{' '}
                  on {fmt(myVoteRecord.timestamp)} (for season{' '}
                  {myVoteRecord.seasonBucket}).
                </div>
              )}

              <button
                type="submit"
                disabled={
                  !voterName ||
                  !pendingChoice ||
                  isSubmitting ||
                  hasVotedThisMotion ||
                  !isOffseason ||
                  !motionOpenAllowed ||
                  !windowOpen
                }
                className={`w-full uppercase font-extrabold tracking-wider px-6 py-3 rounded-lg shadow-lg transition-all border-2 ${
                  !voterName ||
                  !pendingChoice ||
                  isSubmitting ||
                  hasVotedThisMotion ||
                  !isOffseason ||
                  !motionOpenAllowed ||
                  !windowOpen
                    ? 'bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed'
                    : 'bg-black text-lime-300 border-lime-400 hover:bg-lime-400 hover:text-black'
                }`}
              >
                {!isOffseason
                  ? 'Voting Locked (In-Season)'
                  : !motionOpenAllowed
                  ? 'Not Allowed (Too Close to Kickoff)'
                  : !windowOpen
                  ? 'Voting Closed'
                  : hasVotedThisMotion
                  ? 'Already Voted for This Motion'
                  : 'Submit Vote'}
              </button>

              {myVoteRecord && (
                <button
                  type="button"
                  onClick={removeMyVote}
                  disabled={isSubmitting || !windowOpen || !isOffseason || !motionOpenAllowed}
                  className={`w-full mt-2 uppercase font-extrabold tracking-wider px-6 py-3 rounded-lg shadow-lg transition-all border-2 ${
                    isSubmitting || !windowOpen || !isOffseason || !motionOpenAllowed
                      ? 'bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed'
                      : 'bg-black text-red-300 border-red-400 hover:bg-red-400 hover:text-black'
                  }`}
                >
                  Remove My Vote
                </button>
              )}

              {!isOffseason && (
                <p className="text-[11px] text-gray-500">
                  Voting is locked during the season. Proposed changes are decided in the
                  offseason and, if passed, apply next season.
                </p>
              )}
              {isOffseason && !motionOpenAllowed && (
                <p className="text-[11px] text-gray-500">
                  This motion was opened within the final 3 days before kickoff (cutoff {fmtDate(LATEST_MOTION_OPEN)}).
                  Voting requires an expedited override by the commissioner.
                </p>
              )}
              {isOffseason && !windowOpen && motionOpenAllowed && (
                <p className="text-[11px] text-gray-500">
                  Voting window closed. Results were locked on {fmtDate(motionDeadline)}.
                </p>
              )}

              {error && <div className="text-red-400 text-sm">{error}</div>}
            </form>
          </div>

          {/* Live Tally */}
          <div className="bg-black/50 rounded-xl border border-lime-400/40 p-6 md:p-8 shadow-xl">
            <h3 className="text-xl md:text-2xl font-black uppercase tracking-wide mb-2">
              Live Tally
            </h3>
            <div className="text-xs text-gray-400 mb-4">
              Auto-refreshes every 10s{lastUpdated ? ` • Updated ${fmt(lastUpdated)}` : ''}
            </div>

            <div className="mb-6">
              <div className="text-sm uppercase text-gray-300 mb-2">
                This Season ({currentBucket})
              </div>
              <Bar label="Yes" value={aCurrent.yes} total={aCurrent.total} />
              <Bar label="No" value={aCurrent.no} total={aCurrent.total} />
              <Bar label="Abstain" value={aCurrent.abstain} total={aCurrent.total} />
              <div className="text-xs text-gray-400 mt-1">
                Total votes: {aCurrent.total}
              </div>
            </div>

            {!isOffseason && (
              <div>
                <div className="text-sm uppercase text-gray-300 mb-2">
                  Queued for Next Season
                </div>
                <Bar label="Yes" value={aNext.yes} total={aNext.total} />
                <Bar label="No" value={aNext.no} total={aNext.total} />
                <Bar label="Abstain" value={aNext.abstain} total={aNext.total} />
                <div className="text-xs text-gray-400 mt-1">
                  Total votes: {aNext.total}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Archive */}
        <div className="mt-14">
          <h3 className="text-2xl md:text-3xl font-black uppercase tracking-wide mb-4 text-white">
            Vote Results Archive
          </h3>
          <p className="text-sm text-gray-400 mb-6">
            Season-by-season results per motion (totals only). Abstains are shown but not counted toward pass/fail (simple majority).
          </p>

          {loading ? (
            <div className="text-gray-400">Loading…</div>
          ) : groupedResults.length === 0 ? (
            <div className="text-gray-400">No votes yet.</div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-lime-400/30 bg-black/40">
              <table className="min-w-[900px] w-full text-left font-mono">
                <thead>
                  <tr className="bg-lime-400/80 text-black uppercase text-xs">
                    <th className="px-3 py-2">Season</th>
                    <th className="px-3 py-2">Motion</th>
                    <th className="px-3 py-2">Yes</th>
                    <th className="px-3 py-2">No</th>
                    <th className="px-3 py-2">Abstain</th>
                    <th className="px-3 py-2">Total</th>
                    <th className="px-3 py-2">Outcome</th>
                    <th className="px-3 py-2">Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedResults.map((r) => (
                    <tr
                      key={`${r.motionId}-${r.seasonBucket}`}
                      className="even:bg-gray-800/40 hover:bg-lime-300/10 transition-colors"
                    >
                      <td className="px-3 py-2">{r.seasonBucket}</td>
                      <td className="px-3 py-2">{r.motionTitle}</td>
                      <td className="px-3 py-2 text-lime-300">{r.yes}</td>
                      <td className="px-3 py-2 text-red-400">{r.no}</td>
                      <td className="px-3 py-2 text-gray-300">{r.abstain}</td>
                      <td className="px-3 py-2">{r.total}</td>
                      <td className={`px-3 py-2 ${r.outcome === 'Passes' ? 'text-lime-300' : r.outcome === 'Fails' ? 'text-red-400' : 'text-yellow-300'}`}>{r.outcome}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-gray-200">{r.lastTimestamp ? fmt(r.lastTimestamp) : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}