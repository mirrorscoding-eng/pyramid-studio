'use client';

import { t } from '@/lib/content/defaults';
import { Icon, uid, useDash, useDraft } from '../ctx';
import { MediaField, MoveButtons, SaveBar, move } from '../fields';

export function Clients() {
  const { confirm } = useDash();
  const { draft, setDraft, dirty, commit, reset, busy } = useDraft('clients');
  const upd = (i: number, patch: Partial<(typeof draft)[number]>) => setDraft(draft.map((c, j) => (j === i ? { ...c, ...patch } : c)));
  return (
    <div className="card">
      <p className="muted" style={{ fontSize: 13.5, marginBottom: 8 }}>أول 3 شعارات تظهر بكروت الواجهة. الشعار الأسود (سلويت) يخلي الشعارات الملونة بلون واحد حتى تتناسق.</p>
      <div className="items">
        {draft.map((c, i) => (
          <div className="item-card" key={c.id}>
            <div className="item-head">
              <span className="num">{String(i + 1).padStart(2, '0')}</span>
              <b>{t(c.name, 'ar') || 'عميل جديد'}</b>
              <span className="spacer" />
              <MoveButtons i={i} n={draft.length} onMove={(a, b) => setDraft(move(draft, a, b))} />
              <button className="icon-btn danger" aria-label="حذف"
                onClick={async () => { if (await confirm('حذف هذا العميل؟', t(c.name, 'ar'))) setDraft(draft.filter((_, j) => j !== i)); }}>{Icon.trash}</button>
            </div>
            <div className="grid-2">
              <div className="field"><label>الاسم بالعربي</label><input className="input" value={c.name.ar} onChange={(e) => upd(i, { name: { ...c.name, ar: e.target.value } })} /></div>
              <div className="field"><label>الاسم بالإنكليزي</label><input className="input" dir="ltr" value={c.name.en} onChange={(e) => upd(i, { name: { ...c.name, en: e.target.value } })} /></div>
            </div>
            <MediaField label="الشعار" value={c.logo} folder="clients" contain onChange={(v) => upd(i, { logo: v })} />
          </div>
        ))}
      </div>
      <button className="btn btn-line" style={{ marginTop: 18 }}
        onClick={() => setDraft([...draft, { id: 'c' + uid().slice(-6), name: { ar: '', en: '' }, logo: '' }])}>+ إضافة عميل</button>
      <SaveBar dirty={dirty} busy={busy} onSave={() => commit(draft.filter((c) => c.name.ar || c.name.en || c.logo))} onReset={reset} />
    </div>
  );
}
