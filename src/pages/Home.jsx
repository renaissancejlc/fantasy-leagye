import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="relative text-white bg-black min-h-screen font-sans overflow-x-hidden">
      <NavBar />

      {/* HERO */}
      <section className="w-full px-6 py-24 bg-gradient-to-b from-black via-gray-900 to-black text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-12">
          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold uppercase tracking-wide mb-6">
              Welcome to the <span className="text-lime-400 drop-shadow-md">CARR</span> League
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl">
              Track matchups, dominate the standings, and relive legendary moments. This is fantasy football—amplified.
            </p>
            <a
              href="/matchups"
              className="inline-block bg-lime-500 text-black text-sm font-bold uppercase px-6 py-3 rounded hover:bg-lime-400 transition"
            >
              View Matchups
            </a>
          </div>
          <div className="flex justify-center">
            <img
              src="/images/league-logo-placeholder.png"
              alt="League Logo"
              className="w-64 h-64 object-contain"
            />
          </div>
        </div>
      </section>

      {/* STATS GRID */}
      <section className="bg-black text-white px-6 py-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div>
            <p className="text-5xl font-bold text-lime-400">12</p>
            <p className="uppercase tracking-widest text-sm mt-2 text-gray-400">Teams</p>
          </div>
          <div>
            <p className="text-5xl font-bold text-lime-400">17</p>
            <p className="uppercase tracking-widest text-sm mt-2 text-gray-400">Weeks</p>
          </div>
          <div>
            <p className="text-5xl font-bold text-lime-400">1</p>
            <p className="uppercase tracking-widest text-sm mt-2 text-gray-400">Champion</p>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="bg-gradient-to-b from-black to-gray-900 text-center py-24 px-6">
        <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-wide mb-6">
          Are You Ready?
        </h2>
        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
          Draft day is coming. Trash talk is heating up. Legends are born here.
        </p>
        <a
          href="/draft-order"
          className="inline-block bg-lime-500 text-black text-sm font-bold uppercase px-8 py-4 rounded hover:bg-lime-400 transition"
        >
          See Draft Order
        </a>
      </section>

      <Footer />
    </div>
  );
}