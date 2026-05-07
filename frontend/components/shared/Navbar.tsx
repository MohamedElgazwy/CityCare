'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import Button from '../ui/Button';

const defaultNav = [
  { href: '/', label: 'الرئيسية' },
  { href: '/services', label: 'الخدمات' },
  { href: '/dashboard/technician', label: 'لوحة التحكم' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, hydrate, hydrated, logout } = useAuthStore();

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

        <div className="flex items-center gap-2 sm:gap-3">
          {defaultNav.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
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
      </nav>
    </header>
  );
}
