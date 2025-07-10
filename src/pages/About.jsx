import React from 'react';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';

import '../index.css';

import miracleCover from '/images/miracleCover.png'; // reuse as placeholder

export default function About() {
  return (
    <>
      <Navbar />
      <div className="border-t-4 border-black"></div>
      <div className="px-8 py-16 space-y-24 text-black">
        {/* Hero Section */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <img src='./images/doug1' alt="Doug Cooper" className="rounded-xl shadow-xl w-full max-w-sm mx-auto" />
          <div>
            <h1 className="text-5xl font-bold mb-4 font-fraunces site-title">Meet Doug Cooper</h1>
            <p className="text-lg leading-relaxed">
              Author. Speaker. Storyteller. Doug believes in the power of words to spark transformation.
            </p>
          </div>
        </section>

        {/* His Story */}
        <section className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-semibold mb-4 font-fraunces">His Story</h2>
            <p className="text-lg leading-relaxed">
              Doug's journey as a writer began with a single question: What does the world need most right now?
              Through his books, speaking, and community work, Doug has inspired countless people to live with purpose and
              conviction. His latest series is a call to become the light you seek.
            </p>
          </div>
          <img src='./images/doug2' alt="Doug speaking" className="rounded-xl shadow-xl w-full max-w-sm mx-auto" />
        </section>

        {/* Photo Grid */}
        <section>
          <h2 className="text-3xl font-semibold mb-6 text-center font-fraunces">Snapshots</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <img src='./images/doug1' alt="Doug portrait" className="rounded-lg shadow-md w-full" />
            <img src='./images/doug2' alt="Doug at event" className="rounded-lg shadow-md w-full" />
            <img src='./images/doug3' alt="Doug in nature" className="rounded-lg shadow-md w-full" />
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}