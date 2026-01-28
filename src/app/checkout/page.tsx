'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/cart';

export default function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const total = getTotalPrice();

  const handleCheckout = () => {
    if (items.length === 0) return;

    setIsRedirecting(true);
    const paypalUrl = `https://www.paypal.me/UrbanBees/${total.toFixed(2)}`;
    
    // Redirect to PayPal
    window.location.href = paypalUrl;
  };

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-stone-100">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-16 h-16 text-stone-300 mx-auto mb-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
            <h1 className="text-2xl font-bold text-zinc-800 mb-2">Your cart is empty</h1>
            <p className="text-zinc-600 mb-6">Add some items before checking out</p>
            <Link
              href="/"
              className="inline-block bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Browse Products
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-stone-100">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold text-zinc-800 mb-8">Checkout</h1>

          <div className="bg-white rounded-lg shadow-md p-6 md:p-8 mb-6">
            <h2 className="text-xl font-bold text-zinc-800 mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantName}`}
                  className="flex justify-between items-start pb-4 border-b border-stone-200 last:border-0"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-zinc-800">{item.productName}</h3>
                    <p className="text-sm text-zinc-600 mt-1">{item.variantName}</p>
                    <p className="text-sm text-zinc-600 mt-1">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-zinc-800">
                      £{(item.price * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-sm text-zinc-600">£{item.price.toFixed(2)} each</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t-2 border-zinc-800">
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-zinc-800">Total:</span>
                <span className="text-3xl font-bold text-amber-500">
                  £{total.toFixed(2)} GBP
                </span>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6 mb-6">
            <div className="flex gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 text-amber-600 flex-shrink-0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z"
                />
              </svg>
              <div>
                <h3 className="font-bold text-amber-800 mb-2">Important: Order Details</h3>
                <p className="text-amber-900 text-sm leading-relaxed">
                  <strong>Please mention your items in the PayPal note on the next screen</strong> so we can 
                  fulfil your order correctly. Include the product names, variants, and quantities from 
                  the order summary above.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleCheckout}
              disabled={isRedirecting}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 text-white font-bold py-4 px-6 rounded-lg transition-colors text-lg flex items-center justify-center gap-3"
            >
              {isRedirecting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Redirecting to PayPal...
                </>
              ) : (
                <>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
                    />
                  </svg>
                  Pay with PayPal
                </>
              )}
            </button>

            <Link
              href="/"
              className="block w-full text-center text-zinc-600 hover:text-zinc-800 font-medium py-3 transition-colors"
            >
              ← Continue Shopping
            </Link>
          </div>

          <div className="mt-8 p-6 bg-white rounded-lg shadow-sm">
            <h3 className="font-semibold text-zinc-800 mb-3">Secure Payment via PayPal</h3>
            <p className="text-sm text-zinc-600 leading-relaxed">
              You'll be redirected to PayPal.me to complete your payment securely. 
              After payment, we'll process your order and contact you for delivery arrangements. 
              Your cart will remain saved until you complete the purchase.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
