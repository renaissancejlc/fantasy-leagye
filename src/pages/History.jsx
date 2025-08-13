import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { Trophy } from 'lucide-react';

export default function History() {
  const standings2024 = [
    { rk: 1, team: "Patty's Pub", manager: 'Angelo Carr', rec: '7-7-0', pf: 1618.48, pa: 1566.02, pfg: 115.6, pag: 111.9, div: '3-2-0', home: '4-4-0', away: '3-3-0', strk: 'W1', moves: 6 },
    { rk: 2, team: 'Cryo Me a River', manager: 'Daisy Carr', rec: '6-8-0', pf: 1558.42, pa: 1695.2, pfg: 111.3, pag: 121.1, div: '4-1-0', home: '5-3-0', away: '1-5-0', strk: 'L2', moves: 2 },
    { rk: 3, team: 'Love thy Nabers', manager: 'Raphael Carr', rec: '10-4-0', pf: 1854.66, pa: 1718.68, pfg: 132.5, pag: 122.8, div: '5-0-0', home: '4-2-0', away: '6-2-0', strk: 'L1', moves: 13 },
    { rk: 4, team: 'Tyreek it Till you Make it', manager: 'Tariq Muhummad', rec: '9-5-0', pf: 1616.22, pa: 1613.48, pfg: 115.4, pag: 115.2, div: '1-4-0', home: '6-2-0', away: '3-3-0', strk: 'W6', moves: 22 },
    { rk: 5, team: 'The Program', manager: 'Christian Carr', rec: '10-4-0', pf: 1879.14, pa: 1565.34, pfg: 134.2, pag: 111.8, div: '3-2-0', home: '5-2-0', away: '5-2-0', strk: 'W5', moves: 26 },
    { rk: 6, team: 'Luna', manager: 'Imani Muhammad', rec: '7-7-0', pf: 1640.7, pa: 1581.14, pfg: 117.2, pag: 112.9, div: '3-2-0', home: '2-4-0', away: '5-3-0', strk: 'W2', moves: 6 },
    { rk: 7, team: 'The Replacements', manager: 'David Carr & David Carr', rec: '11-3-0', pf: 1762.8, pa: 1548.18, pfg: 125.9, pag: 110.6, div: '4-1-0', home: '4-1-0', away: '7-2-0', strk: 'L1', moves: 10 },
    { rk: 8, team: 'Team Ustav', manager: 'Utsav Pandey', rec: '10-4-0', pf: 1775.32, pa: 1551.06, pfg: 126.8, pag: 110.8, div: '3-2-0', home: '4-3-0', away: '6-1-0', strk: 'W1', moves: 10 },
    { rk: 9, team: 'Santee Eagles', manager: 'Thomas Carr', rec: '4-10-0', pf: 1555.8, pa: 1719.56, pfg: 111.1, pag: 122.8, div: '0-5-0', home: '2-5-0', away: '2-5-0', strk: 'W1', moves: 27 },
    { rk: 10, team: 'The Happy Accidents', manager: 'Dustin Carr', rec: '3-11-0', pf: 1508.04, pa: 1720.7, pfg: 107.7, pag: 122.9, div: '1-4-0', home: '1-7-0', away: '2-4-0', strk: 'L1', moves: 0 },
    { rk: 11, team: 'No Punt Intended', manager: 'Callie Everson', rec: '3-11-0', pf: 1457.22, pa: 1730.68, pfg: 104.1, pag: 123.6, div: '1-4-0', home: '2-5-0', away: '1-6-0', strk: 'L3', moves: 0 },
    { rk: 12, team: 'Team Simon', manager: 'Simon Carr', rec: '4-10-0', pf: 1500.96, pa: 1717.72, pfg: 107.2, pag: 122.7, div: '2-3-0', home: '2-5-0', away: '2-5-0', strk: 'L3', moves: 3 },
  ];

  const standings2023 = [
    { rk: 1, team: 'Team Ustav', manager: 'Utsav Pandey', rec: '7-7-0', pf: 1713.84, pa: 1697.22, pfg: 122.4, pag: 121.2, div: '3-4-0', home: '3-4-0', away: '4-3-0', strk: 'W2', moves: 13 },
    { rk: 2, team: 'The Program', manager: 'Christian Carr', rec: '11-3-0', pf: 1935.58, pa: 1741.44, pfg: 138.3, pag: 124.4, div: '6-1-0', home: '4-3-0', away: '7-0-0', strk: 'L1', moves: 55 },
    { rk: 3, team: "What's Olave Got to Do with it?", manager: 'Angelo Carr', rec: '7-7-0', pf: 1905.5, pa: 1816.58, pfg: 136.1, pag: 129.8, div: '3-5-0', home: '4-3-0', away: '3-4-0', strk: 'W1', moves: 17 },
    { rk: 4, team: 'Any Given Sunday', manager: 'Tariq Muhummad', rec: '8-6-0', pf: 1866.06, pa: 1747.08, pfg: 133.3, pag: 124.8, div: '4-3-0', home: '4-3-0', away: '4-3-0', strk: 'L3', moves: 29 },
    { rk: 5, team: 'Luna', manager: 'Imani Muhammad', rec: '8-6-0', pf: 1784.12, pa: 1874.54, pfg: 127.4, pag: 133.9, div: '3-4-0', home: '4-3-0', away: '4-3-0', strk: 'W1', moves: 14 },
    { rk: 6, team: 'Santee Eagles', manager: 'Thomas Carr', rec: '7-7-0', pf: 1805.8, pa: 1810.62, pfg: 129.0, pag: 129.3, div: '3-4-0', home: '2-5-0', away: '5-2-0', strk: 'W4', moves: 20 },
    { rk: 7, team: 'Team Simon', manager: 'Simon Carr', rec: '8-6-0', pf: 1898.12, pa: 1745.26, pfg: 135.6, pag: 124.7, div: '5-3-0', home: '4-3-0', away: '4-3-0', strk: 'W2', moves: 8 },
    { rk: 8, team: 'No Punt Intended', manager: 'Callie Everson', rec: '6-8-0', pf: 1831.66, pa: 1889.9, pfg: 130.8, pag: 135.0, div: '3-2-0', home: '4-3-0', away: '2-5-0', strk: 'L1', moves: 23 },
    { rk: 9, team: 'No Rodgers No Cry', manager: 'Dustin Carr', rec: '3-11-0', pf: 1594.92, pa: 1886.58, pfg: 113.9, pag: 134.8, div: '1-4-0', home: '2-5-0', away: '1-6-0', strk: 'L2', moves: 38 },
    { rk: 10, team: 'The Replacements', manager: 'david carr, David Carr', rec: '5-9-0', pf: 1605.36, pa: 1731.74, pfg: 114.7, pag: 123.7, div: '3-4-0', home: '3-4-0', away: '2-5-0', strk: 'L2', moves: 9 },
  ];

  return (
    <div className="bg-zinc-950 text-zinc-300 min-h-screen font-mono">
      <NavBar />
      <section className="px-6 py-20 text-center">
       <h1 className="text-5xl font-extrabold uppercase tracking-wide mb-6 text-lime-400">
         League History
        </h1>
        <div className="text-xs uppercase tracking-widest text-zinc-400 mb-12">
          Official Archival Record
        </div>

        <div className="mb-16">
          <h2 className="text-2xl uppercase tracking-widest font-mono text-zinc-200 mb-2">
            Hall of Champions
          </h2>
          <div className="text-xs uppercase tracking-widest text-zinc-400 mb-6">
            Champions &amp; Records
          </div>
          <ul className="space-y-4 max-w-xl mx-auto text-left">
            <li className="border border-zinc-700 bg-zinc-900 p-4 rounded-md shadow-sm font-mono flex items-center gap-3 ring-1 ring-zinc-700">
              <Trophy className="text-lime-400 w-6 h-6" />
              <span>
                <span className="text-zinc-200 font-semibold">2024</span> - Angelo <span className="text-zinc-400">(Patty's Pub • Record: 7-7)</span>
                <span className="block text-xs uppercase tracking-widest text-zinc-400 mt-1">League Champion</span>
              </span>
            </li>
            <li className="border border-zinc-700 bg-zinc-900 p-4 rounded-md shadow-sm font-mono flex items-center gap-3 ring-1 ring-zinc-700">
              <Trophy className="text-lime-400 w-6 h-6" />
              <span>
                <span className="text-zinc-200 font-semibold">2023</span> - Angelo <span className="text-zinc-400">(Record: 9-4)</span>
                <span className="block text-xs uppercase tracking-widest text-zinc-400 mt-1">“The Silent Assassin”</span>
              </span>
            </li>
            <li className="border border-zinc-700 bg-zinc-900 p-4 rounded-md shadow-sm font-mono flex items-center gap-3 ring-1 ring-zinc-700">
              <Trophy className="text-lime-400 w-6 h-6" />
              <span>
                <span className="text-zinc-200 font-semibold">2022</span> - Christian <span className="text-zinc-400">(Record: 11-2)</span>
                <span className="block text-xs uppercase tracking-widest text-zinc-400 mt-1">“Most Dominant Season Ever”</span>
              </span>
            </li>
          </ul>
        </div>

        <div className="mb-16 mt-8">
          <h2 className="text-2xl uppercase tracking-widest font-mono text-zinc-200 mb-2">2024 Season Snapshot</h2>
          <div className="text-xs uppercase tracking-widest text-zinc-400 mb-6">Final Standings &amp; Season Stats</div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left uppercase text-zinc-400">
                  <th className="py-2 pr-4">RK</th>
                  <th className="py-2 pr-4">Team</th>
                  <th className="py-2 pr-4">Manager</th>
                  <th className="py-2 pr-4">REC</th>
                  <th className="py-2 pr-4">PF</th>
                  <th className="py-2 pr-4">PA</th>
                  <th className="py-2 pr-4">PF/G</th>
                  <th className="py-2 pr-4">PA/G</th>
                  <th className="py-2 pr-4">DIFF</th>
                  <th className="py-2 pr-4">DIV</th>
                  <th className="py-2 pr-4">H</th>
                  <th className="py-2 pr-4">A</th>
                  <th className="py-2 pr-4">STRK</th>
                  <th className="py-2 pr-4">MOVES</th>
                </tr>
              </thead>
              <tbody>
                {standings2024.map((t, i) => (
                  <tr key={t.rk} className={i % 2 === 0 ? 'bg-zinc-900/60' : 'bg-zinc-900/30'}>
                    <td className="py-2 pr-4 text-zinc-300">{t.rk}</td>
                    <td className="py-2 pr-4 text-zinc-100 font-semibold">{t.team}</td>
                    <td className="py-2 pr-4 text-zinc-200">{t.manager}</td>
                    <td className="py-2 pr-4 text-zinc-200">{t.rec}</td>
                    <td className="py-2 pr-4 text-zinc-200">{t.pf.toFixed(2)}</td>
                    <td className="py-2 pr-4 text-zinc-200">{t.pa.toFixed(2)}</td>
                    <td className="py-2 pr-4 text-zinc-200">{t.pfg.toFixed(1)}</td>
                    <td className="py-2 pr-4 text-zinc-200">{t.pag.toFixed(1)}</td>
                    <td className={`py-2 pr-4 font-mono ${t.pfg - t.pag >= 0 ? 'text-lime-400' : 'text-rose-400'}`}>
                      {(t.pfg - t.pag >= 0 ? '+' : '') + (t.pfg - t.pag).toFixed(1)}
                    </td>
                    <td className="py-2 pr-4 text-zinc-200">{t.div}</td>
                    <td className="py-2 pr-4 text-zinc-200">{t.home}</td>
                    <td className="py-2 pr-4 text-zinc-200">{t.away}</td>
                    <td className="py-2 pr-4 text-zinc-200">{t.strk}</td>
                    <td className="py-2 pr-4 text-zinc-200">{t.moves}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-16 mt-8">
          <h2 className="text-2xl uppercase tracking-widest font-mono text-zinc-200 mb-2">2023 Season Snapshot</h2>
          <div className="text-xs uppercase tracking-widest text-zinc-400 mb-6">Final Standings &amp; Season Stats</div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left uppercase text-zinc-400">
                  <th className="py-2 pr-4">RK</th>
                  <th className="py-2 pr-4">Team</th>
                  <th className="py-2 pr-4">Manager</th>
                  <th className="py-2 pr-4">REC</th>
                  <th className="py-2 pr-4">PF</th>
                  <th className="py-2 pr-4">PA</th>
                  <th className="py-2 pr-4">PF/G</th>
                  <th className="py-2 pr-4">PA/G</th>
                  <th className="py-2 pr-4">DIFF</th>
                  <th className="py-2 pr-4">DIV</th>
                  <th className="py-2 pr-4">H</th>
                  <th className="py-2 pr-4">A</th>
                  <th className="py-2 pr-4">STRK</th>
                  <th className="py-2 pr-4">MOVES</th>
                </tr>
              </thead>
              <tbody>
                {standings2023.map((t, i) => (
                  <tr key={t.rk} className={i % 2 === 0 ? 'bg-zinc-900/60' : 'bg-zinc-900/30'}>
                    <td className="py-2 pr-4 text-zinc-300">{t.rk}</td>
                    <td className="py-2 pr-4 text-zinc-100 font-semibold">{t.team}</td>
                    <td className="py-2 pr-4 text-zinc-200">{t.manager}</td>
                    <td className="py-2 pr-4 text-zinc-200">{t.rec}</td>
                    <td className="py-2 pr-4 text-zinc-200">{t.pf.toFixed(2)}</td>
                    <td className="py-2 pr-4 text-zinc-200">{t.pa.toFixed(2)}</td>
                    <td className="py-2 pr-4 text-zinc-200">{t.pfg.toFixed(1)}</td>
                    <td className="py-2 pr-4 text-zinc-200">{t.pag.toFixed(1)}</td>
                    <td className={`py-2 pr-4 font-mono ${t.pfg - t.pag >= 0 ? 'text-lime-400' : 'text-rose-400'}`}>
                      {(t.pfg - t.pag >= 0 ? '+' : '') + (t.pfg - t.pag).toFixed(1)}
                    </td>
                    <td className="py-2 pr-4 text-zinc-200">{t.div}</td>
                    <td className="py-2 pr-4 text-zinc-200">{t.home}</td>
                    <td className="py-2 pr-4 text-zinc-200">{t.away}</td>
                    <td className="py-2 pr-4 text-zinc-200">{t.strk}</td>
                    <td className="py-2 pr-4 text-zinc-200">{t.moves}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="border-t border-zinc-700 mt-12 pt-6 grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
          <div>
            <h3 className="text-xl uppercase tracking-widest font-mono text-zinc-200 mb-2">
              All-Time Wins
            </h3>
            <div className="text-xs uppercase tracking-widest text-zinc-400 mb-4">
              Career Victories
            </div>
            <ul className="space-y-4">
              <li className="border border-zinc-700 bg-zinc-900 p-4 rounded-md shadow-sm font-mono ring-1 ring-zinc-700">Christian <span className="text-zinc-400">— 28 Wins</span></li>
              <li className="border border-zinc-700 bg-zinc-900 p-4 rounded-md shadow-sm font-mono ring-1 ring-zinc-700">Angelo <span className="text-zinc-400">— 25 Wins</span></li>
              <li className="border border-zinc-700 bg-zinc-900 p-4 rounded-md shadow-sm font-mono ring-1 ring-zinc-700">Callie <span className="text-zinc-400">— 24 Wins</span></li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl uppercase tracking-widest font-mono text-zinc-200 mb-2">
              Legendary Streaks
            </h3>
            <div className="text-xs uppercase tracking-widest text-zinc-400 mb-4">
              Unbroken Runs
            </div>
            <ul className="space-y-4">
              <li className="border border-zinc-700 bg-zinc-900 p-4 rounded-md shadow-sm font-mono ring-1 ring-zinc-700">Christian <span className="text-zinc-400">— 8 Game Win Streak (2022)</span></li>
              <li className="border border-zinc-700 bg-zinc-900 p-4 rounded-md shadow-sm font-mono ring-1 ring-zinc-700">Callie <span className="text-zinc-400">— 6 Game Win Streak (2024)</span></li>
              <li className="border border-zinc-700 bg-zinc-900 p-4 rounded-md shadow-sm font-mono ring-1 ring-zinc-700">Angelo <span className="text-zinc-400">— 5 Game Win Streak (2023)</span></li>
            </ul>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}