

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
            Orders are processed within 2–4 business days unless noted otherwise. You will receive a confirmation email with tracking information once your order ships.
          </p>
          <p className="mb-4">
            Shipping is currently available within the continental United States only. We do not offer international shipping at this time.
          </p>
          <p className="mb-4">
            Preorder items may take up to 6 months to ship. If your order contains a mix of in-stock and preorder items, it will ship once all items are available.
          </p>
          <p className="mb-4">
            Please ensure your shipping address is accurate before placing your order. We are not responsible for packages delivered to incorrect addresses provided by the customer.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Returns &amp; Exchanges</h2>
          <p className="mb-4">
            All sales are final. If your item arrives damaged or defective, please contact us within 7 days of delivery through our contact page, including a description and photo of the issue.
          </p>
          <p className="mb-4">
            If approved, we will process a replacement or refund as soon as possible.
          </p>
          <p className="mb-4">
            We do not offer returns or exchanges for change of mind. This includes preorder items, which are made to order and are not eligible for cancellation or return once placed.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}