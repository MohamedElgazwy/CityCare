'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

type Category = { id: number; name: string };
type Technician = { id: number; name: string; description: string; price: number; rating: number; photoUrl?: string };

export default function ServicesPage() {
  const router = useRouter();
  const { user, hydrate, hydrated } = useAuthStore();
  const [techs, setTechs] = useState<Technician[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [rating, setRating] = useState('');

  useEffect(() => { hydrate(); }, [hydrate]);
  useEffect(() => {
    if (!hydrated) return;
    if (!user) return void router.push('/auth/login');
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
    <main className="min-h-screen px-6 py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-bold text-slate-900">Find a service</h1>
        <p className="mt-2 text-slate-600">Filter by specialty, budget, and rating to hire the right technician.</p>

        <Card className="mt-6 grid gap-3 md:grid-cols-5">
          <Input placeholder="Search by name" onChange={(e) => setName(e.target.value)} />
          <select onChange={(e) => setCategoryId(e.target.value)} className="rounded-2xl border border-white/60 bg-white/70 px-4 py-2.5 text-sm text-slate-800">
            <option value="">All Categories</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <Input placeholder="Min price" type="number" onChange={(e) => setMinPrice(e.target.value)} />
          <Input placeholder="Min rating" type="number" onChange={(e) => setRating(e.target.value)} />
          <Button onClick={search}>{isLoading ? 'Searching...' : 'Search'}</Button>
        </Card>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {techs.map((t) => (
            <Card key={t.id} className="hover:-translate-y-1 transition">
              <h2 className="text-xl font-semibold text-slate-900">{t.name}</h2>
              {t.photoUrl && <img src={t.photoUrl} alt={`${t.name} profile`} className="mt-3 h-16 w-16 rounded-full object-cover" />}
              <p className="mt-2 text-slate-600">{t.description}</p>
              <div className="mt-4 flex items-center justify-between text-sm text-slate-700"><span>Price: ${t.price}</span><span>⭐ {t.rating}</span></div>
              <Button className="mt-4" onClick={async () => {
                try {
                  await api('/bookings', { method: 'POST', body: JSON.stringify({ technicianId: t.id }) });
                  setIsModalOpen(true);
                } catch {
                  alert('Failed to book technician. Please try again.');
                }
              }}>Book Now</Button>
            </Card>
          ))}
        </div>
        <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} title="Booking Requested">Your booking request was sent successfully.</Modal>
      </div>
    </main>
  );
}
