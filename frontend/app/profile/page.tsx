"use client";

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import ReviewForm from '@/components/review/ReviewForm';

type Booking = { id: number; status: string; date: string; technician: { name: string } };
type UserDetails = { id: number; email: string; name?: string; photoUrl?: string | null; role: string; technicianProfile?: { id: number; isApproved: boolean; } | null };

export default function ProfilePage() {
  const router = useRouter();
  const { user, hydrate, hydrated } = useAuthStore();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [details, setDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => { hydrate(); }, [hydrate]);

  useEffect(() => {
    if (!hydrated) return;
    if (!user) return void router.push('/auth/login');

    Promise.all([
      api('/bookings/me'),
      api('/users/me'),
    ])
      .then(([bookingsRes, userRes]) => {
        if (Array.isArray(bookingsRes)) setBookings(bookingsRes);
        setDetails(userRes as UserDetails);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [hydrated, router, user]);

  if (!hydrated || !user) return <p className="p-6">Loading...</p>;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="rounded-2xl border theme-card p-6 shadow-sm" style={{ borderColor: 'var(--accent)' }}>
          <div className="flex items-center gap-4">
            <img src={details?.photoUrl || user.photoUrl || '/placeholder-avatar.png'} alt="avatar" className="h-20 w-20 rounded-full object-cover" style={{ border: '3px solid var(--accent)' }} />
            <div>
              <h1 className="text-2xl font-bold" style={{ color: 'var(--accent)' }}>{details?.name || user.name || user.email}</h1>
              <p className="text-sm muted">{details?.email || user.email}</p>
              {details?.technicianProfile ? (
                <p className="mt-1 text-sm">
                  Technician application status: <strong>{details.technicianProfile.isApproved ? 'Approved' : 'Pending'}</strong>
                </p>
              ) : (
                <p className="mt-1 text-sm">No technician application submitted.</p>
              )}
            </div>
          </div>

          <section className="mt-6">
            <h2 className="text-lg font-semibold">Booking History</h2>
            {loading ? (
              <p className="p-4">Loading...</p>
            ) : bookings.length === 0 ? (
              <p className="p-4">You have no bookings yet.</p>
            ) : (
              <ul className="mt-4 space-y-3">
                {bookings.map((b) => (
                  <li key={b.id} className="rounded border p-3 bg-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Booking #{b.id}</p>
                        <p className="text-sm text-slate-600">Technician: {b.technician?.name || '—'}</p>
                        <p className="text-sm text-slate-600">Date: {new Date(b.date).toLocaleString()}</p>
                      </div>
                      <div className="text-sm font-semibold">{b.status}</div>
                    </div>
                    {b.status === 'completed' && (
                      <div className="mt-3">
                        <p className="text-sm muted">Leave a review for this booking</p>
                        <ReviewForm bookingId={b.id} onSuccess={async () => {
                          // refresh bookings list
                          const list = await api('/bookings/me');
                          if (Array.isArray(list)) setBookings(list);
                        }} />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
