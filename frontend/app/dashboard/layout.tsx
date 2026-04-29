'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const dashboardLinks = [
  { href: '/dashboard/admin', label: 'Admin Panel' },
  { href: '/dashboard/technician', label: 'Technician Panel' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[250px_1fr] lg:px-8">
        <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Dashboard</h2>
          <div className="space-y-2">
            {dashboardLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block rounded-lg px-3 py-2 text-sm font-medium ${pathname === link.href ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-100'}`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </aside>
        <section>{children}</section>
      </div>
    </div>
  );
}
