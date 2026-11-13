'use server';

import { createClient } from '@/lib/supabase/server';
import { hasSupabase } from '@/lib/supabase/env';

export type SendResult = { ok: true } | { ok: false; error: 'required' | 'failed' };

const clip = (v: FormDataEntryValue | null, max: number) => String(v ?? '').trim().slice(0, max);

/** Contact form → messages table (anyone may insert, only admins can read). */
export async function sendMessage(formData: FormData): Promise<SendResult> {
  // Honeypot: bots fill every field, people never see this one.
  if (clip(formData.get('website'), 200)) return { ok: true };

  const name = clip(formData.get('name'), 200);
  const phone = clip(formData.get('phone'), 40);
  if (!name || phone.length < 3) return { ok: false, error: 'required' };

  if (!hasSupabase) {
    console.error('[contact] Supabase is not configured (prototype mode); message not saved.');
    return { ok: false, error: 'failed' };
  }

  const supabase = await createClient();
  const { error } = await supabase.from('messages').insert({
    name,
    phone,
    company: clip(formData.get('company'), 200),
    email: clip(formData.get('email'), 200),
    service: clip(formData.get('service'), 100),
    budget: clip(formData.get('budget'), 100),
    message: clip(formData.get('message'), 5000)
  });
  if (error) {
    console.error('[contact] insert failed:', error.message);
    return { ok: false, error: 'failed' };
  }
  return { ok: true };
}
