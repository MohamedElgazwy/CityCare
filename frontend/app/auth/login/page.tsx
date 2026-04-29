'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';

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
        throw new Error('Email and password are required');
      }

      const res = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      if (!res.access_token) {
        throw new Error(res.message || 'Invalid credentials');
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
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-slate-50 px-6">
      <section className="w-full max-w-md rounded-2xl border bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-sm text-gray-500 mt-1">
          Login to manage your services
        </p>

        <div className="mt-6 space-y-3">
          <input
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-2 rounded"
          />

          

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-black text-white p-2 rounded hover:bg-gray-800"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>
      </section>
    </main>
  );
}
