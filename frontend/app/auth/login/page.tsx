'use client';

import { useState } from 'react';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const setAuth = useAuthStore((s) => s.setAuth);

  const handleLogin = async () => {
    const res = await api('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    setAuth(res.user, res.access_token);
  };

  return (
    <div className="p-10">
      <h1>Login</h1>

      <input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 block"
      />

      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 block mt-2"
      />

      <button onClick={handleLogin} className="bg-black text-white p-2 mt-4">
        Login
      </button>
    </div>
  );
}