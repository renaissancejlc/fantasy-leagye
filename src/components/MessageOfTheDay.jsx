

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const MessageOfTheDay = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const response = await fetch('https://api.sheetbest.com/sheets/95157ef1-bcd7-4c97-9799-2bedf9aaf37d');
        const data = await response.json();
        const todayMessage = data.find((entry) => entry.Date === today);
        if (todayMessage) {
          setMessage(todayMessage.Message);
        } else {
          setMessage('Stay aligned. You are the miracle.');
        }
      } catch (error) {
        console.error('Failed to fetch message of the day:', error);
        setMessage('Error loading message.');
      } finally {
        setLoading(false);
      }
    };

    fetchMessage();
  }, [today]);

  return (
    <section className="relative bg-black text-white py-24 px-8 border-t border-white text-center">
      <div className="absolute inset-0 z-0 bg-[url('/images/noise.png')] opacity-10 pointer-events-none"></div>
      <div className="relative z-10 max-w-3xl mx-auto">
        <button
          onClick={() => {}}
          className="w-full h-full flex flex-col items-center justify-center focus:outline-none"
        >
          <div className="inline-block bg-white text-black text-xs px-2 py-1 uppercase tracking-wide rotate-[-4deg] mb-4">
            Message of the Day
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl font-bold uppercase tracking-wider mb-4"
          >
            Today’s Reflection
          </motion.h2>
          {loading ? (
            <p className="text-gray-400 italic">Loading...</p>
          ) : (
            <p className="text-xl font-light italic leading-relaxed hover:underline">
              “{message}”
            </p>
          )}
        </button>
      </div>
    </section>
  );
};

export default MessageOfTheDay;