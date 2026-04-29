'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import Button from '@/components/ui/Button';

const defaultNav = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/dashboard/technician', label: 'Dashboard' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, hydrate, hydrated, logout } = useAuthStore();

  useEffect(() => { hydrate(); }, [hydrate]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/40 bg-white/35 backdrop-blur-xl">
      <nav className="mx-auto flex h-18 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold tracking-tight text-slate-800">CityCare</Link>
        <div className="flex items-center gap-2">
          {defaultNav.map((item) => {
            const isActive = pathname === item.href;
            return <Link key={item.href} href={item.href} className={`rounded-full px-4 py-2 text-sm transition ${isActive ? 'bg-white/75 shadow text-slate-900' : 'text-slate-600 hover:bg-white/55'}`}>{item.label}</Link>;
          })}
          {hydrated && user ? (
            <>
              <Link href="/profile" className="hidden rounded-full bg-white/70 px-3 py-2 text-sm text-slate-700 sm:block">{user.name || user.email}</Link>
              <Button variant="ghost" onClick={() => { logout(); router.push('/'); }}>Logout</Button>
            </>
          ) : (
            <Link href="/auth/login" className="rounded-full bg-white/70 px-4 py-2 text-sm text-slate-700">Login</Link>
          )}
        </div>
      </nav>
    </header>
  );
}
