import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

export default function SeasonTimeline() {
  const timeline = [
    { date: 'July 14', event: 'Home Run Derby', note: 'Determines draft order' },
    { date: 'July 28', event: 'Dues Deadline', note: '$10 or lose 1st round pick' },
    { date: 'August 3–10', event: 'Fantasy Draft Week', note: 'Live or slow draft' },
    { date: 'August 15', event: 'Roster Lock', note: 'Trades + lineups must be set' },
    { date: 'September 4', event: 'NFL Kickoff (Week 1)', note: 'Chiefs vs TBD' },
    { date: 'October 17', event: 'Trade Deadline', note: 'Last chance to trade' },
    { date: 'November 27', event: 'Thanksgiving Games', note: 'Classic matchups' },
    { date: 'December 3', event: 'Playoffs Begin (Week 14)', note: 'Top 4 or 6 teams' },
    { date: 'December 17', event: 'Championship (Week 16)', note: 'Final week' },
    { date: 'January 1', event: 'Keeper Deadline', note: 'Declare 2026 keepers' }
  ];

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <NavBar />
      <section className="px-6 py-20 text-center">
        <h1 className="text-5xl font-extrabold uppercase tracking-wide mb-6 text-lime-400">
          2025 Season Timeline
        </h1>
        <p className="text-lg text-gray-400 mb-12 max-w-3xl mx-auto">
          Here's your playbook for the entire fantasy football season. Know the deadlines. Respect the grind.
        </p>

        <div className="relative border-l-4 border-lime-500 max-w-4xl mx-auto pl-6 space-y-12">
          {timeline.map((item, idx) => (
            <div key={idx} className="relative pl-6">
              <div className="absolute -left-3 top-1 w-6 h-6 rounded-full bg-lime-500 border-4 border-black"></div>
              <div className="bg-gray-950 border border-gray-800 rounded-md p-5 shadow-md">
                <p className="text-sm text-gray-400 font-mono">{item.date}</p>
                <h3 className="text-2xl font-bold text-white mt-1">{item.event}</h3>
                <p className="text-sm text-gray-400 mt-1">{item.note}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}