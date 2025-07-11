
import React from 'react';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';

export default function Press() {
  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-20 text-[#222]">
        <h1 className="text-4xl font-bold mb-8">Press & Media</h1>

        <section className="mb-10">
          <p className="mb-4">
            Doug Cooper is available for interviews, press coverage, podcast appearances, speaking engagements, and more. His work invites meaningful conversation and he welcomes opportunities to connect with journalists and creators.
          </p>
        </section>

        <section>
          <p className="mb-4">
           For all media inquiries, please reach out to{' '}
            <a href="mailto:doug@dougcooper.com" className="underline hover:italic">doug@dougcooper.com</a>.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}