'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

const dashboardLinks = [
  { href: '/dashboard/admin', label: 'Admin Panel' },
  { href: '/dashboard/technician', label: 'Technician Panel' },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, hydrate, hydrated } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <div className="min-h-screen page-container">
      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[250px_1fr] lg:px-8">
        <aside className="rounded-xl bg-white/90 backdrop-blur border border-gray-200/50 p-5 shadow-soft">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Dashboard</h2>
          <div className="space-y-2">
            {dashboardLinks.map((link) => {
              const isAdminLink = link.href === '/dashboard/admin';
              const isTechnicianLink = link.href === '/dashboard/technician';
              const isDisabled = hydrated && !!user && ((user.role === 'TECHNICIAN' && isAdminLink) || (user.role === 'ADMIN' && isTechnicianLink));

              return (
                <Link
                  key={link.href}
                  href={isDisabled ? '#' : link.href}
                  aria-disabled={isDisabled}
                  onClick={(e) => { if (isDisabled) e.preventDefault(); }}
                  className={`block rounded-lg px-3 py-2 text-sm font-medium ${pathname === link.href ? 'active' : 'text-slate-700 hover:bg-slate-100'} ${isDisabled ? 'cursor-not-allowed opacity-50 hover:bg-transparent' : ''}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </aside>
        <section>{children}</section>
      </div>
    </div>
  );
}
