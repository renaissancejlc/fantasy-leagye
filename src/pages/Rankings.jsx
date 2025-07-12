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

        <div className="max-w-4xl mx-auto bg-gray-900 rounded-xl shadow-2xl overflow-hidden">
          <table className="w-full table-auto text-left text-gray-200">
            <thead className="bg-gradient-to-r from-lime-600 via-lime-500 to-lime-400 text-black text-sm uppercase tracking-wide">
              <tr>
                <th className="px-6 py-4">#</th>
                <th className="px-6 py-4">Player</th>
                <th className="px-6 py-4">Record</th>
                <th className="px-6 py-4">Total Points</th>
              </tr>
            </thead>
            <tbody>
              {players.map((player, index) => (
                <tr key={index} className="border-t border-gray-700 hover:bg-gray-800 transition">
                  <td className="px-6 py-4 font-extrabold text-xl text-lime-300">{index + 1}</td>
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold uppercase">
                      {player.name.charAt(0)}
                    </div>
                    <span className="text-lg font-medium">{player.name}</span>
                  </td>
                  <td className="px-6 py-4">{player.record}</td>
                  <td className="px-6 py-4 font-semibold text-lime-200">{player.points}</td>
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