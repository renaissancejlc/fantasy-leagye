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
          League directory with teams, divisions, and manager status. More visuals coming soon.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {teams.map((team) => {
            const hasEmail = Boolean(team.email);
            const primaryManager = team.managers && team.managers.length ? team.managers[0] : null;
            const otherManagers = team.managers && team.managers.length > 1 ? team.managers.slice(1) : [];
            const statusClasses = team.status === 'Joined'
              ? 'bg-lime-500/20 text-lime-300 border border-lime-500/30'
              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30';
            const slug = slugify(team.teamName || team.abbr || String(team.id));

            return (
              <Link
                to={`/teams/${slug}`}
                key={team.id}
                className="bg-gray-900 p-6 rounded-lg shadow-xl hover:bg-gray-800 transition group border border-gray-800"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs uppercase tracking-widest px-2 py-1 rounded bg-gray-800 text-gray-300 border border-gray-700">{team.abbr || team.id}</span>
                  <span className={`text-xs px-2 py-1 rounded ${statusClasses}`}>{team.status}</span>
                </div>

                <h3 className="text-2xl font-extrabold text-white mb-1 group-hover:text-lime-400 transition-colors">{team.teamName}</h3>
                <p className="text-sm text-gray-400 mb-4">Division: <span className="text-gray-200">{team.division}</span></p>

                <div className="mb-4">
                  <p className="text-sm text-gray-400">Manager{(team.managers?.length || 0) > 1 ? 's' : ''}:</p>
                  {primaryManager ? (
                    <p className="font-semibold text-white">{primaryManager}</p>
                  ) : (
                    <p className="text-gray-500 italic">—</p>
                  )}
                  {otherManagers.map((m, i) => (
                    <p className="font-semibold text-white" key={i + '-' + m}>{m}</p>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    type="button"
                    onClick={(e) => { e.preventDefault(); if (hasEmail) window.location.href = `mailto:${team.email}`; }}
                    className={`text-xs px-3 py-2 rounded border ${hasEmail ? 'border-lime-500 text-lime-300 hover:bg-lime-500/10' : 'border-gray-700 text-gray-500 cursor-not-allowed'}`}
                    disabled={!hasEmail}
                    aria-disabled={!hasEmail}
                  >
                    Send Email
                  </button>

                  {team.canAddSecondManager && (
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); alert(`Add 2nd Manager for ${team.teamName}`); }}
                      className="text-xs px-3 py-2 rounded border border-gray-700 text-gray-300 hover:bg-gray-800"
                    >
                      ADD 2ND MANAGER
                    </button>
                  )}

                  {team.canRemoveManager && (
                    <button
                      type="button"
                      onClick={(e) => { e.preventDefault(); const ok = window.confirm(`Remove manager(s) for ${team.teamName}?`); if (ok) alert('Manager removed (stub)'); }}
                      className="text-xs px-3 py-2 rounded border border-red-500/60 text-red-300 hover:bg-red-500/10"
                    >
                      REMOVE MANAGER
                    </button>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="overflow-x-auto mt-12">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left uppercase text-gray-400">
                <th className="py-2 pr-4">#</th>
                <th className="py-2 pr-4">Abbrv</th>
                <th className="py-2 pr-4">Team Name</th>
                <th className="py-2 pr-4">Division</th>
                <th className="py-2 pr-4">Manager(s)</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team, idx) => (
                <tr key={`row-${team.id}`} className={idx % 2 === 0 ? 'bg-gray-900/60' : 'bg-gray-900/30'}>
                  <td className="py-3 pr-4 align-top text-gray-300">{team.id}</td>
                  <td className="py-3 pr-4 align-top text-gray-200">{team.abbr || team.id}</td>
                  <td className="py-3 pr-4 align-top text-white font-semibold">{team.teamName}</td>
                  <td className="py-3 pr-4 align-top text-gray-200">{team.division}</td>
                  <td className="py-3 pr-4 align-top text-gray-200">{team.managers && team.managers.length ? team.managers.join(', ') : '—'}</td>
                  <td className="py-3 pr-4 align-top">{team.email ? <a href={`mailto:${team.email}`} className="text-lime-400 underline">{team.email}</a> : <span className="text-gray-500">—</span>}</td>
                  <td className="py-3 pr-4 align-top">
                    <span className={`text-xs px-2 py-1 rounded ${team.status === 'Joined' ? 'bg-lime-500/20 text-lime-300 border border-lime-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}`}>{team.status}</span>
                  </td>
                  <td className="py-3 pr-4 align-top">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => team.email && (window.location.href = `mailto:${team.email}`)}
                        className={`text-xs px-2 py-1 rounded border ${team.email ? 'border-lime-500 text-lime-300 hover:bg-lime-500/10' : 'border-gray-700 text-gray-500 cursor-not-allowed'}`}
                        disabled={!team.email}
                        aria-disabled={!team.email}
                      >
                        Send Email
                      </button>
                      {team.canAddSecondManager && (
                        <button
                          type="button"
                          onClick={() => alert(`Add 2nd Manager for ${team.teamName}`)}
                          className="text-xs px-2 py-1 rounded border border-gray-700 text-gray-300 hover:bg-gray-800"
                        >
                          Add 2nd Manager
                        </button>
                      )}
                      {team.canRemoveManager && (
                        <button
                          type="button"
                          onClick={() => { const ok = window.confirm(`Remove manager(s) for ${team.teamName}?`); if (ok) alert('Manager removed (stub)'); }}
                          className="text-xs px-2 py-1 rounded border border-red-500/60 text-red-300 hover:bg-red-500/10"
                        >
                          Remove Manager
                        </button>
                      )}
                    </div>
                  </td>
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