'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import products from '@/data/products';
import { useCartStore } from '@/store/cart';

export const dynamicParams = true;

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;
  
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);

  // Find product
  const product = products.find((p) => p.id === productId);

  // Client-side hydration guard
  const [isClient, setIsClient] = useState(false);
  const [mainImage, setMainImage] = useState(product?.images[0]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Default to first variant
  const [selectedVariantId, setSelectedVariantId] = useState(
    product?.variants[0].id || 'default'
  );
  const [showToast, setShowToast] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-zinc-800 mb-4">Product Not Found</h1>
          <Link
            href="/"
            className="text-amber-600 hover:text-amber-700 font-semibold"
          >
            ← Back to Products
          </Link>
        </div>
      </div>
    );
  }

  const selectedVariant = product.variants.find((v) => v.id === selectedVariantId) || product.variants[0];
  const currentPrice = selectedVariant.price;
  const isPriceAvailable = currentPrice !== null;

  // Update main image when product changes
  useEffect(() => {
    if (product?.images[0]) {
      setMainImage(product.images[0]);
    }
  }, [product]);

  // Build variant display name
  const getVariantName = () => {
    const parts: string[] = [];
    Object.entries(selectedVariant.optionValues).forEach(([key, value]) => {
      parts.push(value);
    });
    return parts.length > 0 ? parts.join(' - ') : 'Standard';
  };

  const variantName = getVariantName();

  const handleAddToCart = () => {
    if (!isPriceAvailable || !currentPrice) return;
    
    addItem({
      productId: product.id,
      productName: product.name,
      variant: selectedVariant.optionValues,
      variantName,
      price: currentPrice,
    });

    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      openCart();
    }, 800);
  };

  // Helper to get image src (handles both external URLs and local paths)
  const getImageSrc = (src: string) => {
    return src; // For production with basePath, update next.config.js
  };

  const mainImageSrc = getImageSrc(mainImage?.src || product.images[0].src);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-2 text-sm text-zinc-600">
            <Link href="/" className="hover:text-amber-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-zinc-400">{product.category}</span>
            <span>/</span>
            <span className="text-zinc-800 font-semibold">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-amber-600 hover:text-amber-700 font-semibold transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
          Back
        </button>
      </div>

      {/* Two-Column Layout */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Image Gallery */}
          <div>
            {/* Desktop: Thumbnails Left, Main Image Right */}
            <div className="hidden lg:flex gap-4">
              {/* Vertical Thumbnail Sidebar (Desktop Only) */}
              {product.images.length > 1 && (
                <div className="flex flex-col gap-2">
                  {product.images.map((image, idx) => {
                    const isActive = mainImage?.src === image.src;
                    return (
                      <button
                        key={idx}
                        onClick={() => setMainImage(image)}
                        className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
                          isActive
                            ? 'border-blue-500 ring-2 ring-blue-200'
                            : 'border-stone-300 hover:border-blue-300'
                        }`}
                      >
                        <div className="relative w-full h-full bg-stone-100">
                          <Image
                            src={getImageSrc(image.src)}
                            alt={image.alt}
                            fill
                            unoptimized
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Main Image (Desktop) */}
              <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative aspect-square bg-stone-100">
                  <Image
                    src={mainImageSrc}
                    alt={mainImage?.alt || product.images[0].alt}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Mobile: Main Image Top, Thumbnails Bottom */}
            <div className="lg:hidden space-y-4">
              {/* Main Image (Mobile) */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="relative aspect-square bg-stone-100">
                  <Image
                    src={mainImageSrc}
                    alt={mainImage?.alt || product.images[0].alt}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="100vw"
                    priority
                  />
                </div>
              </div>

              {/* Horizontal Thumbnails (Mobile) */}
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {product.images.map((image, idx) => {
                    const isActive = mainImage?.src === image.src;
                    return (
                      <button
                        key={idx}
                        onClick={() => setMainImage(image)}
                        className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
                          isActive
                            ? 'border-blue-500 ring-2 ring-blue-200'
                            : 'border-stone-300 hover:border-blue-300'
                        }`}
                      >
                        <div className="relative w-full h-full bg-stone-100">
                          <Image
                            src={getImageSrc(image.src)}
                            alt={image.alt}
                            fill
                            unoptimized
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-zinc-800 mb-2">
                {product.name}
              </h1>
              <p className="text-sm font-semibold text-amber-600 uppercase tracking-wide">
                {product.category}
              </p>
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <p className="text-lg text-zinc-700 leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div>
                <h2 className="text-xl font-bold text-zinc-800 mb-3">Features</h2>
                <ul className="space-y-2">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-zinc-700">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2.5}
                        stroke="currentColor"
                        className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m4.5 12.75 6 6 9-13.5"
                        />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Variant Options */}
            {product.variants.length > 1 && product.options && (
              <div className="space-y-4">
                {product.options.map((option) => (
                  <div key={option.id}>
                    <label className="block text-sm font-bold text-zinc-800 mb-2">
                      {option.label}:
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {option.values.map((value) => {
                        const matchingVariant = product.variants.find(
                          (v) => v.optionValues[option.id] === value
                        );
                        if (!matchingVariant) return null;

                        const isSelected = selectedVariantId === matchingVariant.id;
                        
                        return (
                          <button
                            key={value}
                            onClick={() => setSelectedVariantId(matchingVariant.id)}
                            className={`py-2 px-4 rounded-lg border-2 font-medium transition-all ${
                              isSelected
                                ? 'border-amber-500 bg-amber-50 text-amber-600'
                                : 'border-stone-200 hover:border-amber-300 text-zinc-600'
                            }`}
                          >
                            {value}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Stock Info */}
            {selectedVariant.stockQty !== null && (
              <div className="flex items-center gap-2 text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5 text-green-600"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m4.5 12.75 6 6 9-13.5"
                  />
                </svg>
                <span className="text-green-700 font-semibold">
                  {selectedVariant.stockQty} in stock
                </span>
              </div>
            )}

            {/* Price and Add to Cart */}
            <div className="bg-stone-100 rounded-lg p-6 space-y-4">
              <div className="flex items-baseline gap-2">
                {isPriceAvailable ? (
                  <>
                    <span className="text-4xl font-bold text-amber-500">
                      £{currentPrice.toFixed(2)}
                    </span>
                    {selectedVariant.msrp && (
                      <span className="text-lg text-zinc-500 line-through">
                        £{selectedVariant.msrp.toFixed(2)}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-xl font-semibold text-zinc-600">
                    Contact for Price
                  </span>
                )}
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!isPriceAvailable}
                className={`w-full font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-3 ${
                  isPriceAvailable
                    ? 'bg-amber-500 hover:bg-amber-600 text-white cursor-pointer'
                    : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                }`}
              >
                {!isClient ? (
                  'Loading...'
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
                        d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                      />
                    </svg>
                    <span>{isPriceAvailable ? 'Add to Cart' : 'Unavailable'}</span>
                  </>
                )}
              </button>
            </div>

            {/* Additional Notes */}
            {selectedVariant.notes && (
              <div className="text-sm text-zinc-600 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="font-semibold text-blue-800 mb-1">Note:</p>
                <p>{selectedVariant.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m4.5 12.75 6 6 9-13.5"
            />
          </svg>
          Added to cart!
        </div>
      )}
    </div>
  );
}
