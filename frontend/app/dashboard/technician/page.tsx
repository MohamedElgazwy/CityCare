'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

type Booking = { id: number; status: string; user?: { email: string } };
type Category = { id: number; name: string };

export default function TechnicianDashboard() {
  const router = useRouter();
  const { user, hydrate, hydrated } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    phone: '',
    description: '',
    price: '',
    categoryId: '',
    photoUrl: '',
  });

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!hydrated) return;
    if (!user) return void router.push('/auth/login');

    if (user.role === 'TECHNICIAN') {
      api('/bookings/my').then((res) => {
        if (Array.isArray(res)) setBookings(res);
        setLoading(false);
      });
      return;
    }

    api('/categories').then((res) => {
      if (Array.isArray(res)) setCategories(res);
      setLoading(false);
    });
  }, [hydrated, router, user]);

  const updateStatus = async (id: number, endpoint: 'accept' | 'reject' | 'complete', nextStatus: string) => {
    try {
      await api(`/bookings/${id}/${endpoint}`, { method: 'PATCH' });
      setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: nextStatus } : b)));
      if (endpoint === 'accept') {
        alert('Booking accepted! The user will be notified.');
      }
    } catch (err) {
      alert('Failed to update booking status.');
    }
  };

  const uploadPhoto = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === 'string' ? reader.result : '';
      setForm((prev) => ({ ...prev, photoUrl: result }));
    };
    reader.readAsDataURL(file);
  };

  const submitApplication = async () => {
    setError('');
    setMessage('');

    if (!form.name || !form.phone || !form.description || !form.price || !form.categoryId || !form.photoUrl) {
      setError('All profile application fields are required, including photo.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api('/technicians/register', {
        method: 'POST',
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          categoryId: Number(form.categoryId),
        }),
      });

      if (res?.message) {
        throw new Error(Array.isArray(res.message) ? res.message.join(', ') : res.message);
      }

      setMessage('Application submitted successfully. Admin approval is required.');
      setForm({ name: '', phone: '', description: '', price: '', categoryId: '', photoUrl: '' });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  if (!hydrated || !user || loading) return <p>Loading...</p>;

  if (user.role !== 'TECHNICIAN') {
    return (
      <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Technician Profile Application</h1>
        <p className="text-sm text-slate-600">Submit your profile to become a technician.</p>

        <input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="Full name" className="w-full rounded border p-2" />
        <input value={form.phone} onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))} placeholder="Phone" className="w-full rounded border p-2" />
        <textarea value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} placeholder="Description" className="w-full rounded border p-2" />
        <input type="number" value={form.price} onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))} placeholder="Service price" className="w-full rounded border p-2" />
        <select value={form.categoryId} onChange={(e) => setForm((prev) => ({ ...prev, categoryId: e.target.value }))} className="w-full rounded border p-2 bg-white">
          <option value="">Select category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700">Profile photo (required)</label>
          <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadPhoto(e.target.files[0])} className="w-full rounded border p-2" />
          {form.photoUrl && <img src={form.photoUrl} alt="Preview" className="h-24 w-24 rounded-full object-cover" />}
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}
        {message && <p className="text-sm text-emerald-600">{message}</p>}

        <button onClick={submitApplication} disabled={submitting} className="rounded bg-blue-600 px-4 py-2 text-white">
          {submitting ? 'Submitting...' : 'Submit application'}
        </button>
      </div>
    );
  }

  return (<div className="space-y-4"><h1 className="text-2xl font-bold text-slate-900">Technician Dashboard</h1>
    {bookings.map((b) => <article key={b.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <p>Booking #{b.id} - {b.status}</p>
      {b.user?.email && <p>Customer: {b.user.email}</p>}
      <div className="mt-3 flex gap-2">
        {b.status === 'pending' && <>
          <button onClick={() => updateStatus(b.id, 'accept', 'accepted')} className="rounded bg-emerald-600 px-3 py-1 text-white">Accept</button>
          <button onClick={() => updateStatus(b.id, 'reject', 'rejected')} className="rounded bg-rose-600 px-3 py-1 text-white">Reject</button>
        </>}
        {b.status === 'accepted' && <button onClick={() => updateStatus(b.id, 'complete', 'completed')} className="rounded bg-violet-600 px-3 py-1 text-white">Complete</button>}
      </div>
    </article>)}
  </div>);
}
