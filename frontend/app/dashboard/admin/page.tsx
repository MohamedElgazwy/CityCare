'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function AdminDashboard() {
  const [techs, setTechs] = useState([]);

  useEffect(() => {
    api('/technicians').then(setTechs);
  }, []);

  const approve = async (id: number) => {
    await api(`/technicians/${id}/approve`, {
      method: 'PATCH',
    });

    alert('Approved ✅');
  };

  return (
    <div>
      <h1 className="text-2xl mb-4">Admin Dashboard</h1>

      {techs.map((t: any) => (
        <div key={t.id} className="border p-4 mb-2">
          <h2>{t.name}</h2>
          <p>{t.description}</p>

          {!t.isApproved && (
            <button
              onClick={() => approve(t.id)}
              className="bg-blue-500 text-white p-2 mt-2"
            >
              Approve
            </button>
          )}
        </div>
      ))}
    </div>
  );
}