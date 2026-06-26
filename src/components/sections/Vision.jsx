import { useRef } from 'react';
import { gsap, SplitText, useGSAP, prefersReduced } from '../../lib/gsap';
import { vision } from '../../data/content';
import SectionHeading from '../SectionHeading';
import './Vision.css';

export default function Vision() {
  const root = useRef(null);

  const { contextSafe } = useGSAP(
    () => {
      const el = root.current;
      let split;

      // ── (1) Opposing slide-in value panels — created SYNCHRONOUSLY so the
      //        triggers exist before the app's font-load refresh runs. ──────
      if (!prefersReduced) {
        const panels = gsap.utils.toArray('.vis-card', el);
        panels.forEach((card) => {
          const dir = card.dataset.side === 'right' ? 60 : -60;
          gsap.from(card, {
            x: dir,
            opacity: 0,
            duration: 1.05,
            ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 88%', once: true },
          });
          gsap.from(card.querySelectorAll('[data-flow]'), {
            opacity: 0,
            y: 22,
            duration: 0.7,
            ease: 'power2.out',
            stagger: 0.1,
            delay: 0.12,
            scrollTrigger: { trigger: card, start: 'top 88%', once: true },
          });
        });

        // animated tracer pulse traveling the central seam between panels
        gsap.to('.vis-seam-pulse', { yPercent: 100, ease: 'none', repeat: -1, duration: 3.4 });
      }

      // ── (2) Scrub word-fill on the display statement (needs font metrics) ─
      const stmt = el.querySelector('.vis-statement');
      const buildFill = () => {
        if (!stmt || prefersReduced || split) return;
        split = new SplitText(stmt, { type: 'words', wordsClass: 'vis-word' });
        gsap.set(split.words, { color: 'var(--text-mute)' });
        gsap.to(split.words, {
          color: 'var(--text)',
          ease: 'none',
          stagger: { each: 1, from: 'start' },
          scrollTrigger: { trigger: stmt, start: 'top 82%', end: 'bottom 45%', scrub: 0.6 },
        });
      };
      if (document.fonts?.ready) document.fonts.ready.then(contextSafe(buildFill));
      else buildFill();

      return () => split?.revert();
    },
    { scope: root }
  );

  return (
    <section className="section vis" id="vision" ref={root}>
      <span className="halo vis-halo vis-halo--1" aria-hidden="true" />
      <span className="halo vis-halo vis-halo--2" aria-hidden="true" />
      <div className="grid-overlay" />

      <div className="container vis-inner">
        <SectionHeading kicker={vision.kicker} heading={vision.heading} align="left" />

        {/* (2) Large display statement with scrub word-fill */}
        <div className="vis-statement-wrap">
          <span className="vis-statement-mark mono" aria-hidden="true">
            “
          </span>
          <p className="vis-statement display">{vision.statement}</p>
        </div>

        {/* (3) Two opposing value-proposition panels */}
        <div className="vis-grid">
          <span className="vis-seam" aria-hidden="true">
            <span className="vis-seam-pulse" />
          </span>

          {vision.value.map((v, i) => (
            <article
              key={v.who}
              className="panel vis-card"
              data-side={i === 0 ? 'left' : 'right'}
            >
              <header className="vis-card__head">
                <span className="vis-role mono" data-flow>
                  {v.role}
                </span>
                <h3 className="vis-who h-md" data-flow>
                  {v.who}
                </h3>
              </header>

              {/* Pain point — visually marked as a problem */}
              <div className="vis-pain" data-flow>
                <span className="vis-pain__tag mono" aria-hidden="true">
                  <span className="vis-pain__dot" />
                  PAIN POINT
                </span>
                <p className="vis-pain__text">{v.pain}</p>
              </div>

              {/* Connector arrow (slides on hover) */}
              <div className="vis-connector" data-flow aria-hidden="true">
                <span className="vis-connector__line" />
                <span className="vis-connector__arrow">
                  <svg viewBox="0 0 28 14" width="28" height="14">
                    <path
                      d="M0 7 H24 M18 1 L25 7 L18 13"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </div>

              {/* Solution */}
              <div className="vis-solution" data-flow>
                <h4 className="vis-solution__title">{v.solutionTitle}</h4>
                <p className="vis-solution__text text-dim">{v.solution}</p>
              </div>

              <span className="vis-card__idx mono" aria-hidden="true">
                0{i + 1}
              </span>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
