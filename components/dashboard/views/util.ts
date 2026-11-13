export const initial = (s: string) => (String(s || '?').trim().charAt(0) || '?').toUpperCase();
export const digits = (p: string) => String(p || '').replace(/[^\d+]/g, '');

export const ago = (iso: string) => {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const days = Math.floor((Date.now() - d.getTime()) / 864e5);
  if (days <= 0) return 'اليوم';
  if (days === 1) return 'أمس';
  if (days < 7) return `قبل ${days} أيام`;
  return d.toLocaleDateString('ar-IQ', { day: 'numeric', month: 'short' });
};
