'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

type Booking = { id: number; status: string; user?: { email: string } };

export default function TechnicianDashboard() {
  const router = useRouter();
  const { user, hydrate, hydrated } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { hydrate(); }, [hydrate]);

  useEffect(() => {
    if (!hydrated) return;
    if (!user) return router.push('/auth/login');
    if (user.role !== 'TECHNICIAN') return router.push('/services');

    api('/bookings/my').then((res) => {
      if (Array.isArray(res)) setBookings(res);
      setLoading(false);
    });
  }, [hydrated, router, user]);

  const updateStatus = async (id: number, endpoint: 'accept' | 'reject' | 'complete', nextStatus: string) => {
    await api(`/bookings/${id}/${endpoint}`, { method: 'PATCH' });
    setBookings((prev) => prev.map((b) => (b.id === id ? { ...b, status: nextStatus } : b)));
  };

  if (!hydrated || !user || loading) return <p>Loading...</p>;

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
