

import React from 'react';
import NavBar from '../components/NavBar';
import Hero from '../components/Hero';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <div className="text-black min-h-screen font-serif">
      <NavBar />
      <Hero />
      <Footer />
    </div>
  );
}