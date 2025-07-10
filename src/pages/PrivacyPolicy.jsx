
import React from "react";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";

export default function PrivacyPolicy() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen px-6 md:px-20 py-16 bg-white text-black">
        <h1 className="text-4xl font-bold mb-8 border-b-2 border-black pb-2">Privacy Policy</h1>

        <section className="space-y-6 max-w-4xl mx-auto text-lg leading-relaxed">
          <p>Last updated: July 2025</p>

          <p>
            This Privacy Policy describes how your personal information is collected, used, and shared when you visit or make a purchase from our website (the “Site”), powered by Shopify.
          </p>

          <h2 className="text-2xl font-bold mt-10">1. Personal Information We Collect</h2>
          <p>
            When you visit the Site, we automatically collect certain information about your device, including your web browser, IP address, time zone, and some cookies installed on your device. 
            Additionally, as you browse the Site, we collect information about the individual web pages or products that you view.
          </p>
          <p>
            When you make a purchase or attempt to make a purchase, we collect information including your name, billing address, shipping address, payment information (including credit card numbers), 
            email address, and phone number. This is referred to as “Order Information”.
          </p>

          <h2 className="text-2xl font-bold mt-10">2. How Do We Use Your Personal Information?</h2>
          <p>We use the Order Information to:</p>
          <ul className="list-disc ml-6">
            <li>Fulfill orders placed through the Site;</li>
            <li>Communicate with you via email or phone when necessary;</li>
            <li>Screen orders for potential risk or fraud; and</li>
            <li>Provide you with information or advertising relating to our products.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-10">3. Sharing Your Personal Information</h2>
          <p>
            We share your Personal Information with third parties to help us use your Personal Information, as described above. 
            For example, we use Shopify to power our online store — you can read more about how Shopify uses your Personal Information 
            <a href="https://www.shopify.com/legal/privacy" target="_blank" rel="noreferrer" className="underline ml-1">here</a>.
          </p>

          <h2 className="text-2xl font-bold mt-10">4. Your Rights</h2>
          <p>
            If you are a resident of the European Economic Area (EEA) or California, you have the right to access personal information we hold about you and to ask that your personal information be 
            corrected, updated, or deleted. Please contact us via our <a href="/contact" className="underline">Contact</a> page to make this request.
          </p>

          <h2 className="text-2xl font-bold mt-10">5. Data Retention</h2>
          <p>
            When you place an order through the Site, we will maintain your Order Information for our records unless and until you ask us to delete this information.
          </p>

          <h2 className="text-2xl font-bold mt-10">6. Changes</h2>
          <p>
            We may update this privacy policy from time to time to reflect changes to our practices or for other operational, legal, or regulatory reasons.
          </p>

          <h2 className="text-2xl font-bold mt-10">7. Contact Us</h2>
          <p>
            For more information about our privacy practices or if you have questions, please contact us via the <a href="/contact" className="underline">Contact</a> page.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}