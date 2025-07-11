

import React from 'react';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';

export default function ShippingAndReturns() {
  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-20 text-[#222]">
        <h1 className="text-4xl font-bold mb-8">Shipping &amp; Returns</h1>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Shipping Policy</h2>
          <p className="mb-4">
            Orders are processed within 2–4 business days. You will receive a confirmation email with tracking information once your order has shipped.
          </p>
          <p className="mb-4">
            Shipping is available within the continental United States. We do not currently offer international shipping.
          </p>
          <p className="mb-4">
            Please double-check your shipping address at checkout. We are not responsible for packages delivered to incorrect addresses provided by the customer.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Returns &amp; Exchanges</h2>
          <p className="mb-4">
            All sales are final. However, if you receive a defective or damaged item, please contact us within 7 days of delivery at our contact page with a description and photo of the issue.
          </p>
          <p className="mb-4">
            Approved replacements or refunds will be processed as soon as possible.
          </p>
          <p>
            We do not offer exchanges or returns due to change of mind.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}