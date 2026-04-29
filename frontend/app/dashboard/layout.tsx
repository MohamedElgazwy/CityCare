'use client';

import Link from 'next/link';

export default function DashboardLayout({ children }: any) {
  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 h-screen bg-gray-900 text-white p-4">
        <h2 className="text-xl mb-4">Dashboard</h2>

        <Link href="/dashboard/admin" className="block mb-2">
          Admin
        </Link>

        <Link href="/dashboard/technician" className="block mb-2">
          Technician
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 p-6">{children}</div>
    </div>
  );
}