'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AddProductPage() {
  const router = useRouter();

  const [websiteProducts, setWebsiteProducts] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState('');
  const [manualMode, setManualMode] = useState(false);
  const [manualName, setManualName] = useState('');

  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  // Load product names from website_products
  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await supabase
        .from('website_products')
        .select('id, name')
        .order('name');

      if (!error && data) setWebsiteProducts(data);
    }

    loadProducts();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const uploadedUrls: string[] = [];

    // Upload images
    for (const file of images) {
      const filePath = `products/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file);

      if (error) {
        console.error(error);
        setLoading(false);
        return;
      }

      const url = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath).data.publicUrl;

      uploadedUrls.push(url);
    }

    // Determine product name + ID
    const productName = manualMode
      ? manualName
      : websiteProducts.find((p) => p.id === selectedProductId)?.name;

    const productIdToSave = manualMode
      ? manualName.toLowerCase().replace(/\s+/g, '-')
      : selectedProductId;

    // Insert into products table
    const { error } = await supabase.from('products').insert([
      {
        id: productIdToSave,
        name: productName,
        category,
        description,
        images: uploadedUrls,
      },
    ]);

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push('/add-variant');
  }

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-bold mb-4">Add Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Toggle for manual entry */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={manualMode}
            onChange={(e) => setManualMode(e.target.checked)}
          />
          This product is not on the website list
        </label>

        {/* Product name dropdown OR manual input */}
        {!manualMode && (
          <select
            className="w-full p-2 border rounded"
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            required={!manualMode}
          >
            <option value="">Select product name</option>
            {websiteProducts.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        )}

        {manualMode && (
          <input
            type="text"
            placeholder="Enter product name"
            className="w-full p-2 border rounded"
            value={manualName}
            onChange={(e) => setManualName(e.target.value)}
            required={manualMode}
          />
        )}

        {/* Category dropdown */}
        <select
          className="w-full p-2 border rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="">Select category</option>
          <option value="hive">Hive</option>
          <option value="frames">Frames</option>
          <option value="foundation">Foundation</option>
          <option value="equipment">Equipment</option>
          <option value="clothing">Clothing</option>
          <option value="other">Other</option>
        </select>

        {/* Description */}
        <textarea
          placeholder="Description"
          className="w-full p-2 border rounded"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Image upload */}
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setImages(Array.from(e.target.files || []))}
          className="w-full"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-2 rounded"
        >
          {loading ? 'Saving…' : 'Save Product'}
        </button>
      </form>
    </div>
  );
}
