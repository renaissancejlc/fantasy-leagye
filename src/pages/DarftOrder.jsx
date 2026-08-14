import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const draftOrder = [
  'River',
  'Julio',
  'Callie',
  'Kevin',
  'Dustin',
  'Raphy',
  'Daisy',
  'Tariq',
  'Dad',
  'Christian',
  'Utsav',
  'Simon',
];

export default function DraftOrder() {
  return (
    <div className="min-h-screen bg-black font-sans text-white">
      <NavBar />
      <main className="mx-auto max-w-5xl px-6 py-20">
        <div className="text-xs font-black uppercase tracking-[0.3em] text-lime-400">Official · 2026</div>
        <h1 className="mt-4 text-5xl font-black uppercase tracking-tight md:text-7xl">Rookie Draft Order</h1>
        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-zinc-300">
          The 12-team keeper draft begins <strong className="text-white">Saturday, August 15 at 9:30 AM PT</strong>. It runs for three rookie-only rounds in fixed standard order—not snake order—with 12 hours allowed for each pick or pass.
        </p>

        <ol className="mt-12 grid grid-cols-1 gap-px overflow-hidden border border-zinc-800 bg-zinc-800 sm:grid-cols-2">
          {draftOrder.map((name, index) => (
            <li key={name} className="flex items-center gap-5 bg-zinc-950 px-6 py-5">
              <span className="w-10 font-mono text-xl font-bold text-lime-400">{String(index + 1).padStart(2, '0')}</span>
              <span className="text-xl font-black uppercase tracking-wide">{name}</span>
            </li>
          ))}
        </ol>

        <div className="mt-10 border-l-4 border-lime-400 bg-zinc-900 px-6 py-5 text-zinc-300">
          This exact order repeats in rounds one, two, and three. Free agency resumes 24 hours after the final draft pick or pass.
        </div>

        <a href="/draft" className="mt-10 inline-block rounded bg-lime-400 px-8 py-4 text-sm font-black uppercase tracking-wider text-black transition hover:bg-lime-300">
          Enter Draft Room
        </a>
      </main>
      <Footer />
    </div>
  );
}
