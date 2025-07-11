import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { Book, Trash2 } from 'lucide-react';

export default function Checkout() {
  const { cartItems, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const subtotal = cartItems.reduce(
    (total, item) => total + item.quantity * (item.price || 0),
    0
  );

  // Group items by preorder status
  const preorderItems = cartItems.filter((item) => item.isPreorder);
  const regularItems = cartItems.filter((item) => !item.isPreorder);

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-20 text-[#222]">
               <h1 className="text-4xl font-extrabold tracking-tight mb-10 border-b pb-4 border-black uppercase">
          Cart
        </h1>

        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <div className="space-y-8">
            {regularItems.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Items</h2>
                {regularItems.map((item) => (
                  <div key={item.id} className="flex items-start gap-6 border-t border-black py-6">
                    {item.cover ? (
                      <img
                        src={typeof item.cover === 'string' ? item.cover : URL.createObjectURL(item.cover)}
                        alt={item.title || 'Book cover'}
                        className="w-24 h-32 object-cover border rounded"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                          e.target.parentNode.innerHTML = '<div class="w-24 h-32 flex items-center justify-center bg-gray-100 border rounded"><svg xmlns="http://www.w3.org/2000/svg" class="lucide lucide-book w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M4 4.5A2.5 2.5 0 0 1 6.5 7H20" /><path d="M6.5 7v10" /><path d="M20 7v10" /></svg></div>';
                        }}
                      />
                    ) : (
                      <div className="w-24 h-32 flex items-center justify-center bg-gray-100 border rounded">
                        <Book className="w-10 h-10 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h2 className="text-base font-mono font-bold uppercase tracking-wide">
                        {item.title || 'Untitled Book'}
                      </h2>
                      <p className="text-xs text-gray-700 italic mt-1">
                        ${item.price?.toFixed(2)} each &mdash; ${ (item.price * item.quantity).toFixed(2) } total
                      </p>
                      <div className="mt-2 flex items-center gap-4">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 border border-black rounded-sm hover:bg-black hover:text-white transition-colors duration-150"
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 border border-black rounded-sm hover:bg-black hover:text-white transition-colors duration-150"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="ml-4 text-red-600 hover:text-red-800"
                          title="Remove from cart"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {preorderItems.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4">Preorder</h2>
                {preorderItems.map((item) => (
                  <div key={item.id} className="flex items-start gap-6 border-t border-black py-6">
                    {item.cover ? (
                      <img
                        src={typeof item.cover === 'string' ? item.cover : URL.createObjectURL(item.cover)}
                        alt={item.title || 'Book cover'}
                        className="w-24 h-32 object-cover border rounded"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = 'none';
                          e.target.parentNode.innerHTML = '<div class="w-24 h-32 flex items-center justify-center bg-gray-100 border rounded"><svg xmlns="http://www.w3.org/2000/svg" class="lucide lucide-book w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M4 4.5A2.5 2.5 0 0 1 6.5 7H20" /><path d="M6.5 7v10" /><path d="M20 7v10" /></svg></div>';
                        }}
                      />
                    ) : (
                      <div className="w-24 h-32 flex items-center justify-center bg-gray-100 border rounded">
                        <Book className="w-10 h-10 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h2 className="text-base font-mono font-bold uppercase tracking-wide">
                        {item.title || 'Untitled Book'}
                        <span className="ml-2 px-2 py-1 text-sm bg-yellow-100 text-yellow-800 rounded">
                          Preorder
                        </span>
                      </h2>
                      <p className="text-xs text-gray-700 italic mt-1">
                        ${item.price?.toFixed(2)} each &mdash; ${ (item.price * item.quantity).toFixed(2) } total
                      </p>
                      <div className="mt-2 flex items-center gap-4">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-2 py-1 border border-black rounded-sm hover:bg-black hover:text-white transition-colors duration-150"
                        >
                          −
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-2 py-1 border border-black rounded-sm hover:bg-black hover:text-white transition-colors duration-150"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="ml-4 text-red-600 hover:text-red-800"
                          title="Remove from cart"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <hr className="my-6 border-black" />
            <div className="text-right mt-10">
              <p className="text-lg font-mono font-semibold uppercase">Subtotal: ${subtotal.toFixed(2)}</p>
              <p className="text-xs text-gray-700 mt-2 font-mono">Shipping calculated at next step.</p>
              <p className="text-xs text-gray-700 mt-2 font-mono">
                <strong>Preorder Notice:</strong> Preorder items may take up to <span className="font-semibold">6 months</span> to ship depending on production and availability.
              </p>
              <p className="text-xs text-gray-700 mt-2 font-mono">
                All payments are processed securely through <strong>Stripe</strong>.
              </p>
              <button
                className="mt-8 px-8 py-3 bg-black text-white text-sm font-mono uppercase tracking-wide border border-black hover:bg-white hover:text-black transition-colors duration-200"
                onClick={() => navigate('/checkout')}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}