import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Trash2, Book } from 'lucide-react';

// Helper hook to get previous value
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

export default function NavBar() {
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const searchRef = useRef(null);

  const players = [
    { name: "Dad", path: "/teams/dad" },
    { name: "Dustin", path: "/teams/dustin" },
    { name: "Callie", path: "/teams/callie" },
    { name: "Angelo", path: "/teams/angelo" },
    { name: "Simon", path: "/teams/simon" },
    { name: "River", path: "/teams/river" },
    { name: "Christian", path: "/teams/christian" },
    { name: "Utsav", path: "/teams/utsav" },
    { name: "Tariq", path: "/teams/tariq" },
    { name: "Daisy", path: "/teams/daisy" },
    { name: "Raphy", path: "/teams/raphy" },
    { name: "Cisco", path: "/teams/cisco" }

  ];

  const filtered = players.filter(player =>
    player.name.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        !event.target.closest('.search-result-link')
      ) {
        setSearchOpen(false);
        setQuery('');
      }
    }
    if (searchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchOpen]);

  return (
    <nav className="w-full bg-black text-white px-6 py-4 shadow-md font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-2xl font-extrabold tracking-wide uppercase hover:text-lime-400 transition-colors">
              League Hub
            </Link>
          </div>

          {/* Hamburger for mobile */}
          <button
            className="md:hidden focus:outline-none"
            onClick={() => setMobileOpen(prev => !prev)}
            aria-label="Toggle navigation menu"
          >
            <div className="space-y-1">
              <span className="block w-6 h-0.5 bg-white"></span>
              <span className="block w-6 h-0.5 bg-white"></span>
              <span className="block w-6 h-0.5 bg-white"></span>
            </div>
          </button>

          <div className="hidden md:flex gap-8 text-sm font-semibold uppercase tracking-widest">
            <Link to="/" className="hover:text-lime-400 transition-colors">Home</Link>
            <Link to="/matchups" className="hover:text-lime-400 transition-colors">Matchups</Link>
            <Link to="/vote" className="hover:text-lime-400 transition-colors">Votes</Link>
            <Link to="/draft" className="hover:text-lime-400 transition-colors">Draft</Link>
            <Link to="/history" className="hover:text-lime-400 transition-colors">History</Link>
            <Link to="/prize" className="hover:text-lime-400 transition-colors">Prize</Link>
          </div>

          <div className="flex items-center gap-4">
            <button
              aria-label="Search"
              onClick={() => setSearchOpen(prev => !prev)}
              className="hover:text-lime-400 transition-colors"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="flex flex-col gap-4 mt-4 md:hidden text-sm font-semibold uppercase tracking-widest">
              <Link to="/" className="hover:text-lime-400 transition-colors">Home</Link>
            <Link to="/matchups" className="hover:text-lime-400 transition-colors">Matchups</Link>
            <Link to="/vote" className="hover:text-lime-400 transition-colors">Votes</Link>
            <Link to="/draft" className="hover:text-lime-400 transition-colors">Draft</Link>
            <Link to="/history" className="hover:text-lime-400 transition-colors">History</Link>
            <Link to="/prize" className="hover:text-lime-400 transition-colors">Prize</Link>
          </div>
        )}

        {searchOpen && (
          <div className="mt-4">
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search for a player..."
              className="w-full bg-gray-900 text-white border border-lime-400 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-lime-400"
            />
            {query && (
              <ul className="bg-gray-800 border border-lime-400 mt-2 rounded-md max-h-48 overflow-y-auto text-sm text-white">
                {filtered.length > 0 ? (
                  filtered.map(player => (
                    <li key={player.name}>
                      <Link
                        to={player.path}
                        className="block px-4 py-2 hover:bg-lime-600 hover:text-black transition-colors search-result-link"
                        onClick={() => {
                          setQuery('');
                          setSearchOpen(false);
                        }}
                      >
                        {player.name}
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-gray-400 italic">No matches found</li>
                )}
              </ul>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}