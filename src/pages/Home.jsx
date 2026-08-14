import React, { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

const DRAFT_START = new Date('2026-08-15T09:30:00-07:00');

function getTimeLeft() {
  const total = Math.max(0, DRAFT_START.getTime() - Date.now());
  return {
    total,
    days: Math.floor(total / 86400000),
    hours: Math.floor((total / 3600000) % 24),
    minutes: Math.floor((total / 60000) % 60),
    seconds: Math.floor((total / 1000) % 60),
  };
}

function FlashLabel({ children, tone = 'lime' }) {
  const colors = tone === 'red'
    ? 'border-red-500 text-red-400 bg-red-500/10'
    : 'border-lime-400 text-lime-300 bg-lime-400/10';

  return (
    <div className={`inline-flex border px-3 py-1 text-xs font-black uppercase tracking-[0.25em] ${colors}`}>
      {children}
    </div>
  );
}

export default function Home() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);

  useEffect(() => {
    const interval = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black font-sans text-white">
      <NavBar />

      {/* NEWS FLASH: SEASON LAUNCH */}
      <section className="relative border-b border-zinc-800 bg-gradient-to-br from-black via-zinc-950 to-lime-950/40 px-6 py-24 md:py-32">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 md:grid-cols-[1.3fr_0.7fr]">
          <div>
            <FlashLabel>Breaking · 2026 Season</FlashLabel>
            <h1 className="mt-6 text-5xl font-black uppercase leading-[0.92] tracking-tight md:text-8xl">
              A New Era<br />
              <span className="text-lime-400">Starts Now.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-zinc-300 md:text-xl">
              Twelve teams. Keeper rosters. A rookie-only draft. The Carr League is back—and every move from here shapes the next championship run.
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <a href="/draft" className="rounded bg-lime-400 px-7 py-4 text-sm font-black uppercase tracking-wider text-black transition hover:bg-lime-300">
                Enter Draft Room
              </a>
              <a href="https://discord.gg/Q9JufrVbq" target="_blank" rel="noopener noreferrer" className="rounded border border-zinc-600 px-7 py-4 text-sm font-black uppercase tracking-wider text-white transition hover:border-lime-400 hover:text-lime-300">
                Join League Discord
              </a>
            </div>
          </div>
          <div className="flex justify-center">
            <div className="relative flex h-72 w-72 items-center justify-center md:h-80 md:w-80">
              <div className="absolute inset-0 rounded-full bg-lime-400/30 blur-3xl animate-pulse" />
              <img src="/images/logo.png" alt="Carr League logo" className="relative z-10 h-64 w-64 object-contain md:h-72 md:w-72" />
            </div>
          </div>
        </div>
      </section>

      {/* NEWS FLASH: DRAFT */}
      <section className="border-b border-zinc-800 bg-zinc-950 px-6 py-24">
        <div className="mx-auto max-w-6xl text-center">
          <FlashLabel tone="red">Draft Alert</FlashLabel>
          <h2 className="mt-6 text-4xl font-black uppercase tracking-tight md:text-6xl">
            Saturday, August 15<br />
            <span className="text-lime-400">9:30 AM Pacific</span>
          </h2>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-zinc-300">
            This is a three-round, rookie-only keeper draft in fixed order. It is not a snake draft, participation is optional, and every manager gets up to 12 continuous hours to pick or pass.
          </p>

          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-2 gap-3 md:grid-cols-4">
            {[
              ['12', 'Teams'],
              ['3', 'Rounds'],
              ['36', 'Possible Picks'],
              ['12 HR', 'Pick Clock'],
            ].map(([value, label]) => (
              <div key={label} className="border border-zinc-700 bg-black p-5">
                <div className="text-3xl font-black text-lime-400 md:text-4xl">{value}</div>
                <div className="mt-2 text-xs uppercase tracking-widest text-zinc-500">{label}</div>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <div className="text-xs font-bold uppercase tracking-[0.3em] text-zinc-500">Draft Countdown</div>
            {timeLeft.total > 0 ? (
              <div className="mt-3 font-mono text-3xl font-bold tracking-wider text-white md:text-5xl">
                {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
              </div>
            ) : (
              <div className="mt-3 text-4xl font-black uppercase text-lime-400">The Draft Is Live</div>
            )}
          </div>

          <a href="/draft" className="mt-10 inline-block rounded bg-lime-400 px-8 py-4 text-sm font-black uppercase tracking-wider text-black transition hover:bg-lime-300">
            View Order &amp; Draft
          </a>
        </div>
      </section>

      {/* NEWS FLASH: DRAFT ORDER */}
      <section className="border-b border-zinc-800 bg-black px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <FlashLabel>Official Order · Every Round</FlashLabel>
          <div className="mt-7 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div>
              <h2 className="text-4xl font-black uppercase leading-tight md:text-5xl">No Snake.<br /><span className="text-lime-400">No Reset.</span></h2>
              <p className="mt-5 text-zinc-400">The same order repeats in rounds one, two, and three. Be ready when your name hits the clock.</p>
            </div>
            <ol className="grid grid-cols-1 gap-px overflow-hidden border border-zinc-800 bg-zinc-800 sm:grid-cols-2">
              {['River', 'Julio', 'Callie', 'Kevin', 'Dustin', 'Raphy', 'Daisy', 'Tariq', 'Dad', 'Christian', 'Utsav', 'Simon'].map((name, index) => (
                <li key={name} className="flex items-center gap-4 bg-zinc-950 px-5 py-4">
                  <span className="w-8 font-mono text-lime-400">{String(index + 1).padStart(2, '0')}</span>
                  <span className="font-bold uppercase tracking-wide text-zinc-100">{name}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* NEWS FLASH: TRANSACTION FREEZE */}
      <section className="border-b border-red-500/30 bg-gradient-to-r from-red-950/30 via-black to-black px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <FlashLabel tone="red">Roster Bulletin</FlashLabel>
          <h2 className="mt-6 text-4xl font-black uppercase md:text-5xl">Free Agency Pauses After the Draft</h2>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-zinc-300">
            No free-agent pickups are allowed until 24 hours after the final draft pick or pass. Drops are still allowed. When transactions resume, the league returns to the standard budget-and-bidding system, monitored in ESPN.
          </p>
          <a href="/rules" className="mt-7 inline-block text-sm font-black uppercase tracking-wider text-lime-400 underline decoration-lime-400/40 underline-offset-8 hover:text-lime-300">
            Review League Rules
          </a>
        </div>
      </section>

      {/* NEWS FLASH: KICKOFF */}
      <section className="border-b border-zinc-800 bg-zinc-950 px-6 py-24 text-center">
        <div className="mx-auto max-w-5xl">
          <FlashLabel>Next Stop · Week One</FlashLabel>
          <h2 className="mt-6 text-4xl font-black uppercase tracking-tight md:text-6xl">
            NFL Kickoff<br /><span className="text-lime-400">September 9 · 5:20 PM PT</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-300">
            The 2026 regular season opens Wednesday night. League voting stays open through the offseason and locks at kickoff—settle league business before the games begin.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <a href="/vote" className="rounded bg-lime-400 px-7 py-4 text-sm font-black uppercase tracking-wider text-black transition hover:bg-lime-300">League Voting</a>
            <a href="/history" className="rounded border border-zinc-600 px-7 py-4 text-sm font-black uppercase tracking-wider text-white transition hover:border-lime-400 hover:text-lime-300">League History</a>
          </div>
        </div>
      </section>

      {/* NEWS FLASH: CHAMPION */}
      <section className="bg-black px-6 py-24 text-center">
        <div className="mx-auto max-w-4xl border border-lime-400/40 bg-gradient-to-b from-lime-950/30 to-zinc-950 p-8 md:p-14">
          <FlashLabel>Defending Champion</FlashLabel>
          <div className="mt-7 text-6xl">🏆</div>
          <h2 className="mt-4 text-4xl font-black uppercase md:text-6xl">Team Simon</h2>
          <p className="mt-4 text-zinc-400">The 2025 title belongs to Simon. The chase begins again now.</p>
          <a href="/history" className="mt-8 inline-block text-sm font-black uppercase tracking-wider text-lime-400 hover:text-lime-300">Relive the 2025 Season →</a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
