import React from 'react';
import miracleCover from '/images/miracleCover.png'; // reuse as placeholder
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import PreviewBook from '../components/PreviewBook';

export default function Books() {
  return (
    <>
      <Navbar />
      <div className="px-8 py-16 space-y-24 font-serif text-black">
        {/* Hero Book */}
        <section className="grid md:grid-cols-2 gap-12 items-center" data-product="become-the-miracle">
          <img src={miracleCover} alt="Become the Miracle" className="shadow-xl rounded-lg w-full max-w-sm mx-auto" />
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <h1 className="text-4xl font-bold mb-4">Become the Miracle</h1>
            <p className="text-lg leading-relaxed mb-6">
              Awaken your gift. Answer the call. Become the light.
            </p>
            <a href="#" className="bg-black text-white px-6 py-3 text-sm tracking-wider uppercase hover:opacity-80 transition">
              Buy Now
            </a>
            <a href="/become-the-miracle" className="mt-4 md:mt-2 inline-block bg-white text-black border border-black px-6 py-3 text-sm tracking-wider uppercase hover:bg-black hover:text-white transition">
              Learn More
            </a>
          </div>
        </section>

        {/* Upcoming Books */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Coming Soon</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 text-sm">
            <article className="border border-black/10 p-6 rounded hover:shadow-md transition" data-product="the-overflow-effect">
              <h3 className="font-bold text-lg">The Overflow Effect</h3>
              <p className="mt-2">A call to live in full alignment and generosity.</p>
              <a href="#" className="mt-4 inline-block bg-black text-white px-6 py-2 text-xs tracking-wider uppercase hover:opacity-80 transition">
                Preorder
              </a>
            </article>
            <article className="border border-black/10 p-6 rounded hover:shadow-md transition" data-product="the-aligned-hustle">
              <h3 className="font-bold text-lg">The Aligned Hustle</h3>
              <p className="mt-2">Spiritual tools for purpose-driven work and creativity.</p>
              <a href="#" className="mt-4 inline-block bg-black text-white px-6 py-2 text-xs tracking-wider uppercase hover:opacity-80 transition">
                Preorder
              </a>
            </article>
            <article className="border border-black/10 p-6 rounded hover:shadow-md transition" data-product="the-aligned-healer">
              <h3 className="font-bold text-lg">The Aligned Healer</h3>
              <p className="mt-2">A path for practitioners to honor their gifts with integrity.</p>
              <a href="#" className="mt-4 inline-block bg-black text-white px-6 py-2 text-xs tracking-wider uppercase hover:opacity-80 transition">
                Preorder
              </a>
            </article>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}