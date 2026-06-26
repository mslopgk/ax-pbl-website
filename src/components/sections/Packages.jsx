import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP, prefersReduced } from '../../lib/gsap';
import { packages } from '../../data/content';
import SectionHeading from '../SectionHeading';
import './Packages.css';

/* Bento placement keyed by item.no (spans defined in CSS as .pkg-tile--NN).
   Features (larger, emphasized): 01 (3LAYER-BPF) and 03 (Problem Bank). */
const FEATURE_NOS = new Set(['01', '03']);
const LAYER_KEYS = ['B', 'P', 'F'];

export default function Packages() {
  const root = useRef(null);

  useGSAP(
    () => {
      const el = root.current;
      const tiles = gsap.utils.toArray('.pkg-tile', el);

      /* ── entrance: staggered scale + rise (skipped under reduced-motion) ── */
      if (!prefersReduced) {
        gsap.from(tiles, {
          opacity: 0,
          y: 46,
          scale: 0.94,
          duration: 0.9,
          ease: 'power3.out',
          stagger: { each: 0.07, from: 'start', grid: 'auto' },
          scrollTrigger: { trigger: '.pkg-grid', start: 'top 82%', once: true },
        });

        // feature layer-stack bars drift up on the same beat
        gsap.from('.pkg-layer', {
          xPercent: -8,
          opacity: 0,
          duration: 0.8,
          ease: 'power2.out',
          stagger: 0.12,
          scrollTrigger: { trigger: '.pkg-tile--layers', start: 'top 80%', once: true },
        });
      }

      /* ── signature hover: neon border draws around the tile + number lifts ── */
      const cleanups = [];
      tiles.forEach((tile) => {
        const rect = tile.querySelector('.pkg-draw__rect');
        const no = tile.querySelector('.pkg-no');
        if (rect) gsap.set(rect, { drawSVG: '0%' });

        // quickTo gives crisp, interruptible micro-motion on the number
        const noX = no ? gsap.quickTo(no, 'x', { duration: 0.5, ease: 'power3.out' }) : null;
        const noY = no ? gsap.quickTo(no, 'y', { duration: 0.5, ease: 'power3.out' }) : null;

        const enter = () => {
          if (prefersReduced) return;
          if (rect) gsap.to(rect, { drawSVG: '100%', duration: 0.7, ease: 'power2.inOut' });
          noX?.(6);
          noY?.(-6);
        };
        const leave = () => {
          if (prefersReduced) return;
          if (rect) gsap.to(rect, { drawSVG: '0% 0%', duration: 0.45, ease: 'power2.in' });
          noX?.(0);
          noY?.(0);
        };

        tile.addEventListener('pointerenter', enter);
        tile.addEventListener('pointerleave', leave);
        tile.addEventListener('focusin', enter);
        tile.addEventListener('focusout', leave);
        cleanups.push(() => {
          tile.removeEventListener('pointerenter', enter);
          tile.removeEventListener('pointerleave', leave);
          tile.removeEventListener('focusin', enter);
          tile.removeEventListener('focusout', leave);
        });
      });

      return () => cleanups.forEach((fn) => fn());
    },
    { scope: root }
  );

  return (
    <section className="section pkg" id="packages" ref={root}>
      <span className="halo pkg__halo pkg__halo--1" aria-hidden="true" />
      <span className="halo pkg__halo pkg__halo--2" aria-hidden="true" />
      <div className="grid-overlay" aria-hidden="true" />

      <div className="container">
        <div className="pkg__head">
          <SectionHeading
            kicker={packages.kicker}
            heading={packages.heading}
            sub={packages.sub}
          />
          <span className="pkg__count mono" aria-hidden="true">
            <em>07</em> / PACKAGES
          </span>
        </div>

        <ul className="pkg-grid">
          {packages.items.map((item) => {
            const isFeature = FEATURE_NOS.has(item.no);
            return (
              <li
                key={item.no}
                className={`pkg-tile panel pkg-tile--${item.no}${
                  item.no === '01' ? ' pkg-tile--layers' : ''
                }${isFeature ? ' pkg-tile--feature' : ''}`}
                tabIndex={0}
              >
                {/* neon draw-border — sits above surface, below content */}
                <svg
                  className="pkg-draw"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  aria-hidden="true"
                >
                  <rect
                    className="pkg-draw__rect"
                    x="1.2"
                    y="1.2"
                    width="97.6"
                    height="97.6"
                    rx="6"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>

                <div className="pkg-tile__top">
                  <span className="pkg-no mono gradient-text">{item.no}</span>
                  <span className="pkg-en mono">{item.en}</span>
                </div>

                <div className="pkg-tile__body">
                  <h3 className="pkg-name h-md">{item.name}</h3>
                  <p className="pkg-desc text-dim">{item.body}</p>
                </div>

                {item.no === '01' && (
                  <div className="pkg-layers" aria-hidden="true">
                    {LAYER_KEYS.map((k, i) => (
                      <span
                        key={k}
                        className="pkg-layer"
                        style={{ '--i': i }}
                      >
                        <em className="pkg-layer__key mono">{k}</em>
                        <span className="pkg-layer__bar" />
                      </span>
                    ))}
                  </div>
                )}

                <span className="pkg-tile__corner mono" aria-hidden="true">
                  PKG·{item.no}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
