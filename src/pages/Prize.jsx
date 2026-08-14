import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { Trophy, ScrollText, DollarSign, AlertTriangle } from 'lucide-react';

const members = [
  'Julio',
  'Dad',
  'Dustin',
  'Callie',
  'Kevin',
  'Simon',
  'River',
  'Christian',
  'Utsav',
  'Tariq',
  'Daisy',
  'Raphy'
];

export default function Prize() {
  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <NavBar />

      <section className="px-6 py-20 max-w-4xl mx-auto">
         <h1 className="text-5xl font-extrabold uppercase tracking-wide mb-6 text-lime-400">
          The Carr League Trophy Case
        </h1>
        <p className="text-lg text-gray-400 mb-12 max-w-3xl mx-auto">
          Earn the honor.
        </p>

        <div className="max-w-3xl mx-auto -mt-8 mb-12">
          <div className="relative overflow-hidden rounded-xl border-2 border-lime-400/40 bg-gradient-to-br from-zinc-900 via-black to-zinc-900 shadow-[0_0_40px_rgba(192,255,102,0.25)] ring-1 ring-lime-400/20">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lime-400/40 to-transparent" />
            <div className="flex items-center gap-3 px-4 py-3">
              <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-lime-500/20 border border-lime-400/40">
                <Trophy size={18} className="text-lime-300" />
              </span>
              <div className="flex-1">
                <div className="text-[10px] uppercase tracking-[0.2em] text-gray-400">Defending Champion</div>
                <div className="text-lg font-extrabold text-white">
                  Team Simon <span className="text-gray-400 font-normal">• 2025 Champion • 10-4-0</span>
                </div>
                <div className="text-xs text-gray-300">
                  Owner: <span className="font-semibold text-white">Simon Carr</span>
                </div>
              </div>
            </div>
            <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-lime-400/10 blur-2xl pointer-events-none" />
            <div className="absolute -left-12 -bottom-10 w-32 h-32 rounded-full bg-lime-500/10 blur-3xl pointer-events-none" />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-10 mb-12">
          <div className="relative bg-zinc-900/70 backdrop-blur-xl border-4 border-lime-500/30 shadow-[0_0_40px_rgba(192,255,102,0.2)] rounded-2xl p-8 ring-1 ring-lime-400/20 hover:scale-[1.01] transition-transform duration-300">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-lime-400/40 via-yellow-200/40 to-lime-400/40 blur-sm rounded-t-xl" />
            <h3 className="text-2xl font-extrabold text-lime-300 mb-3 uppercase tracking-wider flex items-center gap-2 relative z-10">
              <Trophy size={24} className="text-lime-400" /> The Champion’s Trophy
            </h3>
            <p className="text-gray-200 text-base leading-relaxed mb-3 relative z-10">
              A distinguished, rotating league trophy engraved annually with the victor’s name.
              This legacy item stands as the crown jewel of the Carr League—admired, defended, revered.
            </p>
            <div className="bg-gradient-to-br from-black to-zinc-800 p-3 rounded-xl border-2 border-lime-400/30 shadow-inner relative z-10">
              <img src="/images/trophy.jpg" alt="League Trophy" className="w-full rounded-md object-cover" />
            </div>
          </div>
          <div className="relative bg-zinc-900/70 backdrop-blur-xl border-4 border-lime-500/30 shadow-[0_0_40px_rgba(192,255,102,0.2)] rounded-2xl p-8 ring-1 ring-lime-400/20 hover:scale-[1.01] transition-transform duration-300">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-lime-400/40 via-yellow-200/40 to-lime-400/40 blur-sm rounded-t-xl" />
            <h3 className="text-2xl font-extrabold text-lime-300 mb-3 uppercase tracking-wider flex items-center gap-2 relative z-10">
              <ScrollText size={24} className="text-lime-400" /> The Champions’ Plaque
            </h3>
            <p className="text-gray-200 text-base leading-relaxed mb-3 relative z-10">
              A gilded tribute to the league’s finest, the Champions’ Plaque immortalizes each victor’s name and record.
              A source of envy, pride, and eternal bragging rights.
            </p>
            <div className="bg-gradient-to-br from-black to-zinc-800 p-3 rounded-xl border-2 border-lime-400/30 shadow-inner relative z-10">
              <img src="/images/plaque.jpg" alt="Champion Plaque" className="w-full rounded-md object-cover" />
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold uppercase text-white mb-5 mt-16 flex items-center gap-2"><Trophy size={22} /> 2026 Prize Distribution</h2>
        <p className="text-gray-400 mb-7">
          Cash payouts are based on the final eligible prize pool after trophy, ring, plaque, engraving, and other approved league-award expenses.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="relative overflow-hidden rounded-2xl border-2 border-lime-400/60 bg-gradient-to-b from-lime-500/15 to-zinc-950 p-6 shadow-[0_16px_40px_rgba(163,230,53,0.12)]">
            <div className="text-xs font-black uppercase tracking-[0.25em] text-lime-300">1st Place</div>
            <div className="mt-3 text-4xl font-black text-white">60%</div>
            <p className="mt-4 text-sm leading-relaxed text-gray-300">
              League champion cash payout, the championship trophy or ring, and the champion’s name engraved on the league plaque.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-500/60 bg-gradient-to-b from-zinc-700/20 to-zinc-950 p-6">
            <div className="text-xs font-black uppercase tracking-[0.25em] text-zinc-300">2nd Place</div>
            <div className="mt-3 text-4xl font-black text-white">25%</div>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">Runner-up cash payout from the final prize pool.</p>
          </div>
          <div className="rounded-2xl border border-amber-600/50 bg-gradient-to-b from-amber-800/15 to-zinc-950 p-6">
            <div className="text-xs font-black uppercase tracking-[0.25em] text-amber-400">3rd Place</div>
            <div className="mt-3 text-4xl font-black text-white">15%</div>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">Third-place cash payout from the final prize pool.</p>
          </div>
        </div>
        <p className="mt-4 text-xs text-gray-500">
          Final dollar amounts are calculated after the payment deadline and award expenses are confirmed; the 60/25/15 percentages remain the same.
        </p>

        <h2 className="text-2xl font-bold uppercase text-white mb-4 mt-16 flex items-center gap-2"><DollarSign size={22} /> League Dues</h2>
        <p className="text-gray-300 mb-2">
          Dues are $20 per manager for the 2026 season. Your contribution goes toward the cash prizes, championship awards, engraving, trophy maintenance, and bragging rights.
        </p>
        <p className="mt-3 font-semibold text-white">
          Payment deadline: <span className="text-lime-300">September 9, 2026 at 5:20 PM PT</span> — the first kickoff of the NFL regular season.
        </p>
        <p className="text-lime-300 mt-4">
          Send your payment directly via Venmo:&nbsp;
          <a 
            href="https://venmo.com/reny-carr" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="underline text-lime-400 hover:text-lime-300"
          >
            @reny-carr
          </a>
        </p>
        <p className="text-red-400 mt-2 font-semibold flex items-center gap-2">
          <AlertTriangle size={18} /> Any manager who has not paid by the first kickoff of the regular season forfeits all 2026 league winnings. Any forfeited prize money will roll over into the following season's prize pool.
        </p>

        <div className="bg-gray-900 rounded-lg shadow-lg mt-8 overflow-hidden">
          <div className="bg-lime-600 px-6 py-4 flex justify-between items-center">
            <span className="text-black font-bold uppercase tracking-wide">Dues</span>
            <span className="text-black font-semibold text-sm">Fantasy League 2026</span>
          </div>
          <div className="px-6 py-4">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-lime-400 border-b border-gray-600 uppercase text-xs">
                  <th className="pb-2">Member</th>
                  <th className="pb-2">Description</th>
                  <th className="pb-2">Amount</th>
                  <th className="pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {members.map((name, idx) => {
                  const isPaid = false;
                  return (
                    <tr key={idx} className="border-b border-gray-700 last:border-none">
                      <td className="py-2 text-gray-200">{name}</td>
                      <td className="py-2 text-gray-400">2026 League Entry Fee</td>
                      <td className="py-2 text-gray-200">$20.00</td>
                      <td className={`py-2 font-semibold ${isPaid ? "text-green-400" : "text-red-400"}`}>
                        {isPaid ? "Paid" : "Payment Due"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
