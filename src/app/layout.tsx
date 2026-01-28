//src\app\layout.tsx


import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import CartDrawer from '@/components/CartDrawer';
import FloatingCartButton from '@/components/FloatingCartButton';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Urban Bees Sale - Premium Beekeeping Supplies',
  description: 'Shop premium beekeeping supplies and raw urban honey from Urban Bees. Support local beekeepers and urban pollinators.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {children}
        <CartDrawer />
        <FloatingCartButton />
      </body>
    </html>
  );
}
