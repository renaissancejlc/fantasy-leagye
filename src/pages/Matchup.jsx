import React, { useMemo, useState } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

export default function Matchup() {
  // 2025 Regular Season Schedule (Weeks 1–14)
  const schedule2025 = [
    { week: 1, games: [
      { awayTeam: 'Love thy Nabers', awayMgr: 'Raphael Carr', awayScore: 144.22, homeTeam: 'No Punt Intended', homeMgr: 'Callie Carr', homeScore: 119.68 },
      { awayTeam: 'The Replacements', awayMgr: 'david carr, David Carr', awayScore: 126.34, homeTeam: 'Santee Eagles', homeMgr: 'Thomas Carr', homeScore: 132.58 },
      { awayTeam: 'Team Ustav', awayMgr: 'Utsav Pandey', awayScore: 127.02, homeTeam: 'Team Simon', homeMgr: 'Simon Carr', homeScore: 142.82 },
      { awayTeam: 'Building Dynasties', awayMgr: 'Christian Carr', awayScore: 140.76, homeTeam: "Breece's Pieces", homeMgr: 'Daisy Carr', homeScore: 112.02 },
      { awayTeam: "francisco's Fantastic Team", awayMgr: 'francisco chavez', awayScore: 162.96, homeTeam: "King Henry's Court", homeMgr: 'Angelo Carr', homeScore: 116.08 },
      { awayTeam: 'The Happy Accidents', awayMgr: 'Dustin Carr', awayScore: 80.62, homeTeam: 'Sutton things never change', homeMgr: 'Tariq Muhummad', homeScore: 160.02 },
    ]},
    { week: 2, games: [
      { awayTeam: 'The Replacements', awayMgr: 'david carr, David Carr', homeTeam: 'Love thy Nabers', homeMgr: 'Raphael Carr' },
      { awayTeam: 'No Punt Intended', awayMgr: 'Callie Everson', homeTeam: 'Team Ustav', homeMgr: 'Utsav Pandey' },
      { awayTeam: 'Santee Eagles', awayMgr: 'Thomas Carr', homeTeam: 'Team Simon', homeMgr: 'Simon Carr' },
      { awayTeam: 'Team 9', awayMgr: '—', homeTeam: 'Building Dynasties', homeMgr: 'Christian Carr' },
      { awayTeam: 'Cryo Me a River', awayMgr: 'Daisy Carr', homeTeam: 'The Happy Accidents', homeMgr: 'Dustin Carr' },
      { awayTeam: "Patty's Pub", awayMgr: 'Angelo Carr', homeTeam: 'Tyreek it Till you Make it', homeMgr: 'Tariq Muhummad' },
    ]},
    { week: 3, games: [
      { awayTeam: 'Love thy Nabers', awayMgr: 'Raphael Carr', homeTeam: 'Team Ustav', homeMgr: 'Utsav Pandey' },
      { awayTeam: 'Team Simon', awayMgr: 'Simon Carr', homeTeam: 'The Replacements', homeMgr: 'david carr, David Carr' },
      { awayTeam: 'Santee Eagles', awayMgr: 'Thomas Carr', homeTeam: 'No Punt Intended', homeMgr: 'Callie Everson' },
      { awayTeam: 'Building Dynasties', awayMgr: 'Christian Carr', homeTeam: 'The Happy Accidents', homeMgr: 'Dustin Carr' },
      { awayTeam: 'Tyreek it Till you Make it', awayMgr: 'Tariq Muhummad', homeTeam: 'Team 9', homeMgr: '—' },
      { awayTeam: "Patty's Pub", awayMgr: 'Angelo Carr', homeTeam: 'Cryo Me a River', homeMgr: 'Daisy Carr' },
    ]},
    { week: 4, games: [
      { awayTeam: 'Team Simon', awayMgr: 'Simon Carr', homeTeam: 'Love thy Nabers', homeMgr: 'Raphael Carr' },
      { awayTeam: 'Team Ustav', awayMgr: 'Utsav Pandey', homeTeam: 'Santee Eagles', homeMgr: 'Thomas Carr' },
      { awayTeam: 'The Replacements', awayMgr: 'david carr, David Carr', homeTeam: 'No Punt Intended', homeMgr: 'Callie Everson' },
      { awayTeam: 'Tyreek it Till you Make it', awayMgr: 'Tariq Muhummad', homeTeam: 'Building Dynasties', homeMgr: 'Christian Carr' },
      { awayTeam: 'The Happy Accidents', awayMgr: 'Dustin Carr', homeTeam: "Patty's Pub", homeMgr: 'Angelo Carr' },
      { awayTeam: 'Team 9', awayMgr: '—', homeTeam: 'Cryo Me a River', homeMgr: 'Daisy Carr' },
    ]},
    { week: 5, games: [
      { awayTeam: 'Love thy Nabers', awayMgr: 'Raphael Carr', homeTeam: 'Santee Eagles', homeMgr: 'Thomas Carr' },
      { awayTeam: 'No Punt Intended', awayMgr: 'Callie Everson', homeTeam: 'Team Simon', homeMgr: 'Simon Carr' },
      { awayTeam: 'The Replacements', awayMgr: 'david carr, David Carr', homeTeam: 'Team Ustav', homeMgr: 'Utsav Pandey' },
      { awayTeam: 'Building Dynasties', awayMgr: 'Christian Carr', homeTeam: "Patty's Pub", homeMgr: 'Angelo Carr' },
      { awayTeam: 'Cryo Me a River', awayMgr: 'Daisy Carr', homeTeam: 'Tyreek it Till you Make it', homeMgr: 'Tariq Muhummad' },
      { awayTeam: 'Team 9', awayMgr: '—', homeTeam: 'The Happy Accidents', homeMgr: 'Dustin Carr' },
    ]},
    { week: 6, games: [
      { awayTeam: 'Building Dynasties', awayMgr: 'Christian Carr', homeTeam: 'Love thy Nabers', homeMgr: 'Raphael Carr' },
      { awayTeam: 'Cryo Me a River', awayMgr: 'Daisy Carr', homeTeam: 'No Punt Intended', homeMgr: 'Callie Everson' },
      { awayTeam: 'Team 9', awayMgr: '—', homeTeam: 'The Replacements', homeMgr: 'david carr, David Carr' },
      { awayTeam: 'The Happy Accidents', awayMgr: 'Dustin Carr', homeTeam: 'Team Ustav', homeMgr: 'Utsav Pandey' },
      { awayTeam: 'Tyreek it Till you Make it', awayMgr: 'Tariq Muhummad', homeTeam: 'Team Simon', homeMgr: 'Simon Carr' },
      { awayTeam: "Patty's Pub", awayMgr: 'Angelo Carr', homeTeam: 'Santee Eagles', homeMgr: 'Thomas Carr' },
    ]},
    { week: 7, games: [
      { awayTeam: 'No Punt Intended', awayMgr: 'Callie Everson', homeTeam: 'Building Dynasties', homeMgr: 'Christian Carr' },
      { awayTeam: 'The Replacements', awayMgr: 'david carr, David Carr', homeTeam: 'Cryo Me a River', homeMgr: 'Daisy Carr' },
      { awayTeam: 'Team Ustav', awayMgr: 'Utsav Pandey', homeTeam: 'Team 9', homeMgr: '—' },
      { awayTeam: 'Team Simon', awayMgr: 'Simon Carr', homeTeam: 'The Happy Accidents', homeMgr: 'Dustin Carr' },
      { awayTeam: 'Santee Eagles', awayMgr: 'Thomas Carr', homeTeam: 'Tyreek it Till you Make it', homeMgr: 'Tariq Muhummad' },
      { awayTeam: "Patty's Pub", awayMgr: 'Angelo Carr', homeTeam: 'Love thy Nabers', homeMgr: 'Raphael Carr' },
    ]},
    { week: 8, games: [
      { awayTeam: 'Building Dynasties', awayMgr: 'Christian Carr', homeTeam: 'The Replacements', homeMgr: 'david carr, David Carr' },
      { awayTeam: 'Cryo Me a River', awayMgr: 'Daisy Carr', homeTeam: 'Team Ustav', homeMgr: 'Utsav Pandey' },
      { awayTeam: 'Team 9', awayMgr: '—', homeTeam: 'Team Simon', homeMgr: 'Simon Carr' },
      { awayTeam: 'The Happy Accidents', awayMgr: 'Dustin Carr', homeTeam: 'Santee Eagles', homeMgr: 'Thomas Carr' },
      { awayTeam: 'Tyreek it Till you Make it', awayMgr: 'Tariq Muhummad', homeTeam: 'Love thy Nabers', homeMgr: 'Raphael Carr' },
      { awayTeam: "Patty's Pub", awayMgr: 'Angelo Carr', homeTeam: 'No Punt Intended', homeMgr: 'Callie Everson' },
    ]},
    { week: 9, games: [
      { awayTeam: 'Team Ustav', awayMgr: 'Utsav Pandey', homeTeam: 'Building Dynasties', homeMgr: 'Christian Carr' },
      { awayTeam: 'Team Simon', awayMgr: 'Simon Carr', homeTeam: 'Cryo Me a River', homeMgr: 'Daisy Carr' },
      { awayTeam: 'Santee Eagles', awayMgr: 'Thomas Carr', homeTeam: 'Team 9', homeMgr: '—' },
      { awayTeam: 'Love thy Nabers', awayMgr: 'Raphael Carr', homeTeam: 'The Happy Accidents', homeMgr: 'Dustin Carr' },
      { awayTeam: 'No Punt Intended', awayMgr: 'Callie Everson', homeTeam: 'Tyreek it Till you Make it', homeMgr: 'Tariq Muhummad' },
      { awayTeam: 'The Replacements', awayMgr: 'david carr, David Carr', homeTeam: "Patty's Pub", homeMgr: 'Angelo Carr' },
    ]},
    { week: 10, games: [
      { awayTeam: 'Building Dynasties', awayMgr: 'Christian Carr', homeTeam: 'Team Simon', homeMgr: 'Simon Carr' },
      { awayTeam: 'Cryo Me a River', awayMgr: 'Daisy Carr', homeTeam: 'Santee Eagles', homeMgr: 'Thomas Carr' },
      { awayTeam: 'Team 9', awayMgr: '—', homeTeam: 'Love thy Nabers', homeMgr: 'Raphael Carr' },
      { awayTeam: 'The Happy Accidents', awayMgr: 'Dustin Carr', homeTeam: 'No Punt Intended', homeMgr: 'Callie Everson' },
      { awayTeam: 'Tyreek it Till you Make it', awayMgr: 'Tariq Muhummad', homeTeam: 'The Replacements', homeMgr: 'david carr, David Carr' },
      { awayTeam: "Patty's Pub", awayMgr: 'Angelo Carr', homeTeam: 'Team Ustav', homeMgr: 'Utsav Pandey' },
    ]},
    { week: 11, games: [
      { awayTeam: 'Santee Eagles', awayMgr: 'Thomas Carr', homeTeam: 'Building Dynasties', homeMgr: 'Christian Carr' },
      { awayTeam: 'Love thy Nabers', awayMgr: 'Raphael Carr', homeTeam: 'Cryo Me a River', homeMgr: 'Daisy Carr' },
      { awayTeam: 'No Punt Intended', awayMgr: 'Callie Everson', homeTeam: 'Team 9', homeMgr: '—' },
      { awayTeam: 'The Replacements', awayMgr: 'david carr, David Carr', homeTeam: 'The Happy Accidents', homeMgr: 'Dustin Carr' },
      { awayTeam: 'Team Ustav', awayMgr: 'Utsav Pandey', homeTeam: 'Tyreek it Till you Make it', homeMgr: 'Tariq Muhummad' },
      { awayTeam: 'Team Simon', awayMgr: 'Simon Carr', homeTeam: "Patty's Pub", homeMgr: 'Angelo Carr' },
    ]},
    { week: 12, games: [
      { awayTeam: 'Love thy Nabers', awayMgr: 'Raphael Carr', homeTeam: 'Building Dynasties', homeMgr: 'Christian Carr' },
      { awayTeam: 'No Punt Intended', awayMgr: 'Callie Everson', homeTeam: 'Cryo Me a River', homeMgr: 'Daisy Carr' },
      { awayTeam: 'The Replacements', awayMgr: 'david carr, David Carr', homeTeam: 'Team 9', homeMgr: '—' },
      { awayTeam: 'Team Ustav', awayMgr: 'Utsav Pandey', homeTeam: 'The Happy Accidents', homeMgr: 'Dustin Carr' },
      { awayTeam: 'Team Simon', awayMgr: 'Simon Carr', homeTeam: 'Tyreek it Till you Make it', homeMgr: 'Tariq Muhummad' },
      { awayTeam: "Patty's Pub", awayMgr: 'Angelo Carr', homeTeam: 'Santee Eagles', homeMgr: 'Thomas Carr' },
    ]},
    { week: 13, games: [
      { awayTeam: 'Building Dynasties', awayMgr: 'Christian Carr', homeTeam: 'No Punt Intended', homeMgr: 'Callie Everson' },
      { awayTeam: 'Cryo Me a River', awayMgr: 'Daisy Carr', homeTeam: 'The Replacements', homeMgr: 'david carr, David Carr' },
      { awayTeam: 'Team 9', awayMgr: '—', homeTeam: 'Team Ustav', homeMgr: 'Utsav Pandey' },
      { awayTeam: 'The Happy Accidents', awayMgr: 'Dustin Carr', homeTeam: 'Team Simon', homeMgr: 'Simon Carr' },
      { awayTeam: 'Tyreek it Till you Make it', awayMgr: 'Tariq Muhummad', homeTeam: 'Santee Eagles', homeMgr: 'Thomas Carr' },
      { awayTeam: "Patty's Pub", awayMgr: 'Angelo Carr', homeTeam: 'Love thy Nabers', homeMgr: 'Raphael Carr' },
    ]},
    { week: 14, games: [
      { awayTeam: 'The Replacements', awayMgr: 'david carr, David Carr', homeTeam: 'Building Dynasties', homeMgr: 'Christian Carr' },
      { awayTeam: 'Team Ustav', awayMgr: 'Utsav Pandey', homeTeam: 'Cryo Me a River', homeMgr: 'Daisy Carr' },
      { awayTeam: 'Team Simon', awayMgr: 'Simon Carr', homeTeam: 'Team 9', homeMgr: '—' },
      { awayTeam: 'Santee Eagles', awayMgr: 'Thomas Carr', homeTeam: 'The Happy Accidents', homeMgr: 'Dustin Carr' },
      { awayTeam: 'Tyreek it Till you Make it', awayMgr: 'Tariq Muhummad', homeTeam: 'No Punt Intended', homeMgr: 'Callie Everson' },
      { awayTeam: 'Love thy Nabers', awayMgr: 'Raphael Carr', homeTeam: "Patty's Pub", homeMgr: 'Angelo Carr' },
    ]},
  ];

  const [selectedWeek, setSelectedWeek] = useState(2);
  const current = useMemo(() => schedule2025.find(w => w.week === selectedWeek) || schedule2025[0], [selectedWeek]);

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <NavBar />
      <section className="px-6 py-20 text-center font-serif">
        {/* Headline Section */}
       <h1 className="text-5xl font-extrabold uppercase tracking-wide mb-6 text-lime-400">
          Matchup Report
        </h1>
        <div className="text-xs uppercase tracking-widest font-semibold text-lime-300 mb-12" style={{fontVariantCaps: 'small-caps'}}>
          2025 REGULAR SEASON — OFFICIAL LEAGUE SCHEDULE
        </div>

        {/* Week Selector + Matchups */}
        <div className="mb-16">
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {schedule2025.map(({ week }) => (
              <button
                key={week}
                type="button"
                onClick={() => setSelectedWeek(week)}
                className={`px-3 py-1 text-xs uppercase tracking-widest border transition ${
                  selectedWeek === week
                    ? 'bg-lime-400 text-black border-black'
                    : 'bg-black text-white border-white/20 hover:border-white/40'
                }`}
                aria-pressed={selectedWeek === week}
              >
                Week {week}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {current.games.map((g, idx) => (
              <div key={idx} className="border-2 border-black bg-white text-black p-5 font-serif">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-extrabold mb-2">
                  <span className="px-2 py-0.5 border border-black">Away</span>
                  <span className="px-2 py-0.5 border border-black">Home</span>
                </div>
                <div className="grid grid-cols-5 items-center gap-2">
                  <div className="col-span-2">
                    <div className="text-xl font-extrabold leading-tight">{g.awayTeam}</div>
                    <div className="text-xs font-semibold opacity-70">{g.awayMgr}</div>
                  </div>
                  <div className="col-span-1 text-center">
                    <div className="text-2xl font-black">{g.awayScore != null ? g.awayScore.toFixed(2) : '0.0'}</div>
                    <div className="text-[10px] uppercase tracking-widest">vs</div>
                    <div className="text-2xl font-black">{g.homeScore != null ? g.homeScore.toFixed(2) : '0.0'}</div>
                  </div>
                  <div className="col-span-2 text-right">
                    <div className="text-xl font-extrabold leading-tight">{g.homeTeam}</div>
                    <div className="text-xs font-semibold opacity-70">{g.homeMgr}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Playoffs (Weeks 15–17) */}
        <div className="text-left font-serif border-t border-gray-800 pt-10">
          <h3 className="text-3xl font-bold text-white mb-4 border-b-2 border-gray-700 pb-2 uppercase tracking-tight">
            Playoffs
          </h3>
          <ul className="space-y-4 text-sm">
            <li className="bg-gray-900 border-l-4 border-blue-500 p-5 rounded-md shadow text-white font-mono font-semibold">
              <div className="text-lg font-bold">Round 1 — NFL Week 15</div>
              <div className="text-xs uppercase tracking-widest font-extrabold mt-1">Matchups to be determined</div>
            </li>
            <li className="bg-gray-900 border-l-4 border-blue-500 p-5 rounded-md shadow text-white font-mono font-semibold">
              <div className="text-lg font-bold">Round 2 — NFL Week 16</div>
              <div className="text-xs uppercase tracking-widest font-extrabold mt-1">Matchups to be determined</div>
            </li>
            <li className="bg-gray-900 border-l-4 border-blue-500 p-5 rounded-md shadow text-white font-mono font-semibold">
              <div className="text-lg font-bold">Championship — NFL Week 17</div>
              <div className="text-xs uppercase tracking-widest font-extrabold mt-1">Matchups to be determined</div>
            </li>
          </ul>
        </div>
      </section>
      <Footer />
    </div>
  );
}