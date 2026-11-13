'use client';

import { createContext, useCallback, useContext, useRef, useState } from 'react';
import { saveSection } from '@/app/(admin)/dashboard/actions';
import { createClient } from '@/lib/supabase/browser';
import type { Content, ContentKey, L, Message } from '@/lib/content/types';

type ConfirmState = { title: string; text: string; yes: string; resolve: (v: boolean) => void } | null;

type Dash = {
  content: Content;
  setLocal: <K extends ContentKey>(key: K, value: Content[K]) => void;
  save: <K extends ContentKey>(key: K, value: Content[K], okMsg?: string) => Promise<boolean>;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  toast: (msg: string, err?: boolean) => void;
  confirm: (title: string, text?: string, yes?: string) => Promise<boolean>;
  go: (view: string, extra?: string) => void;
};

const Ctx = createContext<Dash | null>(null);
export const useDash = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error('useDash outside provider');
  return c;
};

export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
export const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v));
export const emptyL = (): L => ({ ar: '', en: '' });

const ERRORS: Record<string, string> = {
  auth: 'انتهت الجلسة — سجّل دخول من جديد.',
  bad_input: 'البيانات مو صالحة.'
};

export function DashProvider({
  initialContent, initialMessages, go, children
}: { initialContent: Content; initialMessages: Message[]; go: Dash['go']; children: React.ReactNode }) {
  const [content, setContent] = useState(initialContent);
  const [messages, setMessages] = useState(initialMessages);
  const [toastState, setToast] = useState<{ msg: string; err: boolean; on: boolean }>({ msg: '', err: false, on: false });
  const [confirmState, setConfirm] = useState<ConfirmState>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const dialog = useRef<HTMLDialogElement>(null);

  const toast = useCallback((msg: string, err = false) => {
    setToast({ msg, err, on: true });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast((s) => ({ ...s, on: false })), 2800);
  }, []);

  const setLocal = useCallback(<K extends ContentKey>(key: K, value: Content[K]) => {
    setContent((c) => ({ ...c, [key]: value }));
  }, []);

  const save = useCallback(async <K extends ContentKey>(key: K, value: Content[K], okMsg = 'تم الحفظ ✦') => {
    const res = await saveSection(key, value);
    if (!res.ok) {
      toast(ERRORS[res.error] || 'ما گدرنا نحفظ: ' + res.error, true);
      return false;
    }
    setContent((c) => ({ ...c, [key]: value }));
    if (okMsg) toast(okMsg);
    return true;
  }, [toast]);

  const confirm = useCallback((title: string, text = '', yes = 'حذف') => new Promise<boolean>((resolve) => {
    setConfirm({ title, text, yes, resolve });
    requestAnimationFrame(() => dialog.current?.showModal());
  }), []);

  const answer = (v: boolean) => {
    confirmState?.resolve(v);
    dialog.current?.close();
    setConfirm(null);
  };

  return (
    <Ctx.Provider value={{ content, setLocal, save, messages, setMessages, toast, confirm, go }}>
      {children}
      <dialog className="confirm" ref={dialog} onCancel={() => answer(false)}>
        <h3>{confirmState?.title}</h3>
        {confirmState?.text && <p>{confirmState.text}</p>}
        <div className="row">
          <button className="btn btn-line" onClick={() => answer(false)}>إلغاء</button>
          <button className="btn btn-ink" onClick={() => answer(true)}>{confirmState?.yes}</button>
        </div>
      </dialog>
      <div className={`toast${toastState.on ? ' show' : ''}${toastState.err ? ' err' : ''}`} role="status" aria-live="polite">{toastState.msg}</div>
    </Ctx.Provider>
  );
}

/* ---------------- uploads (Supabase Storage, bucket "media") ---------------- */

/** Shrink big photos before upload (keeps the site fast). GIF/SVG and videos go up untouched. */
async function shrinkImage(file: File, max = 1800): Promise<Blob> {
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) return file;
  const bmp = await createImageBitmap(file).catch(() => null);
  if (!bmp) return file;
  const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
  if (scale === 1 && file.size < 900_000) return file;
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  canvas.getContext('2d')!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/webp', 0.85));
  return blob || file;
}

export async function uploadMedia(file: File, folder: string): Promise<string> {
  const isImage = file.type.startsWith('image/');
  const body = isImage ? await shrinkImage(file) : file;
  const type = body.type || file.type;
  const ext = type === 'image/webp' ? 'webp' : (file.name.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '');
  const path = `${folder}/${new Date().toISOString().slice(0, 10)}-${uid()}.${ext}`;
  const sb = createClient();
  const { error } = await sb.storage.from('media').upload(path, body, { contentType: type, upsert: false, cacheControl: '31536000' });
  if (error) throw error;
  return sb.storage.from('media').getPublicUrl(path).data.publicUrl;
}

/* ---------------- icons ---------------- */
const svg = (d: React.ReactNode, sw = 2) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{d}</svg>
);
export const Icon = {
  plus: svg(<path d="M12 5v14M5 12h14" />, 2.2),
  edit: svg(<path d="M4 20h4L19 9l-4-4L4 16z" />),
  trash: svg(<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />),
  star: <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z" /></svg>,
  up: svg(<path d="M6 14l6-6 6 6" />, 2.2),
  down: svg(<path d="M6 10l6 6 6-6" />, 2.2),
  search: svg(<><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></>),
  works: svg(<><path d="M3 5l9-3 9 3-9 16z" /><path d="M12 2v19" /></>, 1.8),
  msg: svg(<path d="M4 5h16v11H8l-4 4z" />, 1.8),
  ig: svg(<><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /></>, 1.8),
  overview: svg(<path d="M3 4h7v7H3zM14 4h7v4h-7zM14 12h7v8h-7zM3 15h7v5H3z" />, 1.8),
  text: svg(<path d="M4 6h16M4 12h10M4 18h13" />, 1.8),
  layers: svg(<><path d="M12 3l9 5-9 5-9-5z" /><path d="M3 13l9 5 9-5" /></>, 1.8),
  team: svg(<><circle cx="9" cy="8" r="3.5" /><path d="M2.5 20a6.5 6.5 0 0 1 13 0" /><circle cx="17.5" cy="9" r="2.5" /><path d="M16 14.2A5 5 0 0 1 21.5 19" /></>, 1.8),
  clients: svg(<><rect x="3" y="3" width="7" height="7" rx="2" /><rect x="14" y="3" width="7" height="7" rx="2" /><rect x="3" y="14" width="7" height="7" rx="2" /><rect x="14" y="14" width="7" height="7" rx="2" /></>, 1.8),
  tag: svg(<><path d="M3 12l9-9h9v9l-9 9z" /><circle cx="16" cy="8" r="1.5" /></>, 1.8),
  settings: svg(<><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" /></>, 1.8)
};

/** Local editable copy of one content section, with save / undo. */
export function useDraft<K extends ContentKey>(key: K) {
  const { content, save } = useDash();
  const [draft, setDraft] = useState<Content[K]>(() => clone(content[key]));
  const [busy, setBusy] = useState(false);
  const dirty = JSON.stringify(draft) !== JSON.stringify(content[key]);
  const commit = async (value: Content[K] = draft) => {
    setBusy(true);
    const ok = await save(key, value);
    setBusy(false);
    if (ok) setDraft(clone(value));
    return ok;
  };
  const reset = () => setDraft(clone(content[key]));
  return { draft, setDraft, dirty, commit, reset, busy };
}
