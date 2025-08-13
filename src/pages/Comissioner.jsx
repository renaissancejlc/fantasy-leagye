import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import { Trophy, ScrollText, DollarSign, AlertTriangle } from 'lucide-react';

const members = [
  'Dad',
  'Dustin',
  'Callie',
  'Angelo',
  'Simon',
  'River',
  'Christian',
  'Utsav',
  'Tariq',
  'Daisy',
  'Raphy',
  'Cisco'

];

export default function CommissionerInfo() {
  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <NavBar />

      <section className="px-6 py-20 max-w-4xl mx-auto">
        <h1 className="text-5xl font-extrabold uppercase tracking-wide mb-6 text-lime-400">
          Carr League Commissioner HQ
        </h1>
        <p className="text-lg text-gray-400 mb-12 max-w-3xl mx-auto">
          Your mission control for all things Carr League. Stay on top of key dates, reminders, and league integrity.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-200">
          <div className="bg-zinc-900 p-6 rounded-xl shadow-lg border border-lime-400/20 hover:shadow-lime-400/20 transition">
            <h2 className="text-2xl font-bold text-lime-300 mb-2">📆 Key Dates & Reminders</h2>
            <ul className="list-disc list-inside space-y-2 text-base text-gray-300">
              <li><strong>Aug 10:</strong> Send group text reminder about dues + confirm team participation.</li>
              <li><strong>Aug 18:</strong> Final deadline to collect dues. Update status board.</li>
              <li><strong>Aug 20:</strong> Confirm draft date with all players.</li>
              <li><strong>Aug 25:</strong> 1-week text reminder for live draft day.</li>
              <li><strong>Sept 1:</strong> Text 24-hour reminder for draft, share final draft order.</li>
              <li><strong>Sept 2:</strong> LIVE DRAFT DAY — send Zoom/ESPN invite early morning.</li>
            </ul>
          </div>
          <div className="bg-zinc-900 p-6 rounded-xl shadow-lg border border-lime-400/20 hover:shadow-lime-400/20 transition">
            <h2 className="text-2xl font-bold text-lime-300 mb-2">💸 Dues Management</h2>
            <ul className="list-disc list-inside space-y-2 text-base text-gray-300">
              <li>Each player owes <strong>$20</strong>.</li>
              <li>Track payments (Venmo: <a href="https://venmo.com/reny-carr" target="_blank" className="underline text-lime-400"> @reny-carr</a>).</li>
              <li>Remind unpaid players on Aug 15 and Aug 18.</li>
              <li><span className="text-red-400 font-semibold">Penalty:</span> If not paid by Aug 18, player loses 1st round pick.</li>
            </ul>
          </div>
          <div className="bg-zinc-900 p-6 rounded-xl shadow-lg border border-lime-400/20 hover:shadow-lime-400/20 transition">
            <h2 className="text-2xl font-bold text-lime-300 mb-2">🏆 League Legacy Duties</h2>
            <ul className="list-disc list-inside space-y-2 text-base text-gray-300">
              <li>Ensure Champion Trophy and Plaque are engraved by Oct 15.</li>
              <li>Announce last year’s winner with photo during draft kickoff.</li>
              <li>Store trophy safely and clean before next handoff.</li>
            </ul>
          </div>
          <div className="bg-zinc-900 p-6 rounded-xl shadow-lg border border-lime-400/20 hover:shadow-lime-400/20 transition">
            <h2 className="text-2xl font-bold text-lime-300 mb-2">🧠 Commissioner To-Do List</h2>
            <ul className="list-disc list-inside space-y-2 text-base text-gray-300">
              <li>Update team names + owners in ESPN before draft.</li>
              <li>Set draft rules and scoring settings by Aug 22.</li>
              <li>Design fun draft order reveal (optional bonus points for drama).</li>
              <li>Post draft recap + trash talk kickoff in group thread.</li>
              <li>Be fair, firm, and funny. That’s the Carr League way.</li>
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}