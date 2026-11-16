export type Lang = 'ar' | 'en';
export type L = { ar: string; en: string };

export type Settings = {
  eyebrow: L;
  about: L;
  aboutImage: string;
  phones: string[];
  whatsapp: string;
  email: string;
  instagram: string;
  studio: string;
  threads: string;
  website: string;
  hashtag: string;
  years: number;
  projects: number;
  clientsCount: number;
  followers: number;
  posts: number;
  /** Page sections switched off from the dashboard (key → false). Missing means on. */
  sections?: Record<string, boolean>;
};

export type Category = { id: string; name: L; hidden?: boolean };

export type Result = { value: string; label: L };

export type Work = {
  id: string;
  category: string;
  year: string | number;
  featured: boolean;
  cover: number;
  image: string;
  video?: string;
  link: string;
  title: L;
  client: L;
  summary: L;
  services: string[];
  results: Result[];
  hidden?: boolean;
};

export type Client = { id: string; name: L; logo: string; hidden?: boolean };
export type Member = { id: string; name: L; role: L; photo?: string; featured?: boolean; hidden?: boolean };

export type ArtKey = 'analysis' | 'plans' | 'reports' | 'web' | 'content' | 'photo' | 'social' | 'ads' | 'color';

export type Service = { id: string; art: ArtKey; title: L; desc: L; hidden?: boolean };
export type OrbitLabel = { service: string; sub: L; hidden?: boolean };
export type ApproachItem = { art: ArtKey; heading: L; title: L; desc: L; hidden?: boolean };
export type Step = { title: L; desc: L; hidden?: boolean };

export type Content = {
  settings: Settings;
  texts: Record<string, L>;
  services: Service[];
  orbit: OrbitLabel[];
  approach: ApproachItem[];
  steps: Step[];
  budgets: L[];
  categories: Category[];
  works: Work[];
  clients: Client[];
  team: Member[];
};

export type ContentKey = keyof Content;

export type Message = {
  id: string;
  name: string;
  company: string;
  phone: string;
  email: string;
  service: string;
  budget: string;
  message: string;
  read: boolean;
  created_at: string;
};
