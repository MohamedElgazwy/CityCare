'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

type Technician = { id: number; name: string; description: string; isApproved: boolean; user?: { email: string } };
type Category = { id: number; name: string };
type Booking = { id: number; status: string; user?: { email: string } };

export default function AdminDashboard() {
  const router = useRouter();
  const { user, hydrate, hydrated } = useAuthStore();
  const [techs, setTechs] = useState<Technician[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { hydrate(); }, [hydrate]);

  useEffect(() => {
    if (!hydrated) return;
    if (!user) return router.push('/auth/login');
    if (user.role !== 'ADMIN') return router.push('/services');

    api('/technicians/admin/all').then((res) => Array.isArray(res) && setTechs(res));
    api('/bookings/all').then((res) => Array.isArray(res) && setBookings(res));
    api('/categories').then((res) => Array.isArray(res) && setCategories(res));
  }, [hydrated, router, user]);

  const approve = async (id: number) => {
    await api(`/technicians/${id}/approve`, { method: 'PATCH' });
    setTechs((prev) => prev.map((t) => (t.id === id ? { ...t, isApproved: true } : t)));
  };

  const addCategory = async () => { /* unchanged */
    setError('');
    const name = categoryName.trim();
    if (!name) return setError('Category name is required.');
    setSaving(true);
    try {
      const res = await api('/categories', { method: 'POST', body: JSON.stringify({ name }) });
      if (res?.message) return setError(Array.isArray(res.message) ? res.message.join(', ') : res.message);
      setCategoryName('');
      const list = await api('/categories');
      if (Array.isArray(list)) setCategories(list);
    } finally { setSaving(false); }
  };

  if (!hydrated || !user) return <p>Loading...</p>;

  return (<div className="space-y-6">
    <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
    {error && <p className="text-red-500">{error}</p>}
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
      <h2 className="text-lg font-semibold text-slate-900">Service categories</h2>
      <div className="flex gap-2"><input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} className="w-full rounded border p-2" />
      <button onClick={addCategory} disabled={saving} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white">{saving ? 'Saving...' : 'Add'}</button></div>
      <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">{categories.map((c) => <li key={c.id}>{c.name}</li>)}</ul>
    </section>

    <section className="space-y-2"><h2 className="text-lg font-semibold">Technician Applications</h2>
      {techs.map((t) => <article key={t.id} className="rounded border bg-white p-4"><p>{t.name} {t.user?.email ? `(${t.user.email})` : ''}</p>
      {!t.isApproved ? <button onClick={() => approve(t.id)} className="mt-2 rounded bg-blue-600 px-3 py-1 text-white">Approve</button> : <span>Approved</span>}</article>)}
    </section>

    <section className="space-y-2"><h2 className="text-lg font-semibold">Bookings Monitor</h2>
      {bookings.map((b) => <p key={b.id}>#{b.id} - {b.status} {b.user?.email ? `(${b.user.email})` : ''}</p>)}
    </section>
  </div>);
}
