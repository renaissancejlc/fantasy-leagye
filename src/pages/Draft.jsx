import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
// const playersPicks = draftOrder.map(name => ({
//   name,
//   picks: Array.from({ length: 15 }, (_, i) => '—')
// }));

const normalize = str => str?.toLowerCase().replace(/[^\w\s]/gi, '').replace(/\s+/g, ' ').trim();

export default function DraftPage() {
  const [timeLeft, setTimeLeft] = useState({
    total: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [playersPicks, setPlayersPicks] = useState([]);
  const [duplicatePicks, setDuplicatePicks] = useState(new Set());

  useEffect(() => {
    const draftDate = new Date('2025-08-14T09:30:00-07:00');
    const updateCountdown = () => {
      const now = new Date();
      const diff = draftDate - now;

      if (diff <= 0) {
        setTimeLeft({ total: 0 });
        return;
      }

      const total = diff;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ total, days, hours, minutes, seconds });
    };

    const timer = setInterval(updateCountdown, 1000);
    updateCountdown();
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchDraftData = () => {
      axios.get('https://api.sheetbest.com/sheets/2d64a4bb-aedf-478d-abb1-504cd6fa2d1f')
        .then(response => {
          const formatted = response.data.map(row => ({
            name: row.Player,
            picks: Object.entries(row)
              .filter(([key]) => key !== 'Player')
              .map(([, value]) => value || '—')
          }));
          setPlayersPicks(formatted);

          const allPicks = formatted
            .flatMap(player => player.picks)
            .filter(pick => pick && pick !== '—')
            .map(normalize);

          const duplicates = allPicks.filter((item, index, self) => self.indexOf(item) !== index);
          setDuplicatePicks(new Set(duplicates));
        })
        .catch(error => console.error("Error fetching draft data:", error));
    };

    fetchDraftData(); // initial fetch
    const interval = setInterval(fetchDraftData, 10000); // poll every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <NavBar />

      <section className="px-6 py-20 text-center max-w-7xl mx-auto bg-gradient-to-br from-black via-gray-900 to-black rounded-2xl shadow-2xl border border-lime-500">
        <h1 className="text-6xl md:text-7xl font-extrabold uppercase tracking-wider mb-6 text-white drop-shadow-[0_0_20px_rgba(0,255,0,0.5)]">
          2025 Draft Day
        </h1>
        <div className="text-center mb-10">
          <div className="inline-block bg-red-600 bg-opacity-20 border-l-4 border-red-500 px-4 py-3 rounded-md shadow text-left text-sm sm:text-base max-w-xl mx-auto">
            <strong className="text-red-400 font-semibold block mb-1">🚨 Draft Date Updated</strong>
            <span className="text-white font-medium">
              The draft has been moved to <span className="text-lime-300 font-bold">Thursday, August 14 · 9:30 AM PST</span>. Please mark your calendars!
            </span>
          </div>
        </div>

        <div className="mt-14 mb-20 text-center">
          <h2 className="text-4xl md:text-5xl uppercase font-extrabold text-lime-300 tracking-tight mb-4">
            Draft Countdown
          </h2>
          {timeLeft.total > 0 ? (
            <div className="flex justify-center gap-8 md:gap-14 text-4xl md:text-5xl font-mono text-white">
              <div className="text-center">
                <div className="text-lime-300">{timeLeft.days}</div>
                <div className="text-xs md:text-sm uppercase text-gray-400">Days</div>
              </div>
              <div className="text-center">
                <div className="text-lime-300">{timeLeft.hours}</div>
                <div className="text-xs md:text-sm uppercase text-gray-400">Hours</div>
              </div>
              <div className="text-center">
                <div className="text-lime-300">{timeLeft.minutes}</div>
                <div className="text-xs md:text-sm uppercase text-gray-400">Minutes</div>
              </div>
              <div className="text-center">
                <div className="text-lime-300">{timeLeft.seconds}</div>
                <div className="text-xs md:text-sm uppercase text-gray-400">Seconds</div>
              </div>
            </div>
          ) : (
            <div className="text-5xl font-black text-red-500">The Draft Has Begun!</div>
          )}
        </div>

        <div className="max-w-md mx-auto">
          <a
            href="https://docs.google.com/spreadsheets/d/1NDVTuhiF8lpWKFLAvP83Llu8Owkq25bx3bHKvvC4bag/edit?usp=sharing"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-black text-lime-300 font-bold uppercase px-10 py-3 rounded-full shadow-xl border-2 border-lime-400 hover:bg-lime-400 hover:text-black hover:scale-105 transition-all tracking-wide"
          >
            Edit Draft Picks Sheet
          </a>
          <p className="mt-4 text-gray-400 text-sm italic">
            Draft record will be automatically populated from the sheet.
          </p>
          <p className="mt-2 text-gray-400 text-sm italic">
            After making your draft pick, please notify the league in the group message to keep everyone updated in real-time.
          </p>
          <br></br>
        </div>

        <div className="overflow-x-auto max-w-full mb-16 bg-gradient-to-r from-black via-gray-900 to-black p-2 rounded-xl">
          <h2 className="text-3xl font-bold text-white mb-6 uppercase tracking-wide">Player Picks</h2>
          <p className="text-sm text-gray-300 mb-2 italic">
            Duplicate picks will appear <span className="text-red-400 font-semibold">highlighted in red</span>.
          </p>
          <table className="min-w-[1200px] w-full bg-black/60 text-white font-mono backdrop-blur-md">
            <thead>
              <tr className="bg-lime-400/80 text-black uppercase font-bold text-xs tracking-wide">
                <th className="px-3 py-2 text-base tracking-tight text-center">Player</th>
                {Array.from({ length: 15 }, (_, i) => (
                  <th key={i} className="px-3 py-2 text-base tracking-tight text-center">Round {i + 1}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {playersPicks.map(({ name, picks }, idx) => (
                <tr key={idx} className="even:bg-gray-800/50 hover:bg-lime-300/10 hover:scale-[1.01] transition-transform duration-150">
                  <td className="px-3 py-2 font-semibold">{name}</td>
                  {picks.map((pick, roundIdx) => {
                    const isDuplicate = duplicatePicks.has(normalize(pick));
                    return (
                      <td
                        key={roundIdx}
                        className={`px-3 py-2 text-center ${isDuplicate ? 'bg-red-600 text-white font-bold' : ''}`}
                      >
                        {pick}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
           <div className="text-center text-sm text-gray-400 italic mb-6">
        Note: This is a <span className="text-lime-400 font-semibold">snake order</span> draft.
      </div>
        </div>

      </section>



      <Footer />
    </div>
  );
}
