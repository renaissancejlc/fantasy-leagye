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

        <div className="max-w-4xl mx-auto bg-gray-900 rounded-lg shadow-xl overflow-hidden">
          <table className="w-full table-auto text-left text-gray-300">
            <thead className="bg-gray-800 text-lime-400 uppercase text-sm">
              <tr>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Event</th>
                <th className="px-6 py-4">Notes</th>
              </tr>
            </thead>
            <tbody>
              {timeline.map((item, idx) => (
                <tr key={idx} className="border-t border-gray-700 hover:bg-gray-800 transition">
                  <td className="px-6 py-4 font-medium">{item.date}</td>
                  <td className="px-6 py-4">{item.event}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{item.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <Footer />
    </div>
  );
}