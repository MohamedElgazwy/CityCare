'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

type Booking = { id: number; status: string; user?: { email: string } };
type Category = { id: number; name: string };

type TechnicianForm = {
  name: string;
  phone: string;
  description: string;
  price: string;
  categoryId: string;
};

export default function TechnicianDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<TechnicianForm>({
    name: '',
    phone: '',
    description: '',
    price: '',
    categoryId: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [needsProfile, setNeedsProfile] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api('/bookings/my');

        if (Array.isArray(res)) {
          setBookings(res);
        } else {
          setNeedsProfile(true);
          setError('Create your technician profile first to start receiving orders.');
          const categoryRes = await api('/categories');
          if (Array.isArray(categoryRes)) {
            setCategories(categoryRes);
          }
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateStatus = async (id: number, endpoint: 'accept' | 'complete', nextStatus: string) => {
    const res = await api(`/bookings/${id}/${endpoint}`, { method: 'PATCH' });
    if (res?.message) {
      setError(res.message);
      return;
    }
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: nextStatus } : b)));
  };

  const handleCreateProfile = async () => {
    setError('');
    if (!form.name || !form.phone || !form.description || !form.price || !form.categoryId) {
      setError('All technician profile fields are required.');
      return;
    }

    setSaving(true);
    try {
      const res = await api('/technicians/register', {
        method: 'POST',
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          description: form.description,
          price: Number(form.price),
          categoryId: Number(form.categoryId),
        }),
      });

      if (res?.message) {
        setError(Array.isArray(res.message) ? res.message.join(', ') : res.message);
        return;
      }

      setNeedsProfile(false);
      setError('Profile submitted. Ask admin to approve your technician account, then log in again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Technician Dashboard</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && needsProfile && (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
          <h2 className="text-lg font-semibold text-slate-900">Create technician profile</h2>
          <p className="text-sm text-slate-600">Choose your field and complete your details.</p>
          <input placeholder="Full name" className="w-full rounded border p-2" onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Phone" className="w-full rounded border p-2" onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          <textarea placeholder="Description" className="w-full rounded border p-2" onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <input placeholder="Service price" type="number" className="w-full rounded border p-2" onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <select className="w-full rounded border p-2" onChange={(e) => setForm({ ...form, categoryId: e.target.value })}>
            <option value="">Choose field</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <button onClick={handleCreateProfile} disabled={saving} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500">
            {saving ? 'Saving...' : 'Submit profile'}
          </button>
        </section>
      )}

      {!loading && !needsProfile && bookings.length === 0 && <p>No bookings found</p>}

      {bookings.map((b) => (
        <article key={b.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-slate-700">Booking #{b.id}</p>
          {b.user?.email && <p className="text-sm text-slate-500">Customer: {b.user.email}</p>}
          <p className="text-slate-700">Status: <span className="font-semibold capitalize">{b.status}</span></p>

          <div className="mt-3 flex gap-2">
            {b.status === 'pending' && (
              <button onClick={() => updateStatus(b.id, 'accept', 'accepted')} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500">Accept</button>
            )}
            {b.status === 'accepted' && (
              <button onClick={() => updateStatus(b.id, 'complete', 'completed')} className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500">Complete</button>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
