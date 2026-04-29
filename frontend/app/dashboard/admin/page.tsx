'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

type Technician = { id: number; name: string; description: string; isApproved: boolean };

export default function AdminDashboard() {
  const [techs, setTechs] = useState<Technician[]>([]);

  useEffect(() => {
    api('/technicians').then(setTechs);
  }, []);

  const approve = async (id: number) => {
    await api(`/technicians/${id}/approve`, { method: 'PATCH' });
    setTechs((prev) => prev.map((t) => (t.id === id ? { ...t, isApproved: true } : t)));
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
      {techs.map((t) => (
        <article key={t.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">{t.name}</h2>
          <p className="mt-1 text-slate-600">{t.description}</p>
          {!t.isApproved ? (
            <button onClick={() => approve(t.id)} className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500">Approve Technician</button>
          ) : (
            <span className="mt-4 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">Approved</span>
          )}
        </article>
      ))}
    </div>
  );
}
