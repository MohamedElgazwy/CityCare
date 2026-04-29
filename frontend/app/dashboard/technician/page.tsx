'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function TechnicianDashboard() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    api('/bookings/my').then(setBookings);
  }, []);

  const accept = (id: number) => {
    api(`/bookings/${id}/accept`, { method: 'PATCH' });
  };

  const complete = (id: number) => {
    api(`/bookings/${id}/complete`, { method: 'PATCH' });
  };

  return (
    <div>
      <h1 className="text-2xl mb-4">Technician Dashboard</h1>

      {bookings.map((b: any) => (
        <div key={b.id} className="border p-4 mb-2">
          <p>Status: {b.status}</p>

          {b.status === 'pending' && (
            <button
              onClick={() => accept(b.id)}
              className="bg-green-500 text-white p-2 mr-2"
            >
              Accept
            </button>
          )}

          {b.status === 'accepted' && (
            <button
              onClick={() => complete(b.id)}
              className="bg-purple-500 text-white p-2"
            >
              Complete
            </button>
          )}
        </div>
      ))}
    </div>
  );
}