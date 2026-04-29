'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

type Technician = { id: number; name: string; description: string; isApproved: boolean };
type Category = { id: number; name: string };

export default function AdminDashboard() {
  const [techs, setTechs] = useState<Technician[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api('/technicians').then(setTechs);
    api('/categories').then((res) => {
      if (Array.isArray(res)) setCategories(res);
    });
  }, []);

  const approve = async (id: number) => {
    await api(`/technicians/${id}/approve`, { method: 'PATCH' });
    setTechs((prev) => prev.map((t) => (t.id === id ? { ...t, isApproved: true } : t)));
  };

  const addCategory = async () => {
    setError('');
    const name = categoryName.trim();
    if (!name) {
      setError('Category name is required.');
      return;
    }

    setSaving(true);
    try {
      const res = await api('/categories', {
        method: 'POST',
        body: JSON.stringify({ name }),
      });

      if (res?.message) {
        setError(Array.isArray(res.message) ? res.message.join(', ') : res.message);
        return;
      }

      setCategoryName('');
      const list = await api('/categories');
      if (Array.isArray(list)) {
        setCategories(list);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm space-y-3">
        <h2 className="text-lg font-semibold text-slate-900">Service categories</h2>
        <p className="text-sm text-slate-600">Create categories so technicians can choose their field.</p>
        {error && <p className="text-red-500">{error}</p>}
        <div className="flex gap-2">
          <input
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Example: Plumbing"
            className="w-full rounded border p-2"
          />
          <button onClick={addCategory} disabled={saving} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-60">
            {saving ? 'Saving...' : 'Add'}
          </button>
        </div>
        {categories.length === 0 ? (
          <p className="text-sm text-amber-600">No categories found yet.</p>
        ) : (
          <ul className="list-disc pl-5 text-sm text-slate-700 space-y-1">
            {categories.map((c) => (
              <li key={c.id}>{c.name}</li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-4">
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
      </section>
    </div>
  );
}
