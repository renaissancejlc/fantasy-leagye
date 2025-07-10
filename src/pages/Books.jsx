import React from 'react';
import miracleCover from '/images/miracleCover.png'; // reuse as placeholder
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';

export default function Books() {
  return (
    <>
      <Navbar />
      <div className="border-t-4 border-black"></div>
      <div className="pl-4 relative">
        <div className="py-16 space-y-12 font-serif text-black">
        {/* Hero Book */}
        <div className="relative py-4">
          {/* Layered Modern Overlapping Text */}
          {/* <div className="absolute top-[-4rem] left-[-2rem] text-[7vw] font-black uppercase tracking-tight text-black/10 leading-none z-0 select-none pointer-events-none">
            Awaken
          </div> */}
          {/* <div className="absolute bottom-[-3rem] right-[-2rem] text-[6vw] font-extrabold uppercase tracking-tighter text-black/10 rotate-[6deg] z-0 select-none pointer-events-none">
            Answer
          </div> */}
          <section className="relative z-10 grid md:grid-cols-2 gap-x-2 md:gap-x-0 items-center" data-product="become-the-miracle">
            <div className="relative z-10 flex justify-center">
              <img src={miracleCover} alt="Become the Miracle" className="shadow-xl rounded-lg w-full max-w-sm" />
            </div>
            <div className="relative z-10 flex flex-col items-center text-center md:items-start md:text-left bg-white/80 backdrop-blur-sm p-1 md:p-1 rounded-md ml-[-1rem] md:ml-[-1.5rem]">
              <div className="relative w-full text-center md:text-left font-black text-[10vw] md:text-[7vw] tracking-tight leading-none z-10">
                <span className="block text-[#000000] drop-shadow-md">BECOME</span>
                <span className="block text-[#000000] -mt-2 ml-6 md:ml-10 drop-shadow-md">THE</span>
                <span className="block text-[#000000] -mt-2 ml-12 md:ml-20 drop-shadow-md">MIRACLE</span>
              </div>
              <p className="text-lg md:text-xl font-medium italic mt-4 text-gray-800 max-w-prose text-center md:text-left">
                Awaken your gift. Answer the call. Become the light.
              </p>
              <br></br>
              <a href="#" className="border-2 border-black text-black bg-transparent px-5 py-2 text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all">
                Pre order Now
              </a>
              <a href="/become-the-miracle" className="mt-4 md:mt-2 inline-block border-2 border-black text-black px-5 py-2 text-xs uppercase tracking-widest hover:bg-black hover:text-white transition-all">
                Learn More
              </a>
            </div>
          </section>
        </div>

        {/* Upcoming Books */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Coming Soon</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 text-sm">
            <article className="border border-black/10 p-6 rounded hover:shadow-md transition" data-product="the-overflow-effect">
              <h3 className="font-bold text-lg">The Overflow Effect</h3>
              <p className="mt-2">A call to live in full alignment and generosity.</p>
              <a href="#" className="mt-4 inline-block bg-black text-white px-6 py-2 text-xs tracking-wider uppercase hover:opacity-80 transition">
                Pre order
              </a>
            </article>
            <article className="border border-black/10 p-6 rounded hover:shadow-md transition" data-product="the-aligned-hustle">
              <h3 className="font-bold text-lg">The Aligned Hustle</h3>
              <p className="mt-2">Spiritual tools for purpose-driven work and creativity.</p>
              <a href="#" className="mt-4 inline-block bg-black text-white px-6 py-2 text-xs tracking-wider uppercase hover:opacity-80 transition">
                Pre order
              </a>
            </article>
            <article className="border border-black/10 p-6 rounded hover:shadow-md transition" data-product="the-aligned-healer">
              <h3 className="font-bold text-lg">The Aligned Healer</h3>
              <p className="mt-2">A path for practitioners to honor their gifts with integrity.</p>
              <a href="#" className="mt-4 inline-block bg-black text-white px-6 py-2 text-xs tracking-wider uppercase hover:opacity-80 transition">
                Pre order
              </a>
            </article>
          </div>
        </section>
        </div>
      </div>
      <Footer />
    </>
  );
}