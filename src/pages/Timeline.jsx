import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

export default function SeasonTimeline() {
  const timeline = [
    { date: 'August 14', event: 'Dues Deadline', note: '$20 or lose chance to win the prize' },
    { date: 'August 15', event: 'Rookie Draft Begins', note: '9:30 AM PT · 3 rounds · 12 hours per pick' },
    { date: '24 hours after the final pick', event: 'Free Agency Resumes', note: 'Standard FAAB budget and bidding return' },
    { date: 'September 9', event: 'NFL Kickoff (Week 1)', note: '5:20 PM PT · Patriots at Seahawks' },
    { date: 'TBD', event: 'Trade Deadline', note: 'Two weeks before the fantasy playoffs' },
    { date: 'November 26', event: 'Thanksgiving Games', note: 'Holiday football returns' },
    { date: 'TBD', event: 'Fantasy Playoffs', note: 'Final schedule set in ESPN' }
  ];

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <NavBar />
      <section className="px-6 py-20 text-center">
        <h1 className="text-5xl font-extrabold uppercase tracking-wide mb-6 text-lime-400">
          2026 Season Timeline
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
