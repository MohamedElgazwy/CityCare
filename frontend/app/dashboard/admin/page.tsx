'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

type Technician = { id: number; name: string; description: string; isApproved: boolean; photoUrl?: string; user?: { email: string } };
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

  const removeTech = async (id: number) => {
    if (!confirm('حذف ملف هذا الفنّي؟ سيتم إرجاع المستخدم إلى حساب عادي.')) return;
    try {
      await api(`/technicians/${id}`, { method: 'DELETE' });
      setTechs((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      alert('فشل حذف الفنّي');
    }
  };

  const addCategory = async () => { /* unchanged */
    setError('');
    const name = categoryName.trim();
    if (!name) return setError('اسم القسم مطلوب.');
    setSaving(true);
    try {
      const res = await api('/categories', { method: 'POST', body: JSON.stringify({ name }) });
      if (res?.message) return setError(Array.isArray(res.message) ? res.message.join(', ') : res.message);
      setCategoryName('');
      const list = await api('/categories');
      if (Array.isArray(list)) setCategories(list);
    } finally { setSaving(false); }
  };

  if (!hydrated || !user) return <p>جارٍ التحميل...</p>;

  return (
    <div className="space-y-6">
      <h1 className="heading-2" style={{ color: 'var(--accent)' }}>لوحة تحكم المدير</h1>
      {error && <p className="text-red-500">{error}</p>}
      <section className="card space-y-3">
        <h2 className="text-lg font-semibold">أقسام الخدمات</h2>
        <div className="flex gap-2">
          <input value={categoryName} onChange={(e) => setCategoryName(e.target.value)} className="w-full rounded border p-2" />
          <Button onClick={addCategory} disabled={saving} variant="primary">{saving ? 'جارٍ الحفظ...' : 'إضافة'}</Button>
        </div>
        <ul className="list-disc pl-5 text-sm muted space-y-1">{categories.map((c) => <li key={c.id}>{c.name}</li>)}</ul>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">طلبات الفنيين</h2>
        {techs.map((t) => (
          <Card key={t.id} className="rounded">
            <p>{t.name} {t.user?.email ? `(${t.user.email})` : ''}</p>
            {t.photoUrl && <img src={t.photoUrl} alt={`${t.name} profile`} className="mt-2 h-16 w-16 rounded-full object-cover" />}
            <div className="mt-2">
              {!t.isApproved ? <Button onClick={() => approve(t.id)} className="mr-2" variant="primary">قبول</Button> : <span className="mr-2">مقبول</span>}
              <Button onClick={() => removeTech(t.id)} variant="secondary">حذف</Button>
            </div>
          </Card>
        ))}
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">مراقبة الحجوزات</h2>
        {bookings.map((b) => <p key={b.id}>#{b.id} - {b.status} {b.user?.email ? `(${b.user.email})` : ''}</p>)}
      </section>
    </div>
  );
    }
