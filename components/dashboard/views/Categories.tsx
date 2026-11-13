'use client';

import { Icon, uid, useDash, useDraft } from '../ctx';
import { SaveBar } from '../fields';

export function Categories() {
  const { content, confirm, toast } = useDash();
  const { draft, setDraft, dirty, commit, reset, busy } = useDraft('categories');
  const count = (id: string) => content.works.filter((w) => w.category === id).length;
  return (
    <div className="card">
      <div className="cat-row cat-head"><span>الاسم بالعربي</span><span>الاسم بالإنكليزي</span><span className="cnt">الأعمال</span><span /></div>
      {draft.map((c, i) => (
        <div className="cat-row" key={c.id}>
          <input className="input" aria-label="الاسم بالعربي" value={c.name.ar} onChange={(e) => setDraft(draft.map((x, j) => (j === i ? { ...x, name: { ...x.name, ar: e.target.value } } : x)))} />
          <input className="input" aria-label="الاسم بالإنكليزي" dir="ltr" value={c.name.en} onChange={(e) => setDraft(draft.map((x, j) => (j === i ? { ...x, name: { ...x.name, en: e.target.value } } : x)))} />
          <span className="cnt">{count(c.id)}</span>
          <button className="icon-btn danger" aria-label="حذف" onClick={async () => {
            if (count(c.id)) { toast('هذا التصنيف مستخدم بأعمال — انقل الأعمال لتصنيف ثاني أول.', true); return; }
            if (await confirm('حذف التصنيف؟')) setDraft(draft.filter((_, j) => j !== i));
          }}>{Icon.trash}</button>
        </div>
      ))}
      <button className="btn btn-line" style={{ marginTop: 18 }} onClick={() => setDraft([...draft, { id: 'k' + uid().slice(-5), name: { ar: '', en: '' } }])}>+ إضافة تصنيف</button>
      <SaveBar dirty={dirty} busy={busy} onSave={() => commit(draft.filter((c) => c.name.ar || c.name.en || count(c.id)))} onReset={reset} />
    </div>
  );
}
