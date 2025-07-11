import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search } from 'lucide-react';

export default function NavBar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searchRef = useRef(null);

  const books = [
    {
      title: "How to Become the Miracle the World is Waiting For",
      path: "/become-the-miracle"
    }
  ];

  const filtered = books.filter(book =>
    book.title.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
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
    <nav className="w-full border-b border-black/10 bg-white font-serif tracking-wide px-6 py-6">
      <div className="flex justify-between items-center w-full max-w-7xl mx-auto">
        <div ref={searchRef} className="relative search-container">
          <div className="flex items-center gap-2 transition-all duration-300 ease-in-out">
            <button
              aria-label="Search"
              className="text-black"
              onClick={() => setSearchOpen(prev => !prev)}
            >
              <Search className="w-5 h-5 hover:opacity-70 transition" />
            </button>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search books..."
              className={`transition-all duration-300 ease-in-out border border-black px-4 py-2 text-sm bg-white text-black rounded-full focus:outline-none focus:ring-2 focus:ring-black
                ${searchOpen ? "w-64 opacity-100" : "w-0 opacity-0 overflow-hidden"}`}
              style={{ minWidth: 0 }}
            />
          </div>
          {searchOpen && query && (
            <ul className="absolute top-full left-0 mt-2 w-64 bg-white border border-black rounded-lg shadow-lg max-h-48 overflow-y-auto text-sm z-50">
              {filtered.length > 0 ? (
                filtered.map(book => (
                  <li key={book.title}>
                    <Link
                      to={book.path}
                      className="block px-4 py-2 hover:bg-black hover:text-white transition-colors duration-200"
                      onClick={() => {
                        setQuery('');
                        setSearchOpen(false);
                      }}
                    >
                      {book.title}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-gray-400 italic">No matches found</li>
              )}
            </ul>
          )}
        </div>
        <div className="text-[2.25rem] tracking-[0.25em] font-light font-[Playfair_Display] uppercase text-black text-center site-title">
          Doug Cooper
        </div>
        <button aria-label="Cart" className="relative text-black">
          <ShoppingCart className="w-5 h-5 hover:opacity-70 transition" />
          <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
            0
          </span>
        </button>
      </div>


      <div className="flex justify-center overflow-x-auto sm:overflow-visible">
        <ul className="flex space-x-4 sm:space-x-16 text-sm text-gray-600 tracking-wide font-light mt-4 font-sans uppercase px-2 sm:px-0">
          <li className="relative cursor-pointer hover:text-black hover:after:absolute hover:after:left-0 hover:after:bottom-0 hover:after:h-[1px] hover:after:w-full hover:after:bg-black transition-all duration-200 ease-in-out">
            <Link to="/">Home</Link>
          </li>
          <li className="relative cursor-pointer hover:text-black hover:after:absolute hover:after:left-0 hover:after:bottom-0 hover:after:h-[1px] hover:after:w-full hover:after:bg-black transition-all duration-200 ease-in-out">
            <Link to="/about">About</Link>
          </li>
          <li className="relative cursor-pointer hover:text-black hover:after:absolute hover:after:left-0 hover:after:bottom-0 hover:after:h-[1px] hover:after:w-full hover:after:bg-black transition-all duration-200 ease-in-out">
            <Link to="/books">Books</Link>
          </li>
          <li className="relative cursor-pointer hover:text-black hover:after:absolute hover:after:left-0 hover:after:bottom-0 hover:after:h-[1px] hover:after:w-full hover:after:bg-black transition-all duration-200 ease-in-out">
            <Link to="/events">Events</Link>
          </li>
          <li className="relative cursor-pointer hover:text-black hover:after:absolute hover:after:left-0 hover:after:bottom-0 hover:after:h-[1px] hover:after:w-full hover:after:bg-black transition-all duration-200 ease-in-out">
            <Link to="/contact">Contact</Link>
          </li>
          {/* <li className="relative cursor-pointer hover:text-black hover:after:absolute hover:after:left-0 hover:after:bottom-0 hover:after:h-[1px] hover:after:w-full hover:after:bg-black transition-all duration-200 ease-in-out">Learn</li> */}
        </ul>
      </div>
    </nav>
  );
}