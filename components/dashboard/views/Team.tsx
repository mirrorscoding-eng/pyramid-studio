'use client';

import { t } from '@/lib/content/defaults';
import type { Member } from '@/lib/content/types';
import { Icon, uid, useDash, useDraft } from '../ctx';
import { MediaField, MoveButtons, SaveBar, VisToggle, move } from '../fields';
import { initial } from './util';

export function Team() {
  const { confirm } = useDash();
  const { draft, setDraft, dirty, commit, reset, busy } = useDraft('team');
  const patch = (i: number, p: Partial<Member>) => setDraft(draft.map((m, j) => (j === i ? { ...m, ...p } : m)));
  const shown = draft.filter((m) => !m.hidden).length;

  return (
    <div className="card">
      <div className="card-head">
        <div>
          <h2>أعضاء الفريق</h2>
          <p className="muted" style={{ fontSize: 13.5 }}>{draft.length} عضو · {shown} ظاهر بالموقع. اطفي العضو حتى يختفي من الموقع بدون ما تحذفه. المؤسسين تطلع بطاقاتهم مميزة بالأعلى.</p>
        </div>
        <button type="button" className="btn btn-ink btn-sm"
          onClick={() => setDraft([...draft, { id: 't' + uid().slice(-6), name: { ar: '', en: '' }, role: { ar: '', en: '' }, photo: '' }])}>{Icon.plus}<span>عضو جديد</span></button>
      </div>
      <div className="items">
        {draft.map((m, i) => (
          <div className={`item-card${m.hidden ? ' is-off' : ''}`} key={m.id}>
            <div className="item-head">
              <span className="num">{String(i + 1).padStart(2, '0')}</span>
              <span className="av" style={m.photo ? { overflow: 'hidden', background: 'var(--paper-2)' } : undefined}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {m.photo ? <img src={m.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top' }} /> : initial(t(m.name, 'ar') || '؟')}
              </span>
              <b>{t(m.name, 'ar') || 'عضو جديد'}</b>
              {m.featured && <span className="chip ochre">✦ مؤسس</span>}
              <span className="spacer" />
              <VisToggle on={!m.hidden} label={t(m.name, 'ar')} onChange={(on) => patch(i, { hidden: !on })} />
              <MoveButtons i={i} n={draft.length} onMove={(a, b) => setDraft(move(draft, a, b))} />
              <button type="button" className="icon-btn danger" aria-label="حذف" title="حذف"
                onClick={async () => { if (await confirm('حذف هذا العضو؟', t(m.name, 'ar'))) setDraft(draft.filter((_, j) => j !== i)); }}>{Icon.trash}</button>
            </div>
            <div className="grid-2">
              <div className="field"><label>الاسم بالعربي</label><input className="input" value={m.name.ar} onChange={(e) => patch(i, { name: { ...m.name, ar: e.target.value } })} /></div>
              <div className="field"><label>الاسم بالإنكليزي</label><input className="input" dir="ltr" value={m.name.en} onChange={(e) => patch(i, { name: { ...m.name, en: e.target.value } })} /></div>
              <div className="field"><label>المنصب بالعربي</label><input className="input" value={m.role.ar} onChange={(e) => patch(i, { role: { ...m.role, ar: e.target.value } })} /></div>
              <div className="field"><label>المنصب بالإنكليزي</label><input className="input" dir="ltr" value={m.role.en} onChange={(e) => patch(i, { role: { ...m.role, en: e.target.value } })} /></div>
            </div>
            <label className="switch"><input type="checkbox" checked={!!m.featured} onChange={(e) => patch(i, { featured: e.target.checked })} /> مؤسس — تطلع بطاقته مميزة بأعلى الفريق</label>
            <MediaField label="الصورة" value={m.photo || ''} folder="team" contain hint="الأفضل صورة مقصوصة بخلفية شفافة (PNG أو WebP)." onChange={(v) => patch(i, { photo: v })} />
          </div>
        ))}
      </div>
      <SaveBar dirty={dirty} busy={busy} onSave={() => commit(draft.filter((m) => m.name.ar || m.name.en))} onReset={reset} />
    </div>
  );
}
