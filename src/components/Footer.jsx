import React from 'react';
import { Facebook, Instagram, Youtube, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-white px-8 py-24 font-serif tracking-wider leading-relaxed">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 text-sm">
        <div>
          <h3 className="font-bold uppercase mb-4">Follow</h3>
          <ul className="flex space-x-4">
            <li>
              <a href="#" aria-label="Facebook">
                <Facebook className="h-5 w-5 hover:text-gray-400 transition" />
              </a>
            </li>
            <li>
              <a href="#" aria-label="Instagram">
                <Instagram className="h-5 w-5 hover:text-gray-400 transition" />
              </a>
            </li>
            <li>
              <a href="#" aria-label="YouTube">
                <Youtube className="h-5 w-5 hover:text-gray-400 transition" />
              </a>
            </li>
            <li>
              {/* TikTok icon not available in Lucide, consider using a custom SVG or another icon set */}
              <span className="h-5 w-5 bg-white rounded-sm inline-block" title="TikTok"></span>
            </li>
            <li>
              <a href="#" aria-label="Twitter">
                <Twitter className="h-5 w-5 hover:text-gray-400 transition" />
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold uppercase mb-2">Doug Cooper</h3>
          <ul className="space-y-1">
            <li><a href="#" className="hover:underline">About Doug</a></li>
            <li><a href="#" className="hover:underline">My Story</a></li>
            <li><a href="#" className="hover:underline">Press</a></li>
            <li><a href="#" className="hover:underline">Shop Doug</a></li>
            <li><a href="#" className="hover:underline">Books</a></li>
            <li><a href="#" className="hover:underline">Connect with Doug</a></li>
            <li><a href="#" className="hover:underline">Events</a></li>
            <li><a href="#" className="hover:underline">Doug Cooper Live</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold uppercase mb-2">Support</h3>
          <ul className="space-y-1">
            <li><a href="#" className="hover:underline">Help</a></li>
            <li><a href="#" className="hover:underline">Contact</a></li>
            <li><a href="#" className="hover:underline">Shipping &amp; Returns</a></li>
            <li><a href="#" className="hover:underline">FAQ</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold uppercase mb-2">Legal</h3>
          <ul className="space-y-1">
            <li><a href="/terms-of-use" className="hover:underline">Terms of Use</a></li>
            <li><a href="/privacy-policy" className="hover:underline">Privacy Policy</a></li>
          </ul>
        </div>
      </div>

      <div className="mt-20 border-t border-gray-700 pt-6 text-xs text-center text-gray-400">
        © 2025, Doug Cooper | Website designed & developed by <a href="https://vadis.studio" className="hover:underline">vadis.studio</a>
      </div>
    </footer>
  );
}