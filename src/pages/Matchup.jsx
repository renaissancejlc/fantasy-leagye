import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

export default function Matchup() {
  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <NavBar />
      <section className="px-6 py-20 text-center">
        <h1 className="text-5xl font-extrabold uppercase tracking-wide mb-12 text-lime-400">
          Matchups
        </h1>

        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-6">Week 1 Spotlight</h2>
          <div className="max-w-xl mx-auto bg-gray-900 rounded-lg shadow-xl p-8">
            <div className="text-2xl font-bold mb-4">Christian vs. Kevin</div>
            <div className="text-gray-400 text-sm">Projected showdown for Week 1</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
          <div>
            <h3 className="text-2xl font-semibold text-white mb-4">Past Matchups</h3>
            <ul className="space-y-4 text-gray-400">
              <li className="bg-gray-800 p-4 rounded-lg shadow">Callie def. Simon</li>
              <li className="bg-gray-800 p-4 rounded-lg shadow">Tariq def. Dustin</li>
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-white mb-4">Future Matchups</h3>
            <ul className="space-y-4 text-gray-400">
              <li className="bg-gray-800 p-4 rounded-lg shadow">Simon vs. Dustin</li>
              <li className="bg-gray-800 p-4 rounded-lg shadow">Tariq vs. Callie</li>
            </ul>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}