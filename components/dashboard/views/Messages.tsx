'use client';

import { useEffect, useState } from 'react';
import { deleteMessage, setMessageRead } from '@/app/(admin)/dashboard/actions';
import { logoSVG } from '@/lib/art';
import { t } from '@/lib/content/defaults';
import { useDash } from '../ctx';
import { ago, digits, initial } from './util';

export function Messages({ activeId }: { activeId?: string }) {
  const { messages, setMessages, content, confirm, toast } = useDash();
  const [active, setActive] = useState<string | null>(activeId || null);
  const [skip, setSkip] = useState<string | null>(null);
  const m = messages.find((x) => x.id === active) || messages[0];

  useEffect(() => {
    if (!m || m.read || m.id === skip) return;
    setMessages((list) => list.map((x) => (x.id === m.id ? { ...x, read: true } : x)));
    setMessageRead(m.id, true).then((r) => { if (!r.ok) toast('ما گدرنا نحدّث الرسالة.', true); });
  }, [m, skip, setMessages, toast]);

  if (!messages.length || !m) {
    return <div className="card empty"><span className="svgw" dangerouslySetInnerHTML={{ __html: logoSVG({ bg: 'none' }) }} /><p>ماكو رسائل بعد.</p></div>;
  }

  const svc = (id: string) => t(content.services.find((s) => s.id === id)?.title, 'ar') || id || '—';

  const markUnread = async () => {
    const r = await setMessageRead(m.id, false);
    if (!r.ok) return toast('ما گدرنا نحدّث الرسالة.', true);
    setMessages((list) => list.map((x) => (x.id === m.id ? { ...x, read: false } : x)));
    const next = messages.find((x) => x.id !== m.id);
    if (next) setActive(next.id); else setSkip(m.id);
  };
  const remove = async () => {
    if (!(await confirm('حذف الرسالة؟', 'ما تگدر ترجع الرسالة بعد الحذف.'))) return;
    const r = await deleteMessage(m.id);
    if (!r.ok) return toast('ما گدرنا نحذف الرسالة.', true);
    setMessages((list) => list.filter((x) => x.id !== m.id));
    setActive(null);
    toast('تم الحذف');
  };

  return (
    <div className="inbox">
      <div className="card inbox-list">
        {messages.map((x) => (
          <button key={x.id} className={`inbox-item${x.id === m.id ? ' active' : ''}`} onClick={() => { setActive(x.id); setSkip(null); }}>
            <span className={`av${x.read ? '' : ' unread'}`}>{initial(x.name)}</span>
            <span className="body"><b><span>{x.name}</span><time>{ago(x.created_at)}</time></b><p>{x.message || x.company}</p></span>
          </button>
        ))}
      </div>
      <div className="card msg-detail">
        <span className="chip ink">{svc(m.service)}</span>
        <h2 style={{ marginTop: 12 }}>{m.name}</h2>
        <p className="muted" style={{ fontSize: 13 }}>{new Date(m.created_at).toLocaleString('ar-IQ', { dateStyle: 'medium', timeStyle: 'short' })}</p>
        <div className="msg-meta">
          <div><span>الهاتف</span><b>{m.phone || '—'}</b></div>
          <div><span>البريد</span><b>{m.email || '—'}</b></div>
          <div><span>الشركة/المشروع</span><b style={{ direction: 'inherit' }}>{m.company || '—'}</b></div>
          <div><span>الخدمة</span><b style={{ direction: 'inherit' }}>{svc(m.service)}</b></div>
          <div><span>الميزانية</span><b style={{ direction: 'inherit' }}>{m.budget || '—'}</b></div>
        </div>
        <div className="msg-text">{m.message || '—'}</div>
        <div className="msg-actions">
          {m.phone && (
            <>
              <a className="btn btn-ink" href={`https://wa.me/${digits(m.phone).replace('+', '')}`} target="_blank" rel="noopener">واتساب ↗</a>
              <a className="btn btn-line" href={`tel:${digits(m.phone)}`}>اتصال</a>
            </>
          )}
          {m.email && <a className="btn btn-line" href={`mailto:${m.email}`}>رد بالإيميل</a>}
          <button className="btn btn-line" onClick={markUnread}>تعليم كغير مقروءة</button>
          <button className="btn btn-danger" onClick={remove}>حذف</button>
        </div>
      </div>
    </div>
  );
}
