import type { Metadata } from 'next';
import { t } from '@/lib/content/defaults';
import { getSiteContent, getLang, makeT } from '@/lib/content/server';
import { sectionOn } from '@/lib/content/sections';
import { PageHero, digits, waLink } from '@/components/site/blocks';
import { ContactForm } from '@/components/site/ContactForm';

export async function generateMetadata(): Promise<Metadata> {
  const [c, lang] = await Promise.all([getSiteContent(), getLang()]);
  return { title: makeT(c, lang)('meta_contact') };
}

const ICONS = {
  wa: <><path d="M3 21l1.6-4.7A8.5 8.5 0 1 1 8 19.6Z" /><path d="M9 9.5c.5 2.5 2.5 4.5 5 5l1.2-1.4 2 1-.6 1.6c-3.6.4-8.4-4.2-8-8l1.6-.6 1 2Z" /></>,
  phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>,
  ig: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" /></>,
  studio: <><path d="M4 8h3l2-3h6l2 3h3v11H4Z" /><circle cx="12" cy="13" r="3.5" /></>
};

export default async function Contact() {
  const [c, lang] = await Promise.all([getSiteContent(), getLang()]);
  const tx = makeT(c, lang);
  const st = c.settings;
  const rows: [href: string, label: string, value: string, icon: React.ReactNode][] = [];
  if (st.whatsapp) rows.push([waLink(st.whatsapp), tx('i_wa'), st.whatsapp, ICONS.wa]);
  (st.phones || []).filter(Boolean).forEach((p) => rows.push([`tel:${digits(p)}`, tx('i_phone'), p, ICONS.phone]));
  if (st.email) rows.push([`mailto:${st.email}`, tx('i_mail'), st.email, ICONS.mail]);
  if (st.instagram) rows.push([`https://instagram.com/${st.instagram}`, tx('i_ig'), '@' + st.instagram, ICONS.ig]);
  if (st.studio) rows.push([`https://instagram.com/${st.studio}`, tx('i_studio'), '@' + st.studio, ICONS.studio]);
  const formKeys = ['form_h', 'form_p', 'f_name', 'f_company', 'f_phone', 'f_email', 'f_service', 'f_budget', 'f_message', 'optional', 'f_send', 'sent', 'required', 'saveFail'] as const;

  const showInfo = sectionOn(c, 'contact.info');
  const showForm = sectionOn(c, 'contact.form');

  return (
    <>
      <PageHero c={c} lang={lang} k="contact" artKey="social" />
      {(showInfo || showForm) && <section className="sec" style={{ paddingTop: 50 }}><div className="container contact-grid" style={showInfo && showForm ? undefined : { gridTemplateColumns: 'minmax(0, 720px)', justifyContent: 'center' }}>
        {showInfo && <div className="reveal">
          <div className="info-list">
            {rows.map(([href, label, value, icon], i) => (
              <a className="info-row" href={href} key={i} {...(href.startsWith('http') ? { target: '_blank', rel: 'noopener' } : {})}>
                <span className="ico"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{icon}</svg></span>
                <span><small>{label}</small><b>{value}</b></span>
              </a>
            ))}
          </div>
          <div className="hours"><b>{tx('hours_t')}</b><p>{tx('hours_p')}</p></div>
        </div>}
        {showForm && <ContactForm
          tx={Object.fromEntries(formKeys.map((k) => [k, tx(k)])) as Record<(typeof formKeys)[number], string>}
          services={c.services.map((s) => ({ id: s.id, title: t(s.title, lang) }))}
          budgets={c.budgets.map((b, i) => ({ value: i === 0 ? '' : b.ar, label: t(b, lang) }))}
        />}
      </div></section>}
    </>
  );
}
