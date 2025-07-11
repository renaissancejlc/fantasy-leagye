import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { Book, Trash2, Lock } from 'lucide-react';



export default function Confirmation() {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();

  const orderId = Math.floor(Math.random() * 1000000);
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = 7.95; // Example flat rate
  const total = subtotal + shippingCost;

  // Clear cart after rendering
  React.useEffect(() => {
    clearCart();
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Navbar />
      <main className="flex-grow px-4 py-8 max-w-3xl mx-auto text-gray-800">
        <div className="text-center">
          <Lock size={36} className="mx-auto text-green-600 mb-4" />
          <h1 className="text-2xl font-bold mb-2">Thank you for your order!</h1>
          <p className="text-sm text-gray-600 mb-6">Your order <span className="font-semibold">#{orderId}</span> has been placed successfully.</p>
        </div>

        <section className="bg-white border rounded-lg shadow-md p-6 space-y-6">
          <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b py-2">
              <div className="flex items-center space-x-3">
                {item.cover ? (
                  <img src={item.cover} alt={item.title} className="w-12 h-16 object-cover rounded" />
                ) : (
                  <Book className="w-12 h-16 text-gray-400" />
                )}
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-gray-500">{item.isPreorder ? 'Preorder - ships in up to 6 months' : 'In stock'}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm">Qty: {item.quantity}</p>
                <p className="text-sm">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            </div>
          ))}
          <div className="border-t pt-4 text-sm space-y-1">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>${shippingCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </section>

        <div className="text-center mt-8">
          <p className="text-gray-600 text-sm">A confirmation email will be sent to you shortly.</p>
          <p className="text-gray-500 text-xs mt-2">If you have any questions, contact us at support@dougcooper.com</p>
          <button
            onClick={() => navigate('/')}
            className="mt-6 px-5 py-2 bg-black text-white text-sm rounded hover:bg-gray-800 transition"
          >
            Return to Home
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}