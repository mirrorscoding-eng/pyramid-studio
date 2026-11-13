import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getContent } from '@/lib/content/server';
import type { Message } from '@/lib/content/types';
import { DashboardApp } from '@/components/dashboard/DashboardApp';
import { SignOutButton } from '@/components/dashboard/SignOutButton';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) redirect('/dashboard/login');

  const { data: isAdmin } = await supabase.rpc('is_admin');
  if (isAdmin !== true) {
    return (
      <main className="denied card">
        <h2>هذا الحساب ما عنده صلاحية</h2>
        <p className="muted" style={{ margin: '10px 0 18px' }}>سجّل دخول بحساب المسؤول عن الموقع.</p>
        <SignOutButton className="btn btn-ink" />
      </main>
    );
  }

  const [content, msgs] = await Promise.all([
    getContent(),
    supabase.from('messages').select('*').order('created_at', { ascending: false }).limit(500)
  ]);

  return <DashboardApp initialContent={content} initialMessages={(msgs.data || []) as Message[]} email={String(data.claims.email || '')} />;
}
