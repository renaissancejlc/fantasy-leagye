import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

export default function PowerRankings() {
  const players = [
    'Christian', 'Kevin', 'Callie', 'Dustin', 'Tariq', 'Simon',
    'River', 'Utsav', 'Daisy', 'Raphy', 'Dad'
  ];

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <NavBar />
      <section className="px-6 py-20 text-center">
        <h1 className="text-5xl font-extrabold uppercase tracking-wide mb-4 text-lime-400">
          2025 Power Rankings
        </h1>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-12">
          These aren’t just standings — this is *vibe-based supremacy*. Updated weekly by the Commissioner and league drama. Let the narratives unfold.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {players.map((name, index) => (
            <div key={index} className="bg-gray-900 border border-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition">
              <h2 className="text-2xl font-bold text-lime-300 mb-2">{name}</h2>
              <p className="text-sm text-gray-400 italic">Awaiting first update...</p>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}