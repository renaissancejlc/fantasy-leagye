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
      </section>

      <Footer />
    </div>
  );
}
