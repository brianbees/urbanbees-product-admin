'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '@/store/cart';

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const totalItems = useCartStore((state) => state.getTotalItems());

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">🐝</span>
            </div>
            <span className="text-2xl font-bold text-zinc-800">Urban Bees</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-zinc-800 hover:text-amber-500 transition-colors font-medium"
            >
              Products
            </Link>
            <a
              href="https://www.urbanbees.co.uk"
              className="text-zinc-800 hover:text-amber-500 transition-colors font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              Back to Main Site
            </a>
          </nav>

          <button
            onClick={toggleCart}
            className="relative p-2 hover:bg-stone-100 rounded-lg transition-colors"
            aria-label="Open cart"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-zinc-800"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
              />
            </svg>
            {mounted && totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>

        <nav className="md:hidden mt-4 flex items-center justify-center space-x-4 text-sm">
          <Link
            href="/"
            className="text-zinc-800 hover:text-amber-500 transition-colors font-medium"
          >
            Products
          </Link>
          <a
            href="https://www.urbanbees.co.uk"
            className="text-zinc-800 hover:text-amber-500 transition-colors font-medium"
            target="_blank"
            rel="noopener noreferrer"
          >
            Main Site
          </a>
        </nav>
      </div>
    </header>
  );
}
