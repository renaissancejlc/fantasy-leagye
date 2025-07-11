import React from "react";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";


export default function Faq() {
  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 py-20 text-[#222]">
        <h1 className="text-4xl font-bold mb-8">Frequently Asked Questions</h1>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">What is the book about?</h2>
          <p className="mb-4">
            <em>How to Become the Miracle the World is Waiting For</em> is a debut work exploring personal growth, purpose, and community transformation through storytelling and reflective practices. It’s a heartfelt guide for anyone seeking to live more intentionally.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Is this Doug’s first book?</h2>
          <p className="mb-4">
            Yes, this is Doug Cooper’s debut publication. It represents the beginning of a larger series of work aimed at helping people step into their full purpose.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Where do you ship?</h2>
          <p className="mb-4">
            We currently ship within the continental United States. At this time, we are not offering international shipping.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">How long does shipping take?</h2>
          <p className="mb-4">
            Orders are typically processed and shipped within 5–7 business days. You’ll receive a confirmation email with tracking information once your order is on its way.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">What if I entered the wrong shipping address?</h2>
          <p className="mb-4">
            Please double-check your address at checkout. We are not responsible for packages delivered to incorrect addresses provided by the customer.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Can I return or exchange my order?</h2>
          <p className="mb-4">
            All sales are final. However, if your order arrives damaged or defective, please reach out within 7 days of delivery through the contact page with a description and photo of the issue.
          </p>
          <p className="mb-4">
            If approved, we will process a replacement or refund promptly. We are unable to accommodate returns or exchanges due to change of mind.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}