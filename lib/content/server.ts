import { cache } from 'react';
import { cookies } from 'next/headers';
import { unstable_rethrow } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { hasSupabase } from '@/lib/supabase/env';
import { mergeContent, t } from './defaults';
import type { Content, Lang } from './types';

export const CONTENT_ID = 'main';

/** The whole site content, read once per request (database values over the defaults). */
export const getContent = cache(async (): Promise<Content> => {
  if (!hasSupabase) return mergeContent(null);
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from('site_content').select('data').eq('id', CONTENT_ID).maybeSingle();
    if (error) console.error('[content] read failed:', error.message);
    return mergeContent(data?.data);
  } catch (e) {
    unstable_rethrow(e); // let Next.js handle its own signals (dynamic rendering, redirects)
    console.error('[content] read failed:', e);
    return mergeContent(null);
  }
});

export const getLang = cache(async (): Promise<Lang> => ((await cookies()).get('lang')?.value === 'en' ? 'en' : 'ar'));

/** Text helper for a page: tx('nav_home') → the right language. */
export const makeT = (c: Content, lang: Lang) => (key: string) => t(c.texts[key], lang) || key;
