'use client';

import { useRef, useState, useTransition } from 'react';
import { sendMessage } from '@/app/(site)/actions';
import { useSite } from './SiteClient';

type Texts = Record<'form_h' | 'form_p' | 'f_name' | 'f_company' | 'f_phone' | 'f_email' | 'f_service' | 'f_budget' | 'f_message' | 'optional' | 'f_send' | 'sent' | 'required' | 'saveFail', string>;

export function ContactForm({ tx, services, budgets }: { tx: Texts; services: { id: string; title: string }[]; budgets: { value: string; label: string }[] }) {
  const { toast } = useSite();
  const formRef = useRef<HTMLFormElement>(null);
  const [err, setErr] = useState<{ name?: boolean; phone?: boolean }>({});
  const [pending, start] = useTransition();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const name = String(fd.get('name') || '').trim(), phone = String(fd.get('phone') || '').trim();
    setErr({ name: !name, phone: !phone });
    if (!name || !phone) { toast(tx.required); return; }
    start(async () => {
      const res = await sendMessage(fd);
      if (res.ok) { formRef.current?.reset(); toast('✦ ' + tx.sent); }
      else toast(res.error === 'required' ? tx.required : tx.saveFail);
    });
  };

  return (
    <form className="form-card reveal" ref={formRef} onSubmit={onSubmit} noValidate>
      <h3>{tx.form_h}</h3><p>{tx.form_p}</p>
      <div className="fields">
        <div className={`field${err.name ? ' err' : ''}`}><label htmlFor="f-name">{tx.f_name} *</label><input id="f-name" name="name" autoComplete="name" required /></div>
        <div className="field"><label htmlFor="f-company">{tx.f_company}</label><input id="f-company" name="company" autoComplete="organization" /></div>
        <div className={`field${err.phone ? ' err' : ''}`}><label htmlFor="f-phone">{tx.f_phone} *</label><input id="f-phone" name="phone" type="tel" autoComplete="tel" dir="ltr" required /></div>
        <div className="field"><label htmlFor="f-email">{tx.f_email}</label><input id="f-email" name="email" type="email" autoComplete="email" dir="ltr" /></div>
        <div className="field"><label htmlFor="f-service">{tx.f_service}</label>
          <select id="f-service" name="service">{services.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}</select>
        </div>
        <div className="field"><label htmlFor="f-budget">{tx.f_budget} <i>{tx.optional}</i></label>
          <select id="f-budget" name="budget">{budgets.map((b, i) => <option key={i} value={b.value}>{b.label}</option>)}</select>
        </div>
        <div className="field full"><label htmlFor="f-message">{tx.f_message} <i>{tx.optional}</i></label><textarea id="f-message" name="message" /></div>
        <input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }} />
      </div>
      <button className="btn btn-ink" type="submit" disabled={pending}>{tx.f_send}</button>
    </form>
  );
}
