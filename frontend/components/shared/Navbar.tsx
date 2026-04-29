'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <div className="flex justify-between p-4 bg-black text-white">
      <h1>CityCare</h1>

      <div className="space-x-4">
        <Link href="/">Home</Link>
        <Link href="/services">Services</Link>
        <Link href="/dashboard">Dashboard</Link>
      </div>
    </div>
  );
}