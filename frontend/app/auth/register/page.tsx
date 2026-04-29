'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'USER' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    setLoading(true);
    setError('');
    try {
      if (!form.name || !form.email || !form.password) throw new Error('All fields are required');
      if (form.password.length < 6) throw new Error('Password must be at least 6 characters');
      await api('/auth/register', { method: 'POST', body: JSON.stringify(form) });
      const res = await api('/auth/login', { method: 'POST', body: JSON.stringify({ email: form.email, password: form.password }) });
      if (!res.access_token) throw new Error('Login after register failed');
      localStorage.setItem('token', res.access_token);
      setAuth(res.user, res.access_token);
      if (res.user.role === 'ADMIN') router.push('/dashboard/admin');
      else if (res.user.role === 'TECHNICIAN') router.push('/profile');
      else router.push('/services');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-5rem)] items-center justify-center px-6">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-bold text-slate-900">Create account</h1>
        <p className="mt-1 text-sm text-slate-600">Join CityCare and start booking services.</p>
        <div className="mt-6 space-y-3">
          <Input placeholder="Name" onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <Input placeholder="Email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Input type="password" placeholder="Password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full rounded-2xl border border-white/60 bg-white/70 px-4 py-2.5 text-sm text-slate-800 outline-none focus:border-cyan-300 focus:ring-4 focus:ring-cyan-100">
            <option value="USER">User</option><option value="TECHNICIAN">Technician</option><option value="ADMIN">Admin</option>
          </select>
          {error && <p className="text-sm text-rose-500">{error}</p>}
          <Button onClick={handleRegister} disabled={loading} className="w-full">{loading ? 'Creating account...' : 'Register'}</Button>
        </div>
      </Card>
    </main>
  );
}
