'use client';

import { useRef } from 'react';
import { replaceContent } from '@/app/(admin)/dashboard/actions';
import { defaults } from '@/lib/content/defaults';
import type { Settings as S } from '@/lib/content/types';
import { useDash, useDraft } from '../ctx';
import { LField, MediaField, SaveBar, TextField } from '../fields';

export function Settings() {
  const { content, confirm, toast } = useDash();
  const { draft: s, setDraft, dirty, commit, reset, busy } = useDraft('settings');
  const file = useRef<HTMLInputElement>(null);
  const set = <K extends keyof S>(k: K, v: S[K]) => setDraft({ ...s, [k]: v });
  const handle = (v: string) => v.trim().replace(/^@/, '');
  const num = (v: string) => Math.max(0, Number(v) || 0);
  const phones = [...(s.phones || []), '', ''].slice(0, 2);

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `pyramid-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  const importJson = async (f?: File) => {
    if (!f) return;
    try {
      const d = JSON.parse(await f.text());
      if (!d || typeof d !== 'object' || !Array.isArray(d.works) || !d.settings) throw new Error('bad');
      if (!(await confirm('استيراد النسخة؟', 'محتوى الموقع الحالي راح يتبدّل بمحتوى الملف.', 'استيراد'))) return;
      const r = await replaceContent(d);
      if (!r.ok) throw new Error(r.error);
      toast('تم الاستيراد ✦');
      setTimeout(() => location.reload(), 700);
    } catch {
      toast('الملف مو صالح.', true);
    } finally {
      if (file.current) file.current.value = '';
    }
  };
  const resetAll = async () => {
    if (!(await confirm('رجوع للمحتوى الأصلي؟', 'كل النصوص والأعمال والإعدادات راح ترجع مثل أول نسخة من الموقع. الرسائل ما تتأثر.', 'رجوع للأصلي'))) return;
    const r = await replaceContent(defaults());
    if (!r.ok) return toast('ما گدرنا نرجع المحتوى: ' + r.error, true);
    toast('رجع المحتوى الأصلي ✦');
    setTimeout(() => location.reload(), 700);
  };

  return (
    <>
      <div className="settings">
        <div className="card stack">
          <div><h2>الهوية والنبذة</h2><p className="muted" style={{ fontSize: 13.5 }}>النبذة بالرئيسية وصفحة من نحن، والشعار النصي بأسفل الموقع.</p></div>
          <LField label="الشعار النصي (بالفوتر)" value={s.eyebrow} onChange={(v) => set('eyebrow', v)} />
          <LField label="نبذة عن الاستوديو" long value={s.about} onChange={(v) => set('about', v)} />
          <MediaField label="صورة صفحة من نحن" value={s.aboutImage} folder="about" onChange={(v) => set('aboutImage', v)} />
          <TextField label="الهاشتاك" value={s.hashtag} onChange={(v) => set('hashtag', v.replace(/^#/, ''))} hint="بدون #. الجزء قبل أول _ يطلع بخط مميز بشريط الأرقام." />
        </div>
        <div className="stack">
          <div className="card stack">
            <div><h2>معلومات التواصل</h2><p className="muted" style={{ fontSize: 13.5 }}>تظهر بصفحة التواصل وأسفل الموقع وأزرار واتساب.</p></div>
            <div className="grid-2">
              <TextField label="رقم الهاتف 1" ltr value={phones[0]} onChange={(v) => set('phones', [v, phones[1]])} />
              <TextField label="رقم الهاتف 2" ltr value={phones[1]} onChange={(v) => set('phones', [phones[0], v])} />
              <TextField label="واتساب" ltr value={s.whatsapp} onChange={(v) => set('whatsapp', v)} />
              <TextField label="حساب إنستغرام" ltr value={s.instagram} onChange={(v) => set('instagram', handle(v))} />
              <TextField label="حساب الستوديو" ltr value={s.studio} onChange={(v) => set('studio', handle(v))} />
              <TextField label="ثريدز" ltr value={s.threads} onChange={(v) => set('threads', handle(v))} />
              <TextField label="البريد الإلكتروني" ltr type="email" value={s.email} onChange={(v) => set('email', v.trim())} />
              <TextField label="الموقع" ltr value={s.website} onChange={(v) => set('website', v.trim())} />
            </div>
          </div>
          <div className="card stack">
            <div><h2>الأرقام</h2><p className="muted" style={{ fontSize: 13.5 }}>بكروت الواجهة وشريط الإحصائيات.</p></div>
            <div className="grid-2">
              <TextField label="سنوات الخبرة" ltr type="number" value={s.years} onChange={(v) => set('years', num(v))} />
              <TextField label="المشاريع المنجزة" ltr type="number" value={s.projects} onChange={(v) => set('projects', num(v))} />
              <TextField label="عدد العملاء" ltr type="number" value={s.clientsCount} onChange={(v) => set('clientsCount', num(v))} />
              <TextField label="المتابعين" ltr type="number" value={s.followers} onChange={(v) => set('followers', num(v))} />
              <TextField label="المنشورات" ltr type="number" value={s.posts} onChange={(v) => set('posts', num(v))} />
            </div>
          </div>
          <div className="card stack">
            <div><h2>النسخ الاحتياطي</h2><p className="muted" style={{ fontSize: 13.5 }}>خذ نسخة من كل محتوى الموقع، أو رجّع نسخة قديمة.</p></div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button type="button" className="btn btn-line btn-sm" onClick={exportJson}>تصدير نسخة JSON</button>
              <button type="button" className="btn btn-line btn-sm" onClick={() => file.current?.click()}>استيراد نسخة</button>
              <button type="button" className="btn btn-danger btn-sm" onClick={resetAll}>رجوع للمحتوى الأصلي</button>
              <input ref={file} type="file" accept="application/json,.json" hidden onChange={(e) => importJson(e.target.files?.[0])} />
            </div>
          </div>
        </div>
      </div>
      <SaveBar dirty={dirty} busy={busy} onSave={() => commit({ ...s, phones: (s.phones || []).map((p) => p.trim()).filter(Boolean) })} onReset={reset} />
    </>
  );
}
