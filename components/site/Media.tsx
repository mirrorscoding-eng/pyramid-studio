import { coverSVG } from '@/lib/art';
import { t } from '@/lib/content/defaults';
import type { Work } from '@/lib/content/types';
import { Svg } from './Svg';

/** A work's cover: looping muted video, uploaded image, or a generated engraved cover. */
export function Media({ w, catEn, mode = 'lazy' }: { w: Work; catEn: string; mode?: 'lazy' | 'eager' | 'small' }) {
  if (w.video) {
    return <video src={w.video} poster={w.image || undefined} muted loop playsInline autoPlay preload={mode === 'eager' ? 'auto' : 'metadata'} />;
  }
  if (w.image) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={w.image} alt={t(w.title, 'ar')} loading={mode === 'eager' ? 'eager' : 'lazy'} decoding="async" />;
  }
  return <Svg html={coverSVG(w, catEn)} />;
}
