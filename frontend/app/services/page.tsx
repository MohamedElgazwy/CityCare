'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function ServicesPage() {
  const [techs, setTechs] = useState([]);

  useEffect(() => {
    api('/technicians').then(setTechs);
  }, []);

  return (
    <div className="p-10">
      <h1>Technicians</h1>

      {techs.map((t: any) => (
        <div key={t.id} className="border p-4 mt-4">
          <h2>{t.name}</h2>
          <p>{t.description}</p>
          <p>Price: {t.price}</p>
          <p>Rating: {t.rating}</p>
          <button
  onClick={() => api(`/bookings/${t.id}`, { method: 'POST' })}
  className="bg-green-500 text-white p-2 mt-2"
>
  Book Now
</button>
        </div>
      ))}
    </div>
  );
}