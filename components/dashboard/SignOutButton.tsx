'use client';

import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/browser';

export function SignOutButton({ className = 'side-btn danger', label = 'تسجيل الخروج' }: { className?: string; label?: string }) {
  const router = useRouter();
  return (
    <button
      className={className}
      onClick={async () => {
        await createClient().auth.signOut();
        router.replace('/dashboard/login');
        router.refresh();
      }}
    >
      {label}
    </button>
  );
}
