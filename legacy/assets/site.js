/* ============================================================
   PYRAMID · هرم — shared site script
   Every page is a light shell: <body data-page="…"> + blocks
   (<div data-block="name">). This file renders header, footer
   and all blocks in Arabic or English from the local store.
   ============================================================ */
(function () {
  const S = window.PyramidStore;
  const { esc, t } = S;
  let data = S.load();
  let lang = S.getLang();
  let filter = 'all';
  let activeStep = 0;
  let modalList = [];
  const PAGE = document.body.dataset.page || 'home';

  /* ---------------- copy ---------------- */
  const I = {
    brand: ['هرم', 'Pyramid'],
    nav_home: ['الرئيسية', 'Home'], nav_about: ['من نحن', 'About'], nav_services: ['الخدمات', 'Services'], nav_work: ['الأعمال', 'Work'], nav_contact: ['تواصل معنا', 'Contact'],
    cta: ['ابدأ مشروعك', 'Start a project'], see_work: ['شاهد أعمالنا', 'See our work'], how: ['آلية العمل', 'How we work'],
    fc1_s: ['سنوات خبرة بالتسويق والإنتاج الإبداعي.', 'years of marketing and creative production.'],
    fc2_s: ['مشروع منجز لعملاء بمختلف القطاعات.', 'projects delivered across many sectors.'],
    trust: ['يتابعون شغلنا على إنستغرام', 'follow our work on Instagram'],
    less: ['نفهم. نخطط. ننفذ.', 'Understand. Plan. Deliver.'],
    know_more: ['اعرف أكثر عنا', 'More about us'],
    orbit_label: ['نماذج من أعمال وخدمات هرم تدور حول الشعار', 'Pyramid work and services orbiting the logo'],
    orbit_hint: ['اسحب حتى تلف ✦ اضغط على أي فيديو', 'Drag to spin ✦ tap any video'],
    open_ig: ['فتح على إنستغرام', 'Open on Instagram'],
    approach_k: ['نهجنا', 'Our approach'],
    feat_k: ['نماذج من أعمالنا', 'Selected work'], feat_h1: ['شغل', 'Work'], feat_h2: ['يحچي عن نفسه.', 'that speaks for itself.'], all_work: ['كل الأعمال', 'All work'],
    stats_k: ['النتائج والخبرات', 'Results & experience'],
    st_years: ['سنوات خبرة', 'Years of experience'], st_projects: ['مشروع منجز', 'Projects delivered'], st_clients: ['عميل', 'Clients'], st_followers: ['متابع على إنستغرام', 'Instagram followers'],
    clients_k: ['عملاؤنا وشركاؤنا', 'Clients & partners'],
    cta_h1: ['خلّينا نبني', "Let's build"], cta_h2: ['هرمك.', 'your pyramid.'], cta_p: ['احچيلنا عن مشروعك، ونرجعلك بخطة واضحة.', "Tell us about your project and we'll come back with a clear plan."], whatsapp: ['واتساب', 'WhatsApp'],
    // page heroes
    ph_about_k: ['من نحن', 'About us'], ph_about_1: ['فريق واحد،', 'One team,'], ph_about_2: ['هرم من الخبرات.', 'a pyramid of skills.'], ph_about_p: ['مخططين، كتّاب، مصممين، مصورين ومونتيرية — نشتغل سوية من أول فكرة لآخر تقرير.', 'Planners, writers, designers, shooters and editors — working together from the first idea to the last report.'],
    ph_services_k: ['الخدمات', 'Services'], ph_services_1: ['كل اللي يحتاجه', 'Everything your'], ph_services_2: ['محتواك.', 'content needs.'], ph_services_p: ['من تحليل المشروع وكتابة الخطة، للتصوير والمونتاج، للنشر والترويج والتقارير.', 'From analysis and planning, to shooting and editing, to publishing, promotion and reporting.'],
    ph_work_k: ['الأعمال', 'Work'], ph_work_1: ['نماذج', 'Selected'], ph_work_2: ['من أعمالنا.', 'projects.'], ph_work_p: ['ريلز وحملات صنعناها ويا عملائنا. اضغط على أي عمل حتى تشوفه.', 'Reels and campaigns we made with our clients. Tap any project to view it.'],
    ph_contact_k: ['تواصل معنا', 'Contact'], ph_contact_1: ['خلّينا نحچي', "Let's talk"], ph_contact_2: ['عن مشروعك.', 'about your project.'], ph_contact_p: ['املأ النموذج أو راسلنا مباشرة على واتساب، وفريقنا يرجعلك بأقرب وقت.', 'Fill in the form or message us on WhatsApp — our team will get back to you shortly.'],
    // about page
    about_k: ['عن استوديو هرم', 'About Pyramid Studio'], years_exp: ['سنوات خبرة', 'years of experience'],
    team_k: ['فريق العمل', 'The team'], team_h1: ['الناس', 'The people'], team_h2: ['ورا الشغل.', 'behind the work.'],
    // services page
    services_k: ['الخدمات', 'Services'],
    process_k: ['آلية العمل', 'How we work'], process_h1: ['ستّ خطوات،', 'Six steps,'], process_h2: ['نتيجة وحدة.', 'one result.'],
    process_p: ['كل مشروع نبنيه مثل الهرم: نبدأ بفهم واسع، ونضيّق خطوة بخطوة لحد ما نوصل لنقطة وحدة واضحة — النتيجة.', 'We build every project like a pyramid: start wide with understanding, narrow step by step, and arrive at one clear point — the result.'],
    // work
    all: ['الكل', 'All'], empty: ['ماكو أعمال بهذا التصنيف بعد.', 'No work in this category yet.'],
    client: ['العميل', 'Client'], year: ['السنة', 'Year'], category: ['التصنيف', 'Category'], services: ['الخدمات', 'Services'], watch_ig: ['مشاهدة على إنستغرام', 'Watch on Instagram'], visit: ['زيارة المشروع', 'Visit project'],
    // contact
    form_h: ['اطلب عرض سعر', 'Request a quote'], form_p: ['الحقول اللي عليها * مطلوبة.', 'Fields marked * are required.'],
    f_name: ['الاسم', 'Name'], f_company: ['اسم الشركة/المشروع', 'Company / project'], f_phone: ['رقم الهاتف', 'Phone'], f_email: ['البريد الإلكتروني', 'Email'],
    f_service: ['الخدمة المطلوبة', 'Service needed'], f_budget: ['الميزانية المتوقعة', 'Expected budget'], f_message: ['رسالتك', 'Your message'], optional: ['(اختياري)', '(optional)'], f_send: ['إرسال', 'Send'],
    budget_opts: [['غير محددة', 'أقل من 500$', '500$ – 1,500$', '1,500$ – 5,000$', 'أكثر من 5,000$'], ['Not sure yet', 'Under $500', '$500 – $1,500', '$1,500 – $5,000', 'Over $5,000']],
    sent: ['وصل طلبك! راح نتواصل وياك قريباً.', "Got it! We'll be in touch soon."], required: ['اكتب الاسم ورقم الهاتف رجاءً.', 'Please add your name and phone.'], saveFail: ['ما گدرنا نحفظ الطلب، جرّب مرة ثانية.', "Couldn't save your request, please try again."],
    i_wa: ['واتساب', 'WhatsApp'], i_phone: ['اتصال', 'Call'], i_mail: ['البريد', 'Email'], i_ig: ['إنستغرام', 'Instagram'], i_studio: ['حساب الستوديو', 'Studio account'],
    hours_t: ['أوقات الرد', 'Response time'], hours_p: ['نرد على الرسائل خلال يوم عمل واحد.', 'We reply to messages within one working day.'],
    // footer
    f_pages: ['الصفحات', 'Pages'], f_contact: ['تواصل', 'Contact'], f_follow: ['تابعنا', 'Follow'], dashboard: ['لوحة التحكم', 'Dashboard'],
    rights: ['استوديو هرم — كل الحقوق محفوظة.', 'Pyramid Studio — all rights reserved.']
  };
  const L = () => (lang === 'ar' ? 0 : 1);
  const tr = (k) => (I[k] ? I[k][L()] : k);

  const NAV = [['home', 'index.html', 'nav_home'], ['about', 'about.html', 'nav_about'], ['services', 'services.html', 'nav_services'], ['work', 'work.html', 'nav_work'], ['contact', 'contact.html', 'nav_contact']];

  const SERVICES = [
    { id: 'analysis', art: 'analysis', t: ['تحليل وفهم المشروع', 'Project analysis'], p: ['ندرس مشروعك، جمهورك، منافسينك وميزانيتك التسويقية قبل ما نكتب أي خطة.', 'We study your project, audience, competitors and marketing budget before writing any plan.'] },
    { id: 'plans', art: 'plans', t: ['إنشاء الخطط التسويقية', 'Marketing plans'], p: ['خطة واضحة تحدد المحتوى، المنصات، الجدول الزمني وآلية التنفيذ.', 'A clear plan covering content, platforms, timeline and how it gets done.'] },
    { id: 'reports', art: 'reports', t: ['تقديم التقارير', 'Reporting'], p: ['تقارير دورية واضحة عن التنفيذ والأداء، مع اقتراحات للخطوة الجاية.', 'Clear, regular reports on delivery and performance, with next-step recommendations.'] },
    { id: 'content', art: 'content', t: ['كتابة المحتوى', 'Content writing'], p: ['أفكار، سكربتات ونصوص إعلانية تحچي بلغة جمهورك.', 'Ideas, scripts and ad copy in your audience\'s language.'] },
    { id: 'social', art: 'social', t: ['إدارة منصات التواصل الاجتماعي', 'Social media management'], p: ['نشر منتظم، تفاعل مع الجمهور، وإدارة كاملة لحساباتك.', 'Consistent publishing, community engagement and full account management.'] },
    { id: 'web', art: 'web', t: ['تطوير المنصات الإلكترونية', 'Digital platforms'], p: ['مواقع وصفحات سريعة ومرتبة تحوّل الزائر لزبون.', 'Fast, tidy websites and pages that turn visitors into customers.'] },
    { id: 'photo', art: 'photo', t: ['التصوير الاحترافي', 'Professional shooting'], p: ['تصوير فوتوغرافي وفيديو بفريق ومعدات احترافية.', 'Photo and video production with a professional crew and gear.'] },
    { id: 'edit', art: 'color', t: ['المونتاج والتلوين', 'Editing & colour'], p: ['مونتاج بإيقاع يشد، وتلوين سينمائي يخلي المحتوى يوقف الإصبع.', 'Punchy editing and cinematic colour that stop the scroll.'] },
    { id: 'promo', art: 'ads', t: ['الترويج', 'Promotion'], p: ['حملات ممولة تستهدف الجمهور المناسب ضمن الميزانية المعتمدة.', 'Paid campaigns that reach the right audience within the agreed budget.'] }
  ];

  const APPROACH = [
    { art: 'analysis', h: ['نفهم المشروع قبل أن نبدأ', 'We understand before we start'], t: ['تحليل وفهم المشروع', 'Analyse the project'], p: ['ندرس المشروع، الجمهور، الأهداف، الرؤية، والميزانية التسويقية قبل كتابة أي خطة.', 'We study the project, audience, goals, vision and marketing budget before writing any plan.'] },
    { art: 'plans', h: ['نخطط قبل أن ننتج', 'We plan before we produce'], t: ['كتابة خطة تسويقية صحيحة', 'Write the right plan'], p: ['نحوّل المعلومات إلى خطة واضحة تشمل المحتوى، المنصات، الجدول الزمني، وآلية التنفيذ.', 'We turn what we learn into a clear plan: content, platforms, timeline and execution.'] },
    { art: 'photo', h: ['ننفذ ونسلّم بوضوح وسرعة', 'We deliver clearly and fast'], t: ['تنفيذ الخطة حسب الجدول الزمني', 'Execute on schedule'], p: ['ننتج، ننشر، نروّج، ونتابع التنفيذ مع تقارير واضحة عن الأداء.', 'We produce, publish, promote and follow up with clear performance reports.'] }
  ];

  const STEPS = [
    [['الاجتماع الأولي وفهم المشروع', 'First meeting'], ['نجتمع مع صاحب المشروع لفهم الاحتياجات، الرؤية، الأهداف، والجوانب المتعلقة بالميزانية التسويقية.', 'We meet the owner to understand needs, vision, goals and the marketing budget.']],
    [['كتابة الخطة التسويقية', 'Writing the plan'], ['نكتب خطة تسويقية تفصيلية مبنية على المعلومات والأهداف المتفق عليها.', 'We write a detailed marketing plan built on the agreed information and goals.']],
    [['الاجتماع الثاني واعتماد الخطة', 'Plan approval'], ['نشرح الخطة، نراجع التفاصيل، ونتفق على جدول التنفيذ.', 'We walk through the plan, review the details and agree on the schedule.']],
    [['التنفيذ والنشر', 'Production & publishing'], ['نبدأ بالإنتاج والتنفيذ والتسليم والنشر بحسب الجدول المتفق عليه.', 'We produce, deliver and publish according to the agreed schedule.']],
    [['الترويج', 'Promotion'], ['نطلق الحملات الترويجية وفق الخطة والميزانية المعتمدة، ونستهدف الجمهور المناسب لتحقيق أفضل وصول ونتائج.', 'We launch campaigns within the approved plan and budget, targeting the right audience for the best reach.']],
    [['التقارير والمتابعة', 'Reports & follow-up'], ['نقدّم تقارير واضحة عن التنفيذ والأداء ونقترح خطوات التطوير اللاحقة.', 'Clear reports on delivery and performance, with suggested next steps.']]
  ];

  /* ---------------- engraved illustrations ---------------- */
  const P = '#FFFFFF';
  const ART = {
    analysis: (id) => `
      <ellipse cx="130" cy="202" rx="95" ry="12" fill="url(#d-${id})"/>
      <g filter="url(#rough-${id})" stroke="#141210" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round">
        <g transform="rotate(-6 105 115)">
          <rect x="34" y="40" width="130" height="150" fill="${P}"/>
          <rect x="52" y="128" width="16" height="44" fill="#141210"/><rect x="76" y="104" width="16" height="68" fill="url(#h1-${id})"/><rect x="100" y="140" width="16" height="32" fill="#141210"/><rect x="124" y="88" width="16" height="84" fill="url(#h2-${id})"/>
          <path d="M50 64h70M50 78h46" stroke-width="2"/>
        </g>
        <path d="M184 132 L226 176" stroke-width="13"/>
        <circle cx="156" cy="100" r="46" fill="${P}"/>
        <circle cx="156" cy="100" r="36" fill="url(#d-${id})"/>
        <path d="M134 84 a26 26 0 0 1 22 -12" fill="none" stroke-width="3"/>
      </g>`,
    plans: (id) => `
      <ellipse cx="130" cy="204" rx="86" ry="11" fill="url(#d-${id})"/>
      <g filter="url(#rough-${id})" stroke="#141210" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round">
        <rect x="64" y="34" width="132" height="166" rx="12" fill="url(#h1-${id})"/>
        <rect x="78" y="54" width="104" height="132" rx="4" fill="${P}"/>
        <rect x="104" y="24" width="52" height="22" rx="5" fill="#141210"/>
        <rect x="90" y="72" width="16" height="16" fill="${P}"/><path d="M93 80l4 4 8-10" stroke-width="2.6"/>
        <rect x="90" y="104" width="16" height="16" fill="${P}"/><path d="M93 112l4 4 8-10" stroke-width="2.6"/>
        <rect x="90" y="136" width="16" height="16" fill="url(#h3-${id})"/>
        <path d="M116 80h52M116 112h44M116 144h56M116 166h30" stroke-width="2"/>
        <path d="M206 60 l18 -18 M214 76 l20 -4 M200 46 l2 -18" stroke-width="2"/>
      </g>`,
    reports: (id) => `
      <ellipse cx="130" cy="204" rx="96" ry="11" fill="url(#d-${id})"/>
      <g filter="url(#rough-${id})" stroke="#141210" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round">
        <rect x="70" y="30" width="140" height="168" fill="${P}" transform="rotate(4 140 114)"/>
        <rect x="50" y="40" width="140" height="160" fill="${P}"/>
        <circle cx="96" cy="88" r="28" fill="url(#h2-${id})"/>
        <path d="M96 88 V60 A28 28 0 0 1 124 88 Z" fill="#141210"/>
        <path d="M136 72h40M136 86h30M136 100h36" stroke-width="2"/>
        <polyline points="64,178 92,150 116,162 142,128 172,138" fill="none" stroke-width="2.6"/>
        <circle cx="92" cy="150" r="4" fill="#141210"/><circle cx="142" cy="128" r="4" fill="#141210"/><circle cx="172" cy="138" r="4" fill="${P}"/>
      </g>`,
    web: (id) => `
      <ellipse cx="130" cy="204" rx="100" ry="11" fill="url(#d-${id})"/>
      <g filter="url(#rough-${id})" stroke="#141210" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round">
        <rect x="26" y="36" width="208" height="152" rx="12" fill="${P}"/>
        <path d="M26 60 h208 V48 q0 -12 -12 -12 H38 q-12 0 -12 12 Z" fill="url(#h1-${id})"/>
        <circle cx="42" cy="48" r="4" fill="#141210"/><circle cx="56" cy="48" r="4" fill="${P}"/><circle cx="70" cy="48" r="4" fill="${P}"/>
        <rect x="44" y="76" width="96" height="62" fill="url(#h3-${id})"/>
        <path d="M156 82h60M156 96h46M156 110h54" stroke-width="2"/>
        <rect x="156" y="124" width="46" height="16" rx="8" fill="#141210"/>
        <path d="M44 156h90M44 170h60" stroke-width="2"/>
        <path d="M196 146 l0 40 l10 -10 l8 16 l7 -4 l-8 -15 l14 -1 Z" fill="#141210" stroke-width="2"/>
      </g>`,
    content: (id) => `
      <ellipse cx="130" cy="200" rx="95" ry="12" fill="url(#d-${id})"/>
      <g filter="url(#rough-${id})" stroke="#141210" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round">
        <rect x="40" y="60" width="110" height="130" fill="${P}" transform="rotate(-8 95 125)"/>
        <rect x="70" y="50" width="110" height="135" fill="${P}" transform="rotate(5 125 117)"/>
        <g transform="rotate(5 125 117)" stroke-width="2"><path d="M86 74h70M86 90h78M86 106h60M86 122h74M86 138h40"/><rect x="86" y="150" width="44" height="22" fill="url(#h2-${id})"/></g>
        <path d="M150 168 L222 36 L238 46 L170 176 Z" fill="url(#h1-${id})"/>
        <path d="M150 168 L170 176 L152 196 Z" fill="#141210"/>
        <path d="M222 36 L230 22 L246 32 L238 46" fill="#141210"/>
        <path d="M200 20 l6 -10 M214 14 l10 -4 M190 32 l-10 -4" stroke-width="2"/>
      </g>`,
    photo: (id) => `
      <ellipse cx="130" cy="200" rx="100" ry="12" fill="url(#d-${id})"/>
      <g filter="url(#rough-${id})" stroke="#141210" stroke-width="2.6" stroke-linejoin="round">
        <path d="M40 80 Q40 70 50 70 H90 L102 50 H158 L170 70 H210 Q220 70 220 80 V180 Q220 190 210 190 H50 Q40 190 40 180 Z" fill="url(#h1-${id})"/>
        <rect x="52" y="82" width="34" height="18" rx="3" fill="${P}"/>
        <circle cx="135" cy="132" r="46" fill="${P}"/>
        <circle cx="135" cy="132" r="34" fill="url(#h3-${id})"/>
        <circle cx="135" cy="132" r="20" fill="#141210"/>
        <circle cx="127" cy="124" r="6" fill="${P}" stroke="none"/>
        <rect x="180" y="58" width="22" height="12" fill="#141210"/>
        <path d="M200 40 l10 -10 M212 50 l14 -4 M190 34 l2 -14" stroke-width="2" stroke-linecap="round"/>
      </g>`,
    social: (id) => `
      <ellipse cx="130" cy="204" rx="80" ry="10" fill="url(#d-${id})"/>
      <g filter="url(#rough-${id})" stroke="#141210" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round">
        <rect x="82" y="26" width="96" height="170" rx="16" fill="url(#h1-${id})"/>
        <rect x="92" y="42" width="76" height="132" rx="6" fill="${P}"/>
        <path d="M130 128 C 104 110, 108 88, 122 88 C 128 88, 130 94, 130 96 C 130 94, 132 88, 138 88 C 152 88, 156 110, 130 128 Z" fill="#141210"/>
        <path d="M104 150h52M104 162h34" stroke-width="2"/>
        <path d="M184 52 h52 q8 0 8 8 v22 q0 8 -8 8 h-32 l-12 10 v-10 h-8 q-8 0 -8 -8 v-22 q0 -8 8 -8 Z" fill="${P}"/>
        <circle cx="198" cy="71" r="3" fill="#141210"/><circle cx="210" cy="71" r="3" fill="#141210"/><circle cx="222" cy="71" r="3" fill="#141210"/>
        <path d="M40 120 C 30 112, 32 102, 39 102 C 42 102, 43 105, 43 106 C 43 105, 44 102, 47 102 C 54 102, 56 112, 46 120 Z" fill="url(#h2-${id})"/>
        <path d="M58 70 C 50 64, 52 56, 57 56 C 59 56, 60 58, 60 59 C 60 58, 61 56, 63 56 C 68 56, 70 64, 62 70 Z" fill="#141210"/>
      </g>`,
    ads: (id) => `
      <ellipse cx="130" cy="202" rx="96" ry="11" fill="url(#d-${id})"/>
      <g filter="url(#rough-${id})" stroke="#141210" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round">
        <path d="M60 96 L170 46 L170 170 L60 130 Z" fill="url(#h1-${id})"/>
        <rect x="38" y="92" width="24" height="42" rx="4" fill="#141210"/>
        <ellipse cx="170" cy="108" rx="14" ry="62" fill="${P}"/>
        <ellipse cx="170" cy="108" rx="7" ry="40" fill="url(#h3-${id})"/>
        <path d="M70 130 L84 182 L104 182 L96 136" fill="${P}"/>
        <path d="M200 80 q14 28 0 56 M218 66 q24 42 0 84 M236 54 q32 54 0 108" fill="none" stroke-width="2.2"/>
      </g>`,
    color: (id) => `
      <ellipse cx="130" cy="200" rx="90" ry="12" fill="url(#d-${id})"/>
      <g filter="url(#rough-${id})" stroke="#141210" stroke-width="2.4" stroke-linejoin="round">
        <g transform="rotate(-34 120 176)"><rect x="98" y="30" width="44" height="150" rx="8" fill="${P}"/><rect x="98" y="30" width="44" height="60" rx="8" fill="url(#d-${id})"/></g>
        <g transform="rotate(-12 120 176)"><rect x="98" y="30" width="44" height="150" rx="8" fill="${P}"/><rect x="98" y="30" width="44" height="60" rx="8" fill="url(#h1-${id})"/></g>
        <g transform="rotate(12 120 176)"><rect x="98" y="30" width="44" height="150" rx="8" fill="${P}"/><rect x="98" y="30" width="44" height="60" rx="8" fill="url(#h3-${id})"/></g>
        <g transform="rotate(34 120 176)"><rect x="98" y="30" width="44" height="150" rx="8" fill="${P}"/><rect x="98" y="30" width="44" height="60" rx="8" fill="#141210"/></g>
        <circle cx="120" cy="164" r="9" fill="#141210"/><circle cx="120" cy="164" r="3" fill="${P}" stroke="none"/>
      </g>`
  };
  let artN = 0;
  const art = (key) => { const id = 'a' + key + (artN++); return `<svg viewBox="0 0 260 220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">${S.artDefs(id)}${ART[key](id)}</svg>`; };

  /* ---------------- helpers ---------------- */
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const fmt = (n) => Number(n || 0).toLocaleString('en-US');
  const digits = (p) => String(p || '').replace(/[^\d+]/g, '');
  const waLink = (p) => `https://wa.me/${digits(p).replace('+', '')}`;
  const catName = (id) => { const c = data.categories.find((x) => x.id === id); return c ? t(c.name, lang) : ''; };
  const catNameEn = (id) => { const c = data.categories.find((x) => x.id === id); return c ? t(c.name, 'en') : ''; };
  const toast = (msg) => { const el = $('#toast'); if (!el) return; el.textContent = msg; el.classList.add('show'); clearTimeout(toast._t); toast._t = setTimeout(() => el.classList.remove('show'), 3200); };
  const arrow = ''; // buttons carry no arrow icons
  const playIco = '<svg width="16" height="16" viewBox="0 0 12 12"><path d="M3 1.5v9l7.5-4.5z" fill="currentColor"/></svg>';
  const ico = (d) => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
  const ORBIT_LABELS = [
    { id: 'content', bg: '#141210', fg: '#FFFFFF', icon: ico('<path d="M4 20h4L19 9l-4-4L4 16z"/>'), s: ['نكتب أفكار تبيع.', 'Ideas that sell.'] },
    { id: 'photo', bg: '#C9962F', fg: '#141210', icon: ico('<path d="M4 8h3l2-3h6l2 3h3v11H4Z"/><circle cx="12" cy="13" r="3.5"/>'), s: ['فريق ومعدات احترافية.', 'Pro crew & gear.'] },
    { id: 'edit', bg: '#E6E6E3', fg: '#141210', icon: ico('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M7 5v14M17 5v14M3 12h4M17 12h4"/>'), s: ['إيقاع يوقف الإصبع.', 'Cuts that stop the scroll.'] },
    { id: 'promo', bg: '#141210', fg: '#C9962F', icon: ico('<path d="M4 10v4h3l6 4V6L7 10Z"/><path d="M17 9a4 4 0 0 1 0 6"/>'), s: ['نوصلك لجمهورك.', 'Reach the right people.'] },
    { id: 'social', bg: '#FFFFFF', fg: '#141210', icon: ico('<rect x="7" y="3" width="10" height="18" rx="2"/><path d="M11 18h2"/>'), s: ['حضور منتظم ومدروس.', 'Consistent presence.'] },
    { id: 'reports', bg: '#C9962F', fg: '#141210', icon: ico('<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>'), s: ['أرقام واضحة كل شهر.', 'Clear monthly numbers.'] }
  ];
  /* image, or muted looping video when a work has a video file */
  const mediaHTML = (w, small) => w.video
    ? `<video src="${esc(w.video)}" ${w.image ? `poster="${esc(w.image)}"` : ''} muted loop playsinline autoplay preload="${small ? 'metadata' : 'auto'}"></video>`
    : (small === 'eager' ? S.coverHTML(w, catNameEn(w.category)).replace('loading="lazy"', 'loading="eager"') : S.coverHTML(w, catNameEn(w.category)));
  const igEmbed = (link) => { const m = String(link || '').match(/instagram\.com\/(reel|p|tv)\/([\w-]+)/); return m ? `https://www.instagram.com/${m[1]}/${m[2]}/embed/` : ''; };
  const twoLine = (k) => `<h2 class="h2"><span>${tr(k + '_h1')}</span> <em>${tr(k + '_h2')}</em></h2>`;

  /* ---------------- header / footer ---------------- */
  function renderHeader() {
    const el = $('#site-header');
    if (!el) return;
    const links = NAV.map(([key, href, label]) => `<a href="${href}" class="${PAGE === key ? 'active' : ''}" ${PAGE === key ? 'aria-current="page"' : ''}>${tr(label)}</a>`).join('');
    el.innerHTML = `
      <header class="header" id="header">
        <div class="container nav">
          <a href="index.html" class="brand" aria-label="Pyramid">
            ${S.logoSVG({ bg: 'none' })}
            <span class="wm"><b>${tr('brand')}</b><small>PYRAMID STUDIO</small></span>
          </a>
          <nav class="pill-nav" id="pillNav" aria-label="Main"><span class="glider" id="glider"></span>${links}</nav>
          <div class="nav-end">
            <button class="lang" id="langBtn" aria-label="Language">${lang === 'ar' ? 'EN' : 'ع'}</button>
            <a href="contact.html" class="btn btn-ink"><span>${tr('cta')}</span></a>
            <button class="burger" id="burger" aria-label="Menu" aria-expanded="false"><span></span><span></span></button>
          </div>
        </div>
      </header>
      <nav class="mobile-menu" id="mobileMenu">${NAV.map(([key, href, label]) => `<a href="${href}" class="${PAGE === key ? 'active' : ''}">${tr(label)} <span>${PAGE === key ? '✦' : ''}</span></a>`).join('')}
        <a href="contact.html" class="btn btn-ink">${tr('cta')}</a></nav>`;
    $('#langBtn').onclick = () => { lang = lang === 'ar' ? 'en' : 'ar'; S.setLang(lang); renderAll(); };
    $('#burger').onclick = () => { const o = $('#mobileMenu').classList.toggle('open'); $('#burger').classList.toggle('open', o); $('#burger').setAttribute('aria-expanded', o); };
    requestAnimationFrame(placeGlider);
  }
  function placeGlider() {
    const a = $('#pillNav a.active'), g = $('#glider'), nav = $('#pillNav');
    if (!a || !g || !nav || getComputedStyle(nav).display === 'none') return;
    const nb = nav.getBoundingClientRect(), ab = a.getBoundingClientRect();
    g.style.opacity = 1; g.style.left = ab.left - nb.left + 'px'; g.style.width = ab.width + 'px';
  }

  function renderFooter() {
    const el = $('#site-footer');
    if (!el) return;
    const st = data.settings;
    el.innerHTML = `
      <footer class="footer">
        <div class="container">
          <div class="foot-grid">
            <div>
              <a href="index.html" class="brand">${S.logoSVG({ bg: 'none' })}<span class="wm"><b>${tr('brand')}</b><small>PYRAMID STUDIO</small></span></a>
              <p>${esc(t(st.eyebrow, lang))} — #قيمتها_بمحتواها</p>
            </div>
            <div><h4>${tr('f_pages')}</h4><ul>${NAV.map(([, href, label]) => `<li><a href="${href}">${tr(label)}</a></li>`).join('')}</ul></div>
            <div><h4>${tr('f_contact')}</h4><ul>
              ${(st.phones || []).filter(Boolean).map((p) => `<li><a class="ltr" href="tel:${digits(p)}">${esc(p)}</a></li>`).join('')}
              ${st.email ? `<li><a class="ltr" href="mailto:${esc(st.email)}">${esc(st.email)}</a></li>` : ''}
            </ul></div>
            <div><h4>${tr('f_follow')}</h4><ul>
              ${st.instagram ? `<li><a href="https://instagram.com/${esc(st.instagram)}" target="_blank" rel="noopener">Instagram</a></li>` : ''}
              ${st.threads ? `<li><a href="https://threads.net/@${esc(st.threads)}" target="_blank" rel="noopener">Threads</a></li>` : ''}
              ${st.studio ? `<li><a href="https://instagram.com/${esc(st.studio)}" target="_blank" rel="noopener">@${esc(st.studio)}</a></li>` : ''}
              ${st.whatsapp ? `<li><a href="${waLink(st.whatsapp)}" target="_blank" rel="noopener">WhatsApp</a></li>` : ''}
            </ul></div>
          </div>
          <div class="footer-row"><span>© 2026 ${tr('rights')}</span><a href="dashboard.html">${tr('dashboard')}</a></div>
        </div>
      </footer>`;
  }

  /* ---------------- blocks ---------------- */
  const BLOCKS = {
    'home-hero': () => {
      const st = data.settings;
      const logos = (data.clients || []).filter((c) => c.logo).slice(0, 3);
      const reels = [...data.works.filter((w) => w.featured), ...data.works.filter((w) => !w.featured)].slice(0, 6);
      const labels = ORBIT_LABELS.map((k) => SERVICES.find((s) => s.id === k.id) && Object.assign({}, k, SERVICES.find((s) => s.id === k.id)));
      const items = [];
      reels.forEach((w, i) => { items.push({ w }); if (labels[i]) items.push({ l: labels[i] }); });
      return `
      <section class="hero" id="heroM">
        <svg class="connectors" id="connectors" aria-hidden="true"></svg>
        <div class="container hero-top">
          <div class="hero-cta load d5">
            <a href="work.html" class="btn btn-ink">${tr('see_work')} ${arrow}</a>
            <a href="services.html#process" class="btn btn-ghost"><span class="play">${playIco}</span>${tr('how')}</a>
          </div>
          <div class="float-card fc-1 load d5" id="fc1">
            <span class="ic"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 12h2M8 7v10M12 4v16M16 8v8M20 11v2"/></svg></span>
            <span class="big">+${fmt(st.years)}</span>
            <p>${tr('fc1_s')}</p>
          </div>
          <div class="float-card fc-2 load d6" id="fc2">
            <div class="avatars">${logos.map((c) => `<span><img src="${esc(c.logo)}" alt="" loading="lazy"></span>`).join('')}<span class="plus">+</span></div>
            <span class="big">+${fmt(st.projects)}</span>
            <p>${tr('fc2_s')}</p>
          </div>
          <div class="badge-rot load d4" aria-hidden="true">
            <svg class="ring" viewBox="0 0 120 120" direction="ltr" style="direction:ltr"><defs><path id="circ" d="M60 60 m-46 0 a46 46 0 1 1 92 0 a46 46 0 1 1 -92 0"/></defs>
              <text direction="ltr"><textPath href="#circ" textLength="284" lengthAdjust="spacing">PYRAMID • STUDIO • هرم • IRAQ • هرم •</textPath></text></svg>
            <span class="star">✦</span>
          </div>
        </div>

        <div class="orbit load d6" id="orbit" role="region" aria-label="${tr('orbit_label')}">
          <svg class="orbit-path" id="orbitPath" aria-hidden="true"><path id="orbitBack"/></svg>
          <div class="orbit-core" id="orbitCore" aria-hidden="true">
            <span class="halo"></span>
            ${S.logoSVG({ bg: 'none', cls: 'core-logo' })}
            <span class="core-shadow"></span>
          </div>
          ${items.map((it) => it.w ? `
            <button class="oc oc-reel" data-work="${esc(it.w.id)}" aria-label="${esc(t(it.w.title, lang))}">
              ${mediaHTML(it.w, 'eager')}
              <span class="play">${playIco}</span>
              <span class="cap">${esc(t(it.w.title, lang))}</span>
            </button>` : `
            <a class="oc oc-label" href="services.html#svc-${it.l.id}">
              <span class="ic" style="background:${it.l.bg};color:${it.l.fg}">${it.l.icon}</span>
              <b>${it.l.t[L()]}</b>
              <small>${it.l.s[L()]}</small>
            </a>`).join('')}
          <div class="orbit-hint" aria-hidden="true">${tr('orbit_hint')}</div>
        </div>

        <div class="container orbit-foot">
          <div class="trust"><div class="dash"></div><p><b>+${fmt(st.followers)}</b><br>${tr('trust')}</p>
            <div class="avatars">${logos.map((c) => `<span><img src="${esc(c.logo)}" alt="" loading="lazy"></span>`).join('')}<span class="plus">+</span></div></div>
          <div class="less"><div class="dash"></div><p>✦<br>${tr('less')}</p></div>
        </div>

        <div class="container">
          <div class="divider"></div>
          <div class="intro reveal">
            <span class="kicker">${tr('about_k')}</span>
            <p style="margin-top:12px">${esc(t(st.about, lang))}</p>
            <a href="about.html" class="btn btn-line">${tr('know_more')} ${arrow}</a>
          </div>
        </div>
      </section>`;
    },

    'page-hero': (el) => {
      const k = el.dataset.key;
      return `
      <section class="page-hero">
        <div class="container">
          <div class="art load d1">${art(el.dataset.art || 'content')}</div>
          <nav class="crumbs load d1" aria-label="Breadcrumb"><a href="index.html">${tr('nav_home')}</a><span>/</span><span>${tr('ph_' + k + '_k')}</span></nav>
          <h1 class="display"><span class="l1 load d2">${tr('ph_' + k + '_1')}</span><span class="l2 load d3">${tr('ph_' + k + '_2')}</span></h1>
          <p class="lead load d4">${tr('ph_' + k + '_p')}</p>
          <div class="divider load d5"></div>
        </div>
      </section>`;
    },

    'approach-rows': () => `
      <section class="rows"><div class="container">
        ${APPROACH.map((a, i) => `
          <article class="row reveal">
            <div class="row-art">${art(a.art)}</div>
            <div><span class="row-num">0${i + 1} / ${a.t[L()]}</span><h3>${a.h[L()]}</h3><p>${a.p[L()]}</p></div>
          </article>`).join('')}
      </div></section>`,

    'featured': () => {
      const list = [...data.works.filter((w) => w.featured), ...data.works.filter((w) => !w.featured)].slice(0, 4);
      modalList = list;
      return `
      <section class="sec" style="padding-top:60px"><div class="container">
        <div class="sec-head reveal"><div><span class="kicker">${tr('feat_k')}</span>${twoLine('feat')}</div><a href="work.html" class="btn btn-line">${tr('all_work')} (${data.works.length}) ${arrow}</a></div>
        <div class="reels featured-scroll">${list.map(reelCard).join('')}</div>
      </div></section>`;
    },

    'stats': () => {
      const st = data.settings;
      const items = [[st.years, 'st_years'], [st.projects, 'st_projects'], [st.clientsCount, 'st_clients'], [st.followers, 'st_followers']];
      return `
      <section class="stats"><div class="container">
        <span class="kicker">${tr('stats_k')}</span>
        <div class="stats-grid">${items.map(([v, k]) => `<div class="stat reveal"><span class="v" data-count="${Number(v) || 0}">+0</span><p class="l">${tr(k)}</p></div>`).join('')}</div>
        <p class="hash reveal">#<span>قيمتها</span>_بمحتواها</p>
      </div></section>`;
    },

    'clients-marquee': () => {
      const cl = data.clients || [];
      if (!cl.length) return '';
      const row = cl.map((c) => (c.logo ? `<img class="logo ${c.mono === false ? '' : 'mono'}" src="${esc(c.logo)}" alt="${esc(t(c.name, lang))}" loading="lazy">` : `<span class="name">${esc(t(c.name, lang))}</span>`)).join('');
      return `
      <section class="sec" style="padding-bottom:0"><div class="container reveal" style="text-align:center;margin-bottom:28px"><span class="kicker">${tr('clients_k')}</span></div>
        <div class="marquee" aria-label="${tr('clients_k')}"><div class="marquee-track">${row}${row}</div></div>
      </section>`;
    },

    'cta': () => {
      const st = data.settings;
      return `
      <section class="cta-band"><div class="container">
        <div class="cta-box reveal">
          <div>
            <h2 class="h2"><span>${tr('cta_h1')}</span> <em>${tr('cta_h2')}</em></h2>
            <p>${tr('cta_p')}</p>
            <div class="acts">
              <a href="contact.html" class="btn btn-paper">${tr('cta')} ${arrow}</a>
              ${st.whatsapp ? `<a href="${waLink(st.whatsapp)}" target="_blank" rel="noopener" class="btn btn-ghost-paper">${tr('whatsapp')}</a>` : ''}
            </div>
          </div>
          <div class="pyr">${S.logoSVG({ ink: '#FFFFFF', bg: 'none' })}</div>
        </div>
      </div></section>`;
    },

    'about-block': () => {
      const st = data.settings;
      return `
      <section class="sec"><div class="container about-grid">
        <div class="about-img reveal">
          <div class="frame">${st.aboutImage ? `<img src="${esc(st.aboutImage)}" alt="Pyramid Studio" loading="lazy">` : S.engravedPyramid({ id: 'ab' })}</div>
          <div class="sticker"><b>+${fmt(st.years)}</b><span>${tr('years_exp')}</span></div>
          <div class="badge-rot" aria-hidden="true">
            <svg class="ring" viewBox="0 0 120 120" direction="ltr" style="direction:ltr"><defs><path id="circ2" d="M60 60 m-46 0 a46 46 0 1 1 92 0 a46 46 0 1 1 -92 0"/></defs>
              <text direction="ltr"><textPath href="#circ2" textLength="284" lengthAdjust="spacing">PYRAMID • STUDIO • هرم • 10+ YEARS •</textPath></text></svg>
            <span class="star">✦</span>
          </div>
        </div>
        <div class="about-text reveal">
          <span class="kicker">${tr('about_k')}</span>
          <p class="big">${esc(t(st.about, lang))}</p>
          <ul class="pillars">${APPROACH.map((a) => `<li>${a.h[L()]}</li>`).join('')}</ul>
        </div>
      </div></section>`;
    },

    'approach-cards': () => `
      <section class="sec" style="padding-top:20px"><div class="container">
        <div class="reveal" style="margin-bottom:34px"><span class="kicker">${tr('approach_k')}</span></div>
        <div class="approach">${APPROACH.map((a, i) => `<article class="ap-card reveal"><span class="n">0${i + 1}</span><h3>${a.t[L()]}</h3><p>${a.p[L()]}</p></article>`).join('')}</div>
      </div></section>`,

    'team': () => `
      <section class="sec" style="background:var(--paper-2);border-block:1px solid var(--line)"><div class="container">
        <div class="sec-head reveal"><div><span class="kicker">${tr('team_k')}</span>${twoLine('team')}</div></div>
        <div class="team">${(data.team || []).map((m) => `
          <article class="member reveal"><div class="av"><span>${esc((t(m.name, lang) || '?').trim().charAt(0))}</span></div><b>${esc(t(m.name, lang))}</b><small>${esc(t(m.role, lang))}</small></article>`).join('')}
        </div>
      </div></section>`,

    'clients-grid': () => `
      <section class="sec"><div class="container">
        <div class="sec-head reveal"><div><span class="kicker">${tr('clients_k')}</span></div></div>
        <div class="logo-grid">${(data.clients || []).map((c) => `<div class="logo-tile reveal" title="${esc(t(c.name, lang))}">${c.logo ? `<img class="${c.mono === false ? '' : 'mono'}" src="${esc(c.logo)}" alt="${esc(t(c.name, lang))}" loading="lazy">` : `<span>${esc(t(c.name, lang))}</span>`}</div>`).join('')}</div>
      </div></section>`,

    'services-rows': () => `
      <section class="rows" id="list"><div class="container">
        ${SERVICES.map((s, i) => `
          <article class="row reveal" id="svc-${s.id}">
            <div class="row-art">${art(s.art)}</div>
            <div><span class="row-num">${String(i + 1).padStart(2, '0')} /</span><h3>${s.t[L()]}</h3><p>${s.p[L()]}</p></div>
          </article>`).join('')}
      </div></section>`,

    'process': () => `
      <section class="method" id="process"><div class="container">
        <div class="reveal"><span class="kicker">${tr('process_k')}</span>${twoLine('process')}<p class="lead">${tr('process_p')}</p></div>
        <div class="method-grid">
          <div class="method-pyr reveal" id="methodPyr">${S.engravedPyramid({ id: 'method', interactive: true })}</div>
          <div class="steps reveal" id="steps">${STEPS.map((s, i) => `<button class="step" data-step="${i}"><span class="n">${String(i + 1).padStart(2, '0')}</span><b>${s[0][L()]}</b><p>${s[1][L()]}</p></button>`).join('')}</div>
        </div>
      </div></section>`,

    'work-grid': () => {
      const used = data.categories.filter((c) => data.works.some((w) => w.category === c.id));
      if (filter !== 'all' && !used.find((c) => c.id === filter)) filter = 'all';
      const list = data.works.filter((w) => filter === 'all' || w.category === filter);
      modalList = list;
      return `
      <section class="sec" style="padding-top:50px"><div class="container">
        ${used.length > 1 ? `<div class="filters reveal" id="filters" style="margin-bottom:34px">
          <button class="chip-btn ${filter === 'all' ? 'active' : ''}" data-f="all">${tr('all')} <small>${data.works.length}</small></button>
          ${used.map((c) => `<button class="chip-btn ${filter === c.id ? 'active' : ''}" data-f="${esc(c.id)}">${esc(t(c.name, lang))} <small>${data.works.filter((w) => w.category === c.id).length}</small></button>`).join('')}
        </div>` : ''}
        <div class="reels">${list.length ? list.map(reelCard).join('') : `<p class="empty">${tr('empty')}</p>`}</div>
      </div></section>`;
    },

    'contact': () => {
      const st = data.settings;
      const rows = [];
      if (st.whatsapp) rows.push([waLink(st.whatsapp), tr('i_wa'), st.whatsapp, '<path d="M3 21l1.6-4.7A8.5 8.5 0 1 1 8 19.6Z"/><path d="M9 9.5c.5 2.5 2.5 4.5 5 5l1.2-1.4 2 1-.6 1.6c-3.6.4-8.4-4.2-8-8l1.6-.6 1 2Z"/>']);
      (st.phones || []).filter(Boolean).forEach((p) => rows.push([`tel:${digits(p)}`, tr('i_phone'), p, '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>']));
      if (st.email) rows.push([`mailto:${st.email}`, tr('i_mail'), st.email, '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>']);
      if (st.instagram) rows.push([`https://instagram.com/${st.instagram}`, tr('i_ig'), '@' + st.instagram, '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/>']);
      if (st.studio) rows.push([`https://instagram.com/${st.studio}`, tr('i_studio'), '@' + st.studio, '<path d="M4 8h3l2-3h6l2 3h3v11H4Z"/><circle cx="12" cy="13" r="3.5"/>']);
      const budgets = I.budget_opts[L()];
      return `
      <section class="sec" style="padding-top:50px"><div class="container contact-grid">
        <div class="reveal">
          <div class="info-list">${rows.map(([href, label, value, ico]) => `
            <a class="info-row" href="${esc(href)}" ${href.startsWith('http') ? 'target="_blank" rel="noopener"' : ''}>
              <span class="ico"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ico}</svg></span>
              <span><small>${label}</small><b>${esc(value)}</b></span>
            </a>`).join('')}
          </div>
          <div class="hours"><b>${tr('hours_t')}</b><p>${tr('hours_p')}</p></div>
        </div>
        <form class="form-card reveal" id="form" novalidate>
          <h3>${tr('form_h')}</h3><p>${tr('form_p')}</p>
          <div class="fields">
            <div class="field"><label for="f-name">${tr('f_name')} *</label><input id="f-name" name="name" autocomplete="name" required></div>
            <div class="field"><label for="f-company">${tr('f_company')}</label><input id="f-company" name="company" autocomplete="organization"></div>
            <div class="field"><label for="f-phone">${tr('f_phone')} *</label><input id="f-phone" name="phone" type="tel" autocomplete="tel" dir="ltr" required></div>
            <div class="field"><label for="f-email">${tr('f_email')}</label><input id="f-email" name="email" type="email" autocomplete="email" dir="ltr"></div>
            <div class="field"><label for="f-service">${tr('f_service')}</label><select id="f-service" name="service">${SERVICES.map((s) => `<option value="${s.id}">${s.t[L()]}</option>`).join('')}</select></div>
            <div class="field"><label for="f-budget">${tr('f_budget')} <i>${tr('optional')}</i></label><select id="f-budget" name="budget">${budgets.map((b, i) => `<option value="${i === 0 ? '' : esc(I.budget_opts[0][i])}">${b}</option>`).join('')}</select></div>
            <div class="field full"><label for="f-message">${tr('f_message')} <i>${tr('optional')}</i></label><textarea id="f-message" name="message"></textarea></div>
          </div>
          <button class="btn btn-ink" type="submit">${tr('f_send')} ${arrow}</button>
        </form>
      </div></section>`;
    }
  };

  function reelCard(w) {
    return `
      <article class="reel reveal" data-id="${esc(w.id)}" tabindex="0" role="button" aria-label="${esc(t(w.title, lang))}">
        <div class="reel-cover">
          ${mediaHTML(w, true)}
          ${catName(w.category) ? `<span class="chip">${esc(catName(w.category))}</span>` : ''}
          ${w.featured ? '<span class="star" title="Featured">✦</span>' : ''}
          <span class="play">${playIco}</span>
        </div>
        <div class="reel-meta"><h3>${esc(t(w.title, lang))}</h3><p>${[t(w.client, lang) !== t(w.title, lang) ? esc(t(w.client, lang)) : '', esc(w.year || '')].filter(Boolean).join(' · ') || esc(catName(w.category))}</p></div>
      </article>`;
  }

  /* ---------------- modal ---------------- */
  function ensureModal() {
    if ($('#modal')) return;
    document.body.insertAdjacentHTML('beforeend', '<dialog class="modal" id="modal" aria-labelledby="mTitle"><div class="modal-inner" id="modalInner"></div></dialog>');
    $('#modal').addEventListener('click', (e) => { if (e.target.id === 'modal') e.target.close(); });
    $('#modal').addEventListener('close', () => { $('#modalInner').innerHTML = ''; });
  }
  function openWork(id) {
    const w = data.works.find((x) => x.id === id);
    if (!w) return;
    ensureModal();
    const list = modalList.length ? modalList : data.works;
    const idx = list.findIndex((x) => x.id === id);
    const results = (w.results || []).filter((r) => r && r.value);
    const isIg = /instagram\.com/.test(w.link || '');
    const embed = w.video ? '' : igEmbed(w.link);
    $('#modalInner').innerHTML = `
      ${w.video
        ? `<div class="modal-media" id="mMedia"><video src="${esc(w.video)}" ${w.image ? `poster="${esc(w.image)}"` : ''} controls autoplay playsinline></video></div>`
        : embed
          ? `<div class="modal-media embed" id="mMedia">
              <div class="embed-wait" aria-hidden="true">${S.coverHTML(w, catNameEn(w.category))}<span class="spin"></span></div>
              <iframe id="mFrame" src="${embed}" title="${esc(t(w.title, lang))}" allow="autoplay; encrypted-media; picture-in-picture; clipboard-write" allowfullscreen scrolling="no"></iframe>
            </div>`
          : `<div class="modal-media" id="mMedia">${S.coverHTML(w, catNameEn(w.category))}
              ${w.link ? `<a class="play" href="${esc(w.link)}" target="_blank" rel="noopener" aria-label="${tr('visit')}">${playIco}</a>` : ''}</div>`}
      <div class="modal-tools">
        ${list.length > 1 && idx > -1 ? `<button data-nav="-1" aria-label="Previous">${lang === 'ar' ? '→' : '←'}</button><button data-nav="1" aria-label="Next">${lang === 'ar' ? '←' : '→'}</button>` : ''}
        <button data-close aria-label="Close">✕</button>
      </div>
      <div class="modal-body">
        ${catName(w.category) ? `<span class="kicker">${esc(catName(w.category))}</span>` : ''}
        <h3 id="mTitle">${esc(t(w.title, lang))}</h3>
        ${t(w.summary, lang) ? `<p class="sum">${esc(t(w.summary, lang))}</p>` : ''}
        ${results.length ? `<div class="results">${results.map((r) => `<div class="result"><b>${esc(r.value)}</b><span>${esc(t(r.label, lang))}</span></div>`).join('')}</div>` : ''}
        <div class="meta-list">
          <div><span>${tr('client')}</span><b>${esc(t(w.client, lang))}</b></div>
          ${w.year ? `<div><span>${tr('year')}</span><b>${esc(w.year)}</b></div>` : ''}
          ${catName(w.category) ? `<div><span>${tr('category')}</span><b>${esc(catName(w.category))}</b></div>` : ''}
        </div>
        ${(w.services || []).length ? `<div class="svc-tags">${w.services.map((s) => `<span class="tag">${esc(s)}</span>`).join('')}</div>` : ''}
        <div class="acts">
          ${w.link ? `<a class="btn ${embed ? 'btn-line' : 'btn-ink'} ig-btn" href="${esc(w.link)}" target="_blank" rel="noopener">${isIg ? `<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>${tr('open_ig')}` : tr('visit')}</a>` : ''}
          <a class="btn btn-line" href="contact.html">${tr('cta')}</a>
        </div>
      </div>`;
    const m = $('#modal');
    if (!m.open) m.showModal();
    $('#modalInner').scrollTop = 0;
    $('[data-close]', m).onclick = () => m.close();
    const fr = $('#mFrame');
    if (fr) fr.addEventListener('load', () => $('#mMedia') && $('#mMedia').classList.add('ready'));
    $$('[data-nav]', m).forEach((b) => (b.onclick = () => openWork(list[(idx + Number(b.dataset.nav) + list.length) % list.length].id)));
  }
  document.addEventListener('keydown', (e) => {
    const m = $('#modal');
    if (!m || !m.open || !['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
    const b = $$('[data-nav]', m);
    if (!b.length) return;
    const forward = (e.key === 'ArrowLeft') === (lang === 'ar');
    b[forward ? 1 : 0].click();
  });

  /* ---------------- hero connectors ---------------- */
  function drawConnectors() {
    const hero = $('#heroM'), svg = $('#connectors'), orbit = $('#orbit');
    if (!hero || !svg || !orbit || getComputedStyle(svg).display === 'none') return;
    const hb = hero.getBoundingClientRect(), ob = orbit.getBoundingClientRect();
    const R = orbitState.R || ob.width * 0.4, cy = ob.top - hb.top + (orbitState.cy || ob.height * 0.47);
    const cx = ob.left - hb.left + ob.width / 2;
    const out = [$('#fc1'), $('#fc2')].map((c) => {
      if (!c || getComputedStyle(c).display === 'none') return '';
      const b = c.getBoundingClientRect();
      const left = b.left + b.width / 2 < hb.left + hb.width / 2;
      const sx = b.left - hb.left + b.width / 2, sy = b.bottom - hb.top - 6;
      const ex = cx + (left ? -R * 0.98 : R * 0.98), ey = cy + 6;
      return `<path d="M${sx} ${sy} C ${sx} ${sy + 140}, ${ex} ${ey - 160}, ${ex} ${ey}"/><circle cx="${sx}" cy="${sy}" r="3.5"/><circle cx="${ex}" cy="${ey}" r="3.5"/>`;
    }).join('');
    svg.setAttribute('viewBox', `0 0 ${hb.width} ${hb.height}`);
    svg.innerHTML = out;
  }

  /* ---------------- hero orbit: cards circling the logo ---------------- */
  const orbitState = { R: 0, cy: 0 };
  let orbitRAF = 0, orbitCleanup = null;
  function initOrbit() {
    cancelAnimationFrame(orbitRAF);
    if (orbitCleanup) orbitCleanup();
    const el = $('#orbit');
    if (!el) return;
    const cards = $$('.oc', el), N = cards.length, path = $('#orbitBack'), svg = $('#orbitPath');
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const dir = lang === 'ar' ? -1 : 1;
    const AUTO = reduce ? 0 : 0.17 * dir;
    let base = 0.35, vel = AUTO, hover = false, drag = null, moved = 0, visible = true, last = performance.now();
    let tz = -7, tzT = -7, k = 0.17, kT = 0.17;
    const P = 1500;
    const S2 = orbitState;
    const measure = () => {
      const r = el.getBoundingClientRect();
      S2.W = r.width; S2.H = r.height; S2.cx = r.width / 2; S2.cy = r.height * 0.43;
      S2.R = Math.min(500, r.width * (r.width < 700 ? 0.4 : 0.39));
      svg.setAttribute('viewBox', `0 0 ${r.width} ${r.height}`);
    };
    measure();
    const project = (th) => {
      const x = S2.R * Math.sin(th), z = S2.R * Math.cos(th);
      const y = S2.R * k * Math.cos(th) + x * Math.tan(tz * Math.PI / 180);
      const s = P / (P - z);
      return { x: S2.cx + x * s, y: S2.cy + y * s, z, s };
    };
    const frame = (now) => {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (!drag) { vel += ((hover ? 0 : AUTO) - vel) * Math.min(1, dt * (hover ? 6 : 1.6)); base += vel * dt; }
      tz += (tzT - tz) * Math.min(1, dt * 4); k += (kT - k) * Math.min(1, dt * 4);
      cards.forEach((c, i) => {
        const th = base + (i * 2 * Math.PI) / N;
        const p = project(th), depth = (Math.cos(th) + 1) / 2;
        const rotY = Math.sin(th) * 36 * (Math.cos(th) >= 0 ? 1 : -1);
        const lift = c === hoverCard ? 1.1 : 1;
        c.style.transform = `translate3d(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px, 0) translate(-50%, -50%) scale(${(p.s * lift).toFixed(3)}) perspective(700px) rotateY(${rotY.toFixed(1)}deg) rotateZ(${(tz * 0.6).toFixed(1)}deg)`;
        c.style.zIndex = String(200 + Math.round(p.z));
        c.style.opacity = (0.3 + 0.7 * depth).toFixed(2);
        c.style.filter = depth < 0.3 ? `blur(${((0.3 - depth) * 7).toFixed(1)}px)` : '';
        c.tabIndex = depth > 0.45 ? 0 : -1;
      });
      let d = '';
      for (let j = 0; j <= 64; j++) { const p = project((j / 64) * Math.PI * 2); d += (j ? 'L' : 'M') + p.x.toFixed(1) + ' ' + p.y.toFixed(1); }
      path.setAttribute('d', d);
      if (visible) orbitRAF = requestAnimationFrame(frame);
    };
    let hoverCard = null;
    const onDown = (e) => { if (e.button !== undefined && e.button !== 0) return; drag = { x: e.clientX, t: performance.now() }; moved = 0; el.classList.add('dragging'); };
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      if (!drag) {
        const mx = (e.clientX - r.left) / r.width, my = (e.clientY - r.top) / r.height;
        if (mx >= 0 && mx <= 1 && my >= -0.6 && my <= 1) { tzT = -7 + (mx - 0.5) * 8; kT = 0.17 + (my - 0.5) * 0.12; }
        return;
      }
      const now = performance.now(), dx = e.clientX - drag.x, dtt = Math.max(0.008, (now - drag.t) / 1000);
      moved += Math.abs(dx);
      const d = dx / S2.R;
      base += d; vel = Math.max(-4, Math.min(4, d / dtt));
      drag.x = e.clientX; drag.t = now;
    };
    const onUp = () => { if (!drag) return; drag = null; el.classList.remove('dragging'); };
    const onClick = (e) => { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } };
    el.addEventListener('pointerdown', onDown);
    addEventListener('pointermove', onMove, { passive: true });
    addEventListener('pointerup', onUp);
    addEventListener('pointercancel', onUp);
    el.addEventListener('click', onClick, true);
    cards.forEach((c) => {
      c.addEventListener('pointerenter', () => { hover = true; hoverCard = c; });
      c.addEventListener('pointerleave', () => { hover = false; hoverCard = null; });
      c.addEventListener('focus', () => { hover = true; hoverCard = c; });
      c.addEventListener('blur', () => { hover = false; hoverCard = null; });
      c.addEventListener('dragstart', (e) => e.preventDefault());
      if (c.dataset.work) c.addEventListener('click', () => { if (moved <= 6) openWork(c.dataset.work); });
    });
    const ro = new ResizeObserver(() => { measure(); drawConnectors(); });
    ro.observe(el);
    const io2 = new IntersectionObserver(([en]) => {
      const was = visible; visible = en.isIntersecting;
      if (visible && !was) { last = performance.now(); orbitRAF = requestAnimationFrame(frame); }
    });
    io2.observe(el);
    orbitCleanup = () => {
      removeEventListener('pointermove', onMove); removeEventListener('pointerup', onUp); removeEventListener('pointercancel', onUp);
      ro.disconnect(); io2.disconnect();
    };
    orbitRAF = requestAnimationFrame(frame);
  }

  /* ---------------- wiring after render ---------------- */
  function setStep(i) {
    activeStep = i;
    $$('#methodPyr .layer').forEach((g) => g.classList.toggle('active', +g.dataset.layer === i));
    $$('#steps .step').forEach((b) => b.classList.toggle('active', +b.dataset.step === i));
  }
  function wire() {
    $$('.reel').forEach((c) => {
      c.onclick = () => openWork(c.dataset.id);
      c.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openWork(c.dataset.id); } };
    });
    $$('#filters .chip-btn').forEach((b) => (b.onclick = () => { filter = b.dataset.f; renderBlock($('[data-block="work-grid"]')); wire(); observe(true); }));
    $$('#methodPyr .layer').forEach((g) => {
      const go = () => setStep(+g.dataset.layer);
      g.addEventListener('click', go); g.addEventListener('mouseenter', go);
      g.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); } });
    });
    $$('#steps .step').forEach((b) => (b.onclick = () => setStep(+b.dataset.step)));
    if ($('#steps')) setStep(activeStep);
    const form = $('#form');
    if (form) form.onsubmit = (e) => {
      e.preventDefault();
      const f = e.target, name = f.name.value.trim(), phone = f.phone.value.trim();
      f.querySelector('#f-name').parentElement.classList.toggle('err', !name);
      f.querySelector('#f-phone').parentElement.classList.toggle('err', !phone);
      if (!name || !phone) { toast(tr('required')); return; }
      data = S.load();
      data.messages.unshift({
        id: S.uid(), name, phone, company: f.company.value.trim(), email: f.email.value.trim(), service: f.service.value,
        budget: f.budget.value, message: f.message.value.trim(), date: new Date().toISOString(), read: false
      });
      if (S.save(data)) { f.reset(); toast('✦ ' + tr('sent')); } else toast(tr('saveFail'));
    };
  }

  /* ---------------- reveal + counters ---------------- */
  let io;
  function observe(instant) {
    const els = $$('.reveal:not(.in)');
    if (instant || !('IntersectionObserver' in window)) { els.forEach(show); return; }
    io = io || new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { show(en.target); io.unobserve(en.target); } }), { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    els.forEach((el) => io.observe(el));
  }
  function show(el) {
    el.classList.add('in');
    const c = el.querySelector('[data-count]');
    if (c && !c.dataset.done) countUp(c);
  }
  function countUp(el) {
    el.dataset.done = 1;
    const end = Number(el.dataset.count);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches || document.hidden) { el.textContent = '+' + fmt(end); return; }
    const t0 = performance.now(), dur = 1600;
    const step = (now) => { const p = Math.min(1, (now - t0) / dur); el.textContent = '+' + fmt(Math.round(end * (1 - Math.pow(1 - p, 3)))); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }

  /* ---------------- render ---------------- */
  function renderBlock(el) { const fn = BLOCKS[el.dataset.block]; if (fn) el.innerHTML = fn(el); }
  function renderAll(keepVisible) {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    const tt = document.body.dataset['title' + (lang === 'ar' ? 'Ar' : 'En')];
    if (tt) document.title = tt;
    artN = 0;
    renderHeader();
    $$('[data-block]').forEach(renderBlock);
    renderFooter();
    if (!$('#toast')) document.body.insertAdjacentHTML('beforeend', '<div class="toast" id="toast" role="status" aria-live="polite"></div>');
    wire();
    initOrbit();
    observe(keepVisible === true || renderAll.done);
    renderAll.done = true;
    setTimeout(() => { drawConnectors(); placeGlider(); onScroll(); }, 60);
  }
  function onScroll() { const h = $('#header'); if (h) h.classList.toggle('scrolled', scrollY > 20); }

  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', () => { drawConnectors(); placeGlider(); });
  addEventListener('storage', (e) => {
    if (e.key === S.KEY) { data = S.load(); renderAll(true); }
    if (e.key === 'pyramid.lang') { lang = S.getLang(); renderAll(true); }
  });

  renderAll();
  if (location.hash) setTimeout(() => { const t = document.getElementById(location.hash.slice(1)); if (t) t.scrollIntoView(); }, 120);
  document.fonts && document.fonts.ready.then(() => { drawConnectors(); placeGlider(); });
  setTimeout(drawConnectors, 1000);
})();
