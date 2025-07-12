import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

export default function Teams() {
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
          Meet the Teams
        </h1>
        <p className="text-lg text-gray-400 mb-12 max-w-3xl mx-auto">
          Player names and team photos are coming soon. For now, get hyped!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {players.map((player, index) => (
            <Link
              to={`/players/${player.name.toLowerCase()}`}
              key={index}
              className="bg-gray-900 p-6 rounded-lg shadow-xl text-center hover:bg-gray-800 transition"
            >
              <div className="w-24 h-24 mx-auto mb-4 bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-gray-500 text-2xl">👤</span>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{player.name}</h3>
              <p className="text-gray-400 text-sm">Team details coming soon</p>
            </Link>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}