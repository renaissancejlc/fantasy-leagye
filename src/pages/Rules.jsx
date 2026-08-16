import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { Package, Target, BarChart2, Repeat, CalendarDays, Crown, FlaskConical, DollarSign, Users } from 'lucide-react';

export default function Rules() {
  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <NavBar />

      <section className="px-6 py-20 max-w-4xl mx-auto text-white">
        <h1 className="text-5xl font-black uppercase text-lime-400 mb-4 tracking-tight">
          Official League Rules
        </h1>
        <p className="text-sm text-gray-400 mb-12">Last updated: August 14, 2026</p>

        <div className="space-y-10 text-gray-100">
          <div className="border-l-4 border-lime-400 pl-6 py-4 bg-gray-900 rounded-md shadow-md">
            <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-extrabold uppercase text-lime-300 mb-1 tracking-wide"><Target size={20} /> Draft & Keeper Format</h2>
            <p className="text-sm sm:text-base leading-relaxed text-gray-300">
              The league has <strong>12 teams</strong> and uses a <strong>full-keeper format</strong>. The 2026 draft is an optional, <strong>three-round rookie-only draft</strong> using a fixed standard order—not a snake draft. The same order repeats in every round.
              <br /><br />
              The draft begins on <strong>Saturday, August 15 at 9:30 AM PT</strong>. Every picker has <strong>12 active hours</strong> to select a rookie or pass, with the clock paused nightly from <strong>11:00 PM to 8:00 AM Pacific</strong>. Picks are submitted through the draft page and announced in Discord.
            </p>
          </div>

          <div className="border-l-4 border-lime-400 pl-6 py-4 bg-gray-900 rounded-md shadow-md">
            <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-extrabold uppercase text-lime-300 mb-1 tracking-wide"><Users size={20} /> New &amp; Departing Managers</h2>
            <p className="text-sm sm:text-base leading-relaxed text-gray-300">
              The league is designed for <strong>12 teams</strong>. New managers may join when approved by the Commissioner and assigned to an open franchise. A replacement manager inherits that franchise’s existing roster, keeper rights, draft position, FAAB budget, and other league assets. Joining the league does not create an additional draft slot or allow a new roster to be built from free agency.
              <br /><br />
              Managers leaving the league should notify the Commissioner as early as possible. Once notice is given, they may not make trades, drops, or other transactions intended to unfairly weaken the franchise. The Commissioner may lock or temporarily manage a vacant team until a replacement is found, taking only reasonable actions needed to preserve the team and league competition.
            </p>
          </div>

          <div className="border-l-4 border-lime-400 pl-6 py-4 bg-gray-900 rounded-md shadow-md">
            <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-extrabold uppercase text-lime-300 mb-1 tracking-wide"><CalendarDays size={20} /> Free Agency</h2>
            <p className="text-sm sm:text-base leading-relaxed text-gray-300">
              No players may be added from free agency until <strong>24 hours after the final draft pick</strong>. Drops remain allowed during the lock. Once free agency resumes, the league returns to its standard budget/bidding format. Each team starts the season with a <strong>$200 FAAB budget</strong>; tied bids go to the team with higher waiver priority.
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
              League dues are <strong>$20 per manager</strong> and must be paid by the first kickoff of the NFL regular season: <strong>September 9, 2026 at 5:20 PM PT</strong>. Any manager who has not paid by that deadline will <strong>forfeit all 2026 league winnings</strong>. Any forfeited prize money will roll over into the following season's prize pool.
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
