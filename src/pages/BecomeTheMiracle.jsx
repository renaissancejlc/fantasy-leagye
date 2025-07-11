import React from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";
import PreviewBook from "../components/PreviewBook";
import miracleCover from '/images/miracleCover.png'; // reuse as placeholder
import { useCart } from "../context/CartContext";

export default function BecomeTheMiracle() {
  const location = useLocation();
  const { addToCart } = useCart();
  const handleAddToCart = () => {
    addToCart({
      id: "miracle-book",
      title: "How to Become the Miracle the World Is Waiting For",
      price: 22,
      quantity: 1,
      image: miracleCover,
      isPreorder: true,
    });
  };

  useEffect(() => {
    if (location.hash) {
      const el = document.querySelector(location.hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [location]);
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#f9f8f3] text-black px-4 md:px-32 py-20 tracking-wide">
        <section className="max-w-5xl mx-auto text-center mb-16">
          <img
            src={miracleCover}
            alt="Become the Miracle Book Cover"
            className="mx-auto mb-8 w-64 shadow-lg"
          />
         <h1 className="text-5xl md:text-6xl font-bold uppercase mb-6 tracking-widest">
           How to Become the Miracle the World Is Waiting For
         </h1>
          <p className="text-md md:text-lg font-medium uppercase tracking-wider text-gray-600 mb-6">
            A spiritual guide to becoming the light · Doug Cooper’s debut
          </p>
          <p className="text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
            A guide for spiritual alignment, healing, and becoming the light the world needs now.
            Through soulful reflections and grounded wisdom, this book empowers readers to shift
            from seeking miracles to becoming one—for themselves and others.
          </p>
          <br></br>
                    <button
            onClick={handleAddToCart}
            className="inline-block bg-black text-white px-6 py-3 text-lg font-bold uppercase tracking-wider hover:bg-gray-800 transition-all duration-200"
          >
            Pre order Now
          </button>
        </section>

        <section className="max-w-4xl mx-auto text-left mb-16 space-y-6 border-l-4 border-black pl-6">
          
          <h2 className="text-2xl font-semibold">About the Book</h2>
          <p className="italic">
            <em>Become the Miracle</em> is an invitation to remember the divine truth already
            within you. Combining spiritual insight with practical reflection, Doug Cooper offers
            a journey through alignment, healing, and purpose. The book’s two-part structure
            begins with “Reflections,” gently illuminating the parts of ourselves we often hide,
            followed by “Expansions,” which empowers action from a place of embodied light.
          </p>
          <p>
            You’ll find themes of emotional honesty, energetic sovereignty, and spiritual clarity,
            guided by the voices of Abraham Hicks, Deepak Chopra, and more. If you’ve ever felt
            the pull to live more consciously, this book is your companion.
          </p>

          <h2 className="text-2xl font-semibold">Book Inspirations</h2>
          <div className="bg-[#f1f0eb] p-4 rounded-md">
            <ul className="list-disc list-inside space-y-2">
              <li>Abraham Hicks – alignment, joy, and vibration</li>
              <li>Vedantic teachings – non-attachment and true awareness</li>
              <li>Deepak Chopra – you are not your thoughts, but the witness</li>
              <li>Modern energetic practices – healing through presence and integrity</li>
            </ul>
          </div>
        </section>

        <section id='preview' className="max-w-5xl mx-auto text-center mb-20 border-t border-black pt-2">
          <h2 className="text-3xl font-extrabold uppercase tracking-widest border-b-4 border-black inline-block pb-1">Check it out</h2> 
          <p className="text-lg flex items-center justify-center gap-2">
            Tap the pages to turn and reveal the contents and introduction:
            <span className="animate-bounce text-2xl text-maroon-700">↓</span>
          </p>

          <PreviewBook />
        </section>
      </div>
      <Footer />
    </>
  );
}