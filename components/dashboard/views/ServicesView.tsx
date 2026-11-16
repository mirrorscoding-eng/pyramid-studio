'use client';

import { useState } from 'react';
import { ART_KEYS, art } from '@/lib/art';
import { t } from '@/lib/content/defaults';
import type { ArtKey, L } from '@/lib/content/types';
import { Icon, uid, useDash, useDraft } from '../ctx';
import { LField, MoveButtons, SaveBar, VisToggle, move } from '../fields';

const ART_NAMES: Record<string, string> = {
  analysis: 'تحليل (عدسة)', plans: 'خطة (لوح)', reports: 'تقارير (رسم بياني)', web: 'موقع (متصفح)', content: 'كتابة (قلم)',
  photo: 'تصوير (كاميرا)', social: 'سوشيال (موبايل)', ads: 'ترويج (مكبر صوت)', color: 'مونتاج وتلوين'
};

const TABS = [
  { id: 'services', title: 'الخدمات' },
  { id: 'orbit', title: 'الدائرة حول الشعار' },
  { id: 'approach', title: 'نهجنا' },
  { id: 'steps', title: 'خطوات آلية العمل' },
  { id: 'budgets', title: 'خيارات الميزانية' }
];

export function ServicesView() {
  const [tab, setTab] = useState('services');
  return (
    <>
      <div className="tabs" role="tablist">
        {TABS.map((x) => <button key={x.id} role="tab" aria-selected={tab === x.id} className={`tab${tab === x.id ? ' active' : ''}`} onClick={() => setTab(x.id)}>{x.title}</button>)}
      </div>
      {tab === 'services' && <ServicesList />}
      {tab === 'orbit' && <OrbitList />}
      {tab === 'approach' && <ApproachList />}
      {tab === 'steps' && <StepsList />}
      {tab === 'budgets' && <BudgetsList />}
    </>
  );
}

function ArtPicker({ value, onChange, id }: { value: ArtKey; onChange: (v: ArtKey) => void; id: string }) {
  return (
    <div className="field" style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
      <div className="item-art" dangerouslySetInnerHTML={{ __html: art(value, id) }} />
      <select className="select" style={{ width: 'auto' }} value={value} onChange={(e) => onChange(e.target.value as ArtKey)} aria-label="الرسمة">
        {ART_KEYS.map((k: string) => <option key={k} value={k}>{ART_NAMES[k] || k}</option>)}
      </select>
    </div>
  );
}

function Head({ i, n, onMove, onDelete, children, hidden, onToggle }: {
  i: number; n: number; onMove: (a: number, b: number) => void; onDelete: () => void; children?: React.ReactNode; hidden?: boolean; onToggle?: (hidden: boolean) => void;
}) {
  return (
    <div className="item-head">
      <span className="num">{String(i + 1).padStart(2, '0')}</span>
      {children}
      <span className="spacer" />
      {onToggle && <VisToggle on={!hidden} onChange={(on) => onToggle(!on)} />}
      <MoveButtons i={i} n={n} onMove={onMove} />
      <button type="button" className="icon-btn danger" aria-label="حذف" onClick={onDelete}>{Icon.trash}</button>
    </div>
  );
}

function Intro({ title, text }: { title: string; text: string }) {
  return <div className="card-head"><div><h2>{title}</h2><p className="muted" style={{ fontSize: 13.5 }}>{text}</p></div></div>;
}

function ServicesList() {
  const { confirm } = useDash();
  const { draft, setDraft, dirty, commit, reset, busy } = useDraft('services');
  const upd = (i: number, patch: Partial<(typeof draft)[number]>) => setDraft(draft.map((s, j) => (j === i ? { ...s, ...patch } : s)));
  return (
    <div className="card">
      <Intro title="الخدمات" text="تظهر بصفحة الخدمات، بقائمة نموذج التواصل، وبالدائرة حول الشعار. الخدمة المطفية تختفي من كل هذي الأماكن." />
      <div className="items">
        {draft.map((s, i) => (
          <div className={`item-card${s.hidden ? ' is-off' : ''}`} key={s.id}>
            <Head i={i} n={draft.length} onMove={(a, b) => setDraft(move(draft, a, b))} hidden={s.hidden} onToggle={(h) => upd(i, { hidden: h })}
              onDelete={async () => { if (await confirm('حذف هذه الخدمة؟', t(s.title, 'ar'))) setDraft(draft.filter((_, j) => j !== i)); }}>
              <ArtPicker id={'s' + i} value={s.art} onChange={(v) => upd(i, { art: v })} />
            </Head>
            <LField label="اسم الخدمة" value={s.title} onChange={(v) => upd(i, { title: v })} />
            <LField label="الوصف" long value={s.desc} onChange={(v) => upd(i, { desc: v })} />
          </div>
        ))}
      </div>
      <button type="button" className="btn btn-line" style={{ marginTop: 16 }}
        onClick={() => setDraft([...draft, { id: 's' + uid().slice(-6), art: 'content', title: { ar: '', en: '' }, desc: { ar: '', en: '' } }])}>+ إضافة خدمة</button>
      <SaveBar dirty={dirty} busy={busy} onSave={() => commit(draft.filter((s) => s.title.ar || s.title.en))} onReset={reset} />
    </div>
  );
}

