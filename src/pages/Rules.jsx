import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { Package, Target, BarChart2, Repeat, CalendarDays, Crown, FlaskConical } from 'lucide-react';

export default function Rules() {
  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <NavBar />

      <section className="px-6 py-20 max-w-4xl mx-auto text-white">
        <h1 className="text-5xl font-black uppercase text-lime-400 mb-4 tracking-tight">
          Official League Rules
        </h1>
        <p className="text-sm text-gray-400 mb-12">Last updated: July 11, 2025</p>

        <div className="space-y-10 text-gray-100">
          <div className="border-l-4 border-lime-400 pl-6 py-4 bg-gray-900 rounded-md shadow-md">
            <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-extrabold uppercase text-lime-300 mb-1 tracking-wide"><Package size={20} /> No Keepers (2025)</h2>
            <p className="text-sm sm:text-base leading-relaxed text-gray-300">This is a fresh draft year. No players will be kept from prior rosters in 2025.</p>
          </div>

          <div className="border-l-4 border-lime-400 pl-6 py-4 bg-gray-900 rounded-md shadow-md">
            <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-extrabold uppercase text-lime-300 mb-1 tracking-wide"><Target size={20} /> Draft Order</h2>
            <p className="text-sm sm:text-base leading-relaxed text-gray-300">
              Draft order is determined by the Home Run Derby challenge. Everyone submits a guess, closest to the actual HR total wins the #1 pick. Ties are broken by coin flip.
            </p>
          </div>

          <div className="border-l-4 border-lime-400 pl-6 py-4 bg-gray-900 rounded-md shadow-md">
            <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-extrabold uppercase text-lime-300 mb-1 tracking-wide"><BarChart2 size={20} /> Keepers (Starting 2026)</h2>
            <p className="text-sm sm:text-base leading-relaxed text-gray-300">
              Starting next season, we’ll use a full-keeper system. Every team will retain their entire roster unless they trade or drop players. This encourages long-term franchise strategy.
            </p>
          </div>

          <div className="border-l-4 border-lime-400 pl-6 py-4 bg-gray-900 rounded-md shadow-md">
            <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-extrabold uppercase text-lime-300 mb-1 tracking-wide"><Repeat size={20} /> Trades</h2>
            <p className="text-sm sm:text-base leading-relaxed text-gray-300">
              Trades are allowed up until the Week 10 trade deadline. All trades must be submitted via group chat or league platform and confirmed by both parties.
            </p>
          </div>

          <div className="border-l-4 border-lime-400 pl-6 py-4 bg-gray-900 rounded-md shadow-md">
            <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-extrabold uppercase text-lime-300 mb-1 tracking-wide"><CalendarDays size={20} /> Waivers & Free Agency</h2>
            <p className="text-sm sm:text-base leading-relaxed text-gray-300">
              Waivers process every Wednesday. Free agents are first-come, first-serve after waiver clears.
            </p>
          </div>

          <div className="border-l-4 border-lime-400 pl-6 py-4 bg-gray-900 rounded-md shadow-md">
            <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-extrabold uppercase text-lime-300 mb-1 tracking-wide"><Crown size={20} /> League Champion</h2>
            <p className="text-sm sm:text-base leading-relaxed text-gray-300">
              The winner is crowned after the playoff finals in Week 17. Glory lasts all off-season. The trophy updates each year.
            </p>
          </div>

          <div className="border-l-4 border-lime-400 pl-6 py-4 bg-gray-900 rounded-md shadow-md">
            <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-extrabold uppercase text-lime-300 mb-1 tracking-wide"><FlaskConical size={20} /> Rule Changes</h2>
            <p className="text-sm sm:text-base leading-relaxed text-gray-300">
              Rule changes can be proposed and voted on each off-season. Commissioner will facilitate votes with majority needed to pass.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}