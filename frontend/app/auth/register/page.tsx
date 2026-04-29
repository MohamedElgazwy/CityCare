'use client';

import { useState } from 'react';
import { api } from '@/lib/api';

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleRegister = async () => {
    await api('/auth/register', {
      method: 'POST',
      body: JSON.stringify(form),
    });

    alert('Registered ✅');
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl mb-4">Register</h1>

      <input
        placeholder="Name"
        onChange={(e) =>
          setForm({ ...form, name: e.target.value })
        }
        className="border p-2 block"
      />

      <input
        placeholder="Email"
        onChange={(e) =>
          setForm({ ...form, email: e.target.value })
        }
        className="border p-2 block mt-2"
      />

      <input
        type="password"
        placeholder="Password"
        onChange={(e) =>
          setForm({ ...form, password: e.target.value })
        }
        className="border p-2 block mt-2"
      />

      <button
        onClick={handleRegister}
        className="bg-black text-white p-2 mt-4"
      >
        Register
      </button>
    </div>
  );
}