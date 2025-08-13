import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

export default function Teams() {
  const teams = [
    { id: 1, abbr: 'Nbr.', teamName: 'The Happy Accidents', division: 'World', managers: ['Dustin Carr'], email: null, status: 'Joined', canAddSecondManager: true, canRemoveManager: false },
    { id: 2, abbr: 'ASIP', teamName: "Patty's Pub", division: 'World', managers: ['Angelo Carr'], email: null, status: 'Joined', canAddSecondManager: true, canRemoveManager: true },
    { id: 3, abbr: '8', teamName: 'Building Dynasties', division: 'World', managers: ['Christian Carr'], email: null, status: 'Joined', canAddSecondManager: true, canRemoveManager: true },
    { id: 4, abbr: '1', teamName: 'Team Simon', division: 'San Diego', managers: ['Simon Carr'], email: null, status: 'Joined', canAddSecondManager: true, canRemoveManager: true },
    { id: 5, abbr: '8', teamName: 'No Punt Intended', division: 'San Diego', managers: ['Callie Everson'], email: null, status: 'Joined', canAddSecondManager: true, canRemoveManager: true },
    { id: 6, abbr: '3', teamName: 'The Replacements', division: 'San Diego', managers: ['David Carr', 'David Carr'], email: null, status: 'Joined', canAddSecondManager: false, canRemoveManager: true },
    { id: 7, abbr: '4', teamName: 'Santee Eagles', division: 'San Diego', managers: ['Thomas Carr'], email: null, status: 'Joined', canAddSecondManager: true, canRemoveManager: true },
    { id: 8, abbr: '9', teamName: 'Tyreek it Till you Make it', division: 'World', managers: ['Tariq Muhummad'], email: null, status: 'Joined', canAddSecondManager: true, canRemoveManager: true },
    { id: 9, abbr: 'TM9', teamName: 'Team 9', division: 'World', managers: [], email: 'franciscohchavez5@gmail.com', status: 'Invited', canAddSecondManager: true, canRemoveManager: true },
    { id: 10, abbr: '5', teamName: 'Team Ustav', division: 'San Diego', managers: ['Utsav Pandey'], email: null, status: 'Joined', canAddSecondManager: true, canRemoveManager: true },
    { id: 11, abbr: 'RC', teamName: 'Love thy Nabers', division: 'San Diego', managers: ['Raphael Carr'], email: null, status: 'Joined', canAddSecondManager: true, canRemoveManager: true },
    { id: 12, abbr: 'CTE', teamName: 'Cryo Me a River', division: 'World', managers: ['Daisy Carr'], email: null, status: 'Joined', canAddSecondManager: true, canRemoveManager: true },
  ];

  const slugify = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <NavBar />
      <section className="px-6 py-20 text-center">
        <h1 className="text-5xl font-extrabold uppercase tracking-wide mb-6 text-lime-400">
          Meet the Teams
        </h1>
        <p className="text-lg text-gray-400 mb-12 max-w-3xl mx-auto">
          12 squads. One trophy. Tap a team to view its page.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {teams.map((team) => {
            const uniqueManagers = Array.from(new Set(team.managers || []));
            const primaryManager = uniqueManagers.length ? uniqueManagers[0] : '';
            const slug = slugify(team.teamName || team.abbr || String(team.id));
            const imgSrc = `/images/players/${encodeURIComponent(primaryManager || team.teamName)}.svg`;

            return (
              <Link
                to={`/teams/${slug}`}
                key={team.id}
                className="group relative bg-gray-900 p-6 rounded-xl border border-gray-800 hover:border-lime-500/40 hover:bg-gray-900/80 transition"
              >
                {team.teamName === "Patty's Pub" && (
                  <span className="absolute top-3 right-3 text-[10px] uppercase tracking-widest bg-lime-500/20 border border-lime-500/40 text-lime-300 px-2 py-0.5 rounded flex items-center gap-1">
                    <span aria-hidden>👑</span> Defending Champ
                  </span>
                )}

                <div className="flex items-center gap-4">
                  <img
                    src={imgSrc}
                    alt={`${team.teamName} crest`}
                    loading="lazy"
                    onError={(e) => { e.currentTarget.src = '/images/players/default.svg'; }}
                    className="w-16 h-16 rounded-full object-contain bg-black/40 border border-gray-700"
                  />

                  <div className="text-left">
                    <div className="text-xs uppercase tracking-widest text-gray-400">
                      {(team.abbr || team.id)} • {team.division}
                    </div>
                    <h3 className="text-xl font-extrabold text-white group-hover:text-lime-400 transition-colors">{team.teamName}</h3>
                    <p className="text-sm text-gray-300">
                      {uniqueManagers.length ? `Mgr: ${uniqueManagers.join(', ')}` : 'Mgr: TBD'}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
      <Footer />
    </div>
  );
}