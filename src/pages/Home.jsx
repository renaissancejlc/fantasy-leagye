import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

export default function Home() {
  const [timeLeft, setTimeLeft] = useState(() => {
    const now = new Date();
    const draftDate = new Date('2025-08-14T09:30:00-07:00');
    const total = draftDate - now;
    return {
      total,
      days: Math.floor(total / (1000 * 60 * 60 * 24)),
      hours: Math.floor((total / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((total / 1000 / 60) % 60),
      seconds: Math.floor((total / 1000) % 60),
    };
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const draftDate = new Date('2025-08-14T09:30:00-07:00');
      const total = draftDate - now;
      setTimeLeft({
        total,
        days: Math.floor(total / (1000 * 60 * 60 * 24)),
        hours: Math.floor((total / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((total / 1000 / 60) % 60),
        seconds: Math.floor((total / 1000) % 60),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
            <div className="relative flex items-center justify-center w-80 h-80">
              <div className="absolute w-80 h-80 rounded-full bg-lime-400 blur-3xl opacity-40 animate-pulse z-0"></div>
              <img
                src="/images/logo.png"
                alt="League Logo"
                className="w-72 h-72 object-contain relative z-10 transition-transform duration-300 hover:scale-105"
              />
            </div>
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

      {/* LEAGUE VOTING INVITE */}
      <section className="bg-gradient-to-b from-black to-gray-900 text-center py-24 px-6">
        <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-wide mb-6 text-lime-400">
          League Voting Is Open
        </h2>

        <div className="mb-10 px-6 py-4 max-w-2xl mx-auto border-l-4 border-lime-500 bg-gray-800 bg-opacity-60 rounded text-left">
          <div className="flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-lime-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7 20h10a2 2 0 002-2V6a2 2 0 00-2-2H7a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div>
              <p className="text-sm sm:text-base text-gray-300">
                Offseason is <span className="font-semibold text-white">change season</span>. <span className="font-semibold text-white">3 days</span> per motion. <span className="font-semibold text-white">One vote</span> per motion. Pick your name. Enter your PIN. <span className="font-semibold text-white">Make it count.</span>
              </p>
              <ul className="list-disc list-inside text-gray-400 text-sm mt-2 space-y-1">
                <li>Offseason only — locks at kickoff.</li>
                <li>Edit or remove until the clock hits zero.</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 justify-center">
          <a
            href="/votes"
            className="inline-block bg-lime-500 text-black text-sm font-bold uppercase px-8 py-4 rounded hover:bg-lime-400 transition tracking-wider"
          >
            See Open Votes
          </a>
          <a
            href="/rules#voting"
            className="inline-block border border-lime-500 text-lime-300 text-sm font-bold uppercase px-8 py-4 rounded hover:bg-lime-500 hover:text-black transition tracking-wider"
          >
            Voting Rules
          </a>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          Want to propose a motion? Open one during the offseason via group chat.
        </p>
      </section>

      {/* GET READY FOR WEEK ONE */}
      <section className="bg-gradient-to-b from-gray-900 to-black text-center py-24 px-6">
        <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-wide mb-6 text-lime-400">
          Get Ready for Week One
        </h2>
        <div className="mb-10 px-6 py-4 max-w-xl mx-auto border-l-4 border-lime-500 bg-gray-800 bg-opacity-60 rounded">
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-lime-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-3-3v6m6-9a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm sm:text-base text-lime-300 font-medium">
              Week 1 kicks off <span className="font-bold text-white">Wednesday, September 4</span> — set your lineup and make it count.
            </p>
          </div>
        </div>
        <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">
          This is it. Every point matters. Let’s start the season with a statement.
        </p>
        <a
          href="/schedule"
          className="inline-block bg-lime-500 text-black text-sm font-bold uppercase px-8 py-4 rounded hover:bg-lime-400 transition tracking-wider"
        >
          Check Schedule
        </a>
      </section>

      
      {/* CALL TO ACTION */}
      <section className="bg-gradient-to-b from-black to-gray-900 text-center py-24 px-6">
        <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-wide mb-6 text-lime-400">
          Draft Day is Coming
        </h2>
        <div className="mb-10 px-6 py-4 max-w-xl mx-auto border-l-4 border-red-500 bg-gray-800 bg-opacity-60 rounded">
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
            </svg>
            <p className="text-sm sm:text-base text-red-300 font-medium">
              Important Update: Draft has been moved to <span className="font-bold text-white">Thursday, August 14 · 9:30am PST</span>
            </p>
          </div>
        </div>
        
        {/* COUNTDOWN */}
        <div className="mt-10 mb-16">

          <h3 className="text-2xl uppercase font-semibold text-white mb-4"> Countdown</h3>
                    <p className="text-lg text-gray-400 mb-2 max-w-2xl mx-auto">
          Are you ready? Solidify your strategy. Prepare for the snake.        </p>
          {timeLeft.total > 0 ? (
            <div className="text-4xl md:text-5xl font-mono text-lime-400 tracking-wider">
              {`${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`}
            </div>
          ) : (
            <div className="text-4xl font-bold text-red-500">The Draft Has Begun!</div>
          )}
        </div>
        <a
          href="/draft"
          className="inline-block bg-lime-500 text-black text-sm font-bold uppercase px-8 py-4 rounded hover:bg-lime-400 transition"
        >
          See Order
        </a>
      </section>

      {/* DERBY CHALLENGE */}
      <section className="bg-gradient-to-b from-gray-900 to-black text-center py-24 px-6">
        <h2 className="text-3xl md:text-5xl font-extrabold uppercase tracking-wide mb-6 text-lime-400">
          Derby Draft Challenge
        </h2>
        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
          One guess. One shot. The Home Run Derby decides who calls their draft spot first. Closest pick gets the power.
        </p>
        <a
          href="/draft-order#results"
          className="inline-block bg-lime-500 text-black text-sm font-bold uppercase px-8 py-4 rounded hover:bg-lime-400 transition tracking-wider"
        >
          See Results
        </a>
      </section>

      <Footer />
    </div>
  );
}