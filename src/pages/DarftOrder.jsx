import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const DRAFT_DATE = new Date('2025-07-14T17:00:00-07:00');

const players = [
  { name: 'Dad', guess: { player: 'Matt Olson', homeruns: 52 } },
  { name: 'Dustin', guess: { player: 'James Wood', homeruns: 49 } },
  { name: 'Callie', guess: { player: 'Cal Raleigh', homeruns: 52 } },
  { name: 'Kevin', guess: { player: 'Junior Caminero', homeruns: 50 } },
  { name: 'Simon', guess: { player: 'Matt Olson', homeruns: 50 } },
  { name: 'Simon', guess: { player: 'Matt Olson', homeruns: 50 } },
  { name: 'River', guess: { player: 'Cal Raleigh', homeruns: 55 } },
  { name: 'Christian', guess: { player: 'Oneil Cruz', homeruns: 57 } },
  { name: 'Utsav Roommate', guess: { player: 'Cal Raleigh', homeruns: 39 } },
  { name: 'Tariq', guess: { player: 'Oneil Cruz', homeruns: 55 } },
  { name: 'Daisy', guess: { player: 'Oneil Cruz', homeruns: 50 } },
  { name: 'Raphy', guess: { player: 'James Wood', homeruns: 56 } }
];

function getTimeRemaining() {
  const now = new Date();
  const total = DRAFT_DATE - now;
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  return { total, days, hours, minutes, seconds };
}

const DERBY_WINNER = { player: 'Vladimir Guerrero Jr.', homeruns: 51 };

function calculateDraftOrder(players, winner) {
  const correctGuesses = players.filter(p => p.guess.player === winner.player);
  const incorrectGuesses = players.filter(p => p.guess.player !== winner.player);

  const sortedCorrect = correctGuesses
    .map(p => ({
      ...p,
      diff: Math.abs(p.guess.homeruns - winner.homeruns)
    }))
    .sort((a, b) => a.diff - b.diff);

  const sortedIncorrect = incorrectGuesses
    .map(p => ({
      ...p,
      diff: Math.abs(p.guess.homeruns - winner.homeruns)
    }))
    .sort((a, b) => a.diff - b.diff);

  return [...sortedCorrect, ...sortedIncorrect].map(p => p.name);
}

const finalDraftOrder = calculateDraftOrder(players, DERBY_WINNER);

