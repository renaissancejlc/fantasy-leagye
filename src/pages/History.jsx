import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { Trophy } from 'lucide-react';

export default function History() {
  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <NavBar />
      <section className="px-6 py-20 text-center">
        <h1 className="text-5xl font-extrabold uppercase tracking-wide mb-12 text-lime-400">
          League History
        </h1>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Hall of Champions</h2>
          <ul className="space-y-4 text-gray-400 max-w-xl mx-auto text-left">
            <li className="bg-gray-900 p-4 rounded-lg shadow flex items-center gap-3">
              <Trophy className="text-lime-400 w-6 h-6" />
              2024 - Callie (Record: 10-3) — “Queen of the Waiver Wire”
            </li>
            <li className="bg-gray-900 p-4 rounded-lg shadow flex items-center gap-3">
              <Trophy className="text-lime-400 w-6 h-6" />
              2023 - Kevin (Record: 9-4) — “The Silent Assassin”
            </li>
            <li className="bg-gray-900 p-4 rounded-lg shadow flex items-center gap-3">
              <Trophy className="text-lime-400 w-6 h-6" />
              2022 - Christian (Record: 11-2) — “Most Dominant Season Ever”
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
          <div>
            <h3 className="text-2xl font-semibold text-white mb-4">All-Time Wins</h3>
            <ul className="space-y-4 text-gray-400">
              <li className="bg-gray-800 p-4 rounded-lg shadow">Christian — 28 Wins</li>
              <li className="bg-gray-800 p-4 rounded-lg shadow">Kevin — 25 Wins</li>
              <li className="bg-gray-800 p-4 rounded-lg shadow">Callie — 24 Wins</li>
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-white mb-4">Legendary Streaks</h3>
            <ul className="space-y-4 text-gray-400">
              <li className="bg-gray-800 p-4 rounded-lg shadow">Christian — 8 Game Win Streak (2022)</li>
              <li className="bg-gray-800 p-4 rounded-lg shadow">Callie — 6 Game Win Streak (2024)</li>
              <li className="bg-gray-800 p-4 rounded-lg shadow">Kevin — 5 Game Win Streak (2023)</li>
            </ul>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}