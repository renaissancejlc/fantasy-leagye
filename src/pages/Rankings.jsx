import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

export default function Rankings() {
  const players = [
    { name: 'Christian', record: '0-0', points: 0 },
    { name: 'Kevin', record: '0-0', points: 0 },
    { name: 'Callie', record: '0-0', points: 0 },
    { name: 'Dustin', record: '0-0', points: 0 },
    { name: 'Tariq', record: '0-0', points: 0 },
    { name: 'Simon', record: '0-0', points: 0 },
    { name: 'River', record: '0-0', points: 0 },
    { name: 'Utsav', record: '0-0', points: 0 },
    { name: 'Daisy', record: '0-0', points: 0 },
    { name: 'Raphy', record: '0-0', points: 0 },
    { name: 'Dad', record: '0-0', points: 0 },
  ];

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <NavBar />
      <section className="px-6 py-20 text-center">
        <h1 className="text-5xl font-extrabold uppercase tracking-wide mb-6 text-lime-400">
          2025 Rankings
        </h1>
        <p className="text-lg text-gray-400 mb-12 max-w-3xl mx-auto">
          The season has begun. The slate is clean. Let the rankings begin.
        </p>

        <div className="max-w-3xl mx-auto bg-gray-900 rounded-lg shadow-xl overflow-hidden">
          <table className="w-full table-auto text-left text-gray-300">
            <thead className="bg-gray-800 text-lime-400 uppercase text-sm">
              <tr>
                <th className="px-6 py-4">Rank</th>
                <th className="px-6 py-4">Player</th>
                <th className="px-6 py-4">Record</th>
                <th className="px-6 py-4">Total Points</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, index) => (
                <tr key={index} className="border-t border-gray-700 hover:bg-gray-800 transition">
                  <td className="px-6 py-4 font-bold text-lg text-lime-300">{index + 1}</td>
                  <td className="px-6 py-4">{player.name}</td>
                  <td className="px-6 py-4">{player.record}</td>
                  <td className="px-6 py-4">{player.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <Footer />
    </div>
  );
}