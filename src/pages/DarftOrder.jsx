import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const DRAFT_DATE = new Date('2025-07-14T17:00:00-07:00');

const players = [
  { name: 'Dad', guess: null },
  { name: 'Dustin Carr', guess: { player: 'James Wood', homeruns: 49 } },
  { name: 'Callie Everson', guess: { player: 'Cal Raleigh', homeruns: 52 } },
  { name: 'Kevin Carr', guess: { player: 'Junior Caminero', homeruns: 50 } },
  { name: 'Simon', guess: { player: 'Matt Olson', homeruns: 50 } },
  { name: 'River Carr', guess: null },
  { name: 'Christian Carr', guess: { player: 'Oneil Cruz', homeruns: 57 } },
  { name: 'Utsav Roommate', guess: null },
  { name: 'Tariq Muhammad', guess: { player: 'Ronald Acuña Jr.', homeruns: 50 } },
  { name: 'Daisy', guess: null },
  { name: 'Raphy', guess: null }
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
        <p className="text-lg text-gray-400 mb-4 max-w-2xl mx-auto">
          To determine the draft order, each league member will guess how many home runs will be hit in the 2025 Home Run Derby.
          Closest guess wins! Ties go to a coin flip. All guesses must be submitted by Sunday night.
        </p>

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

        {/* 2025 Home Run Derby Participants Section */}
        <div className="max-w-5xl mx-auto mt-20 text-left">
          <h2 className="text-2xl font-bold uppercase text-lime-400 mb-6 text-center">2025 Home Run Derby Participants</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'Cal Raleigh', team: 'Seattle Mariners', image: 'cal-raleigh.jpg' },
              { name: 'James Wood', team: 'Washington Nationals', image: 'james-wood.jpg' },
              { name: 'Byron Buxton', team: 'Minnesota Twins', image: 'byron-buxton.jpg' },
              { name: 'Oneil Cruz', team: 'Pittsburgh Pirates', image: 'oneil-cruz.jpg' },
              { name: 'Junior Caminero', team: 'Tampa Bay Rays', image: 'junior-caminero.jpg' },
              { name: 'Brent Rooker', team: 'Oakland Athletics', image: 'brent-rooker.jpg' },
              { name: 'Jazz Chisholm Jr.', team: 'Miami Marlins', image: 'jazz-chisholm-jr.jpg' },
              { name: 'Matt Olson', team: 'Atlanta Braves', image: 'matt-olson.jpg' }
            ].map((p, idx) => (
              <div key={idx} className="bg-gray-900 p-4 rounded-lg shadow-lg text-center">
                <img
                  src={`/images/players/${p.image}`}
                  alt={p.name}
                  className="w-24 h-24 mx-auto rounded-full object-cover mb-4 border-2 border-lime-400"
                />
                <p className="font-semibold text-white">{p.name}</p>
                <p className="text-sm text-gray-400">{p.team}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="max-w-3xl mx-auto bg-gray-900 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold uppercase text-lime-400 mb-1">Player Guesses</h3>

          <table className="w-full table-auto text-left">
            <thead>
              <tr className="text-gray-400 border-b border-gray-700 text-sm uppercase">
                <th className="pb-2">Player</th>
                <th className="pb-2">Guessed HR Derby Player</th>
                <th className="pb-2">Guessed HRs</th>
              </tr>
            </thead>
            <tbody>
              {players.map((p, idx) => (
                <tr key={idx} className="border-b border-gray-800">
                  <td className="py-3">{p.name}</td>
                  <td className="py-3 text-lime-300">
                    {p.guess && p.guess.player ? p.guess.player : '—'}
                  </td>
                  <td className="py-3 text-lime-300">
                    {p.guess && typeof p.guess.homeruns === 'number' ? p.guess.homeruns : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-sm text-gray-400 italic mt-4">
            If your guessed player is inactive and you don’t submit a correction by the deadline, your guess will default to: Matt Olson → James Wood → Byron Buxton (in that order). If all are out, you’ll be placed at the bottom of the draft order.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}