function OrbitList() {
  const { content } = useDash();
  const { draft, setDraft, dirty, commit, reset, busy } = useDraft('orbit');
  const upd = (i: number, patch: Partial<(typeof draft)[number]>) => setDraft(draft.map((s, j) => (j === i ? { ...s, ...patch } : s)));
  return (
    <div className="card">
      <Intro title="الدائرة حول الشعار" text="بطاقات الخدمات اللي تدور ويا الفيديوهات بالرئيسية. تظهر لحد 6 بطاقات، بين كل فيديو وفيديو." />
      <div className="items">
        {draft.map((o, i) => (
          <div className={`item-card${o.hidden ? ' is-off' : ''}`} key={i}>
            <Head i={i} n={draft.length} onMove={(a, b) => setDraft(move(draft, a, b))} onDelete={() => setDraft(draft.filter((_, j) => j !== i))} hidden={o.hidden} onToggle={(h) => upd(i, { hidden: h })}>
              <select className="select" style={{ width: 'auto' }} value={o.service} onChange={(e) => upd(i, { service: e.target.value })} aria-label="الخدمة">
                {content.services.map((s) => <option key={s.id} value={s.id}>{t(s.title, 'ar')}</option>)}
              </select>
            </Head>
            <LField label="الجملة القصيرة" value={o.sub} onChange={(v) => upd(i, { sub: v })} />
          </div>
        ))}
      </div>
      <button type="button" className="btn btn-line" style={{ marginTop: 16 }}
        onClick={() => setDraft([...draft, { service: content.services[0]?.id || '', sub: { ar: '', en: '' } }])}>+ إضافة بطاقة</button>
      <SaveBar dirty={dirty} busy={busy} onSave={() => commit()} onReset={reset} />
    </div>
  );
}

function ApproachList() {
  const { draft, setDraft, dirty, commit, reset, busy } = useDraft('approach');
  const upd = (i: number, patch: Partial<(typeof draft)[number]>) => setDraft(draft.map((s, j) => (j === i ? { ...s, ...patch } : s)));
  return (
    <div className="card">
      <Intro title="نهجنا" text="الصفوف المرسومة بالرئيسية، وبطاقات نهجنا والنقاط بصفحة من نحن." />
      <div className="items">
        {draft.map((a, i) => (
          <div className={`item-card${a.hidden ? ' is-off' : ''}`} key={i}>
            <Head i={i} n={draft.length} onMove={(x, y) => setDraft(move(draft, x, y))} onDelete={() => setDraft(draft.filter((_, j) => j !== i))} hidden={a.hidden} onToggle={(h) => upd(i, { hidden: h })}>
              <ArtPicker id={'a' + i} value={a.art} onChange={(v) => upd(i, { art: v })} />
            </Head>
            <LField label="العنوان الكبير" value={a.heading} onChange={(v) => upd(i, { heading: v })} />
            <LField label="العنوان الصغير" value={a.title} onChange={(v) => upd(i, { title: v })} />
            <LField label="النص" long value={a.desc} onChange={(v) => upd(i, { desc: v })} />
          </div>
        ))}
      </div>
      <button type="button" className="btn btn-line" style={{ marginTop: 16 }}
        onClick={() => setDraft([...draft, { art: 'plans', heading: { ar: '', en: '' }, title: { ar: '', en: '' }, desc: { ar: '', en: '' } }])}>+ إضافة فقرة</button>
      <SaveBar dirty={dirty} busy={busy} onSave={() => commit()} onReset={reset} />
    </div>
  );
}

function StepsList() {
  const { draft, setDraft, dirty, commit, reset, busy } = useDraft('steps');
  const upd = (i: number, patch: Partial<(typeof draft)[number]>) => setDraft(draft.map((s, j) => (j === i ? { ...s, ...patch } : s)));
  return (
    <div className="card">
      <Intro title="خطوات آلية العمل" text="بصفحة الخدمات. الهرم المرسوم بيه 6 طبقات، وكل طبقة مربوطة بخطوة بالترتيب — الأفضل تبقى 6 خطوات." />
      <div className="items">
        {draft.map((s, i) => (
          <div className={`item-card${s.hidden ? ' is-off' : ''}`} key={i}>
            <Head i={i} n={draft.length} onMove={(x, y) => setDraft(move(draft, x, y))} onDelete={() => setDraft(draft.filter((_, j) => j !== i))} hidden={s.hidden} onToggle={(h) => upd(i, { hidden: h })} />
            <LField label="عنوان الخطوة" value={s.title} onChange={(v) => upd(i, { title: v })} />
            <LField label="الشرح" long value={s.desc} onChange={(v) => upd(i, { desc: v })} />
          </div>
        ))}
      </div>
      <button type="button" className="btn btn-line" style={{ marginTop: 16 }} onClick={() => setDraft([...draft, { title: { ar: '', en: '' }, desc: { ar: '', en: '' } }])}>+ إضافة خطوة</button>
      <SaveBar dirty={dirty} busy={busy} onSave={() => commit()} onReset={reset} />
    </div>
  );
}

function BudgetsList() {
  const { draft, setDraft, dirty, commit, reset, busy } = useDraft('budgets');
  return (
    <div className="card">
      <Intro title="خيارات الميزانية" text="القائمة بنموذج التواصل. أول خيار يعني (غير محددة) وما ينحفظ كرقم." />
      <div className="items">
        {draft.map((b: L, i) => (
          <div className="item-card" key={i}>
            <Head i={i} n={draft.length} onMove={(x, y) => setDraft(move(draft, x, y))} onDelete={() => setDraft(draft.filter((_, j) => j !== i))} />
            <LField label={i === 0 ? 'الخيار الافتراضي' : 'الخيار'} value={b} onChange={(v) => setDraft(draft.map((x, j) => (j === i ? v : x)))} />
          </div>
        ))}
      </div>
      <button type="button" className="btn btn-line" style={{ marginTop: 16 }} onClick={() => setDraft([...draft, { ar: '', en: '' }])}>+ إضافة خيار</button>
      <SaveBar dirty={dirty} busy={busy} onSave={() => commit(draft.filter((b) => b.ar || b.en))} onReset={reset} />
    </div>
  );
}
