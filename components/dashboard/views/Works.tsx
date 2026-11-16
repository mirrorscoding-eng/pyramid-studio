'use client';

import { useEffect, useState } from 'react';
import { coverHTML, coverSVG, logoSVG } from '@/lib/art';
import { t } from '@/lib/content/defaults';
import type { Work } from '@/lib/content/types';
import { Icon, clone, uid, useDash } from '../ctx';
import { LField, MediaField, TextField, VisToggle, move } from '../fields';

const blankWork = (category: string): Work => ({
  id: 'w' + uid(), category, year: new Date().getFullYear(), featured: false, cover: Math.floor(Math.random() * 6),
  image: '', video: '', link: '', title: { ar: '', en: '' }, client: { ar: '', en: '' }, summary: { ar: '', en: '' }, services: [], results: []
});

export function Works({ openId }: { openId?: string }) {
  const { content, save, confirm, toast } = useDash();
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('all');
  const [editing, setEditing] = useState<(Work & { _new?: boolean }) | null>(null);
  const works = content.works;
  const catName = (id: string) => t(content.categories.find((c) => c.id === id)?.name, 'ar') || '—';
  const catEn = (id: string) => t(content.categories.find((c) => c.id === id)?.name, 'en');

  const open = (id: string | null) => {
    const src = id ? works.find((w) => w.id === id) : null;
    setEditing(src ? clone(src) : { ...blankWork(content.categories[0]?.id || ''), _new: true });
  };

  useEffect(() => {
    if (openId === 'new') open(null);
    else if (openId) open(openId);
    // open once when arriving from the overview
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openId]);

  const query = q.trim().toLowerCase();
  const list = works.filter((w) => (cat === 'all' || w.category === cat) &&
    (!query || [t(w.title, 'ar'), t(w.title, 'en'), t(w.client, 'ar'), t(w.client, 'en')].join(' ').toLowerCase().includes(query)));
  const canMove = cat === 'all' && !query;

  const remove = async (id: string) => {
    if (!(await confirm('حذف هذا العمل؟', 'راح ينحذف من الموقع وما تگدر ترجعه.'))) return false;
    return save('works', works.filter((w) => w.id !== id), 'تم الحذف');
  };

  const saveEditor = async (w: Work & { _new?: boolean }) => {
    if (!w.title.ar.trim()) { toast('اكتب عنوان العمل بالعربي على الأقل.', true); return; }
    const isNew = !!w._new;
    const clean: Work = { ...w };
    delete (clean as { _new?: boolean })._new;
    clean.results = (clean.results || []).filter((r) => r.value.trim());
    const next = isNew ? [clean, ...works] : works.map((x) => (x.id === clean.id ? clean : x));
    if (await save('works', next)) setEditing(null);
  };

  return (
    <>
      <div className="toolbar">
        <label className="search">{Icon.search}<input className="input" placeholder="ابحث بالأعمال…" value={q} onChange={(e) => setQ(e.target.value)} /></label>
        <select className="select" value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="all">كل التصنيفات</option>
          {content.categories.map((c) => <option key={c.id} value={c.id}>{t(c.name, 'ar')}</option>)}
        </select>
        <span style={{ flex: 1 }} />
        <button className="btn btn-ink" onClick={() => open(null)}>{Icon.plus}<span>عمل جديد</span></button>
      </div>

      <div className="w-list">
        {!list.length ? (
          <div className="empty"><span className="svgw" dangerouslySetInnerHTML={{ __html: logoSVG({ bg: 'none' }) }} /><p>ماكو أعمال تطابق البحث.</p></div>
        ) : list.map((w) => {
          const i = works.indexOf(w);
          return (
            <div className={`w-row${w.hidden ? ' is-off' : ''}`} key={w.id}>
              <div className="th" onClick={() => open(w.id)} dangerouslySetInnerHTML={{ __html: coverHTML(w, catEn(w.category)) }} />
              <div className="tt"><b onClick={() => open(w.id)}>{t(w.title, 'ar')}</b><span>{t(w.client, 'ar')}{w.hidden && ' · مطفي — ما يظهر بالموقع'}</span></div>
              <div className="cat"><span className="chip">{catName(w.category)}</span></div>
              <div className="yr">{w.year}</div>
              <div className="acts">
                <VisToggle on={!w.hidden} label={t(w.title, 'ar')}
                  onChange={(on) => save('works', works.map((x) => (x.id === w.id ? { ...x, hidden: !on } : x)), on ? 'صار ظاهر بالموقع ✦' : 'انطفى — ما يظهر بالموقع')} />
                <button className={`icon-btn${w.featured ? ' on' : ''}`} title="مميز" aria-label="مميز"
                  onClick={() => save('works', works.map((x) => (x.id === w.id ? { ...x, featured: !x.featured } : x)), '')}>{Icon.star}</button>
                <button className="icon-btn mv" title="للأعلى" aria-label="للأعلى" disabled={!canMove || i === 0} onClick={() => save('works', move(works, i, i - 1), '')}>{Icon.up}</button>
                <button className="icon-btn mv" title="للأسفل" aria-label="للأسفل" disabled={!canMove || i === works.length - 1} onClick={() => save('works', move(works, i, i + 1), '')}>{Icon.down}</button>
                <button className="icon-btn" title="تعديل" aria-label="تعديل" onClick={() => open(w.id)}>{Icon.edit}</button>
                <button className="icon-btn danger" title="حذف" aria-label="حذف" onClick={() => remove(w.id)}>{Icon.trash}</button>
              </div>
            </div>
          );
        })}
      </div>

      {editing && (
        <WorkEditor
          work={editing}
          setWork={setEditing}
          onClose={() => setEditing(null)}
          onSave={saveEditor}
          onDelete={async () => { if (await remove(editing.id)) setEditing(null); }}
        />
      )}
    </>
  );
}

