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
  'Raphy'
];

export default function Prize() {
  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <NavBar />

      <section className="px-6 py-20 max-w-4xl mx-auto">
        <h1 className="text-4xl font-extrabold uppercase text-lime-400 mb-4">League Prizes</h1>
        <p className="text-gray-300 mb-8 text-lg">
          Compete not just for glory, but for the right to hold the coveted Trophy and claim your name on the Plaque.
        </p>

        <div className="grid md:grid-cols-2 gap-10 mb-12">
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg border-l-4 border-lime-400">
            <h3 className="text-xl font-bold text-lime-300 mb-2 uppercase flex items-center gap-2"><Trophy size={20} /> The Trophy</h3>
            <p className="text-gray-300 mb-2">A rotating league trophy engraved with the winner’s name each year. Proudly displayed and fiercely defended.</p>
            <img src="/images/trophy.jpg" alt="League Trophy" className="w-full rounded-lg mt-4" />
          </div>
          <div className="bg-gray-900 p-6 rounded-lg shadow-lg border-l-4 border-lime-400">
            <h3 className="text-xl font-bold text-lime-300 mb-2 uppercase flex items-center gap-2"><ScrollText size={20} /> The Plaque</h3>
            <p className="text-gray-300 mb-2">A commemorative plaque listing each season’s champion and their final record. Immortalized in league lore.</p>
            <img src="/images/plaque.jpg" alt="Champion Plaque" className="w-full rounded-lg mt-4" />
          </div>
        </div>

        <h2 className="text-2xl font-bold uppercase text-white mb-4 mt-16 flex items-center gap-2"><DollarSign size={22} /> League Dues</h2>
        <p className="text-gray-300 mb-2">
          Dues are $10 per player for the 2025 season. Your contribution goes toward engraving, trophy maintenance, and bragging rights.
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
          <AlertTriangle size={18} /> Penalty: Failure to pay will result in loss of a first-round draft pick next season.
        </p>

        <ul className="bg-gray-800 rounded-lg p-4 space-y-2 shadow-md mt-6">
          {members.map((name, idx) => (
            <li key={idx} className="flex justify-between items-center border-b border-gray-700 pb-2 last:border-none">
              <span className="text-gray-300">{name}</span>
              <span className="text-red-400 uppercase font-semibold">Unpaid</span>
            </li>
          ))}
        </ul>
      </section>

      <Footer />
    </div>
  );
}