'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export default function RoleTheme() {
  const { user, hydrate } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    const role = user?.role?.toLowerCase() ?? 'user';
    document.body.dataset.role = role;
  }, [user]);

  return null;
}
