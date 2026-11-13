'use client';

import { useRef, useState } from 'react';
import type { L } from '@/lib/content/types';
import { Icon, uploadMedia, useDash } from './ctx';

/** Arabic + English inputs for one bilingual value. */
export function LField({ label, value, onChange, long, required }: { label: string; value: L; onChange: (v: L) => void; long?: boolean; required?: boolean }) {
  const v = value || { ar: '', en: '' };
  const Tag = long ? 'textarea' : 'input';
  const cls = long ? 'textarea' : 'input';
  return (
    <div className="grid-2">
      <div className="field">
        <label>{label} · عربي{required ? ' *' : ''}</label>
        <Tag className={cls} value={v.ar} onChange={(e: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement>) => onChange({ ...v, ar: e.target.value })} />
      </div>
      <div className="field">
        <label>{label} · English</label>
        <Tag className={cls} dir="ltr" value={v.en} onChange={(e: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement>) => onChange({ ...v, en: e.target.value })} />
      </div>
    </div>
  );
}

export function TextField({ label, value, onChange, ltr, type = 'text', hint, placeholder }: {
  label: string; value: string | number; onChange: (v: string) => void; ltr?: boolean; type?: string; hint?: string; placeholder?: string;
}) {
  return (
    <div className="field">
      <label>{label}</label>
      <input className="input" type={type} dir={ltr ? 'ltr' : undefined} value={value ?? ''} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />
      {hint && <span className="hint">{hint}</span>}
    </div>
  );
}

/** Upload a file to storage or paste a link. Shows a small preview. */
export function MediaField({ label, value, onChange, kind = 'image', folder, contain, hint }: {
  label: string; value: string; onChange: (url: string) => void; kind?: 'image' | 'video'; folder: string; contain?: boolean; hint?: string;
}) {
  const { toast } = useDash();
  const [busy, setBusy] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const pick = async (file?: File) => {
    if (!file) return;
    if (!file.type.startsWith(kind + '/')) { toast(kind === 'image' ? 'اختار صورة.' : 'اختار فيديو.', true); return; }
    setBusy(true);
    try {
      onChange(await uploadMedia(file, folder));
      toast('تم رفع الملف ✦ — لا تنسى تحفظ');
    } catch (e) {
      toast('فشل الرفع: ' + (e as Error).message, true);
    } finally {
      setBusy(false);
      if (input.current) input.current.value = '';
    }
  };
  return (
    <div className="field">
      <label>{label}</label>
      <div className={`media-field${busy ? ' uploading' : ''}`}>
        <div className={`media-thumb${contain ? ' contain' : ''}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {value ? (kind === 'video' ? <video src={value} muted playsInline /> : <img src={value} alt="" />) : <span className="muted" style={{ fontSize: 12 }}>—</span>}
        </div>
        <label className="btn btn-line btn-sm" style={{ cursor: 'pointer' }}>
          {busy ? 'جاري الرفع…' : kind === 'video' ? 'رفع فيديو' : 'رفع صورة'}
          <input ref={input} type="file" accept={kind + '/*'} hidden onChange={(e) => pick(e.target.files?.[0])} />
        </label>
        {value && <button type="button" className="btn btn-danger btn-sm" onClick={() => onChange('')}>إزالة</button>}
      </div>
      <input className="input" dir="ltr" placeholder="أو الصق رابط https://…" value={value} onChange={(e) => onChange(e.target.value.trim())} />
      {hint && <span className="hint">{hint}</span>}
    </div>
  );
}

export function MoveButtons({ i, n, onMove }: { i: number; n: number; onMove: (from: number, to: number) => void }) {
  return (
    <>
      <button type="button" className="icon-btn" aria-label="للأعلى" title="للأعلى" disabled={i === 0} onClick={() => onMove(i, i - 1)}>{Icon.up}</button>
      <button type="button" className="icon-btn" aria-label="للأسفل" title="للأسفل" disabled={i === n - 1} onClick={() => onMove(i, i + 1)}>{Icon.down}</button>
    </>
  );
}

export const move = <T,>(list: T[], from: number, to: number): T[] => {
  if (to < 0 || to >= list.length) return list;
  const next = [...list];
  const [x] = next.splice(from, 1);
  next.splice(to, 0, x);
  return next;
};

export function SaveBar({ dirty, onSave, onReset, busy }: { dirty: boolean; onSave: () => void; onReset?: () => void; busy?: boolean }) {
  return (
    <div className="save-bar" style={{ gap: 10 }}>
      {dirty && onReset && <button type="button" className="btn btn-line" style={{ background: 'var(--paper)' }} onClick={onReset}>تراجع</button>}
      <button type="button" className="btn btn-ink" disabled={!dirty || busy} style={!dirty ? { opacity: .45 } : undefined} onClick={onSave}>
        {busy ? 'جاري الحفظ…' : dirty ? 'حفظ التغييرات ✦' : 'محفوظ ✓'}
      </button>
    </div>
  );
}
