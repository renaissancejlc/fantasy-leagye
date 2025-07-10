import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";


const Events = () => {
  const [engagements, setEngagements] = useState([]);

  useEffect(() => {
    fetch("https://api.sheetbest.com/sheets/2f71a211-d232-420f-a739-64dc805ca91c")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched engagements:", data); // Added for debug
        setEngagements(data);
      })
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  return (
    <>
      <NavBar />
      <div className="flex flex-col min-h-screen">
        <div className="relative">
          <main className="w-full text-black border-t-4 border-black pl-0 ml-0">
            <section className="bg-white px-4 md:px-8 py-12 relative">
              <div className="absolute left-0 top-20 rotate-[-90deg] text-xs tracking-widest uppercase text-black/60">
                engagements
              </div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-[10vw] md:text-[7vw] font-black uppercase text-center mb-16 leading-none tracking-tight"
              >
                Speaking
              </motion.h1>
            </section>


            <section className="mb-20 bg-white py-12 px-4 md:px-0">
              <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
                <div className="space-y-6">
                  <img src='/images/events1.jpg' alt="Doug speaking" className="rounded shadow-xl hover:rotate-1 hover:scale-105 transition-transform duration-300" />
                  <img src='/images/events2.jpg' alt="Doug keynote" className="rounded shadow-xl hover:-rotate-1 hover:scale-105 transition-transform duration-300" />
                </div>
                <div className="bg-white border border-black p-6 shadow-md space-y-4">
                  <h2 className="text-4xl font-bold uppercase mb-2">
                    A Voice Emerging on Local Stages
                  </h2>
                  <p className="text-lg leading-relaxed">
                    Doug recently spoke to an audience of 50, building momentum as a growing presence in the speaking world.
                  </p>
                  {/* <a
                    href="/contact"
                    className="mt-4 inline-block px-6 py-3 text-black bg-neutral-100 border-2 border-black hover:bg-black hover:text-white transition uppercase tracking-wider font-semibold"
                  >
                    Invite Doug to Speak
                  </a> */}
                </div>
              </div>
            </section>

            <div className="w-full flex justify-center py-8">
              <div className="h-1 w-5/6 bg-gradient-to-r from-transparent via-black/30 to-transparent shadow-md" />
            </div>

            <section className="bg-white px-4 py-16 max-w-6xl mx-auto">
              <div className="md:flex md:gap-12">
                <div className="flex-1 flex flex-col justify-between border-2 border-black p-6 bg-white shadow-lg mb-12 md:mb-0">
                  <div className="h-1 bg-black w-16 mb-6" />
                  <h2 className="text-5xl font-serif font-black uppercase leading-tight mb-6 text-center md:text-left">Book Doug</h2>
                  <p className="text-sm italic text-gray-600 mb-4">Bring Doug's perspective to your audience</p>
                  <p className="text-lg mb-4 max-w-xl">Want Doug to speak at your event? Reach out below.</p>
                  <a
                    href="/contact"
                    className="w-full md:w-auto inline-block px-6 py-3 text-black bg-white border-2 border-black hover:bg-black hover:text-white transition uppercase tracking-wider font-semibold whitespace-nowrap"
                  >
                    Book Doug
                  </a>
                </div>
                <div className="flex-1 bg-[#f9f8f3] border-2 border-black p-6 shadow-lg">
                  <h2 className="text-4xl font-bold tracking-wide uppercase mb-6 text-center md:text-left">Upcoming Events</h2>
                  {engagements.length > 0 ? (
                    <ul className="space-y-6 font-mono text-sm">
                      {engagements.map((event, idx) => (
                        <li key={idx} className="border border-black p-4 bg-white shadow-md">
                          <div className="font-semibold text-lg">{event.Date}</div>
                          <div className="text-xl italic">{event.Title}</div>
                          <div className="text-sm text-gray-600">{event.Location}</div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-center italic text-gray-500">No upcoming events at this time. Check back soon!</p>
                  )}
                </div>
              </div>
            </section>
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Events;