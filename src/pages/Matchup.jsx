import React from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';

export default function Matchup() {
  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <NavBar />
      <section className="px-6 py-20 text-center font-serif">
        {/* Headline Section */}
       <h1 className="text-5xl font-extrabold uppercase tracking-wide mb-6 text-lime-400">
          Matchup Report
        </h1>
        <div className="text-xs uppercase tracking-widest font-semibold text-lime-300 mb-12" style={{fontVariantCaps: 'small-caps'}}>
          REPORT BY CARR LEAGUE ANALYSTS
        </div>

        {/* Week 1 Matchups Section */}
        <div className="mb-16">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { teamA: 'Christian', teamB: 'Kevin' },
              { teamA: 'Callie', teamB: 'Tariq' },
              { teamA: 'Simon', teamB: 'Dustin' }
            ].map((matchup, index) => (
              <div
                key={index}
                className="border-2 border-black bg-white text-black p-4 font-serif"
              >
                <div className="text-xl font-bold mb-1 border-b border-black pb-1">
                  {matchup.teamA} vs. {matchup.teamB}
                </div>
                <div className="text-sm font-semibold mb-2">Projected showdown</div>
                <p className="text-xs italic">
                  Expect sparks to fly as these two teams battle it out in Week 1.
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Past & Future Matchups Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left font-serif">
          <div>
            <h3 className="text-3xl font-bold text-white mb-4 border-b-2 border-gray-700 pb-2 uppercase tracking-tight">
              Past Matchups
            </h3>
            <div className="space-y-6">
              <p className="text-gray-400 italic">No completed matchups yet. Check back after Week 1!</p>
            </div>
          </div>

          <div>
            <h3 className="text-3xl font-bold text-white mb-4 border-b-2 border-gray-700 pb-2 uppercase tracking-tight">
              Future Matchups
            </h3>
            <div className="space-y-6">
              {[...Array(10)].map((_, weekIndex) => (
                <div key={weekIndex}>
                  <h4 className="text-xl font-bold text-white mb-2 border-b border-gray-600 pb-1">
                    Week {weekIndex + 1}
                  </h4>
                  <ul className="space-y-4">
                    <li className="bg-gray-900 border-l-4 border-blue-500 p-5 rounded-md shadow text-white font-mono font-semibold">
                      <div className="text-lg font-bold">Matchup 1A vs. Matchup 1B</div>
                      <div className="text-xs uppercase tracking-widest font-mono font-extrabold mt-1">
                        KICKOFF:&nbsp;&nbsp;&nbsp;TBD
                      </div>
                    </li>
                    <li className="bg-gray-900 border-l-4 border-blue-500 p-5 rounded-md shadow text-white font-mono font-semibold">
                      <div className="text-lg font-bold">Matchup 2A vs. Matchup 2B</div>
                      <div className="text-xs uppercase tracking-widest font-mono font-extrabold mt-1">
                        KICKOFF:&nbsp;&nbsp;&nbsp;TBD
                      </div>
                    </li>
                  </ul>
                  {weekIndex < 9 && <hr className="border-gray-700 my-6" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}