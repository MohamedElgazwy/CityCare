'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');

    try {
      // ✅ validation
      if (!email || !password) {
        throw new Error('البريد الإلكتروني وكلمة المرور مطلوبان');
      }

      const res = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (!res.access_token) {
        throw new Error(res.message || 'بيانات الدخول غير صحيحة');
      }

      // ✅ حفظ التوكن
      localStorage.setItem('token', res.access_token);
      setAuth(res.user, res.access_token);

      // 🔥 redirect حسب role (احترافي جدًا)
      if (res.user.role === 'ADMIN') {
        router.push('/dashboard/admin');
      } else if (res.user.role === 'TECHNICIAN') {
        router.push('/dashboard/technician');
      } else {
        router.push('/services');
      }

    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'حدث خطأ ما');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50 px-6">
      <section className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold">مرحبًا بعودتك</h1>
        <p className="text-sm text-gray-500 mt-1">
          سجّل الدخول لإدارة خدماتك
        </p>

        <div className="mt-6 space-y-3">
          <input
            placeholder="البريد الإلكتروني"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
          />

          <input
            type="password"
            placeholder="كلمة المرور"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-gray-50 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
          />

          

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <Button
            onClick={handleLogin}
            disabled={loading}
            variant="primary"
            className="w-full"
          >
            {loading ? 'جارٍ تسجيل الدخول...' : 'تسجيل الدخول'}
          </Button>
        </div>
      </section>
    </main>
  );
}
