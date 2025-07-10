import React from 'react';
import NavBar from '../components/NavBar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';
import BrushParallax from '../components/BrushParallax';

export default function Home() {
  return (
    <div className="relative text-black min-h-screen font-serif">
      <BrushParallax />
      <NavBar />
      <Hero />
      <Footer />
    </div>
  );
}