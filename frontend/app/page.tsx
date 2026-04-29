'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <div className="h-screen flex flex-col justify-center items-center text-center bg-gray-100">
      <h1 className="text-4xl font-bold mb-4">
        CityCare 🏙️
      </h1>

      <p className="mb-6">
        Find trusted technicians بسهولة
      </p>

      <div className="space-x-4">
        <Link href="/services" className="bg-black text-white px-4 py-2">
          Browse Services
        </Link>

        <Link href="/login" className="border px-4 py-2">
          Login
        </Link>
      </div>
    </div>
  );
}