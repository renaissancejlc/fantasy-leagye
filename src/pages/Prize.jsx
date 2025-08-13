import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { Trophy, ScrollText, DollarSign, AlertTriangle } from 'lucide-react';

const members = [
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
  'Raphy',
  'Cisco'
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

        <h2 className="text-2xl font-bold uppercase text-white mb-4 mt-16 flex items-center gap-2"><DollarSign size={22} /> League Dues</h2>
        <p className="text-gray-300 mb-2">
          Dues are $20 per player for the 2025 season. Your contribution goes toward engraving, trophy maintenance, and bragging rights.
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
          <AlertTriangle size={18} /> Penalty: Failure to pay will result forfeiture of prize money. The prize money will roll over into next season's winnings.
        </p>

        <div className="bg-gray-900 rounded-lg shadow-lg mt-8 overflow-hidden">
          <div className="bg-lime-600 px-6 py-4 flex justify-between items-center">
            <span className="text-black font-bold uppercase tracking-wide">Dues</span>
            <span className="text-black font-semibold text-sm">Fantasy League 2025</span>
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
                  const isPaid = ["Dad", "Utsav", "Raphy"].includes(name);
                  return (
                    <tr key={idx} className="border-b border-gray-700 last:border-none">
                      <td className="py-2 text-gray-200">{name}</td>
                      <td className="py-2 text-gray-400">2025 League Entry Fee</td>
                      <td className="py-2 text-gray-200">$20.00</td>
                      <td className={`py-2 font-semibold ${isPaid ? "text-green-400" : "text-red-400"}`}>
                        {isPaid ? "Paid" : "Unpaid"}
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