function WorkEditor({ work: w, setWork, onClose, onSave, onDelete }: {
  work: Work & { _new?: boolean };
  setWork: (w: Work & { _new?: boolean }) => void;
  onClose: () => void;
  onSave: (w: Work & { _new?: boolean }) => void;
  onDelete: () => void;
}) {
  const { content } = useDash();
  const [shown, setShown] = useState(false);
  const [servicesText, setServicesText] = useState((w.services || []).join('، '));
  useEffect(() => { const id = requestAnimationFrame(() => setShown(true)); return () => cancelAnimationFrame(id); }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape' && !document.querySelector('dialog.confirm[open]')) onClose(); };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [onClose]);

  const set = <K extends keyof Work>(k: K, v: Work[K]) => setWork({ ...w, [k]: v });
  const catEn = t(content.categories.find((c) => c.id === w.category)?.name, 'en');
  const results = [...(w.results || [])];
  while (results.length < 3) results.push({ value: '', label: { ar: '', en: '' } });

  const submit = () => onSave({ ...w, services: servicesText.split(/[,،]/).map((s) => s.trim()).filter(Boolean) });

  return (
    <>
      <div className={`overlay${shown ? ' open' : ''}`} onClick={onClose} />
      <aside className={`drawer${shown ? ' open' : ''}`} aria-hidden={!shown}>
        <div className="drawer-head"><h2>{w._new ? 'عمل جديد' : 'تعديل العمل'}</h2><button className="icon-btn" onClick={onClose} aria-label="إغلاق">✕</button></div>
        <form className="drawer-body" onSubmit={(e) => { e.preventDefault(); submit(); }} noValidate>
          {!w.video && <div className="preview" dangerouslySetInnerHTML={{ __html: coverHTML(w, catEn) }} />}
          {w.video &&<video src={w.video} poster={w.image || undefined} muted loop autoPlay playsInline style={{ width: '100%', borderRadius: 18, border: '1.5px solid var(--ink)', maxHeight: 320, objectFit: 'cover' }} />}

          <div className="sec-title">الغلاف</div>
          <MediaField label="صورة الغلاف" value={w.image} folder="works" onChange={(v) => set('image', v)} />
          <MediaField label="فيديو (اختياري)" kind="video" value={w.video || ''} folder="works" onChange={(v) => set('video', v)}
            hint="إذا حطيته، الفيديو يشتغل داخل الكارت بالموقع وبالدائرة اللي حول الشعار." />
          {!w.image && (
            <div>
              <p className="lbl" style={{ marginBottom: 8 }}>بدون صورة؟ اختار غلاف مرسوم:</p>
              <div className="covers">
                {[0, 1, 2, 3, 4, 5].map((n) => (
                  <button type="button" key={n} className={`cover-opt${w.cover === n ? ' active' : ''}`} aria-label={`غلاف ${n + 1}`}
                    onClick={() => set('cover', n)} dangerouslySetInnerHTML={{ __html: coverSVG({ ...w, cover: n, id: w.id + 'o' + n }, '') }} />
                ))}
              </div>
            </div>
          )}

          <div className="sec-title">المعلومات الأساسية</div>
          <LField label="عنوان العمل" required value={w.title} onChange={(v) => set('title', v)} />
          <LField label="اسم العميل" value={w.client} onChange={(v) => set('client', v)} />
          <div className="grid-2">
            <div className="field"><label>التصنيف</label>
              <select className="select" value={w.category} onChange={(e) => set('category', e.target.value)}>
                {content.categories.map((c) => <option key={c.id} value={c.id}>{t(c.name, 'ar')}</option>)}
              </select>
            </div>
            <TextField label="السنة" ltr type="number" value={w.year} onChange={(v) => set('year', v ? Number(v) : '')} />
          </div>
          <label className="switch"><input type="checkbox" checked={w.featured} onChange={(e) => set('featured', e.target.checked)} /> عمل مميز (يظهر بالرئيسية وبعلامة ✦)</label>
          <label className="switch"><input type="checkbox" checked={!w.hidden} onChange={(e) => set('hidden', !e.target.checked)} /> ظاهر بالموقع (شيل العلامة حتى تطفيه بدون ما تحذفه)</label>

          <div className="sec-title">التفاصيل</div>
          <LField label="وصف مختصر" long value={w.summary} onChange={(v) => set('summary', v)} />
          <div className="field"><label>الخدمات</label><input className="input" value={servicesText} onChange={(e) => setServicesText(e.target.value)} /><span className="hint">افصل بينها بفاصلة ،</span></div>
          <div className="field"><label>النتائج (اختياري)</label>
            <div className="stack" style={{ gap: 8 }}>
              {results.map((r, i) => (
                <div className="result-row" key={i}>
                  <input className="input" placeholder="الرقم (+180%)" dir="ltr" value={r.value}
                    onChange={(e) => { const n = [...results]; n[i] = { ...r, value: e.target.value }; set('results', n); }} />
                  <input className="input" placeholder="الوصف بالعربي" value={r.label.ar}
                    onChange={(e) => { const n = [...results]; n[i] = { ...r, label: { ...r.label, ar: e.target.value } }; set('results', n); }} />
                  <input className="input" placeholder="English label" dir="ltr" value={r.label.en}
                    onChange={(e) => { const n = [...results]; n[i] = { ...r, label: { ...r.label, en: e.target.value } }; set('results', n); }} />
                </div>
              ))}
            </div>
          </div>
          <TextField label="رابط العمل (مثلاً ريل إنستغرام)" ltr type="url" placeholder="https://www.instagram.com/reel/…" value={w.link} onChange={(v) => set('link', v.trim())} />
        </form>
        <div className="drawer-foot">
          {!w._new && <button className="btn btn-danger btn-sm" type="button" onClick={onDelete}>حذف</button>}
          <span className="spacer" />
          <button className="btn btn-line" type="button" onClick={onClose}>إلغاء</button>
          <button className="btn btn-ink" type="button" onClick={submit}>حفظ</button>
        </div>
      </aside>
    </>
  );
}
