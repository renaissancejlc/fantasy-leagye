import React from 'react';
import { Facebook, Instagram, Youtube, Twitter } from 'lucide-react';
import { FaTiktok } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-black text-white px-6 py-16 font-sans">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 text-sm uppercase tracking-wider">
        <div>
          <h3 className="font-bold text-lime-400 mb-4">League</h3>
          <ul className="space-y-2">
            <li><a href="/" className="hover:text-lime-400 transition">Home</a></li>
            <li><a href="/teams" className="hover:text-lime-400 transition">Teams</a></li>
            <li><a href="/matchups" className="hover:text-lime-400 transition">Matchups</a></li>
            <li><a href="/rankings" className="hover:text-lime-400 transition">Rankings</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-lime-400 mb-4">History</h3>
          <ul className="space-y-2">
            <li><a href="/champions" className="hover:text-lime-400 transition">Champions Gallery</a></li>
            <li><a href="/hall-of-fame" className="hover:text-lime-400 transition">Hall of Fame</a></li>
            <li><a href="/hall-of-shame" className="hover:text-lime-400 transition">Hall of Shame</a></li>
            <li><a href="/timeline" className="hover:text-lime-400 transition">Season Timeline</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-lime-400 mb-4">Extras</h3>
          <ul className="space-y-2">
            <li><a href="/rules" className="hover:text-lime-400 transition">Rules</a></li>
            <li><a href="/power-rankings" className="hover:text-lime-400 transition">Power Rankings</a></li>
            <li><a href="/draft-order" className="hover:text-lime-400 transition">Draft Order</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold text-lime-400 mb-4">Follow Us</h3>
          <ul className="flex space-x-4">
            <li><a href="#" aria-label="Facebook"><Facebook className="w-5 h-5 hover:text-lime-400 transition" /></a></li>
            <li><a href="#" aria-label="Instagram"><Instagram className="w-5 h-5 hover:text-lime-400 transition" /></a></li>
            <li><a href="#" aria-label="YouTube"><Youtube className="w-5 h-5 hover:text-lime-400 transition" /></a></li>
            <li><a href="#" aria-label="TikTok"><FaTiktok className="w-5 h-5 hover:text-lime-400 transition" /></a></li>
            <li><a href="#" aria-label="Twitter"><Twitter className="w-5 h-5 hover:text-lime-400 transition" /></a></li>
          </ul>
        </div>
      </div>

      <div className="mt-12 border-t border-gray-700 pt-6 text-xs text-center text-gray-500">
        © 2025 Fantasy Football League | Designed by <a href="https://vadis.studio" className="text-lime-400 hover:underline">vadis.studio</a>
      </div>
    </footer>
  );
}