export default function DarftOrder() {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeRemaining());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <NavBar />

      <section className="px-6 py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-wide mb-6 text-lime-400">
          Draft Order: Home Run Derby Edition
        </h1>
      

        <div className="mt-10 mb-16">
          <h2 className="text-2xl uppercase font-semibold text-white mb-4">Derby Countdown</h2>
          {timeLeft.total > 0 ? (
            <div className="text-4xl md:text-5xl font-mono text-lime-400 tracking-wider">
              {`${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`}
            </div>
          ) : (
            <div className="text-4xl font-bold text-red-500">The Derby Has Begun!</div>
          )}
        </div>

        {/* Home Run Derby Info and MLB Link */}
        <div className="max-w-3xl mx-auto mt-12 text-center">
          <img
            src="./images/mlblogo.svg"
            alt="MLB Logo"
            className="w-32 mx-auto mb-4"
          />
          <a
            href="https://www.mlb.com/all-star/home-run-derby"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-white text-black font-semibold uppercase px-6 py-2 rounded hover:bg-lime-300 transition"
          >
            Visit MLB Derby Page &rarr;
          </a>
        </div>

        <div className="max-w-3xl mx-auto bg-gray-950 border border-lime-400 rounded-xl shadow-2xl p-6 mt-12">
          <h2 className="text-2xl font-bold text-white mb-4 mt-12 tracking-wide uppercase">Player Pickings</h2>
          <table className="w-full table-fixed border-2 border-lime-500 divide-y divide-gray-700 bg-gray-950 text-sm">
            <thead className="bg-gray-900 text-gray-300 border-b border-lime-500 text-xs font-bold uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3 text-left w-1/3 font-bold font-condensed border-r border-lime-500">League Member</th>
                <th className="px-4 py-3 text-left w-1/3 font-bold font-condensed border-r border-lime-500">Chosen Slugger</th>
                <th className="px-4 py-3 text-right w-1/3 font-bold font-condensed">HR</th>
              </tr>
            </thead>
            <tbody className="text-gray-100 divide-y divide-gray-700">
              {players.map((p, idx) => (
                <tr key={idx} className="odd:bg-gray-950 even:bg-gray-900 hover:bg-gray-800 transition">
                  <td className="px-4 py-3 font-bold text-white border-r border-gray-700">{p.name}</td>
                  <td className="px-4 py-3 text-lime-400 border-r border-gray-700">{p.guess?.player || '—'}</td>
                  <td className="px-4 py-3 text-right text-lime-300 font-mono">{typeof p.guess?.homeruns === 'number' ? p.guess.homeruns : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-gray-500 mt-4 border-t border-gray-700 pt-2 italic">
            Inactive sluggers uncorrected before deadline will default to: Matt Olson → James Wood → Byron Buxton. If all are inactive, ranking defaults to last.
          </p>
           <p className="text-lg text-gray-400 mb-4 max-w-2xl mx-auto">
          The 2025 draft order will be determined by the <strong>Home Run Derby Challenge</strong>. Each league member predicts:
          <ul className="list-disc list-inside mt-2 mb-4 text-left">
            <li>Which batter will win the 2025 MLB Home Run Derby</li>
            <li>How many home runs that batter will hit</li>
          </ul>
          Final standings from the challenge determine the order in which players choose their position in the 2025 snake draft. The first-place finisher chooses their draft slot first, second chooses next, and so on.
          <br /><br />
          <strong>Ranking is determined as follows:</strong><br />
          1. First priority goes to any player who correctly guesses the winning batter <em>and</em> is closest to their actual home run count.<br />
          2. Remaining correct batter guesses are ranked by proximity to the actual home run total.<br />
          3. Players who did not guess the correct batter are then ranked by how close their guess was to the winning batter’s actual total.<br />
          Ties are resolved by a coin toss.
        </p>
        </div>
      {/* Derby Results: High-Energy Sports Presentation */}
      <section className="bg-black text-white py-16 px-4 md:px-12 rounded-lg shadow-2xl border-l-8 border-lime-500 mt-16 mb-10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-wide text-lime-400 mb-6 drop-shadow-lg">🏆 2025 Home Run Derby Champion</h2>
          <p className="text-xl md:text-2xl font-medium text-gray-300 mb-2 tracking-wide">Cal Raleigh <span className="text-lime-300 font-bold">(Seattle Mariners)</span></p>
          <p className="text-lg md:text-xl text-gray-400 mb-6 italic">Defeated Junior Caminero <span className="text-lime-300">18–15</span> in the Finals</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mt-10">
            <div className="bg-zinc-900 rounded-lg py-6 px-4 shadow-inner border-2 border-lime-500">
              <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">Total Home Runs</h3>
              <p className="text-4xl md:text-5xl font-mono text-lime-300 font-extrabold drop-shadow">54</p>
            </div>
            <div className="bg-zinc-900 rounded-lg py-6 px-4 shadow-inner border-2 border-lime-500">
              <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">Semifinals</h3>
              <p className="text-sm text-gray-400 mb-1">Defeated Oneil Cruz</p>
              <p className="text-4xl md:text-5xl font-mono text-lime-300 font-extrabold drop-shadow">19–13</p>
            </div>
            <div className="bg-zinc-900 rounded-lg py-6 px-4 shadow-inner border-2 border-lime-500">
              <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-tight">Finals</h3>
              <p className="text-4xl md:text-5xl font-mono text-lime-300 font-extrabold drop-shadow">18–15</p>
            </div>
          </div>
          <div className="mt-10 flex flex-col md:flex-row md:justify-between items-center gap-4">
            <ul className="text-gray-200 text-lg md:text-xl list-disc list-inside text-left md:ml-8">
              <li><span className="font-bold text-white">1st Round:</span> <span className="text-lime-200">17</span> homers</li>
              <li><span className="font-bold text-white">Semifinals:</span> <span className="text-lime-200">19</span> homers</li>
              <li><span className="font-bold text-white">Finals:</span> <span className="text-lime-200">18</span> homers</li>
            </ul>
            <div className="hidden md:block w-2 h-24 bg-lime-500 rounded-full mx-4" aria-hidden="true"></div>
            <div className="text-gray-400 text-base md:text-lg italic mt-4 md:mt-0 text-center md:text-right max-w-md">
              These results lock in the draft order standings.<br />
              <span className="text-lime-400 font-semibold">Congratulations to those who nailed the prediction!</span>
            </div>
          </div>
        </div>
      </section>
        <div className="max-w-3xl mx-auto bg-gray-950 border border-lime-500 rounded-xl shadow-lg p-6 mt-10">
  <h2 className="text-2xl font-bold text-lime-400 mb-4 uppercase tracking-wide">Final Draft Order</h2>
  {/* League Player Ranking List with standout styling */}
  <ol className="text-white space-y-3 text-lg text-left">
    <li>
      <span className="text-lime-300 font-bold">1.</span>
      <span className="font-bold text-lime-400 text-lg ml-1">River</span>
      {/* Crown icon for #1 */}
      <svg xmlns="http://www.w3.org/2000/svg" className="inline w-5 h-5 ml-2 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 17l2-5 2 5 2-10 2 10 2-5 2 5" />
      </svg>
      {' — Guessed '}<strong>Cal Raleigh</strong>, 55 HRs (
        <svg xmlns="http://www.w3.org/2000/svg" className="inline h-4 w-4 text-green-400 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Winner, off by 1)
    </li>
    <li>
      <span className="text-lime-300 font-bold">2.</span>
      <span className="font-bold text-lime-400 text-lg ml-1">Callie</span>
      {' — Guessed '}<strong>Cal Raleigh</strong>, 52 HRs (
        <svg xmlns="http://www.w3.org/2000/svg" className="inline h-4 w-4 text-green-400 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Winner, off by 2)
    </li>
    <li>
      <span className="text-lime-300 font-bold">3.</span>
      <span className="font-bold text-lime-400 text-lg ml-1">Utsav Roommate</span>
      {' — Guessed '}<strong>Cal Raleigh</strong>, 39 HRs (
        <svg xmlns="http://www.w3.org/2000/svg" className="inline h-4 w-4 text-green-400 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        Winner, off by 15)
    </li>
    <li>
      <span className="text-lime-300 font-bold">4.</span>
      <span className="font-bold text-yellow-400 text-lg ml-1">Tariq</span>
      {' — Guessed '}<strong>Oneil Cruz</strong>, 55 HRs (
        <svg xmlns="http://www.w3.org/2000/svg" className="inline h-4 w-4 text-red-400 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        Wrong player, off by 1)
    </li>
    <li>
      <span className="text-lime-300 font-bold">5.</span>
      <span className="font-bold text-yellow-400 text-lg ml-1">Dad</span>
      {' — Guessed '}<strong>Matt Olson</strong>, 52 HRs (
        <svg xmlns="http://www.w3.org/2000/svg" className="inline h-4 w-4 text-red-400 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        Wrong player, off by 2) — TIE, coin toss winner
    </li>
    <li>
      <span className="text-lime-300 font-bold">6.</span>
      <span className="font-bold text-yellow-400 text-lg ml-1">Raphy</span>
      {' — Guessed '}<strong>James Wood</strong>, 56 HRs (
        <svg xmlns="http://www.w3.org/2000/svg" className="inline h-4 w-4 text-red-400 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        Wrong player, off by 2) — TIE
    </li>
    <li>
      <span className="text-lime-300 font-bold">7.</span>
      <span className="font-bold text-yellow-400 text-lg ml-1">Christian</span>
      {' — Guessed '}<strong>Oneil Cruz</strong>, 57 HRs (
        <svg xmlns="http://www.w3.org/2000/svg" className="inline h-4 w-4 text-red-400 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        Wrong player, off by 3)
    </li>
        <li>
      <span className="text-lime-300 font-bold">8.</span>
      <span className="font-bold text-yellow-400 text-lg ml-1">Daisy</span>
      {' — Guessed '}<strong>Oneil Cruz</strong>, 50 HRs (
        <svg xmlns="http://www.w3.org/2000/svg" className="inline h-4 w-4 text-red-400 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        Wrong player, off by 4) — TIE, spinning wheel winner
    </li>
        <li>
      <span className="text-lime-300 font-bold">9.</span>
      <span className="font-bold text-yellow-400 text-lg ml-1">Kevin</span>
      {' — Guessed '}<strong>Junior Caminero</strong>, 50 HRs (
        <svg xmlns="http://www.w3.org/2000/svg" className="inline h-4 w-4 text-red-400 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        Wrong player, off by 4) — TIE, coin toss winner
    </li>
    <li>
      <span className="text-lime-300 font-bold">10.</span>
      <span className="font-bold text-yellow-400 text-lg ml-1">Simon</span>
      {' — Guessed '}<strong>Matt Olson</strong>, 50 HRs (
        <svg xmlns="http://www.w3.org/2000/svg" className="inline h-4 w-4 text-red-400 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        Wrong player, off by 4) — TIE
    </li>


    <li>
      <span className="text-lime-300 font-bold">11.</span>
      <span className="font-bold text-yellow-400 text-lg ml-1">Dustin</span>
      {' — Guessed '}<strong>James Wood</strong>, 49 HRs (
        <svg xmlns="http://www.w3.org/2000/svg" className="inline h-4 w-4 text-red-400 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
        Wrong player, off by 5)
    </li>
  </ol>
  <p className="text-sm text-gray-400 mt-6 italic">
    <span className="inline-flex items-center gap-1">
      <svg xmlns="http://www.w3.org/2000/svg" className="inline h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
      = Correctly predicted Cal Raleigh as winner. Order among winners based on closeness to 54 HRs.
    </span>
    <br />
    <span className="inline-flex items-center gap-1">
      <svg xmlns="http://www.w3.org/2000/svg" className="inline h-4 w-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
      = Wrong batter, ordered by closeness to actual winner’s total.
    </span>
  </p>
</div>
      </section>

      <Footer />
    </div>
  );
}
