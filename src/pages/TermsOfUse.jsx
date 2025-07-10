
import React from "react";
import Navbar from "../components/NavBar";
import Footer from "../components/Footer";

export default function TermsOfUse() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen px-6 md:px-20 py-16 bg-white text-black">
        <h1 className="text-4xl font-bold mb-8 border-b-2 border-black pb-2">Terms of Use</h1>

        <section className="space-y-6 max-w-4xl mx-auto text-lg leading-relaxed">
          <p>Last updated: July 2025</p>

          <p>
            These Terms of Use (“Terms”) govern your access to and use of our website (the “Site”), including any content, features, and services made available through the Site.
            By accessing or using the Site, you agree to be bound by these Terms.
          </p>

          <h2 className="text-2xl font-bold mt-10">1. Use of the Site</h2>
          <p>
            You may use the Site only for lawful purposes and in accordance with these Terms. You agree not to use the Site:
          </p>
          <ul className="list-disc ml-6">
            <li>In any way that violates any applicable federal, state, local, or international law or regulation;</li>
            <li>To impersonate or attempt to impersonate the site owner, staff, or other users;</li>
            <li>To engage in any conduct that restricts or inhibits anyone’s use or enjoyment of the Site.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-10">2. Intellectual Property</h2>
          <p>
            All content on this Site—including text, graphics, logos, images, and code—is the property of the site owner or its content suppliers and is protected by intellectual property laws. 
            You may not reproduce, distribute, or create derivative works from any content without express written permission.
          </p>

          <h2 className="text-2xl font-bold mt-10">3. Purchases and Transactions</h2>
          <p>
            All purchases made through our integrated Shopify store are subject to Shopify’s own terms and policies. We are not liable for issues arising from third-party services including payment processing, order fulfillment, or delivery.
          </p>

          <h2 className="text-2xl font-bold mt-10">4. Disclaimer of Warranties</h2>
          <p>
            The Site is provided on an “as is” and “as available” basis. We do not guarantee that the Site or any content will be error-free, uninterrupted, or secure.
            Your use of the Site is at your own risk.
          </p>

          <h2 className="text-2xl font-bold mt-10">5. Limitation of Liability</h2>
          <p>
            In no event shall we be liable for any damages arising out of or related to your use of the Site or purchases made through it.
            This includes, without limitation, direct, indirect, incidental, punitive, and consequential damages.
          </p>

          <h2 className="text-2xl font-bold mt-10">6. Changes to the Terms</h2>
          <p>
            We reserve the right to update or modify these Terms at any time without prior notice. Your continued use of the Site following the posting of changes constitutes your acceptance of those changes.
          </p>

          <h2 className="text-2xl font-bold mt-10">7. Contact</h2>
          <p>
            For questions about these Terms, please reach out to us via our <a href="/contact" className="underline">Contact</a> page.
          </p>
        </section>
      </main>
      <Footer />
    </>
  );
}