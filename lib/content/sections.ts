import type { Content } from './types';

/** Page sections the dashboard can switch on and off. The page hero is always shown. */
export const SECTIONS = [
  {
    page: 'home', title: 'الرئيسية', path: '/',
    items: [
      ['home.approach', 'نهجنا (الصفوف المرسومة)'],
      ['home.featured', 'أعمال مختارة'],
      ['home.stats', 'شريط الأرقام'],
      ['home.clients', 'شريط شعارات العملاء'],
      ['home.cta', 'دعوة للتواصل (أسفل الصفحة)']
    ]
  },
  {
    page: 'about', title: 'من نحن', path: '/about',
    items: [
      ['about.intro', 'النبذة والصورة'],
      ['about.approach', 'بطاقات نهجنا'],
      ['about.stats', 'شريط الأرقام'],
      ['about.team', 'فريق العمل'],
      ['about.clients', 'شعارات العملاء'],
      ['about.cta', 'دعوة للتواصل (أسفل الصفحة)']
    ]
  },
  {
    page: 'services', title: 'الخدمات', path: '/services',
    items: [
      ['services.list', 'قائمة الخدمات'],
      ['services.process', 'آلية العمل (الهرم)'],
      ['services.cta', 'دعوة للتواصل (أسفل الصفحة)']
    ]
  },
  {
    page: 'work', title: 'الأعمال', path: '/work',
    items: [
      ['work.grid', 'معرض الأعمال'],
      ['work.clients', 'شريط شعارات العملاء'],
      ['work.cta', 'دعوة للتواصل (أسفل الصفحة)']
    ]
  },
  {
    page: 'contact', title: 'تواصل معنا', path: '/contact',
    items: [
      ['contact.info', 'معلومات التواصل'],
      ['contact.form', 'نموذج التواصل']
    ]
  }
] as const;

export type SectionKey = (typeof SECTIONS)[number]['items'][number][0];

/** Is this page section switched on? (on unless the dashboard turned it off) */
export const sectionOn = (c: Content, key: SectionKey) => c.settings.sections?.[key] !== false;

const shown = <T extends { hidden?: boolean }>(list: T[]) => list.filter((x) => !x.hidden);

/** The content visitors see: everything switched off in the dashboard is removed. */
export function visibleContent(c: Content): Content {
  const categories = shown(c.categories);
  const catIds = new Set(categories.map((x) => x.id));
  const services = shown(c.services);
  const serviceIds = new Set(services.map((x) => x.id));
  return {
    ...c,
    categories,
    services,
    works: shown(c.works).filter((w) => !w.category || catIds.has(w.category) || !c.categories.some((x) => x.id === w.category)),
    orbit: shown(c.orbit).filter((o) => serviceIds.has(o.service)),
    approach: shown(c.approach),
    steps: shown(c.steps),
    clients: shown(c.clients),
    team: shown(c.team)
  };
}
