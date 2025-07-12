import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { Trophy } from 'lucide-react';

export default function History() {
  return (
    <div className="bg-zinc-950 text-zinc-300 min-h-screen font-mono">
      <NavBar />
      <section className="px-6 py-20 text-center">
       <h1 className="text-5xl font-extrabold uppercase tracking-wide mb-6 text-lime-400">
         League History - fake data , real tbd
        </h1>
        <div className="text-xs uppercase tracking-widest text-zinc-400 mb-12">
          Official Archival Record
        </div>

        <div className="mb-16">
          <h2 className="text-2xl uppercase tracking-widest font-mono text-zinc-200 mb-2">
            Hall of Champions
          </h2>
          <div className="text-xs uppercase tracking-widest text-zinc-400 mb-6">
            Champions &amp; Records
          </div>
          <ul className="space-y-4 max-w-xl mx-auto text-left">
            <li className="border border-zinc-700 bg-zinc-900 p-4 rounded-md shadow-sm font-mono flex items-center gap-3 ring-1 ring-zinc-700">
              <Trophy className="text-lime-400 w-6 h-6" />
              <span>
                <span className="text-zinc-200 font-semibold">2024</span> - Callie <span className="text-zinc-400">(Record: 10-3)</span>
                <span className="block text-xs uppercase tracking-widest text-zinc-400 mt-1">“Queen of the Waiver Wire”</span>
              </span>
            </li>
            <li className="border border-zinc-700 bg-zinc-900 p-4 rounded-md shadow-sm font-mono flex items-center gap-3 ring-1 ring-zinc-700">
              <Trophy className="text-lime-400 w-6 h-6" />
              <span>
                <span className="text-zinc-200 font-semibold">2023</span> - Kevin <span className="text-zinc-400">(Record: 9-4)</span>
                <span className="block text-xs uppercase tracking-widest text-zinc-400 mt-1">“The Silent Assassin”</span>
              </span>
            </li>
            <li className="border border-zinc-700 bg-zinc-900 p-4 rounded-md shadow-sm font-mono flex items-center gap-3 ring-1 ring-zinc-700">
              <Trophy className="text-lime-400 w-6 h-6" />
              <span>
                <span className="text-zinc-200 font-semibold">2022</span> - Christian <span className="text-zinc-400">(Record: 11-2)</span>
                <span className="block text-xs uppercase tracking-widest text-zinc-400 mt-1">“Most Dominant Season Ever”</span>
              </span>
            </li>
          </ul>
        </div>

        <div className="border-t border-zinc-700 mt-12 pt-6 grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
          <div>
            <h3 className="text-xl uppercase tracking-widest font-mono text-zinc-200 mb-2">
              All-Time Wins
            </h3>
            <div className="text-xs uppercase tracking-widest text-zinc-400 mb-4">
              Career Victories
            </div>
            <ul className="space-y-4">
              <li className="border border-zinc-700 bg-zinc-900 p-4 rounded-md shadow-sm font-mono ring-1 ring-zinc-700">Christian <span className="text-zinc-400">— 28 Wins</span></li>
              <li className="border border-zinc-700 bg-zinc-900 p-4 rounded-md shadow-sm font-mono ring-1 ring-zinc-700">Kevin <span className="text-zinc-400">— 25 Wins</span></li>
              <li className="border border-zinc-700 bg-zinc-900 p-4 rounded-md shadow-sm font-mono ring-1 ring-zinc-700">Callie <span className="text-zinc-400">— 24 Wins</span></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl uppercase tracking-widest font-mono text-zinc-200 mb-2">
              Legendary Streaks
            </h3>
            <div className="text-xs uppercase tracking-widest text-zinc-400 mb-4">
              Unbroken Runs
            </div>
            <ul className="space-y-4">
              <li className="border border-zinc-700 bg-zinc-900 p-4 rounded-md shadow-sm font-mono ring-1 ring-zinc-700">Christian <span className="text-zinc-400">— 8 Game Win Streak (2022)</span></li>
              <li className="border border-zinc-700 bg-zinc-900 p-4 rounded-md shadow-sm font-mono ring-1 ring-zinc-700">Callie <span className="text-zinc-400">— 6 Game Win Streak (2024)</span></li>
              <li className="border border-zinc-700 bg-zinc-900 p-4 rounded-md shadow-sm font-mono ring-1 ring-zinc-700">Kevin <span className="text-zinc-400">— 5 Game Win Streak (2023)</span></li>
            </ul>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}