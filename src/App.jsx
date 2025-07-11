// src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import About from './pages/About';
import Books from './pages/Books';
import Contact from './pages/Contact';
import BecomeTheMiracle from './pages/BecomeTheMiracle';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfUse from './pages/TermsOfUse';
import Events from './pages/Events';
import ShippingAndReturns from './pages/ShippingAndReturns';
import Press from './pages/Press';
import Faq from './pages/Faq';



export default function App() {
  useEffect(() => {
    const cursor = document.querySelector('.cursor-circle');

    const moveCursor = (e) => {
      if (cursor) {
        cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
      }
    };

    window.addEventListener('mousemove', moveCursor);
    return () => window.removeEventListener('mousemove', moveCursor);
  }, []);

  return (
    <>
      <div className="cursor-circle" />
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/books" element={<Books />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/become-the-miracle" element={<BecomeTheMiracle />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />
          <Route path="/press" element={<Press />} />
          <Route path="/faq" element={<Faq />} />
          <Route path="/shipping-and-returns" element={<ShippingAndReturns />} />
          <Route path="/events" element={<Events />} />


        </Routes>
      </Router>
    </>
  );
}