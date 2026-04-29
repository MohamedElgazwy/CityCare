'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';

type Category = { id: number; name: string };
type Technician = {
  id: number;
  name: string;
  description: string;
  price: number;
  rating: number;
  photoUrl?: string;
};

export default function ServicesPage() {
  const router = useRouter();
  const { user, hydrate, hydrated } = useAuthStore();
  const [techs, setTechs] = useState<Technician[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [rating, setRating] = useState('');

  useEffect(() => { hydrate(); }, [hydrate]);

  useEffect(() => {
    if (!hydrated) return;
    if (!user) return router.push('/auth/login');
    api('/categories').then(setCategories);
    api('/technicians').then((res) => Array.isArray(res) && setTechs(res));
  }, [hydrated, router, user]);

  const search = async () => {
    setIsLoading(true);
    const query = new URLSearchParams({ name, categoryId, minPrice, rating });
    const res = await api(`/technicians/search?${query}`);
    setTechs(res);
    setIsLoading(false);
  };

  if (!hydrated || !user) return <p className="p-6">Loading...</p>;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-slate-900">Find a service</h1>
        <p className="mt-2 text-slate-600">Filter by specialty, budget, and rating to hire the right technician.</p>

        <div className="mt-6 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-5">
          <input placeholder="Search by name" onChange={(e) => setName(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2" />
          <select onChange={(e) => setCategoryId(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2">
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <input placeholder="Min price" type="number" onChange={(e) => setMinPrice(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2" />
          <input placeholder="Min rating" type="number" onChange={(e) => setRating(e.target.value)} className="rounded-lg border border-slate-300 px-3 py-2" />
          <button onClick={search} className="rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white hover:bg-slate-700">
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {techs.map((t) => (
            <article key={t.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">{t.name}</h2>
              {t.photoUrl && <img src={t.photoUrl} alt={`${t.name} profile`} className="mt-3 h-16 w-16 rounded-full object-cover" />}
              <p className="mt-2 text-slate-600">{t.description}</p>
              <div className="mt-4 flex items-center justify-between text-sm text-slate-700">
                <span>Price: ${t.price}</span>
                <span>⭐ {t.rating}</span>
              </div>
              <button onClick={() => api('/bookings', { method: 'POST', body: JSON.stringify({ technicianId: t.id }) })} className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500">
                Book Now
              </button>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
