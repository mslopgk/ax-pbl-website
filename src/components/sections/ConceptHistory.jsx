import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP, prefersReduced } from '../../lib/gsap';
import { concept } from '../../data/content';
import SectionHeading from '../SectionHeading';
import './ConceptHistory.css';

export default function ConceptHistory() {
  const root = useRef(null);

  useGSAP(
    () => {
      const el = root.current;
      const spine = el.querySelector('.cncpt-spine');
      const entries = gsap.utils.toArray(el.querySelectorAll('.cncpt-entry'));

      // Always make content visible (reduced-motion or no-JS safety handled in CSS too).
      if (prefersReduced) {
        gsap.set(spine, { drawSVG: '100%' });
        entries.forEach((entry) => {
          entry.classList.add('is-active');
          gsap.set(entry.querySelector('.cncpt-card'), { opacity: 1, x: 0 });
        });
        return;
      }

      // ── Signature: scrub-driven spine draw synced to sequential node activation.
      const spineTl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: el.querySelector('.cncpt-timeline'),
          start: 'top 72%',
          end: 'bottom 78%',
          scrub: 0.8,
        },
      });
      spineTl.fromTo(spine, { drawSVG: '0%' }, { drawSVG: '100%', duration: 1 });

      // Travelling pulse that rides the spine as it draws.
      const traveller = el.querySelector('.cncpt-traveller');
      if (traveller) {
        gsap.set(traveller, { opacity: 0 });
        spineTl.to(traveller, { opacity: 1, duration: 0.04 }, 0);
        spineTl.fromTo(
          traveller,
          { yPercent: 0 },
          { yPercent: 100, duration: 1, ease: 'none' },
          0
        );
        spineTl.to(traveller, { opacity: 0, duration: 0.06 }, 0.97);
      }

      // Each entry: node activates + card slides in from its side, once.
      entries.forEach((entry) => {
        const card = entry.querySelector('.cncpt-card');
        const node = entry.querySelector('.cncpt-node');
        const side = entry.dataset.side; // 'left' | 'right'
        const dir = side === 'left' ? -1 : 1;

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: entry,
            start: 'top 76%',
            once: true,
            onEnter: () => entry.classList.add('is-active'),
          },
        });

        tl.from(card, {
          opacity: 0,
          x: 56 * dir,
          y: 22,
          duration: 0.9,
          ease: 'power3.out',
        });

        if (node) {
          tl.fromTo(
            node,
            { scale: 0.2, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(2.4)' },
            0.05
          );
        }

        const yearEl = entry.querySelector('.cncpt-year');
        if (yearEl) {
          tl.from(yearEl, { opacity: 0, y: 14, duration: 0.6, ease: 'power2.out' }, 0.18);
        }
      });

      // Pillars: staggered rise.
      const pillars = el.querySelectorAll('.cncpt-pillar');
      if (pillars.length) {
        gsap.from(pillars, {
          opacity: 0,
          y: 40,
          duration: 0.85,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: el.querySelector('.cncpt-pillars'),
            start: 'top 82%',
            once: true,
          },
        });
      }
    },
    { scope: root }
  );

  return (
    <section className="section cncpt" id="concept" ref={root}>
      <span className="halo cncpt-halo cncpt-halo--1" aria-hidden="true" />
      <span className="halo cncpt-halo cncpt-halo--2" aria-hidden="true" />
      <div className="grid-overlay" aria-hidden="true" />

      <div className="container cncpt-inner">
        <SectionHeading kicker={concept.kicker} heading={concept.heading} sub={concept.intro} />

        {/* ── STORY TIMELINE 1969 → Now ──────────────────────────────── */}
        <div className="cncpt-timeline" role="list" aria-label="PBL 역사 타임라인">
          {/* Spine: a drawable SVG line down the center (left on mobile) */}
          <div className="cncpt-rail" aria-hidden="true">
            <svg className="cncpt-rail-svg" viewBox="0 0 4 1000" preserveAspectRatio="none">
              <line className="cncpt-spine-bg" x1="2" y1="0" x2="2" y2="1000" />
              <line className="cncpt-spine" x1="2" y1="0" x2="2" y2="1000" />
            </svg>
            <span className="cncpt-traveller" />
          </div>

          {concept.timeline.map((item, i) => {
            const side = i % 2 === 0 ? 'left' : 'right';
            return (
              <article
                key={item.year + item.title}
                className={`cncpt-entry cncpt-entry--${side}`}
                data-side={side}
                role="listitem"
              >
                <span className="cncpt-node" aria-hidden="true">
                  <span className="cncpt-node-ring" />
                  <span className="cncpt-node-core" />
                </span>

                <div className="cncpt-card panel">
                  <span className="cncpt-card-glint" aria-hidden="true" />
                  <p className="cncpt-year mono">{item.year}</p>
                  <span className="chip cncpt-chip">{item.tag}</span>
                  <h3 className="h-md cncpt-title">{item.title}</h3>
                  <p className="cncpt-body text-dim">{item.body}</p>
                  <span className="cncpt-index mono" aria-hidden="true">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
              </article>
            );
          })}
        </div>

        {/* ── 4 FOUNDATIONS — 전통적 교육적 정의 ─────────────────────── */}
        <div className="cncpt-pillars-wrap">
          <div className="cncpt-pillars-head">
            <span className="kicker">Four Foundations</span>
            <p className="cncpt-pillars-lead lead">전통적 교육적 정의 — PBL을 지탱하는 네 개의 기둥</p>
          </div>

          <ul className="cncpt-pillars">
            {concept.pillars.map((p, i) => (
              <li key={p.en} className="cncpt-pillar panel">
                <span className="cncpt-pillar-num mono" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="cncpt-pillar-border" aria-hidden="true" />
                <h4 className="cncpt-pillar-ko h-md">{p.ko}</h4>
                <p className="cncpt-pillar-en mono">{p.en}</p>
                <p className="cncpt-pillar-body text-dim">{p.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
