'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function ServicesPage() {
  const [techs, setTechs] = useState([]);
  const [categories, setCategories] = useState([]);

  // 🔍 filters
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [rating, setRating] = useState('');

  // 📥 load categories
  useEffect(() => {
    api('/categories').then(setCategories);
  }, []);

  // 🔍 search function
  const search = async () => {
    const query = new URLSearchParams({
      name,
      categoryId,
      minPrice,
      rating,
    });

    const res = await api(`/technicians/search?${query}`);
    setTechs(res);
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl mb-4">Services</h1>

      {/* 🔍 Filters */}
      <div className="bg-gray-100 p-4 mb-6 rounded">
        <input
          placeholder="Search by name"
          onChange={(e) => setName(e.target.value)}
          className="border p-2 mr-2"
        />

        <select
          onChange={(e) => setCategoryId(e.target.value)}
          className="border p-2 mr-2"
        >
          <option value="">All Categories</option>
          {categories.map((c: any) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          placeholder="Min Price"
          type="number"
          onChange={(e) => setMinPrice(e.target.value)}
          className="border p-2 mr-2"
        />

        <input
          placeholder="Rating (e.g 4)"
          type="number"
          onChange={(e) => setRating(e.target.value)}
          className="border p-2 mr-2"
        />

        <button
          onClick={search}
          className="bg-black text-white p-2"
        >
          Search
        </button>
      </div>

      {/* 👨‍🔧 Results */}
      {techs.map((t: any) => (
        <div key={t.id} className="border p-4 mb-4">
          <h2 className="text-lg">{t.name}</h2>
          <p>{t.description}</p>
          <p>Price: {t.price}</p>
          <p>Rating: {t.rating}</p>

          <button
            onClick={() =>
              api(`/bookings/${t.id}`, { method: 'POST' })
            }
            className="bg-green-500 text-white p-2 mt-2"
          >
            Book Now
          </button>
        </div>
      ))}
    </div>
  );
}