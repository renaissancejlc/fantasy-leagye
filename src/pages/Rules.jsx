import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { Package, Target, BarChart2, Repeat, CalendarDays, Crown, FlaskConical, DollarSign } from 'lucide-react';

export default function Rules() {
  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <NavBar />

      <section className="px-6 py-20 max-w-4xl mx-auto text-white">
        <h1 className="text-5xl font-black uppercase text-lime-400 mb-4 tracking-tight">
          Official League Rules
        </h1>
        <p className="text-sm text-gray-400 mb-12">Last updated: July 12, 2025</p>

        <div className="space-y-10 text-gray-100">
          <div className="border-l-4 border-lime-400 pl-6 py-4 bg-gray-900 rounded-md shadow-md">
            <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-extrabold uppercase text-lime-300 mb-1 tracking-wide"><Target size={20} /> Draft & Keeper Format</h2>
            <p className="text-sm sm:text-base leading-relaxed text-gray-300">
              For 2025, the league will follow a <strong>snake draft format</strong>. The draft order will be determined by participants’ selections based on the results of the MLB Home Run Derby. Each player may choose their draft position based on proximity of their derby guess to the actual outcome. 
              <br /><br />
              Drafts will begin on <strong>August 14, 2025</strong>. The first 3 rounds will allow 24 hours per pick; rounds 4–20 will allow 12 hours. All picks must be submitted offline via a shared Google Sheet and announced in the group message. 
              <br /><br />
              There are <strong>no keepers</strong> for 2025. Beginning in 2026, the league will adopt a full-keeper format. Each team will retain their entire roster and participate in a <strong>5-round rookie draft</strong> each season.
            </p>
          </div>

          <div className="border-l-4 border-lime-400 pl-6 py-4 bg-gray-900 rounded-md shadow-md">
            <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-extrabold uppercase text-lime-300 mb-1 tracking-wide"><CalendarDays size={20} /> Free Agency</h2>
            <p className="text-sm sm:text-base leading-relaxed text-gray-300">
              Each team starts the season with a <strong>$200 FAAB budget</strong> to bid on free agents. Bid deadlines occur <strong>every Thursday and Sunday at 9:00 AM PST</strong>. In the event of tied bids, the team with the higher waiver priority (based on reverse standings) will win the player.
            </p>
          </div>

          <div className="border-l-4 border-lime-400 pl-6 py-4 bg-gray-900 rounded-md shadow-md">
            <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-extrabold uppercase text-lime-300 mb-1 tracking-wide"><Repeat size={20} /> Trades</h2>
            <p className="text-sm sm:text-base leading-relaxed text-gray-300">
              The trade deadline is <strong>two weeks before the start of playoffs</strong>. Trade proposals are processed through the app and will trigger a notification. Any league member may vote to <strong>veto</strong> a trade; if a majority vote is reached, the trade will be canceled.
            </p>
          </div>

          <div className="border-l-4 border-lime-400 pl-6 py-4 bg-gray-900 rounded-md shadow-md">
            <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-extrabold uppercase text-lime-300 mb-1 tracking-wide"><DollarSign size={20} /> Dues</h2>
            <p className="text-sm sm:text-base leading-relaxed text-gray-300">
              League dues are <strong>$20 per player</strong> and must be paid by <strong>Week 1 kickoff</strong>. Any player who fails to submit payment on time will <strong>forfeit their cash winnings</strong>, the winnings will rollover into the following season.
            </p>
          </div>

          <div className="border-l-4 border-lime-400 pl-6 py-4 bg-gray-900 rounded-md shadow-md">
            <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-extrabold uppercase text-lime-300 mb-1 tracking-wide"><Crown size={20} /> Playoff Tiebreakers</h2>
            <p className="text-sm sm:text-base leading-relaxed text-gray-300">
              In the event of a tied playoff matchup, the win will be awarded to the <strong>higher-seeded team</strong> based on final regular season standings.
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