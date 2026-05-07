'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import Button from '@/components/ui/Button';

type Category = { id: number; name: string };
type Technician = {
  id: number;
  name: string;
  description: string;
  price: number;
  rating: number;
  photoUrl?: string;
};

export default function ServicesPage() {
  const router = useRouter();
  const { user, hydrate, hydrated } = useAuthStore();
  const [techs, setTechs] = useState<Technician[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [rating, setRating] = useState('');

  useEffect(() => { hydrate(); }, [hydrate]);

  useEffect(() => {
    if (!hydrated) return;
    if (!user) return router.push('/auth/login');
    api('/categories').then(setCategories);
    api('/technicians').then((res) => Array.isArray(res) && setTechs(res));
  }, [hydrated, router, user]);

  const search = async () => {
    setIsLoading(true);
    const query = new URLSearchParams({ name, categoryId, minPrice, rating });
    const res = await api(`/technicians/search?${query}`);
    setTechs(res);
    setIsLoading(false);
  };

  if (!hydrated || !user) return <p className="p-6">جارٍ التحميل...</p>;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold" style={{ color: 'var(--accent)' }}>ابحث عن خدمة</h1>
        <p className="mt-2 muted">صفِّ النتائج حسب التخصص والميزانية والتقييم لاختيار الفنّي المناسب.</p>

        <div className="mt-6 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-5">
          <input placeholder="ابحث بالاسم" onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all" />
          <select onChange={(e) => setCategoryId(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all">
            <option value="">كل الأقسام</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <input placeholder="أقل سعر" type="number" onChange={(e) => setMinPrice(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all" />
          <input placeholder="أقل تقييم" type="number" onChange={(e) => setRating(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all" />
          <Button onClick={search} variant="primary">
            {isLoading ? 'جارٍ البحث...' : 'بحث'}
          </Button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {techs.map((t) => (
            <article key={t.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900">{t.name}</h2>
              {t.photoUrl && <img src={t.photoUrl} alt={`${t.name} الملف الشخصي`} className="mt-3 h-16 w-16 rounded-full object-cover" />}
              <p className="mt-2 text-slate-600">{t.description}</p>
              <div className="mt-4 flex items-center justify-between text-sm text-slate-700">
                <span>السعر: ${t.price}</span>
                <span>⭐ {t.rating}</span>
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                onClick={async () => {
                  try {
                    await api('/bookings', { method: 'POST', body: JSON.stringify({ technicianId: t.id }) });
                    alert('تم إرسال طلب الحجز بنجاح!');
                  } catch (err) {
                    alert('فشل حجز الفنّي. يرجى المحاولة مرة أخرى.');
                  }
                }}
                variant="primary"
                size="sm"
              >
                احجز الآن
              </Button>
                <Button onClick={() => router.push(`/technicians/${t.id}`)} variant="secondary" size="sm">عرض الملف الشخصي</Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
