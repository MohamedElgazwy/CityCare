'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'USER',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setLoading(true);
    setError('');

    try {
      // ✅ validation
      if (!form.name || !form.email || !form.password) {
        throw new Error('All fields are required');
      }

      if (form.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // ✅ register
      await api('/auth/register', {
        method: 'POST',
        body: JSON.stringify(form),
      });

      // 🔥 auto login بعد التسجيل
      const res = await api('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      if (!res.access_token) {
        throw new Error('Login after register failed');
      }

      localStorage.setItem('token', res.access_token);
      setAuth(res.user, res.access_token);

      // ✅ redirect
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
        <h1 className="text-2xl font-bold">Create account</h1>
        <p className="text-sm text-gray-500 mt-1">
          Join CityCare and start booking services
        </p>

        <div className="mt-6 space-y-3">
          <input
            placeholder="Name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border p-2 rounded"
          />

          <input
            placeholder="Email"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border p-2 rounded"
          />

          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border p-2 rounded"
          />

          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full border p-2 rounded bg-white"
          >
            <option value="USER">User</option>
            <option value="TECHNICIAN">Technician</option>
            <option value="ADMIN">Admin</option>
          </select>

          

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-black text-white p-2 rounded hover:bg-gray-800"
          >
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </div>
      </section>
    </main>
  );
}
