import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import RadiantBackground from './RadiantBackground';

export default function Hero() {
  const [showReflection, setShowReflection] = React.useState(false);
  return (
    <>
      <AnimatePresence>
        {showReflection && (
          <motion.section
            className="fixed inset-0 bg-black text-white flex flex-col items-center justify-center z-50 p-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
          >
            <button
              onClick={() => setShowReflection(false)}
              className="absolute top-6 left-6 text-white hover:text-gray-300 transition duration-300 z-50"
              aria-label="Back"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <motion.h2
              className="text-4xl md:text-6xl font-bold uppercase mb-6 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              You’re not waiting for the miracle.
            </motion.h2>
            <motion.p
              className="text-2xl md:text-3xl italic text-center max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              You are it.
            </motion.p>
          </motion.section>
        )}
      </AnimatePresence>
      {!showReflection && (
      <>
      {/* HERO SECTION */}
      <RadiantBackground>
        <section className="relative min-h-screen flex items-center justify-center px-12 pt-28">
          <div className="absolute top-6 left-6 text-[10rem] font-bold text-white opacity-10 leading-none z-0">MIRACLE</div>
          <div className="absolute bottom-[10%] right-[-5%] text-[8rem] font-black text-white opacity-10 rotate-[12deg] leading-none z-0">BECOME</div>
          <div className="absolute z-0 left-[65%] top-[50%] w-[280px] md:w-[320px] lg:w-[360px] shadow-2xl rounded-md -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <img
              src="/images/miracleCover.png"
              alt="Book Cover"
              className="w-full h-auto"
              aria-hidden="true"
            />
          </div>
          <div className="max-w-7xl w-full flex items-center justify-between gap-12">
            <div className="relative flex-1" style={{ fontFamily: "'Chiefland Variable', serif" }}>
              <div className="relative z-10">
                <h1
                  className="text-[12vw] leading-[0.85] font-serif font-bold text-black select-none"
                  style={{ lineHeight: 0.85 }}
                >
                  BECOME THE MIRACLE
                </h1>
              </div>
            </div>
            <div className="flex flex-col flex-shrink-0 max-w-sm text-right pr-8 z-10">
              <p className="italic text-xl md:text-2xl text-gray-800 mb-6" style={{ fontFamily: "'Chiefland Variable', serif" }}>
                Awaken your gift. <br></br>Answer the call. <br></br>Become the light.
              </p>
              <button className="px-6 py-2 bg-black text-white rounded-full font-semibold hover:bg-gray-900 transition duration-300 w-fit self-end">
                Preorder Now
              </button>
            </div>
          </div>
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-24 h-[2px] bg-black opacity-20 rounded-full" />
        </section>
      </RadiantBackground>

      <div className="w-full h-16 bg-[url('/images/torn-paper.svg')] bg-repeat-x bg-bottom"></div>

      <section className="relative bg-white text-black py-32 px-8 border-t border-black">
        <div className="absolute top-[40%] left-[-5%] text-[8rem] font-black text-black opacity-5 rotate-[6deg] pointer-events-none z-0">
          REMEMBER
        </div>
        <div className="absolute -top-12 -left-16 w-80 h-80 bg-[#fcd34d] opacity-20 rotate-[15deg] z-0"></div>
        <div className="relative z-10 max-w-5xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-12">
          <div className="flex-1">
            <div className="inline-block bg-black text-white text-xs px-2 py-1 uppercase tracking-wide rotate-[-6deg] mb-3">
              Manifesto
            </div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-white border-4 border-black p-6 shadow-[6px_6px_0_rgba(0,0,0,1)] rotate-[-1deg]"
            >
              <motion.h2
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="text-4xl font-bold uppercase tracking-wider mb-6"
              >
                You Are the Miracle
              </motion.h2>
              <p className="text-xl md:text-[1.4rem] font-light leading-snug tracking-normal">
                This is not a book about fixing yourself. It's about remembering what’s already inside;
                the light you’ve carried, the love you’ve given, the moments you’ve changed someone’s world just by being you.
              </p>
            </motion.div>
          </div>
          {/* <div className="text-[5rem] font-bold text-black opacity-10 -rotate-[20deg]">
            AWAKEN
          </div> */}
        </div>
      </section>

      <section className="relative bg-yellow-50 text-black py-32 px-8 border-t border-black">
        <div className="absolute bottom-0 right-[-60px] w-80 h-80 bg-[#f472b6] opacity-20 rounded-full blur-2xl rotate-[-10deg] z-0"></div>
        <div className="relative z-10 max-w-5xl mx-auto flex flex-col md:flex-row-reverse items-center md:items-start md:text-right gap-12">
          <div className="flex-1">
            <div className="inline-block bg-black text-white text-xs px-2 py-1 uppercase tracking-wide rotate-[8deg] mb-3">
              Excerpt
            </div>
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="border-t-4 border-b-4 border-black py-6 px-4 bg-white shadow-[4px_4px_0_rgba(0,0,0,1)] rotate-[1deg]"
            >
              <blockquote className="italic text-2xl leading-loose tracking-tight">
                “The scar doesn’t block the miracle. But hiding it might.”<br />
                “You don’t just change the world around you. You begin to live in a new one.”
              </blockquote>
            </motion.div>
          </div>
          <div className="w-56 h-56 bg-purple-200 rounded-full shadow-md border-4 border-black rotate-[6deg]"></div>
        </div>
      </section>

      <section className="relative bg-pink-50 text-black py-32 px-8 text-center border-t border-black">
        <div className="absolute top-[20%] right-[-5%] text-[6rem] font-black text-black opacity-5 -rotate-[8deg] pointer-events-none z-0">
          BEGIN
        </div>
        <div className="absolute top-0 left-[50%] transform -translate-x-1/2 w-96 h-96 bg-yellow-100 opacity-25 rounded-full blur-2xl rotate-[12deg] z-0"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="absolute -top-10 left-1/4 text-[7rem] font-black text-black opacity-10 rotate-[4deg] z-0">
            LIGHT
          </div>
          <div className="inline-block bg-black text-white text-xs px-2 py-1 uppercase tracking-wide rotate-[-8deg] mb-4 relative z-10">
            Invitation
          </div>
          <motion.h2
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-3xl font-bold uppercase tracking-wider mb-4 relative z-10"
          >
            Your Invitation
          </motion.h2>
          <p className="text-xl md:text-[1.4rem] font-light leading-snug tracking-normal relative z-10">
            This book is an offering. A permission slip. A call to become the one you've been waiting for.
            Start your journey today.
          </p>
          <a
            href="/books"
            className="mt-6 inline-block bg-black text-white text-base tracking-wide uppercase px-8 py-4 rounded hover:bg-opacity-80 transition relative z-10"
          >
            Start Reading
          </a>
          <div className="mt-4 w-full border-t-[2px] border-dashed border-black relative z-10"></div>
        </div>
      </section>
      {/* Learn More Section */}
      <section className="relative bg-white text-black py-32 px-8 border-t border-black">
        <div className="absolute top-10 right-[-5%] text-[6rem] font-black text-black opacity-5 rotate-[6deg] pointer-events-none z-0">
          LEARN
        </div>
        <div className="absolute top-[30%] left-[-6%] w-80 h-80 bg-[#fde68a] opacity-30 rotate-[-8deg] rounded-full blur-2xl z-0"></div>
        <div className="relative z-10 max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white border-4 border-black p-6 shadow-[6px_6px_0_rgba(0,0,0,1)] rotate-[2deg]"
          >
            <h2 className="text-3xl font-bold uppercase tracking-wider mb-4">
              Beyond the Page
            </h2>
            <p className="text-lg leading-relaxed tracking-normal">
              What if the miracle isn’t something you chase, but something you awaken?
              Doug’s work challenges you to reframe self-help as soul-remembrance. This isn’t a fix. It’s a return.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white border-4 border-black p-6 shadow-[6px_6px_0_rgba(0,0,0,1)] -rotate-[2deg]"
          >
            <h2 className="text-3xl font-bold uppercase tracking-wider mb-4">
              Inner Invitation
            </h2>
            <p className="text-lg leading-relaxed tracking-normal">
              This space isn’t just for readers; it’s for rememberers. Those who know
              there’s more. Explore the philosophies behind the words, the healing
              beneath the highlight.
            </p>
          </motion.div>
        </div>
      </section>
      {/* Message of the Day Section */}
      <section className="relative bg-black text-white py-24 px-8 border-t border-white text-center">
        <div className="absolute inset-0 z-0 bg-[url('/images/noise.png')] opacity-10 pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl mx-auto">
          <button
            onClick={() => setShowReflection(true)}
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
            <p className="text-xl font-light italic leading-relaxed hover:underline">
              “You’re not waiting for the miracle. You are it.”
            </p>
          </button>
        </div>
      </section>
      </>
      )}
    </>
  );
}
