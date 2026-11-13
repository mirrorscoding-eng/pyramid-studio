import raw from './defaults.json';
import type { Content, L, Lang } from './types';

export const DEFAULT_CONTENT = raw as unknown as Content;

const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));

export const defaults = (): Content => clone(DEFAULT_CONTENT);

const arr = <T,>(v: unknown, fallback: T[]): T[] => (Array.isArray(v) ? (v as T[]) : clone(fallback));

/** Merge whatever is stored in the database over the defaults, so a missing key never breaks a page. */
export function mergeContent(stored: Partial<Content> | null | undefined): Content {
  const d = defaults();
  if (!stored || typeof stored !== 'object') return d;
  const texts: Record<string, L> = { ...d.texts };
  if (stored.texts && typeof stored.texts === 'object') {
    for (const [k, v] of Object.entries(stored.texts)) {
      if (v && typeof v === 'object') texts[k] = { ar: String(v.ar ?? ''), en: String(v.en ?? '') };
    }
  }
  return {
    settings: { ...d.settings, ...(stored.settings || {}) },
    texts,
    services: arr(stored.services, d.services),
    orbit: arr(stored.orbit, d.orbit),
    approach: arr(stored.approach, d.approach),
    steps: arr(stored.steps, d.steps),
    budgets: arr(stored.budgets, d.budgets),
    categories: arr(stored.categories, d.categories),
    works: arr(stored.works, d.works),
    clients: arr(stored.clients, d.clients),
    team: arr(stored.team, d.team)
  };
}

/** Pick the right language, falling back to the other one when a field is empty. */
export const t = (obj: L | string | null | undefined, lang: Lang): string => {
  if (obj == null) return '';
  if (typeof obj === 'string') return obj;
  return obj[lang] || obj.ar || obj.en || '';
};
