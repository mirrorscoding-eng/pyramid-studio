/** Mounts a trusted SVG/HTML string produced by lib/art.ts without adding a layout box. */
export function Svg({ html, className }: { html: string; className?: string }) {
  return <span className={className ? `svgw ${className}` : 'svgw'} dangerouslySetInnerHTML={{ __html: html }} />;
}

export const PLAY_ICON = '<svg width="16" height="16" viewBox="0 0 12 12"><path d="M3 1.5v9l7.5-4.5z" fill="currentColor"/></svg>';

export function PlayIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 12 12" aria-hidden="true">
      <path d="M3 1.5v9l7.5-4.5z" fill="currentColor" />
    </svg>
  );
}

/** A real element (div by default) whose inside is a trusted SVG string. */
export function Html({ html, className }: { html: string; className?: string }) {
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}
