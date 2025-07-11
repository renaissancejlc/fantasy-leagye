import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, Trash2, Book } from 'lucide-react';
import { useCart } from '../context/CartContext';

// Helper hook to get previous value
function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

export default function NavBar() {
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searchRef = useRef(null);
  const { cartItems, removeFromCart, updateQuantity } = useCart();
  const [itemAdded, setItemAdded] = useState(false);
  const prevCartItems = usePrevious(cartItems);
  const [cartHovered, setCartHovered] = useState(false);
  const cartTimeoutRef = useRef(null);

  useEffect(() => {
    if (!prevCartItems) return;
    const addedOrChanged = cartItems.some((item, index) =>
      !prevCartItems[index] || item.quantity !== prevCartItems[index].quantity
    );
    if (addedOrChanged) {
      setItemAdded(true);
      const timer = setTimeout(() => setItemAdded(false), 800);
      return () => clearTimeout(timer);
    }
  }, [cartItems, prevCartItems]);

  const books = [
    {
      title: "How to Become the Miracle the World is Waiting For",
      path: "/become-the-miracle"
    },
    {
      title: "The Aligned Hustle",
      path: "/books#upcoming"
    },
    {
      title: "The Aligned Healer",
      path: "/books#upcoming"
    },
    {
      title: "The Overflow Effect",
      path: "/books#upcoming"
    }
  ];

  const filtered = books.filter(book =>
    book.title.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target) &&
        !event.target.closest('.search-result-link')
      ) {
        setSearchOpen(false);
        setQuery('');
      }
    }
    if (searchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchOpen]);

  return (
    <nav className="w-full border-b border-black/10 bg-white font-serif tracking-wide px-6 py-6">
      <div className="flex justify-between items-center w-full max-w-7xl mx-auto">
        <div className="relative search-container">
          <div ref={searchRef} className="flex items-center gap-2 transition-all duration-300 ease-in-out">
            <button
              aria-label="Search"
              className="text-black"
              onClick={() => setSearchOpen(prev => !prev)}
            >
              <Search className="w-5 h-5 hover:opacity-70 transition" />
            </button>
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search books..."
              className={`transition-all duration-300 ease-in-out border border-black px-4 py-2 text-sm bg-white text-black rounded-full focus:outline-none focus:ring-2 focus:ring-black
                ${searchOpen ? "w-64 opacity-100" : "w-0 opacity-0 overflow-hidden"}`}
              style={{ minWidth: 0 }}
            />
          </div>
          {searchOpen && query && (
            <ul className="absolute top-full left-0 mt-2 w-64 bg-white border border-black rounded-lg shadow-lg max-h-48 overflow-y-auto text-sm z-50">
              {filtered.length > 0 ? (
                filtered.map(book => (
                  <li key={book.title}>
                    <Link
                      to={book.path}
                      className="block px-4 py-2 hover:bg-black hover:text-white transition-colors duration-200 search-result-link"
                      onClick={() => {
                        setQuery('');
                        setSearchOpen(false);
                      }}
                    >
                      {book.title}
                    </Link>
                  </li>
                ))
              ) : (
                <li className="px-4 py-2 text-gray-400 italic">No matches found</li>
              )}
            </ul>
          )}
        </div>
        <div className="text-[2.25rem] tracking-[0.25em] font-light font-[Playfair_Display] uppercase text-black text-center site-title">
          Doug Cooper
        </div>
        <div
          className="relative"
          onMouseOver={() => {
            clearTimeout(cartTimeoutRef.current);
            setCartHovered(true);
          }}
          onMouseOut={() => {
            cartTimeoutRef.current = setTimeout(() => {
              setCartHovered(false);
            }, 200);
          }}
        >
          <button
            aria-label="Cart"
            className="relative text-black"
            onClick={() => navigate('/cart')}
          >
            <ShoppingCart className="w-5 h-5 hover:opacity-70 transition" />
            <span className={`absolute -top-2 -right-2 text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center transition transform ${itemAdded ? "animate-bounce" : ""}`}>
              {(() => {
                const total = cartItems.reduce((sum, item) => sum + item.quantity, 0);
                return total > 10 ? '10+' : total;
              })()}
            </span>
          </button>
          <div
            className={`absolute right-0 top-full mt-2 w-64 bg-white border border-black rounded-lg shadow-lg text-sm z-50 transition-opacity duration-300 ${cartHovered ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
          >
            {cartItems.length > 0 ? (
              <ul className="p-4 max-h-48 overflow-y-auto text-gray-800 text-sm">
                {cartItems.map((item, index) => (
                  <li key={index} className="mb-3 p-2 flex items-start gap-3 border-b border-gray-200 last:border-none">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.title ?? '(No title)'}
                        className="w-12 h-16 object-cover rounded-md shadow-sm"
                      />
                    ) : (
                      <div className="w-12 h-16 flex items-center justify-center bg-gray-100 text-gray-500 rounded-md shadow-sm">
                        <Book className="w-6 h-6" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="font-semibold text-sm text-black leading-snug">
                        {item.title ?? <span className="italic text-gray-400">No title</span>}
                      </div>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-6 h-6 text-xs bg-gray-100 hover:bg-gray-300 rounded-full flex items-center justify-center transition"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-6 h-6 text-xs bg-gray-100 hover:bg-gray-300 rounded-full flex items-center justify-center transition"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400 hover:text-red-600 mt-1"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-gray-700 italic">Your cart is empty</div>
            )}
          </div>
        </div>
      </div>


      <div className="flex justify-center overflow-x-auto sm:overflow-visible">
        <ul className="flex space-x-4 sm:space-x-16 text-sm text-gray-600 tracking-wide font-light mt-4 font-sans uppercase px-2 sm:px-0">
          <li className="relative cursor-pointer hover:text-black hover:after:absolute hover:after:left-0 hover:after:bottom-0 hover:after:h-[1px] hover:after:w-full hover:after:bg-black transition-all duration-200 ease-in-out">
            <Link to="/">Home</Link>
          </li>
          <li className="relative cursor-pointer hover:text-black hover:after:absolute hover:after:left-0 hover:after:bottom-0 hover:after:h-[1px] hover:after:w-full hover:after:bg-black transition-all duration-200 ease-in-out">
            <Link to="/about">About</Link>
          </li>
          <li className="relative cursor-pointer hover:text-black hover:after:absolute hover:after:left-0 hover:after:bottom-0 hover:after:h-[1px] hover:after:w-full hover:after:bg-black transition-all duration-200 ease-in-out">
            <Link to="/books">Books</Link>
          </li>
          <li className="relative cursor-pointer hover:text-black hover:after:absolute hover:after:left-0 hover:after:bottom-0 hover:after:h-[1px] hover:after:w-full hover:after:bg-black transition-all duration-200 ease-in-out">
            <Link to="/events">Events</Link>
          </li>
          <li className="relative cursor-pointer hover:text-black hover:after:absolute hover:after:left-0 hover:after:bottom-0 hover:after:h-[1px] hover:after:w-full hover:after:bg-black transition-all duration-200 ease-in-out">
            <Link to="/contact">Contact</Link>
          </li>
          {/* <li className="relative cursor-pointer hover:text-black hover:after:absolute hover:after:left-0 hover:after:bottom-0 hover:after:h-[1px] hover:after:w-full hover:after:bg-black transition-all duration-200 ease-in-out">Learn</li> */}
        </ul>
      </div>
    </nav>
  );
}