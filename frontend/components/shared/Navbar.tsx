"use client";

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import Button from '../ui/Button';

const defaultNav = [
  { href: '/', label: 'الرئيسية' },
  { href: '/services', label: 'الخدمات' },
  { href: '/dashboard', label: 'لوحة التحكم' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { user, hydrate, hydrated, logout } = useAuthStore();
  const dashboardHref = user?.role === 'ADMIN' ? '/dashboard/admin' : '/dashboard/technician';

  useEffect(() => { hydrate(); }, [hydrate]);
  useEffect(() => {
    if (!hydrated) return;
    const roleClass = user ? (user.role === 'TECHNICIAN' ? 'role-technician' : user.role === 'ADMIN' ? 'role-admin' : 'role-user') : 'role-user';
    try {
      document.documentElement.classList.remove('role-user', 'role-technician', 'role-admin');
      document.documentElement.classList.add(roleClass);
    } catch (e) {
      // ignore during SSR
    }
  }, [hydrated, user]);

  return (
    <header className="sticky top-0 z-50 backdrop-blur bg-white/80 site-nav border-b border-gray-200/50">
      <nav className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-xl font-bold tracking-tight text-primary-600 hover:text-primary-700 transition-colors">CityCare</Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-2 sm:gap-3">
          {defaultNav.map((item) => {
            const href = item.href === '/dashboard' ? dashboardHref : item.href;
            const isActive = pathname === href;
            return (
              <Link
                key={item.href}
                href={href}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${isActive ? 'active' : ''}`}
              >
                {item.label}
              </Link>
            );
          })}

          {!hydrated && <span className="px-4 py-2 text-sm text-slate-500">...</span>}

          {hydrated && user ? (
            <>
              <Link href="/profile" className="rounded-full px-3 py-1 text-sm text-slate-700 hover:bg-slate-100">
                <div className="flex items-center gap-2">
                  <img src={user.photoUrl || '/placeholder-avatar.png'} alt="الصورة الشخصية" className="h-8 w-8 rounded-full object-cover border" style={{ borderColor: 'var(--accent)' }} />
                  <span style={{ color: 'var(--accent)' }}>{user.name || user.email}</span>
                </div>
              </Link>
              <Button onClick={() => { logout(); router.push('/'); }} variant="secondary" className="rounded-full px-4 py-2 text-sm" style={{ borderColor: 'var(--accent)' }}>
                تسجيل الخروج
              </Button>
            </>
          ) : (
            <Link href="/auth/login" className="rounded-full px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900">تسجيل الدخول</Link>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex items-center md:hidden">
          <button
            aria-label="فتح القائمة"
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100"
            onClick={() => setOpen(!open)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu (stacked) */}
      {open && (
        <div className="md:hidden bg-white/95 border-t border-gray-200/50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-3 space-y-2 sm:px-6 lg:px-8">
            {defaultNav.map((item) => {
              const href = item.href === '/dashboard' ? dashboardHref : item.href;
              const isActive = pathname === href;
              return (
                <Link
                  key={item.href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-lg px-3 py-2 text-base font-medium ${isActive ? 'bg-gray-100 text-slate-900' : 'text-slate-700 hover:bg-gray-50'}`}
                >
                  {item.label}
                </Link>
              );
            })}

            {!hydrated && <div className="px-3 py-2 text-sm text-slate-500">...</div>}

            {hydrated && user ? (
              <div className="space-y-2">
                <Link href="/profile" className="block rounded-lg px-3 py-2 text-base text-slate-700 hover:bg-gray-50" onClick={() => setOpen(false)}>
                  الملف الشخصي
                </Link>
                <button
                  onClick={() => { setOpen(false); logout(); router.push('/'); }}
                  className="w-full text-right rounded-lg px-3 py-2 text-base bg-gray-50"
                >
                  تسجيل الخروج
                </button>
              </div>
            ) : (
              <Link href="/auth/login" className="block rounded-lg px-3 py-2 text-base text-slate-700 hover:bg-gray-50" onClick={() => setOpen(false)}>
                تسجيل الدخول
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
