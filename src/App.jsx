// src/App.jsx
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';

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
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Confirmation from './pages/Confirmation';
import Rules from './pages/Rules';
import Prize from './pages/Prize';
import Rankings from './pages/Rankings';
import Teams from './pages/Teams';
import Comissioner from './pages/Comissioner';



import { useLocation, Navigate } from 'react-router-dom';
import DarftOrder from './pages/DarftOrder';
import Timeline from './pages/Timeline';
import PowerRankings from './pages/PowerRankings';
import Matchup from './pages/Matchup';
import History from './pages/History';
import Draft from './pages/Draft';
import Votes from './pages/Votes';



function ProtectedConfirmation() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const sessionId = params.get('session_id');
  const orderHash = params.get('order');

  if (!sessionId && !orderHash) {
    return <Navigate to="/" replace />;
  }

  return <Confirmation />;
}

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
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/rules" element={<Rules />} />
            <Route path="/draft-order" element={<DarftOrder />} />
            <Route path="/prize" element={<Prize />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/rankings" element={<Rankings />} />
            <Route path="/power-rankings" element={<PowerRankings />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/matchups" element={<Matchup />} />
            <Route path="/history" element={<History />} />
            <Route path="/comissioner" element={<Comissioner />} />
            <Route path="/draft" element={<Draft />} />
            <Route path="/vote" element={<Votes />} />






          </Routes>
        </Router>
      </CartProvider>
    </>
  );
}