import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import Navbar from '../components/NavBar';
import Footer from '../components/Footer';
import { useCart } from '../context/CartContext';
import { Book, Trash2, Lock } from 'lucide-react';



export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems } = useCart();

  // Use a single formData state for contact info
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    fullName: '',
  });

  const [shippingStreet, setShippingStreet] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingState, setShippingState] = useState('');
  const [shippingZip, setShippingZip] = useState('');
  const [shippingCountry, setShippingCountry] = useState('United States');
  // Shipping method selector state
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [shippingCost, setShippingCost] = useState(5.99);

  const [billingName, setBillingName] = useState('');
  const [billingStreet, setBillingStreet] = useState('');
  const [billingCity, setBillingCity] = useState('');
  const [billingState, setBillingState] = useState('');
  const [billingZip, setBillingZip] = useState('');
  const [billingCountry, setBillingCountry] = useState('United States');

  const [sameAsShipping, setSameAsShipping] = useState(true);

  const [paymentDetails, setPaymentDetails] = useState('');
  const [agreed, setAgreed] = useState(false);

  // Error state for form validation
  const [formErrors, setFormErrors] = useState({});
  // Refs for autofocus on error
  const fieldRefs = {
    email: useRef(),
    phone: useRef(),
    fullName: useRef(),
    shippingStreet: useRef(),
    shippingCity: useRef(),
    shippingState: useRef(),
    shippingZip: useRef(),
    shippingCountry: useRef(),
    shippingMethod: useRef(),
    billingName: useRef(),
    billingStreet: useRef(),
    billingCity: useRef(),
    billingState: useRef(),
    billingZip: useRef(),
    billingCountry: useRef(),
    agreed: useRef(),
  };

  const preorderItems = cartItems.filter((item) => item.isPreorder);
  const regularItems = cartItems.filter((item) => !item.isPreorder);

  const subtotal = cartItems.reduce(
    (total, item) => total + item.quantity * (item.price || 0),
    0
  );

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    // Validate required fields
    const errors = {};
    // Email validation
    if (!formData.email) {
      errors.email = 'This field is required';
    } else {
      // Regex for email validation
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(formData.email)) {
        errors.email = 'Invalid email format';
      }
    }
    // Phone validation (optional, but if present, must match pattern)
    if (formData.phone) {
      const phonePattern = /^\+?[0-9\s\-().]{7,15}$/;
      if (!phonePattern.test(formData.phone)) {
        errors.phone = 'Invalid phone format';
      }
    }
    // Full name required
    if (!formData.fullName) errors.fullName = 'This field is required';
    if (!shippingStreet) errors.shippingStreet = 'This field is required';
    if (!shippingCity) errors.shippingCity = 'This field is required';
    if (!shippingState) errors.shippingState = 'This field is required';
    if (!shippingZip) errors.shippingZip = 'This field is required';
    if (!shippingCountry) errors.shippingCountry = 'This field is required';
    if (!shippingMethod) errors.shippingMethod = 'Please select a shipping method';
    if (!sameAsShipping) {
      if (!billingName) errors.billingName = 'This field is required';
      if (!billingStreet) errors.billingStreet = 'This field is required';
      if (!billingCity) errors.billingCity = 'This field is required';
      if (!billingState) errors.billingState = 'This field is required';
      if (!billingZip) errors.billingZip = 'This field is required';
      if (!billingCountry) errors.billingCountry = 'This field is required';
    }
    if (!agreed) errors.agreed = 'You must agree to the terms';
    setFormErrors(errors);
    // Autofocus and scroll to first error field
    if (Object.keys(errors).length > 0) {
      const firstErrorKey = Object.keys(errors)[0];
      if (fieldRefs[firstErrorKey] && fieldRefs[firstErrorKey].current) {
        fieldRefs[firstErrorKey].current.focus();
        fieldRefs[firstErrorKey].current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    // Placeholder for order submission logic
    // alert('Order placed! (This is a placeholder)');
    // For now, use a dummy session_id and navigate to /confirmation with query param
    navigate(`/confirmation?session_id=dummy_session_id`);
  };

  // Generic input handler for formData
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Shipping cost handler
  const handleShippingMethodChange = (e) => {
    const selected = e.target.value;
    setShippingMethod(selected);
    if (selected === 'standard') setShippingCost(5.99);
    else if (selected === 'expedited') setShippingCost(9.99);
    else if (selected === 'overnight') setShippingCost(19.99);
  };

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-20 text-[#222] font-mono">
        <h1 className="text-4xl font-extrabold tracking-tight mb-10 border-b pb-4 border-black uppercase">
          Secure Checkout
        </h1>
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <form onSubmit={handlePlaceOrder} className="space-y-8" noValidate>
            <section className="space-y-4">
              <h2 className="text-2xl font-bold uppercase tracking-wide border-b border-black pb-2">Step 1: Contact Information</h2>
              <div>
                <label htmlFor="email" className="block font-medium mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                  className={`w-full border bg-white px-4 py-2 text-sm tracking-wide placeholder-gray-500 ${
                    formErrors.email ? 'border-red-500' : 'border-black'
                  }`}
                  value={formData.email}
                  onChange={handleInputChange}
                  ref={fieldRefs.email}
                  placeholder="john@example.com"
                  aria-invalid={formErrors.email ? 'true' : 'false'}
                />
                {formErrors.email && (
                  <span className="text-red-500 text-xs">{formErrors.email}</span>
                )}
              </div>
              <div>
                <label htmlFor="phone" className="block font-medium mb-1">
                  Phone (optional)
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required={false}
                  pattern="^\+?[0-9\s\-().]{7,15}$"
                  className={`w-full border bg-white px-4 py-2 text-sm tracking-wide placeholder-gray-500 ${
                    formErrors.phone ? 'border-red-500' : 'border-black'
                  }`}
                  value={formData.phone}
                  onChange={handleInputChange}
                  ref={fieldRefs.phone}
                  placeholder="(123) 456-7890"
                  aria-invalid={formErrors.phone ? 'true' : 'false'}
                />
                {formErrors.phone && (
                  <span className="text-red-500 text-xs">{formErrors.phone}</span>
                )}
                <p className="text-sm text-gray-500 mt-1">Used only for delivery updates and order issues.</p>
              </div>
            </section>

            <hr className="border-t border-black my-8" />

            <section className="space-y-4">
              <h2 className="text-2xl font-bold uppercase tracking-wide border-b border-black pb-2">Step 2: Shipping Address</h2>
              <div>
                <label htmlFor="fullName" className="block font-medium mb-1">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  required
                  ref={fieldRefs.fullName}
                  className={`w-full border bg-white px-4 py-2 text-sm tracking-wide placeholder-gray-500 ${
                    formErrors.fullName ? 'border-red-500' : 'border-black'
                  }`}
                  placeholder="John Doe"
                  aria-invalid={formErrors.fullName ? 'true' : 'false'}
                />
                {formErrors.fullName && (
                  <span className="text-red-500 text-xs">{formErrors.fullName}</span>
                )}
              </div>
              <div>
                <label htmlFor="shippingStreet" className="block font-medium mb-1">
                  Street Address
                </label>
                <input
                  id="shippingStreet"
                  type="text"
                  value={shippingStreet}
                  onChange={(e) => setShippingStreet(e.target.value)}
                  required
                  ref={fieldRefs.shippingStreet}
                  className={`w-full border bg-white px-4 py-2 text-sm tracking-wide placeholder-gray-500 ${
                    formErrors.shippingStreet ? 'border-red-500' : 'border-black'
                  }`}
                  placeholder="123 Main St"
                  aria-invalid={formErrors.shippingStreet ? 'true' : 'false'}
                />
                {formErrors.shippingStreet && (
                  <span className="text-red-500 text-xs">{formErrors.shippingStreet}</span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="shippingCity" className="block font-medium mb-1">
                    City
                  </label>
                  <input
                    id="shippingCity"
                    type="text"
                    value={shippingCity}
                    onChange={(e) => setShippingCity(e.target.value)}
                    required
                    ref={fieldRefs.shippingCity}
                    className={`w-full border bg-white px-4 py-2 text-sm tracking-wide placeholder-gray-500 ${
                      formErrors.shippingCity ? 'border-red-500' : 'border-black'
                    }`}
                    placeholder="Anytown"
                    aria-invalid={formErrors.shippingCity ? 'true' : 'false'}
                  />
                  {formErrors.shippingCity && (
                    <span className="text-red-500 text-xs">{formErrors.shippingCity}</span>
                  )}
                </div>
                <div>
                  <label htmlFor="shippingState" className="block font-medium mb-1">
                    State
                  </label>
                  <select
                    id="shippingState"
                    value={shippingState}
                    onChange={(e) => setShippingState(e.target.value)}
                    required
                    ref={fieldRefs.shippingState}
                    className={`w-full border bg-white px-4 py-2 text-sm tracking-wide ${
                      formErrors.shippingState ? 'border-red-500' : 'border-black'
                    }`}
                    aria-invalid={formErrors.shippingState ? 'true' : 'false'}
                  >
                    <option value="">Select a state</option>
                    <option value="AL">Alabama</option>
                    <option value="AK">Alaska</option>
                    <option value="AZ">Arizona</option>
                    <option value="AR">Arkansas</option>
                    <option value="CA">California</option>
                    <option value="CO">Colorado</option>
                    <option value="CT">Connecticut</option>
                    <option value="DE">Delaware</option>
                    <option value="FL">Florida</option>
                    <option value="GA">Georgia</option>
                    <option value="HI">Hawaii</option>
                    <option value="ID">Idaho</option>
                    <option value="IL">Illinois</option>
                    <option value="IN">Indiana</option>
                    <option value="IA">Iowa</option>
                    <option value="KS">Kansas</option>
                    <option value="KY">Kentucky</option>
                    <option value="LA">Louisiana</option>
                    <option value="ME">Maine</option>
                    <option value="MD">Maryland</option>
                    <option value="MA">Massachusetts</option>
                    <option value="MI">Michigan</option>
                    <option value="MN">Minnesota</option>
                    <option value="MS">Mississippi</option>
                    <option value="MO">Missouri</option>
                    <option value="MT">Montana</option>
                    <option value="NE">Nebraska</option>
                    <option value="NV">Nevada</option>
                    <option value="NH">New Hampshire</option>
                    <option value="NJ">New Jersey</option>
                    <option value="NM">New Mexico</option>
                    <option value="NY">New York</option>
                    <option value="NC">North Carolina</option>
                    <option value="ND">North Dakota</option>
                    <option value="OH">Ohio</option>
                    <option value="OK">Oklahoma</option>
                    <option value="OR">Oregon</option>
                    <option value="PA">Pennsylvania</option>
                    <option value="RI">Rhode Island</option>
                    <option value="SC">South Carolina</option>
                    <option value="SD">South Dakota</option>
                    <option value="TN">Tennessee</option>
                    <option value="TX">Texas</option>
                    <option value="UT">Utah</option>
                    <option value="VT">Vermont</option>
                    <option value="VA">Virginia</option>
                    <option value="WA">Washington</option>
                    <option value="WV">West Virginia</option>
                    <option value="WI">Wisconsin</option>
                    <option value="WY">Wyoming</option>
                  </select>
                  {formErrors.shippingState && (
                    <span className="text-xs text-red-600">{formErrors.shippingState}</span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="shippingZip" className="block font-medium mb-1">
                    ZIP Code
                  </label>
                  <input
                    id="shippingZip"
                    type="text"
                    value={shippingZip}
                    onChange={(e) => setShippingZip(e.target.value)}
                    required
                    pattern="[A-Za-z0-9 ]{3,10}"
                    ref={fieldRefs.shippingZip}
                    className={`w-full border bg-white px-4 py-2 text-sm tracking-wide placeholder-gray-500 ${
                      formErrors.shippingZip ? 'border-red-500' : 'border-black'
                    }`}
                    placeholder="90210"
                    aria-invalid={formErrors.shippingZip ? 'true' : 'false'}
                  />
                  {formErrors.shippingZip && (
                    <span className="text-red-500 text-xs">{formErrors.shippingZip}</span>
                  )}
                </div>
                <div>
                  <label htmlFor="shippingCountry" className="block font-medium mb-1">
                    Country
                  </label>
                  <input
                    id="shippingCountry"
                    type="text"
                    value={shippingCountry}
                    onChange={(e) => setShippingCountry(e.target.value)}
                    required
                    ref={fieldRefs.shippingCountry}
                    className={`w-full border bg-white px-4 py-2 text-sm tracking-wide placeholder-gray-500 ${
                      formErrors.shippingCountry ? 'border-red-500' : 'border-black'
                    }`}
                    placeholder="United States"
                    aria-invalid={formErrors.shippingCountry ? 'true' : 'false'}
                  />
                  {formErrors.shippingCountry && (
                    <span className="text-red-500 text-xs">{formErrors.shippingCountry}</span>
                  )}
                </div>
              </div>
              {/* Shipping Method Selector */}
              <div className="mb-6">
                <label htmlFor="shippingMethod" className="block text-sm font-medium text-gray-700">
                  Shipping Method <span className="text-red-600">*</span> (Required)
                </label>
                <select
                  id="shippingMethod"
                  name="shippingMethod"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm"
                  value={shippingMethod}
                  onChange={handleShippingMethodChange}
                  ref={fieldRefs.shippingMethod}
                  required
                  aria-invalid={formErrors.shippingMethod ? 'true' : 'false'}
                >
                  <option value="standard">Standard (5-7 business days) - $5.99</option>
                  <option value="expedited">Expedited (2-3 business days) - $9.99</option>
                  <option value="overnight">Overnight (1 business day) - $19.99</option>
                </select>
                {formErrors.shippingMethod && (
                  <span className="text-xs text-red-600">{formErrors.shippingMethod}</span>
                )}
              </div>
              <div className="mt-4">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={sameAsShipping}
                    onChange={(e) => setSameAsShipping(e.target.checked)}
                  />
                  Billing address is same as shipping
                </label>
              </div>
            </section>

            {!sameAsShipping && (
              <>
                <hr className="border-t border-black my-8" />
                <section className="space-y-4">
                  <h2 className="text-2xl font-bold uppercase tracking-wide border-b border-black pb-2">Step 3: Billing Address</h2>
                  <div>
                    <label htmlFor="billingName" className="block font-medium mb-1">
                      Name
                    </label>
                    <input
                      id="billingName"
                      type="text"
                      value={billingName}
                      onChange={(e) => setBillingName(e.target.value)}
                      required
                      ref={fieldRefs.billingName}
                      className={`w-full border bg-white px-4 py-2 text-sm tracking-wide placeholder-gray-500 ${
                        formErrors.billingName ? 'border-red-500' : 'border-black'
                      }`}
                      placeholder="John Doe"
                      aria-invalid={formErrors.billingName ? 'true' : 'false'}
                    />
                    {formErrors.billingName && (
                      <span className="text-red-500 text-xs">{formErrors.billingName}</span>
                    )}
                  </div>
                  <div>
                    <label htmlFor="billingStreet" className="block font-medium mb-1">
                      Street Address
                    </label>
                    <input
                      id="billingStreet"
                      type="text"
                      value={billingStreet}
                      onChange={(e) => setBillingStreet(e.target.value)}
                      required
                      ref={fieldRefs.billingStreet}
                      className={`w-full border bg-white px-4 py-2 text-sm tracking-wide placeholder-gray-500 ${
                        formErrors.billingStreet ? 'border-red-500' : 'border-black'
                      }`}
                      placeholder="456 Another Rd"
                      aria-invalid={formErrors.billingStreet ? 'true' : 'false'}
                    />
                    {formErrors.billingStreet && (
                      <span className="text-red-500 text-xs">{formErrors.billingStreet}</span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="billingCity" className="block font-medium mb-1">
                        City
                      </label>
                      <input
                        id="billingCity"
                        type="text"
                        value={billingCity}
                        onChange={(e) => setBillingCity(e.target.value)}
                        required
                        ref={fieldRefs.billingCity}
                        className={`w-full border bg-white px-4 py-2 text-sm tracking-wide placeholder-gray-500 ${
                          formErrors.billingCity ? 'border-red-500' : 'border-black'
                        }`}
                        placeholder="Othertown"
                        aria-invalid={formErrors.billingCity ? 'true' : 'false'}
                      />
                      {formErrors.billingCity && (
                        <span className="text-red-500 text-xs">{formErrors.billingCity}</span>
                      )}
                    </div>
                    <div>
                      <label htmlFor="billingState" className="block font-medium mb-1">
                        State
                      </label>
                      <select
                        id="billingState"
                        value={billingState}
                        onChange={(e) => setBillingState(e.target.value)}
                        required
                        ref={fieldRefs.billingState}
                        className={`w-full border bg-white px-4 py-2 text-sm tracking-wide ${
                          formErrors.billingState ? 'border-red-500' : 'border-black'
                        }`}
                        aria-invalid={formErrors.billingState ? 'true' : 'false'}
                      >
                        <option value="">Select a state</option>
                        <option value="AL">Alabama</option>
                        <option value="AK">Alaska</option>
                        <option value="AZ">Arizona</option>
                        <option value="AR">Arkansas</option>
                        <option value="CA">California</option>
                        <option value="CO">Colorado</option>
                        <option value="CT">Connecticut</option>
                        <option value="DE">Delaware</option>
                        <option value="FL">Florida</option>
                        <option value="GA">Georgia</option>
                        <option value="HI">Hawaii</option>
                        <option value="ID">Idaho</option>
                        <option value="IL">Illinois</option>
                        <option value="IN">Indiana</option>
                        <option value="IA">Iowa</option>
                        <option value="KS">Kansas</option>
                        <option value="KY">Kentucky</option>
                        <option value="LA">Louisiana</option>
                        <option value="ME">Maine</option>
                        <option value="MD">Maryland</option>
                        <option value="MA">Massachusetts</option>
                        <option value="MI">Michigan</option>
                        <option value="MN">Minnesota</option>
                        <option value="MS">Mississippi</option>
                        <option value="MO">Missouri</option>
                        <option value="MT">Montana</option>
                        <option value="NE">Nebraska</option>
                        <option value="NV">Nevada</option>
                        <option value="NH">New Hampshire</option>
                        <option value="NJ">New Jersey</option>
                        <option value="NM">New Mexico</option>
                        <option value="NY">New York</option>
                        <option value="NC">North Carolina</option>
                        <option value="ND">North Dakota</option>
                        <option value="OH">Ohio</option>
                        <option value="OK">Oklahoma</option>
                        <option value="OR">Oregon</option>
                        <option value="PA">Pennsylvania</option>
                        <option value="RI">Rhode Island</option>
                        <option value="SC">South Carolina</option>
                        <option value="SD">South Dakota</option>
                        <option value="TN">Tennessee</option>
                        <option value="TX">Texas</option>
                        <option value="UT">Utah</option>
                        <option value="VT">Vermont</option>
                        <option value="VA">Virginia</option>
                        <option value="WA">Washington</option>
                        <option value="WV">West Virginia</option>
                        <option value="WI">Wisconsin</option>
                        <option value="WY">Wyoming</option>
                      </select>
                      {formErrors.billingState && (
                        <span className="text-xs text-red-600">{formErrors.billingState}</span>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="billingZip" className="block font-medium mb-1">
                        ZIP Code
                      </label>
                      <input
                        id="billingZip"
                        type="text"
                        value={billingZip}
                        onChange={(e) => setBillingZip(e.target.value)}
                        required
                        pattern="[A-Za-z0-9 ]{3,10}"
                        ref={fieldRefs.billingZip}
                        className={`w-full border bg-white px-4 py-2 text-sm tracking-wide placeholder-gray-500 ${
                          formErrors.billingZip ? 'border-red-500' : 'border-black'
                        }`}
                        placeholder="10001"
                        aria-invalid={formErrors.billingZip ? 'true' : 'false'}
                      />
                      {formErrors.billingZip && (
                        <span className="text-red-500 text-xs">{formErrors.billingZip}</span>
                      )}
                    </div>
                    <div>
                      <label htmlFor="billingCountry" className="block font-medium mb-1">
                        Country
                      </label>
                      <input
                        id="billingCountry"
                        type="text"
                        value={billingCountry}
                        onChange={(e) => setBillingCountry(e.target.value)}
                        required
                        ref={fieldRefs.billingCountry}
                        className={`w-full border bg-white px-4 py-2 text-sm tracking-wide placeholder-gray-500 ${
                          formErrors.billingCountry ? 'border-red-500' : 'border-black'
                        }`}
                        placeholder="United States"
                        aria-invalid={formErrors.billingCountry ? 'true' : 'false'}
                      />
                      {formErrors.billingCountry && (
                        <span className="text-red-500 text-xs">{formErrors.billingCountry}</span>
                      )}
                    </div>
                  </div>
                </section>
              </>
            )}

            <hr className="border-t border-black my-8" />

            <section className="space-y-4">
              <h2 className="text-2xl font-bold uppercase tracking-wide border-b border-black pb-2">Step 4: Payment</h2>
              <div>
                <label htmlFor="paymentDetails" className="block font-medium mb-1">
                  Payment Details - (Stripe integration to come)
                </label>
                <div className="flex items-center gap-4 mt-2 mb-2">
                  <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" alt="Visa" className="h-6 w-auto" />
                  <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6 w-auto" />
                  <img src="./images/discover.jpg" alt="Discover" className="h-6 w-auto" />
                  <img src="./images/amex.png" alt="American Express" className="h-6 w-auto" />
                </div>
                {/* <input ... /> */}
              </div>
            </section>

            <hr className="border-t border-black my-8" />

            <section className="space-y-4">
              <h2 className="text-2xl font-bold uppercase tracking-wide border-b border-black pb-2">Step 5: Order Summary</h2>
              {regularItems.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-2">Items</h3>
                  <ul className="space-y-2">
                    {regularItems.map((item) => (
                      <li key={item.id} className="flex justify-between text-sm border-b border-dashed border-gray-400 py-1">
                        <span>{item.quantity} × {item.title || 'Untitled Book'}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {preorderItems.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-2">Preorder</h3>
                  <ul className="space-y-2">
                    {preorderItems.map((item) => (
                      <li key={item.id} className="flex justify-between text-sm border-b border-dashed border-gray-400 py-1">
                        <span>{item.quantity} × {item.title || 'Untitled Book'}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                  <p className="text-xs text-red-600 italic mt-1">
                    Preorder items may take up to 6 months to ship.
                  </p>
                </div>
              )}
              <div className="checkout-totals border-t-2 border-black pt-4 font-bold text-lg">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>${shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax:</span>
                  <span>$0.00</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>${(subtotal + shippingCost).toFixed(2)}</span>
                </div>
              </div>
              <div className="checkout-notes mt-4 text-xs text-gray-700 space-y-1">
                <p>🔒 100% Secure Checkout via Stripe</p>
                <p>A confirmation email will be sent after placing your order.</p>
                <p>📦 Preorder items may take up to 6 months to ship.</p>
              </div>
            </section>

            <hr className="border-t border-black my-8" />

            <section className="space-y-4">
              <h2 className="text-2xl font-bold uppercase tracking-wide border-b border-black pb-2">Step 6: Confirmation</h2>
              <label className="inline-flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  required
                  ref={fieldRefs.agreed}
                  className={formErrors.agreed ? 'border-red-500' : ''}
                  aria-invalid={formErrors.agreed ? 'true' : 'false'}
                />
                I agree to terms and refund policy
              </label>
              {formErrors.agreed && (
                <span className="text-xs text-red-600">{formErrors.agreed}</span>
              )}
              <p className="text-xs mt-2">
                By placing your order, you agree to the
                <a href="/terms" target="_blank" className="underline ml-1">Terms of Service</a>,
                <a href="/refund" target="_blank" className="underline ml-1">Refund Policy</a>, and
                <a href="/privacy" target="_blank" className="underline ml-1">Privacy Policy</a>.
              </p>
            </section>

            <hr className="border-t border-black my-8" />

            <section>
              <button
                type="submit"
                disabled={!agreed}
                className={`w-full px-6 py-3 uppercase text-sm tracking-wider border-2 border-black transition-all duration-200 ${
                  agreed ? 'bg-black text-white hover:bg-white hover:text-black' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                }`}
              >
                Place Order
              </button>
              <p className="mt-4 text-xs text-gray-600 text-center flex items-center justify-center gap-1">
                <Lock className="inline-block w-4 h-4" />
                All transactions are encrypted and securely processed via <strong>Stripe</strong>.
              </p>
            </section>
          </form>
        )}
      </main>
      <Footer />
    </>
  );
}