'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

type Booking = { id: number; status: string };

export default function TechnicianDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api('/bookings/my');
        console.log('BOOKINGS:', res);

        // ✅ تأكد إنها array
        if (Array.isArray(res)) {
          setBookings(res);
        } else {
          // ❌ غالبًا Unauthorized أو Forbidden
          setError(res.message || 'Failed to load bookings');
        }
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const accept = async (id: number) => {
    await api(`/bookings/${id}/accept`, { method: 'PATCH' });

    setBookings((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, status: 'accepted' } : b
      )
    );
  };

  const complete = async (id: number) => {
    await api(`/bookings/${id}/complete`, { method: 'PATCH' });

    setBookings((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, status: 'completed' } : b
      )
    );
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">
        Technician Dashboard
      </h1>

      {/* ⏳ Loading */}
      {loading && <p>Loading...</p>}

      {/* ❗ Error */}
      {error && <p className="text-red-500">{error}</p>}

      {/* 📭 Empty */}
      {!loading && bookings.length === 0 && !error && (
        <p>No bookings found</p>
      )}

      {/* ✅ Safe map */}
      {bookings.map((b) => (
        <article
          key={b.id}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <p className="text-slate-700">
            Booking status:{' '}
            <span className="font-semibold capitalize">
              {b.status}
            </span>
          </p>

          <div className="mt-3 flex gap-2">
            {b.status === 'pending' && (
              <button
                onClick={() => accept(b.id)}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
              >
                Accept
              </button>
            )}

            {b.status === 'accepted' && (
              <button
                onClick={() => complete(b.id)}
                className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500"
              >
                Complete
              </button>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}