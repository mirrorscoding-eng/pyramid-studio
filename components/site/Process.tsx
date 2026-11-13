'use client';

import { useEffect, useRef, useState } from 'react';
import { engravedPyramid } from '@/lib/art';

type Step = { title: string; desc: string };

/** Services page: six steps linked to the six layers of the engraved pyramid. */
export function Process({ kicker, h1, h2, lead, steps }: { kicker: string; h1: string; h2: string; lead: string; steps: Step[] }) {
  const [active, setActive] = useState(0);
  const pyrRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    pyrRef.current?.querySelectorAll<SVGGElement>('.layer').forEach((g) => g.classList.toggle('active', Number(g.dataset.layer) === active));
  }, [active]);

  const fromLayer = (target: EventTarget | null) => {
    const g = (target as Element | null)?.closest?.('.layer') as SVGGElement | null;
    if (g && g.dataset.layer != null) {
      const i = Number(g.dataset.layer);
      if (i < steps.length) setActive(i);
    }
  };

  return (
    <section className="method" id="process"><div className="container">
      <div className="reveal"><span className="kicker">{kicker}</span><h2 className="h2"><span>{h1}</span> <em>{h2}</em></h2><p className="lead">{lead}</p></div>
      <div className="method-grid">
        <div
          className="method-pyr reveal"
          ref={pyrRef}
          onClick={(e) => fromLayer(e.target)}
          onMouseOver={(e) => fromLayer(e.target)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fromLayer(e.target); } }}
          dangerouslySetInnerHTML={{ __html: engravedPyramid({ id: 'method', interactive: true }) }}
        />
        <div className="steps reveal">
          {steps.map((s, i) => (
            <button className={`step${i === active ? ' active' : ''}`} key={i} onClick={() => setActive(i)}>
              <span className="n">{String(i + 1).padStart(2, '0')}</span><b>{s.title}</b><p>{s.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div></section>
  );
}
