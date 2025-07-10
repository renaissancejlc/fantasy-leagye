import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search } from 'lucide-react';

export default function NavBar() {
  return (
    <nav className="w-full flex justify-between items-center px-8 py-6 border-b border-black/10 bg-white font-sans tracking-wider shadow-sm">
      <div className="text-3xl font-serif font-medium text-black lowercase tracking-tight">
        Doug Cooper
      </div>
      <div className="flex items-center space-x-8 text-base text-black">
        <ul className="flex space-x-8">
          <li className="relative cursor-pointer hover:text-black hover:after:absolute hover:after:left-0 hover:after:bottom-0 hover:after:h-[1px] hover:after:w-full hover:after:bg-black transition-all">
            <Link to="/">Home</Link>
          </li>
          <li className="relative cursor-pointer hover:text-black hover:after:absolute hover:after:left-0 hover:after:bottom-0 hover:after:h-[1px] hover:after:w-full hover:after:bg-black transition-all">
            <Link to="/about">About</Link>
          </li>
          <li className="relative cursor-pointer hover:text-black hover:after:absolute hover:after:left-0 hover:after:bottom-0 hover:after:h-[1px] hover:after:w-full hover:after:bg-black transition-all">
            <Link to="/books">Books</Link>
          </li>

          <li className="relative cursor-pointer hover:text-black hover:after:absolute hover:after:left-0 hover:after:bottom-0 hover:after:h-[1px] hover:after:w-full hover:after:bg-black transition-all">
            <Link to="/contact">Contact</Link>
          </li>        <li className="relative cursor-pointer hover:text-black hover:after:absolute hover:after:left-0 hover:after:bottom-0 hover:after:h-[1px] hover:after:w-full hover:after:bg-black transition-all">Learn</li>

        </ul>
        <div className="flex items-center space-x-4 text-black">
          <button aria-label="Search">
            <Search className="w-5 h-5 hover:opacity-70 transition" />
          </button>
          <button aria-label="Cart" className="relative">
            <ShoppingCart className="w-5 h-5 hover:opacity-70 transition" />
            <span className="absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">
              0
            </span>
          </button>
        </div>
      {/* end of nav links + icons wrapper */}
      </div>
    </nav>
  );
}