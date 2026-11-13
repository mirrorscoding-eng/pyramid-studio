'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { CONTENT_ID } from '@/lib/content/server';
import type { Content, ContentKey } from '@/lib/content/types';

export type ActionResult = { ok: true } | { ok: false; error: string };

const KEYS: ContentKey[] = ['settings', 'texts', 'services', 'orbit', 'approach', 'steps', 'budgets', 'categories', 'works', 'clients', 'team'];
const OBJECT_KEYS: ContentKey[] = ['settings', 'texts'];

async function adminClient() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  if (!data?.claims) return { supabase, ok: false as const };
  const { data: isAdmin } = await supabase.rpc('is_admin');
  return { supabase, ok: isAdmin === true };
}

const validShape = (key: ContentKey, value: unknown) =>
  OBJECT_KEYS.includes(key) ? !!value && typeof value === 'object' && !Array.isArray(value) : Array.isArray(value);

/** Save one part of the site (e.g. 'works' or 'settings'). Other parts are left as they are. */
export async function saveSection(key: ContentKey, value: unknown): Promise<ActionResult> {
  if (!KEYS.includes(key) || !validShape(key, value)) return { ok: false, error: 'bad_input' };
  const { supabase, ok } = await adminClient();
  if (!ok) return { ok: false, error: 'auth' };

  const { data: row, error: readErr } = await supabase.from('site_content').select('data').eq('id', CONTENT_ID).maybeSingle();
  if (readErr) return { ok: false, error: readErr.message };
  const next = { ...((row?.data as object) || {}), [key]: value };
  const { error } = await supabase.from('site_content').upsert({ id: CONTENT_ID, data: next, updated_at: new Date().toISOString() });
  if (error) return { ok: false, error: error.message };
  revalidatePath('/', 'layout');
  return { ok: true };
}

/** Replace the whole site content (import a backup, or reset to the original content). */
export async function replaceContent(content: Partial<Content>): Promise<ActionResult> {
  if (!content || typeof content !== 'object') return { ok: false, error: 'bad_input' };
  const clean: Partial<Content> = {};
  for (const k of KEYS) {
    const v = (content as Record<string, unknown>)[k];
    if (v !== undefined) {
      if (!validShape(k, v)) return { ok: false, error: 'bad_input' };
      (clean as Record<string, unknown>)[k] = v;
    }
  }
  const { supabase, ok } = await adminClient();
  if (!ok) return { ok: false, error: 'auth' };
  const { error } = await supabase.from('site_content').upsert({ id: CONTENT_ID, data: clean, updated_at: new Date().toISOString() });
  if (error) return { ok: false, error: error.message };
  revalidatePath('/', 'layout');
  return { ok: true };
}

export async function setMessageRead(id: string, read: boolean): Promise<ActionResult> {
  const { supabase, ok } = await adminClient();
  if (!ok) return { ok: false, error: 'auth' };
  const { error } = await supabase.from('messages').update({ read }).eq('id', id);
  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function deleteMessage(id: string): Promise<ActionResult> {
  const { supabase, ok } = await adminClient();
  if (!ok) return { ok: false, error: 'auth' };
  const { error } = await supabase.from('messages').delete().eq('id', id);
  return error ? { ok: false, error: error.message } : { ok: true };
}
