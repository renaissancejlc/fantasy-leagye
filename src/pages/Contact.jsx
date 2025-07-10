import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';

export default function Contact() {
  const [formStatus, setFormStatus] = useState(null);
  const [showAnimation, setShowAnimation] = useState(false);

  return (
    <>
      <Navbar />
      <main className="min-h-screen px-4 md:px-20 py-16 bg-white text-black">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl font-bold uppercase mb-12 tracking-wide text-center"
        >
          Contact
        </motion.h1>
        <p className="text-center max-w-xl mx-auto text-lg text-gray-600 mt-4">
          Want to book Doug for a talk, ask a question, or share your story? Drop a message below.
        </p>

        <div className="relative z-20 max-w-4xl mx-auto p-8 mt-12 bg-white shadow-lg rounded-lg">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const formElement = e.currentTarget;
              const formData = new FormData(formElement);
              try {
                const response = await fetch("https://formsubmit.co/ajax/contactvadisstudio@gmail.com", {
                  method: "POST",
                  headers: {
                    "Accept": "application/json"
                  },
                  body: formData
                });

                const data = await response.json();
                console.log('FormSubmit response:', data);

                if (response.ok) {
                  setFormStatus('success');
                  setShowAnimation(true);
                  setTimeout(() => setShowAnimation(false), 5000);
                  formElement.reset();
                } else {
                  setFormStatus('error');
                }
              } catch (error) {
                console.error('FormSubmit error:', error);
                setFormStatus('error');
              }
            }}
            className="space-y-6"
          >
            <input type="text" name="_honey" style={{ display: 'none' }} />
            <div>
              <label className="block mb-2 font-semibold">Name</label>
              <input type="text" name="name" required className="w-full border border-black px-4 py-2 rounded focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200" />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Email</label>
              <input type="email" name="email" required className="w-full border border-black px-4 py-2 rounded focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200" />
            </div>
            <div>
              <label className="block mb-2 font-semibold">Message</label>
              <textarea name="message" required rows="6" className="w-full border border-black px-4 py-2 rounded focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200" />
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <button type="submit" className="bg-black text-white px-6 py-2 rounded uppercase tracking-wider hover:opacity-80 transition">
                Send
              </button>
              {formStatus === 'success' && <p className="text-green-600 font-semibold">Message sent successfully!</p>}
              {formStatus === 'error' && <p className="text-red-600 font-semibold">There was an error. Please try again.</p>}
            </div>

            {formStatus === 'success' && showAnimation && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex justify-center mt-6"
              >
                <motion.div
                  className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-3xl shadow-lg"
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.8 }}
                >
                  ✓
                </motion.div>
              </motion.div>
            )}
          </form>
          <div className="mt-12 text-center text-sm text-gray-500">
            You can also find Doug on <a href="#" className="underline">Instagram</a> and <a href="#">YouTube</a>.
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}