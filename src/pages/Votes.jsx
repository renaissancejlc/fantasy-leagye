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

// League members (one person, one vote)
const members = [
  'Reny- Test', // test user
  'Dad',
  'Dustin',
  'Callie',
  'Kevin',
  'Simon',
  'River',
  'Christian',
  'Utsav',
  'Tariq',
  'Daisy',
  'Raphy',
  'Cisco'
];

const USE_REMOTE = Boolean(VOTES_API && !VOTES_API.includes('xxxxxxxx'));
const LOCAL_KEY = 'fantasy:votes-archive';

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
  proposedBy: 'Commissioner',
};

export default function Votes() {
  // Offseason vs In-season
  const [now, setNow] = useState(new Date());
  const isOffseason = now < seasonStart;
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // 3-day voting window from motion creation
  const VOTING_WINDOW_DAYS = 3;
  const motionOpenAt = useMemo(() => new Date(CURRENT_MOTION.createdAt), []);
  const motionDeadline = useMemo(
    () => new Date(new Date(CURRENT_MOTION.createdAt).getTime() + VOTING_WINDOW_DAYS * 24 * 60 * 60 * 1000),
    []
  );
  const windowOpen = now >= motionOpenAt && now < motionDeadline;
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
    if (USE_REMOTE) {
      axios
        .get(VOTES_API)
        .then((res) => {
          setAllVotes(Array.isArray(res.data) ? res.data : []);
          setLastUpdated(new Date());
        })
        .catch(() => setError('Could not load votes.'))
        .finally(() => setLoading(false));
    } else {
      try {
        const stored = JSON.parse(localStorage.getItem(LOCAL_KEY) || '[]');
        setAllVotes(Array.isArray(stored) ? stored : []);
        setLastUpdated(new Date());
      } catch {
        setAllVotes([]);
      } finally {
        setLoading(false);
      }
    }
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

  const hasVotedThisBucket = useMemo(() => {
    if (!voterName) return false;
    return currentSeasonVotes.some(
      (v) => normalize(v.voter) === normalize(voterName)
    );
  }, [currentSeasonVotes, voterName]);

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
      };
      const choice = (v.choice || '').toLowerCase();
      if (choice === 'yes') existing.yes += 1;
      else if (choice === 'no') existing.no += 1;
      else existing.abstain += 1;
      existing.total += 1;
      const ts = new Date(v.timestamp);
      if (!existing.lastTimestamp || (ts > existing.lastTimestamp)) existing.lastTimestamp = ts;
      map.set(key, existing);
    }
    const arr = Array.from(map.values());
    arr.forEach((r) => {
      if (r.yes > r.no) r.outcome = 'Passes';
      else if (r.no > r.yes) r.outcome = 'Fails';
      else r.outcome = 'Tie';
    });
    arr.sort((a, b) => (b.lastTimestamp?.getTime() || 0) - (a.lastTimestamp?.getTime() || 0));
    return arr;
  }, [allVotes]);

  const [pendingChoice, setPendingChoice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitVote = async (e) => {
    e.preventDefault();
    if (!voterName || !pendingChoice) return;
    if (hasVotedThisBucket) return;
    if (!isOffseason) return; // hard lock in-season

    const payload = {
      motionId: CURRENT_MOTION.id,
      motionTitle: CURRENT_MOTION.title,
      voter: voterName,
      choice: pendingChoice, // 'Yes' | 'No' | 'Abstain'
      seasonBucket: getSeasonBucket(new Date()),
      timestamp: new Date().toISOString(),
    };

    try {
      setIsSubmitting(true);
      if (USE_REMOTE) {
        await axios.post(VOTES_API, payload);
        setAllVotes((prev) => [...prev, payload]);
      } else {
        const updated = [...allVotes, payload];
        localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
        setAllVotes(updated);
      }
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
      if (USE_REMOTE) {
        // Delete matching row(s) from remote sheet (SheetBest search delete)
        await axios.delete(`${VOTES_API.replace(/\/$/, '')}/search`, {
          params: {
            motionId: CURRENT_MOTION.id,
            voter: voterName,
            seasonBucket: currentBucket,
          },
        });
        // Optimistically update UI
        const updated = allVotes.filter(
          (v) =>
            !(
              v.motionId === CURRENT_MOTION.id &&
              normalize(v.voter) === normalize(voterName) &&
              `${v.seasonBucket}` === `${currentBucket}`
            )
        );
        setAllVotes(updated);
      } else {
        // Remove only this motion + this season + this voter (local mode)
        const updated = allVotes.filter((v) => !(
          v.motionId === CURRENT_MOTION.id &&
          normalize(v.voter) === normalize(voterName) &&
          `${v.seasonBucket}` === `${currentBucket}`
        ));
        localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
        setAllVotes(updated);
      }
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
              : windowOpen
                ? `Offseason: Voting OPEN • Closes in ${remainingStr}`
                : `Offseason: Voting CLOSED • Closed ${fmt(motionDeadline)}`}
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
                Opened {fmt(CURRENT_MOTION.createdAt)}
              </span>
            </div>
            <p className="text-gray-200 mb-6 leading-relaxed">
              {CURRENT_MOTION.question}
            </p>

            <form onSubmit={submitVote} className="space-y-4">
              <div>
                <label className="block text-xs uppercase text-gray-400 mb-1">
                  Your Name
                </label>
                <input
                  list="league-members"
                  value={voterName}
                  onChange={(e) => setVoterName(e.target.value)}
                  placeholder="Select or type your league name"
                  className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-lime-400"
                  required
                />
                <datalist id="league-members">
                  {leagueMembers.map((n) => (
                    <option key={n} value={n} />
                  ))}
                </datalist>
                <p className="text-[11px] text-gray-500 mt-1">
                  One person, one vote. Use your league name as it appears on the draft sheet.
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
                  hasVotedThisBucket ||
                  !isOffseason ||
                  !windowOpen
                }
                className={`w-full uppercase font-extrabold tracking-wider px-6 py-3 rounded-lg shadow-lg transition-all border-2 ${
                  !voterName ||
                  !pendingChoice ||
                  isSubmitting ||
                  hasVotedThisBucket ||
                  !isOffseason ||
                  !windowOpen
                    ? 'bg-gray-800 text-gray-500 border-gray-700 cursor-not-allowed'
                    : 'bg-black text-lime-300 border-lime-400 hover:bg-lime-400 hover:text-black'
                }`}
              >
                {!isOffseason
                  ? 'Voting Locked (In-Season)'
                  : !windowOpen
                  ? 'Voting Closed'
                  : hasVotedThisBucket
                  ? 'Already Voted for This Season'
                  : 'Submit Vote'}
              </button>

              {myVoteRecord && `${myVoteRecord.seasonBucket}` === `${currentBucket}` && (
                <button
                  type="button"
                  onClick={removeMyVote}
                  disabled={isSubmitting || !windowOpen || !isOffseason}
                  className={`w-full mt-2 uppercase font-extrabold tracking-wider px-6 py-3 rounded-lg shadow-lg transition-all border-2 ${
                    isSubmitting || !windowOpen || !isOffseason
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
              {isOffseason && !windowOpen && (
                <p className="text-[11px] text-gray-500">
                  Voting window closed. Results were locked on {fmt(motionDeadline)}.
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