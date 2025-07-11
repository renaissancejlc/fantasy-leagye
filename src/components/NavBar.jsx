import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search } from 'lucide-react';

export default function NavBar() {
  return (
    <nav className="w-full border-b border-black/10 bg-white font-serif tracking-wide px-6 py-6">
      <div className="flex justify-between items-center w-full max-w-7xl mx-auto">
        <button aria-label="Search" className="text-black">
          <Search className="w-5 h-5 hover:opacity-70 transition" />
        </button>
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
        <ul className="flex space-x-8 sm:space-x-16 text-sm text-gray-600 tracking-wide font-light mt-4 font-sans uppercase px-4 sm:px-0">
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