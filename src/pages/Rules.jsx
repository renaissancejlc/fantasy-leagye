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
            <p className="text-sm sm:text-base leading-relaxed text-gray-300">
              For the 2025 season, this League shall operate as a redraft league. No participants shall retain players from prior rosters. All team rosters shall be reset and redrafted prior to the commencement of the season.
            </p>
          </div>

          <div className="border-l-4 border-lime-400 pl-6 py-4 bg-gray-900 rounded-md shadow-md">
            <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-extrabold uppercase text-lime-300 mb-1 tracking-wide"><Target size={20} /> Draft Order</h2>
            <p className="text-sm sm:text-base leading-relaxed text-gray-300">
              The draft order for the 2025 season shall be determined based upon the results of the Home Run Derby Challenge. Each participant shall submit a guess regarding the number of home runs hit by a selected player. The participant whose guess is numerically closest to the actual result shall be awarded the first overall pick. In the event of a tie, the order shall be resolved via randomized coin toss administered by the Commissioner.
            </p>
          </div>

          <div className="border-l-4 border-lime-400 pl-6 py-4 bg-gray-900 rounded-md shadow-md">
            <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-extrabold uppercase text-lime-300 mb-1 tracking-wide"><BarChart2 size={20} /> Keepers (Starting 2026)</h2>
            <p className="text-sm sm:text-base leading-relaxed text-gray-300">
              Effective with the commencement of the 2026 season, the League shall implement a full-keeper format. Each franchise shall retain all rostered players from the prior season, subject to any trades or player drops executed within league rules. This policy is designed to support continuity and long-term strategic planning.
            </p>
          </div>

          <div className="border-l-4 border-lime-400 pl-6 py-4 bg-gray-900 rounded-md shadow-md">
            <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-extrabold uppercase text-lime-300 mb-1 tracking-wide"><Repeat size={20} /> Trades</h2>
            <p className="text-sm sm:text-base leading-relaxed text-gray-300">
              Trades between League participants shall be permitted until the conclusion of Week 10. All trade agreements must be formally submitted via the designated League communication channel and must receive affirmative confirmation from both parties involved. The Commissioner reserves the right to review and resolve disputes.
            </p>
          </div>

          <div className="border-l-4 border-lime-400 pl-6 py-4 bg-gray-900 rounded-md shadow-md">
            <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-extrabold uppercase text-lime-300 mb-1 tracking-wide"><CalendarDays size={20} /> Waivers & Free Agency</h2>
            <p className="text-sm sm:text-base leading-relaxed text-gray-300">
              The waiver wire shall process weekly each Wednesday. Following the waiver period, all unclaimed players shall become unrestricted free agents and shall be available for acquisition on a first-come, first-serve basis.
            </p>
          </div>

          <div className="border-l-4 border-lime-400 pl-6 py-4 bg-gray-900 rounded-md shadow-md">
            <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-extrabold uppercase text-lime-300 mb-1 tracking-wide"><Crown size={20} /> League Champion</h2>
            <p className="text-sm sm:text-base leading-relaxed text-gray-300">
              The League Champion shall be declared upon the conclusion of the final playoff matchup in Week 17. The victorious participant shall be awarded the official League Trophy, which shall be updated annually to reflect the current champion.
            </p>
          </div>

          <div className="border-l-4 border-lime-400 pl-6 py-4 bg-gray-900 rounded-md shadow-md">
            <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-extrabold uppercase text-lime-300 mb-1 tracking-wide"><FlaskConical size={20} /> Rule Changes</h2>
            <p className="text-sm sm:text-base leading-relaxed text-gray-300">
              Amendments to these League Rules may be proposed by any participant during the designated off-season period. The Commissioner shall facilitate a formal vote, and any proposed amendment shall require a simple majority vote of all participating members for ratification.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}