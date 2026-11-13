/* ============================================================
   PYRAMID · هرم — shared local store + art generators
   Local demo: everything is saved in the browser (localStorage).
   ============================================================ */
(function () {
  const KEY = 'pyramid.store.v2';
  const LANG_KEY = 'pyramid.lang';

  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  const hash = (str) => {
    let h = 2166136261;
    for (let i = 0; i < String(str).length; i++) {
      h ^= String(str).charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  };

  const esc = (s) =>
    String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const t = (obj, lang) => {
    if (obj == null) return '';
    if (typeof obj === 'string') return obj;
    return obj[lang] || obj.ar || obj.en || '';
  };

  /* ---------------- default data (content from pyramidstudio.co) ---------------- */
  const IMG = 'https://pyramidstudio.co/assets/images/';
  const defaults = () => ({
    version: 2,
    settings: {
      eyebrow: { ar: 'هرم للتسويق والإنتاج الإبداعي', en: 'Pyramid — marketing & creative production' },
      heroTop: { ar: 'المحتوى', en: 'Content' },
      heroScript: { ar: 'هو الملك.', en: 'is king.' },
      heroSub: {
        ar: 'نفهم المشروع، نحوله إلى خطة واضحة، والخطة إلى محتوى مؤثر، والمحتوى إلى نتائج قابلة للقياس.',
        en: 'We understand the project, turn it into a clear plan, the plan into impactful content, and the content into measurable results.'
      },
      about: {
        ar: 'استوديو هرم هو فريق تسويق مختص بإنتاج المحتوى الفني والتجاري والتوعوي، يجمع بين التخطيط التسويقي، صناعة المحتوى، الإنتاج البصري وادارة المنصات الألكترونية مع الالتزام بالجودة وسرعة التنفيذ والتسليم.',
        en: 'Pyramid Studio is a marketing team specialised in artistic, commercial and awareness content. We bring together marketing planning, content creation, visual production and social platform management — with a commitment to quality and fast delivery.'
      },
      aboutImage: IMG + 'about/about.webp',
      phones: ['+964 785 800 8800', '+964 771 101 1006'],
      whatsapp: '+964 785 800 8800',
      email: 'iqpyramid@gmail.com',
      instagram: 'pyramid.iq',
      studio: 'pyramid_studio1',
      threads: 'pyramid.iq',
      website: 'www.pyramidstudio.co',
      years: 10,
      projects: 1000,
      clientsCount: 50,
      followers: 2792,
      posts: 106
    },
    categories: [
      { id: 'reels', name: { ar: 'ريلز إعلانية', en: 'Promo reels' } },
      { id: 'social', name: { ar: 'إدارة منصات', en: 'Social management' } },
      { id: 'photo', name: { ar: 'تصوير', en: 'Photography' } },
      { id: 'ads', name: { ar: 'حملات ترويجية', en: 'Promotion' } },
      { id: 'brand', name: { ar: 'تصميم', en: 'Design' } }
    ],
    works: [
      { id: 'p1', category: 'reels', year: '', featured: true, cover: 0, image: IMG + 'projects/aquadiva.webp', link: 'https://www.instagram.com/reel/DbDazcNsdht',
        title: { ar: 'أكواديفا', en: 'Aquadiva' }, client: { ar: 'أكواديفا', en: 'Aquadiva' },
        summary: { ar: 'ريل إعلاني من إنتاج استوديو هرم — شاهده كامل على إنستغرام.', en: 'A promotional reel produced by Pyramid Studio — watch it in full on Instagram.' },
        services: [], results: [] },
      { id: 'p2', category: 'reels', year: '', featured: true, cover: 1, image: IMG + 'projects/nuwa.webp', link: 'https://www.instagram.com/reel/DZU5-dDISY8',
        title: { ar: 'نوى', en: 'Nuwa' }, client: { ar: 'نوى', en: 'Nuwa' },
        summary: { ar: 'ريل إعلاني من إنتاج استوديو هرم — شاهده كامل على إنستغرام.', en: 'A promotional reel produced by Pyramid Studio — watch it in full on Instagram.' },
        services: [], results: [] },
      { id: 'p3', category: 'reels', year: '', featured: true, cover: 2, image: IMG + 'projects/tanky.webp', link: 'https://www.instagram.com/reel/DWRDvhcDDRZ',
        title: { ar: 'تانكي', en: 'Tanky' }, client: { ar: 'تانكي', en: 'Tanky' },
        summary: { ar: 'ريل إعلاني من إنتاج استوديو هرم — شاهده كامل على إنستغرام.', en: 'A promotional reel produced by Pyramid Studio — watch it in full on Instagram.' },
        services: [], results: [] },
      { id: 'p4', category: 'reels', year: '', featured: true, cover: 3, image: IMG + 'projects/watar.webp', link: 'https://www.instagram.com/reel/DT0d-LbDJr-',
        title: { ar: 'وتر للاستشارات الهندسية', en: 'Watar Engineering Consultancy' }, client: { ar: 'وتر للاستشارات الهندسية', en: 'Watar Engineering Consultancy' },
        summary: { ar: 'ريل إعلاني من إنتاج استوديو هرم — شاهده كامل على إنستغرام.', en: 'A promotional reel produced by Pyramid Studio — watch it in full on Instagram.' },
        services: [], results: [] },
      { id: 'p5', category: 'reels', year: '', featured: false, cover: 4, image: IMG + 'projects/dr.mo.webp', link: 'https://www.instagram.com/reel/DZQJwEZtHZ4',
        title: { ar: 'الدكتور محمد الخفاجي', en: 'Dr. Mohammed Al-Khafaji' }, client: { ar: 'الدكتور محمد الخفاجي', en: 'Dr. Mohammed Al-Khafaji' },
        summary: { ar: 'ريل إعلاني من إنتاج استوديو هرم — شاهده كامل على إنستغرام.', en: 'A promotional reel produced by Pyramid Studio — watch it in full on Instagram.' },
        services: [], results: [] },
      { id: 'p6', category: 'reels', year: '', featured: false, cover: 5, image: IMG + 'projects/car.webp', link: 'https://www.instagram.com/reel/DaS3VrHIIe7',
        title: { ar: 'خيرات المهند', en: 'Khayrat Al-Muhannad' }, client: { ar: 'خيرات المهند', en: 'Khayrat Al-Muhannad' },
        summary: { ar: 'ريل إعلاني من إنتاج استوديو هرم — شاهده كامل على إنستغرام.', en: 'A promotional reel produced by Pyramid Studio — watch it in full on Instagram.' },
        services: [], results: [] },
      { id: 'p7', category: 'reels', year: '', featured: false, cover: 0, image: IMG + 'projects/alomix.webp', link: 'https://www.instagram.com/reel/DQJc8Hcjf9Y',
        title: { ar: 'خبراء الومكس', en: 'Alumix Experts' }, client: { ar: 'خبراء الومكس', en: 'Alumix Experts' },
        summary: { ar: 'ريل إعلاني من إنتاج استوديو هرم — شاهده كامل على إنستغرام.', en: 'A promotional reel produced by Pyramid Studio — watch it in full on Instagram.' },
        services: [], results: [] },
      { id: 'p8', category: 'reels', year: '', featured: false, cover: 1, image: IMG + 'projects/halab.webp', link: 'https://www.instagram.com/reel/C-r1mfEt8Vh',
        title: { ar: 'مطعم بيت حلب', en: 'Bayt Halab Restaurant' }, client: { ar: 'مطعم بيت حلب', en: 'Bayt Halab Restaurant' },
        summary: { ar: 'ريل إعلاني من إنتاج استوديو هرم — شاهده كامل على إنستغرام.', en: 'A promotional reel produced by Pyramid Studio — watch it in full on Instagram.' },
        services: [], results: [] },
      { id: 'p9', category: 'reels', year: '', featured: false, cover: 2, image: IMG + 'projects/care.webp', link: 'https://www.instagram.com/reel/DHv-mYnNJeq',
        title: { ar: 'كير', en: 'Care' }, client: { ar: 'كير', en: 'Care' },
        summary: { ar: 'ريل إعلاني من إنتاج استوديو هرم — شاهده كامل على إنستغرام.', en: 'A promotional reel produced by Pyramid Studio — watch it in full on Instagram.' },
        services: [], results: [] },
      { id: 'p10', category: 'reels', year: '', featured: false, cover: 3, image: IMG + 'projects/vanilly.webp', link: 'https://www.instagram.com/reel/DAX_8lsKw5H',
        title: { ar: 'فانيلي', en: 'Vanilly' }, client: { ar: 'فانيلي', en: 'Vanilly' },
        summary: { ar: 'ريل إعلاني من إنتاج استوديو هرم — شاهده كامل على إنستغرام.', en: 'A promotional reel produced by Pyramid Studio — watch it in full on Instagram.' },
        services: [], results: [] },
      { id: 'p11', category: 'reels', year: '', featured: false, cover: 4, image: IMG + 'projects/firash.webp', link: 'https://www.instagram.com/reel/DRHekmLgsX6',
        title: { ar: 'الفراش الأبيض', en: 'Al-Firash Al-Abyad' }, client: { ar: 'الفراش الأبيض', en: 'Al-Firash Al-Abyad' },
        summary: { ar: 'ريل إعلاني من إنتاج استوديو هرم — شاهده كامل على إنستغرام.', en: 'A promotional reel produced by Pyramid Studio — watch it in full on Instagram.' },
        services: [], results: [] },
      { id: 'p12', category: 'reels', year: '', featured: false, cover: 5, image: IMG + 'projects/ja-un.webp', link: 'https://www.instagram.com/reel/DBof9HBNNEy',
        title: { ar: 'جامعة الإمام جعفر الصادق', en: 'Imam Ja\'far Al-Sadiq University' }, client: { ar: 'جامعة الإمام جعفر الصادق', en: 'Imam Ja\'far Al-Sadiq University' },
        summary: { ar: 'ريل إعلاني من إنتاج استوديو هرم — شاهده كامل على إنستغرام.', en: 'A promotional reel produced by Pyramid Studio — watch it in full on Instagram.' },
        services: [], results: [] }
    ],
    clients: [
      { id: 'c1', name: { ar: 'الدكتور محمد الخفاجي', en: 'Dr. Mohammed Al-Khafaji' }, logo: IMG + 'clients/dr-mohammed-alkhafaji.png', mono: true },
      { id: 'c2', name: { ar: 'مطعم بيت حلب', en: 'Bayt Halab Restaurant' }, logo: IMG + 'clients/bayt-halab.png', mono: true },
      { id: 'c3', name: { ar: 'فانيلي', en: 'Vanilly' }, logo: IMG + 'clients/vanilly.png', mono: true },
      { id: 'c4', name: { ar: 'تانكي', en: 'Tanky' }, logo: IMG + 'clients/tanky.png', mono: true },
      { id: 'c5', name: { ar: 'أكواديفا', en: 'Aquadiva' }, logo: IMG + 'clients/aquadeva.png', mono: false },
      { id: 'c6', name: { ar: 'خيرات المهند', en: 'Khayrat Al-Muhannad' }, logo: IMG + 'clients/khyrat-almohanad.png', mono: true },
      { id: 'c7', name: { ar: 'نوى', en: 'Nuwa' }, logo: IMG + 'clients/nuwa.png', mono: true },
      { id: 'c8', name: { ar: 'وتر للاستشارات الهندسية', en: 'Watar Engineering' }, logo: IMG + 'clients/watar.png', mono: true },
      { id: 'c9', name: { ar: 'الفراش الأبيض', en: 'Al-Firash Al-Abyad' }, logo: IMG + 'clients/alfirash-alabed.png', mono: true },
      { id: 'c10', name: { ar: 'ألومكس البصرة', en: 'Alumix Basra' }, logo: IMG + 'clients/alomix-albasra.png', mono: true },
      { id: 'c11', name: { ar: 'جامعة الإمام جعفر الصادق', en: 'Imam Ja\'far Al-Sadiq University' }, logo: IMG + 'clients/imam-jaafar-al-sadiq-university.png', mono: false },
      { id: 'c12', name: { ar: 'كير', en: 'Care' }, logo: IMG + 'clients/care.png', mono: true },
      { id: 'c13', name: { ar: 'صرح هامان', en: 'Sarh Haman' }, logo: IMG + 'clients/sarh-haman.png', mono: true }
    ],
    team: [
      { id: 't1', name: { ar: 'أحمد صادق', en: 'Ahmed Sadiq' }, role: { ar: 'شريك مؤسس / مدير الفريق', en: 'Co-founder / Team lead' } },
      { id: 't2', name: { ar: 'منير أحمد', en: 'Muneer Ahmed' }, role: { ar: 'شريك مؤسس / مسوّق', en: 'Co-founder / Marketer' } },
      { id: 't3', name: { ar: 'مريم حميد', en: 'Maryam Hameed' }, role: { ar: 'مديرة المشاريع', en: 'Project manager' } },
      { id: 't4', name: { ar: 'مصطفى نبيل', en: 'Mustafa Nabeel' }, role: { ar: 'مدير المالية', en: 'Finance manager' } },
      { id: 't5', name: { ar: 'مصطفى عزت', en: 'Mustafa Ezzat' }, role: { ar: 'مصمم گرافك', en: 'Graphic designer' } },
      { id: 't6', name: { ar: 'محمد أمين', en: 'Mohammed Amin' }, role: { ar: 'مصمم گرافك', en: 'Graphic designer' } },
      { id: 't7', name: { ar: 'أحمد عادل', en: 'Ahmed Adel' }, role: { ar: 'مصمم گرافك', en: 'Graphic designer' } },
      { id: 't8', name: { ar: 'سارة علي', en: 'Sara Ali' }, role: { ar: 'مسؤولة المنصات الألكترونية', en: 'Social platforms lead' } },
      { id: 't9', name: { ar: 'بنين سعد', en: 'Baneen Saad' }, role: { ar: 'كاتبة محتوى إبداعي', en: 'Creative content writer' } },
      { id: 't10', name: { ar: 'محمد عيسى', en: 'Mohammed Issa' }, role: { ar: 'مدير تصوير', en: 'Director of photography' } },
      { id: 't11', name: { ar: 'مبشر أحمد', en: 'Mubasher Ahmed' }, role: { ar: 'مصور فيديو', en: 'Videographer' } },
      { id: 't12', name: { ar: 'فهمي طلال', en: 'Fahmi Talal' }, role: { ar: 'مصور فوتوغراف', en: 'Photographer' } },
      { id: 't13', name: { ar: 'صادق عيسى', en: 'Sadiq Issa' }, role: { ar: 'مصور فيديو', en: 'Videographer' } },
      { id: 't14', name: { ar: 'غيث سرمد', en: 'Ghaith Sarmad' }, role: { ar: 'مصور فيديو', en: 'Videographer' } },
      { id: 't15', name: { ar: 'عاصم علي', en: 'Asim Ali' }, role: { ar: 'مونتير', en: 'Video editor' } },
      { id: 't16', name: { ar: 'مصطفى أحمد', en: 'Mustafa Ahmed' }, role: { ar: 'مسؤول المونتاج', en: 'Head of editing' } }
    ],
    messages: [
      {
        id: 'm1', name: 'زبون تجريبي', company: 'رسالة تجريبية', phone: '+964 770 000 0000', email: '', service: 'social', budget: '',
        message: 'هذي رسالة تجريبية تبين شلون توصل طلبات نموذج التواصل للوحة التحكم. تگدر تحذفها.', date: new Date(Date.now() - 864e5).toISOString(), read: false
      }
    ]
  });

  const load = () => {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return defaults();
      const d = JSON.parse(raw);
      const def = defaults();
      return {
        version: 2,
        settings: Object.assign({}, def.settings, d.settings || {}),
        categories: Array.isArray(d.categories) ? d.categories : def.categories,
        works: Array.isArray(d.works) ? d.works : def.works,
        clients: Array.isArray(d.clients) ? d.clients : def.clients,
        team: Array.isArray(d.team) ? d.team : def.team,
        messages: Array.isArray(d.messages) ? d.messages : def.messages
      };
    } catch (e) {
      return defaults();
    }
  };

  const save = (data) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      return false;
    }
  };

  const reset = () => {
    try { localStorage.removeItem(KEY); } catch (e) {}
    return defaults();
  };

  const getLang = () => {
    try { return localStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'ar'; } catch (e) { return 'ar'; }
  };
  const setLang = (l) => { try { localStorage.setItem(LANG_KEY, l); } catch (e) {} };

  /* ---------------- pyramid geometry (traced from the logo) ---------------- */
  const K = 0.5708, CX = 540;
  const xl = (y) => 165 + K * (y - 298);
  const xr = (y) => 915 - K * (y - 298);
  const r = (n) => Math.round(n * 10) / 10;

  const layers = () => {
    const out = [{ left: '165,293 540,172 540,293', right: '549,184 872,287 549,287' }];
    const bands = [[298, 422], [428, 552], [558, 682], [688, 812], [818, 955]];
    bands.forEach(([y1, y2], i) => {
      const left = `${r(xl(y1))},${y1} ${CX},${y1} ${CX},${y2} ${r(xl(y2))},${y2}`;
      let right;
      if (i === bands.length - 1) {
        right = `549,${y1 + 4} ${r(xr(y1 + 4) - 9)},${y1 + 4} 549,923`;
      } else {
        right = `549,${y1 + 4} ${r(xr(y1 + 4) - 9)},${y1 + 4} ${r(xr(y2 - 4) - 9)},${y2 - 4} 549,${y2 - 4}`;
      }
      out.push({ left, right, y1, y2 });
    });
    return out;
  };
  const VIEWBOX = '150 160 780 810';

  /* plain logo (flat, like the brand mark) */
  const logoSVG = (opts = {}) => {
    const ink = opts.ink || 'currentColor';
    const bg = opts.bg || 'none';
    const L = layers();
    return `<svg viewBox="${VIEWBOX}" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="${opts.cls || ''}">
      ${L.map((l) => `<polygon points="${l.left}" fill="${ink}"/><polygon points="${l.right}" fill="${bg}" stroke="${ink}" stroke-width="8" stroke-linejoin="miter"/>`).join('')}
    </svg>`;
  };

  /* shared defs: hatching, stipple, hand-drawn wobble */
  const artDefs = (id, ink = '#141210') => `
    <defs>
      <pattern id="h1-${id}" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="7" stroke="${ink}" stroke-width="1.3"/></pattern>
      <pattern id="h2-${id}" width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="5" stroke="${ink}" stroke-width="1.5"/></pattern>
      <pattern id="h3-${id}" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)"><line x1="0" y1="0" x2="0" y2="4" stroke="${ink}" stroke-width="1.6"/></pattern>
      <pattern id="x-${id}" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(30)"><path d="M0 0V6M0 0H6" stroke="${ink}" stroke-width="1"/></pattern>
      <pattern id="d-${id}" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.1" fill="${ink}"/><circle cx="5.5" cy="5.5" r=".8" fill="${ink}"/></pattern>
      <filter id="rough-${id}" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="2" seed="7"/><feDisplacementMap in="SourceGraphic" scale="3"/></filter>
    </defs>`;

  /* engraved pyramid — the hero / method illustration */
  const engravedPyramid = (opts = {}) => {
    const id = opts.id || 'ep';
    const L = layers();
    const fills = [`url(#h1-${id})`, `url(#h1-${id})`, `url(#h2-${id})`, `url(#h2-${id})`, `url(#h3-${id})`, `url(#h3-${id})`];
    const interactive = !!opts.interactive;
    return `<svg viewBox="100 120 880 920" xmlns="http://www.w3.org/2000/svg" direction="ltr" style="direction:ltr" class="${opts.cls || ''}" ${interactive ? 'role="group"' : 'aria-hidden="true"'}>
      ${artDefs(id)}
      <ellipse cx="560" cy="1000" rx="230" ry="22" fill="url(#d-${id})" opacity=".8"/>
      <ellipse cx="560" cy="1000" rx="120" ry="10" fill="url(#d-${id})"/>
      <g filter="url(#rough-${id})">
        ${L.map((l, i) => `
          <g class="layer" data-layer="${i}" ${interactive ? `tabindex="0" role="button" aria-label="${i + 1}"` : ''}>
            <polygon class="layer-left" points="${l.left}" fill="#141210"/>
            <polygon class="layer-right" points="${l.right}" fill="${fills[i]}" stroke="#141210" stroke-width="7"/>
            ${interactive ? `<text class="layer-num" x="${i === 0 ? 470 : 500}" y="${i === 0 ? 278 : (l.y1 + l.y2) / 2 + 14}" text-anchor="end">${String(i + 1).padStart(2, '0')}</text>` : ''}
          </g>`).join('')}
      </g>
    </svg>`;
  };

  /* ---------------- generated work covers (engraved, monochrome) ---------------- */
  const coverSVG = (work, catName = '') => {
    const seed = hash(work.id || 'x');
    const style = Number.isInteger(work.cover) ? work.cover % 6 : seed % 6;
    const id = 'c' + (work.id || 'x').replace(/[^a-z0-9]/gi, '') + style;
    const INK = '#141210', PAPER = '#FFFFFF', PAPER2 = '#F1F1EF', OCHRE = '#C9962F';
    const rnd = (n) => { const x = Math.sin(seed + n * 99.13) * 10000; return x - Math.floor(x); };
    const dark = style === 0 || style === 5;
    const fg = dark ? PAPER : INK;
    let art = '';

    if (style === 0) {
      // ink: layered inverted pyramid outline
      const L = layers();
      art = `<rect width="800" height="600" fill="${INK}"/>
        <g transform="translate(173 64) scale(.42)" filter="url(#rough-${id})">
          ${L.map((l) => `<polygon points="${l.left}" fill="none" stroke="${PAPER}" stroke-width="5"/><polygon points="${l.right}" fill="url(#h1p-${id})" stroke="${PAPER}" stroke-width="5"/>`).join('')}
        </g>
        <circle cx="${600 + rnd(1) * 80}" cy="${110 + rnd(2) * 60}" r="14" fill="${OCHRE}"/>`;
    } else if (style === 1) {
      const cx = 470 + rnd(1) * 120;
      art = `<rect width="800" height="600" fill="${PAPER}"/>
        <g filter="url(#rough-${id})">
          <circle cx="${cx}" cy="270" r="170" fill="url(#h1-${id})" stroke="${INK}" stroke-width="4"/>
          <circle cx="${cx}" cy="270" r="110" fill="${PAPER}" stroke="${INK}" stroke-width="3"/>
          <circle cx="${cx}" cy="270" r="110" fill="url(#d-${id})"/>
          <line x1="40" y1="470" x2="760" y2="470" stroke="${INK}" stroke-width="3" stroke-dasharray="3 7"/>
          <polygon points="160,470 260,300 360,470" fill="${INK}"/>
          <polygon points="260,300 360,470 300,470" fill="url(#h2-${id})"/>
        </g>`;
    } else if (style === 2) {
      art = `<rect width="800" height="600" fill="${PAPER2}"/>
        <rect width="400" height="600" fill="${INK}"/>
        <g filter="url(#rough-${id})">
          <polygon points="140,100 400,100 400,480" fill="${PAPER}"/>
          <polygon points="400,100 660,100 400,480" fill="url(#h2-${id})" stroke="${INK}" stroke-width="5"/>
          <line x1="140" y1="140" x2="660" y2="140" stroke="${PAPER2}" stroke-width="6"/>
          <line x1="140" y1="140" x2="400" y2="140" stroke="${INK}" stroke-width="6"/>
        </g>
        <circle cx="${120 + rnd(3) * 60}" cy="${400 + rnd(4) * 60}" r="10" fill="${OCHRE}"/>`;
    } else if (style === 3) {
      const bars = [0, 1, 2, 3, 4].map((i) => 120 + rnd(i + 5) * 240);
      art = `<rect width="800" height="600" fill="${PAPER}"/>
        <rect x="60" y="60" width="680" height="420" rx="22" fill="url(#d-${id})" opacity=".55"/>
        <g filter="url(#rough-${id})">
          ${bars.map((h, i) => `<rect x="${170 + i * 100}" y="${470 - h}" width="64" height="${h}" fill="${i % 2 ? `url(#h2-${id})` : INK}" stroke="${INK}" stroke-width="4"/>`).join('')}
          <path d="M150 ${470 - bars[0] - 30} ${bars.map((h, i) => `L ${202 + i * 100} ${470 - h - 30}`).join(' ')}" fill="none" stroke="${INK}" stroke-width="3" stroke-dasharray="2 8" stroke-linecap="round"/>
          <line x1="120" y1="470" x2="680" y2="470" stroke="${INK}" stroke-width="4"/>
        </g>`;
    } else if (style === 4) {
      art = `<rect width="800" height="600" fill="${PAPER2}"/>
        <g filter="url(#rough-${id})">
          ${[280, 222, 166, 110, 56].map((rr, i) => `<path d="M ${400 - rr} 480 A ${rr} ${rr} 0 0 1 ${400 + rr} 480 Z" fill="${i % 2 ? PAPER2 : `url(#h${(i % 3) + 1}-${id})`}" stroke="${INK}" stroke-width="4"/>`).join('')}
          <line x1="40" y1="480" x2="760" y2="480" stroke="${INK}" stroke-width="4"/>
        </g>
        <circle cx="${150 + rnd(6) * 500}" cy="110" r="12" fill="${OCHRE}"/>`;
    } else {
      const letter = (t(work.client, 'ar') || t(work.title, 'ar') || 'هـ').trim().charAt(0);
      art = `<rect width="800" height="600" fill="${INK}"/>
        <g filter="url(#rough-${id})">
          <text x="400" y="420" text-anchor="middle" font-family="'Markazi Text', serif" font-weight="700" font-size="380" fill="url(#h1p-${id})" stroke="${PAPER}" stroke-width="4">${esc(letter)}</text>
        </g>
        <circle cx="${560 + rnd(7) * 100}" cy="${120 + rnd(8) * 40}" r="12" fill="${OCHRE}"/>`;
    }

    return `<svg viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" class="cover-svg" role="img" aria-label="${esc(t(work.title, 'ar'))}">
      ${artDefs(id)}
      <defs><pattern id="h1p-${id}" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="8" stroke="${PAPER}" stroke-width="1.4"/></pattern></defs>
      ${art}
      <text x="40" y="502" font-family="'IBM Plex Sans Arabic', sans-serif" font-size="17" letter-spacing="3" fill="${fg}" opacity=".75" direction="ltr">PYRAMID STUDIO — ${esc(work.year || '')}</text>
      <text x="760" y="502" text-anchor="end" font-family="'IBM Plex Sans Arabic', sans-serif" font-size="17" letter-spacing="2" fill="${fg}" opacity=".75" direction="ltr">${esc(catName).toUpperCase()}</text>
    </svg>`;
  };

  const coverHTML = (work, catName) =>
    work.image ? `<img src="${esc(work.image)}" alt="${esc(t(work.title, 'ar'))}" loading="lazy" decoding="async">` : coverSVG(work, catName);

  window.PyramidStore = {
    KEY, uid, hash, esc, t, defaults, load, save, reset, getLang, setLang,
    layers, logoSVG, engravedPyramid, artDefs, coverSVG, coverHTML
  };
})();
