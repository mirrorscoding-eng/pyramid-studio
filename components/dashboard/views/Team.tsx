'use client';

import { t } from '@/lib/content/defaults';
import { Icon, uid, useDash, useDraft } from '../ctx';
import { MediaField, MoveButtons, SaveBar, move } from '../fields';
import { initial } from './util';

export function Team() {
  const { confirm } = useDash();
  const { draft, setDraft, dirty, commit, reset, busy } = useDraft('team');
  const upd = (i: number, path: 'name' | 'role', lang: 'ar' | 'en', v: string) =>
    setDraft(draft.map((m, j) => (j === i ? { ...m, [path]: { ...m[path], [lang]: v } } : m)));
  return (
    <div className="card">
      <div className="l-list">
        {draft.map((m, i) => (
          <div className="l-row" key={m.id}>
            <span className="av" style={m.photo ? { overflow: 'hidden', background: 'var(--paper-2)' } : undefined}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {m.photo ? <img src={m.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} /> : initial(t(m.name, 'ar'))}
            </span>
            <div className="l-fields">
              <input className="input" placeholder="الاسم بالعربي" aria-label="الاسم بالعربي" value={m.name.ar} onChange={(e) => upd(i, 'name', 'ar', e.target.value)} />
              <input className="input" placeholder="Name (English)" aria-label="الاسم بالإنكليزي" dir="ltr" value={m.name.en} onChange={(e) => upd(i, 'name', 'en', e.target.value)} />
              <input className="input" placeholder="المنصب بالعربي" aria-label="المنصب بالعربي" value={m.role.ar} onChange={(e) => upd(i, 'role', 'ar', e.target.value)} />
              <input className="input" placeholder="Role (English)" aria-label="المنصب بالإنكليزي" dir="ltr" value={m.role.en} onChange={(e) => upd(i, 'role', 'en', e.target.value)} />
              <div style={{ gridColumn: '1 / -1' }}>
                <MediaField label="الصورة" value={m.photo || ''} folder="team" contain hint="يفضّل صورة مقصوصة بخلفية شفافة (PNG/WebP)."
                  onChange={(v) => setDraft(draft.map((x, j) => (j === i ? { ...x, photo: v } : x)))} />
              </div>
            </div>
            <div className="acts" style={{ display: 'flex', gap: 6 }}>
              <MoveButtons i={i} n={draft.length} onMove={(a, b) => setDraft(move(draft, a, b))} />
              <button className="icon-btn danger" aria-label="حذف"
                onClick={async () => { if (await confirm('حذف هذا العضو؟', t(m.name, 'ar'))) setDraft(draft.filter((_, j) => j !== i)); }}>{Icon.trash}</button>
            </div>
          </div>
        ))}
      </div>
      <button className="btn btn-line" style={{ marginTop: 18 }}
        onClick={() => setDraft([...draft, { id: 't' + uid().slice(-6), name: { ar: '', en: '' }, role: { ar: '', en: '' } }])}>+ إضافة عضو</button>
      <SaveBar dirty={dirty} busy={busy} onSave={() => commit(draft.filter((m) => m.name.ar || m.name.en))} onReset={reset} />
    </div>
  );
}
