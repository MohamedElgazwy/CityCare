'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
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
      if (!email || !password) throw new Error('Email and password are required');
      const res = await api('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      if (!res.access_token) throw new Error(res.message || 'Invalid credentials');
      localStorage.setItem('token', res.access_token);
      setAuth(res.user, res.access_token);
      if (res.user.role === 'ADMIN') router.push('/dashboard/admin');
      else if (res.user.role === 'TECHNICIAN') router.push('/dashboard/technician');
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
        <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-600">Login to manage your services.</p>
        <div className="mt-6 space-y-3">
          <Input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
          <Input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
          {error && <p className="text-sm text-rose-500">{error}</p>}
          <Button onClick={handleLogin} disabled={loading} className="w-full">{loading ? 'Logging in...' : 'Login'}</Button>
        </div>
      </Card>
    </main>
  );
}
