import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP, prefersReduced } from '../../lib/gsap';
import { stats } from '../../data/content';
import SectionHeading from '../SectionHeading';
import './Stats.css';

export default function Stats() {
  const root = useRef(null);

  useGSAP(
    () => {
      const el = root.current;
      const cards = gsap.utils.toArray(el.querySelectorAll('.stat-card'));

      cards.forEach((card) => {
        const numEl = card.querySelector('[data-count]');
        const barEl = card.querySelector('.stat-card__bar-fill');
        const target = Number(numEl.dataset.count);

        // Final state — content must be fully visible/usable even without motion.
        const renderValue = (v) => {
          numEl.textContent = Math.round(v).toLocaleString('ko-KR');
        };

        if (prefersReduced) {
          renderValue(target);
          if (barEl) gsap.set(barEl, { scaleX: 1 });
          return;
        }

        renderValue(0);
        if (barEl) gsap.set(barEl, { scaleX: 0, transformOrigin: 'left center' });

        const counter = { n: 0 };

        ScrollTrigger.create({
          trigger: card,
          start: 'top 84%',
          once: true,
          onEnter: () => {
            // count-up: snap to integer, write straight to the DOM
            gsap.to(counter, {
              n: target,
              duration: 1.6,
              ease: 'power2.out',
              snap: { n: 1 },
              onUpdate: () => renderValue(counter.n),
            });
            // animated underline bar sweeps behind the number
            if (barEl) {
              gsap.to(barEl, {
                scaleX: 1,
                duration: 1.6,
                ease: 'power3.out',
              });
            }
          },
        });
      });

      // staggered card entrance
      if (!prefersReduced) {
        gsap.from(cards, {
          opacity: 0,
          y: 34,
          duration: 0.85,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: { trigger: el.querySelector('.stat-grid'), start: 'top 82%', once: true },
        });

        gsap.from(el.querySelector('.stat-req'), {
          opacity: 0,
          y: 26,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: el.querySelector('.stat-req'), start: 'top 88%', once: true },
        });
      }
    },
    { scope: root }
  );

  return (
    <section className="section stat" ref={root} id="stats">
      <div className="grid-overlay" aria-hidden="true" />
      <span className="halo stat__halo stat__halo--1" aria-hidden="true" />
      <span className="halo stat__halo stat__halo--2" aria-hidden="true" />

      <div className="container stat__inner">
        <SectionHeading
          kicker={stats.kicker}
          heading={stats.heading}
          sub={stats.sub}
          align="left"
        />

        <ul className="stat-grid" aria-label="2025 교육과정 PBL 추출 성과 지표">
          {stats.metrics.map((m, i) => (
            <li className="stat-card" key={m.label}>
              <span className="stat-card__index mono" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>

              <div className="stat-card__figure">
                <span className="stat-card__number mono">
                  <span data-count={m.value}>{m.value.toLocaleString('ko-KR')}</span>
                  <span className="stat-card__suffix" aria-hidden="true">
                    {m.suffix}
                  </span>
                </span>
                <span className="stat-card__bar" aria-hidden="true">
                  <span className="stat-card__bar-fill" />
                </span>
              </div>

              <strong className="stat-card__label h-md">{m.label}</strong>
              <p className="stat-card__note text-mute mono">{m.note}</p>

              <span className="sr-only">
                {m.label}: {m.value}
                {m.suffix}. {m.note}
              </span>
            </li>
          ))}
        </ul>

        <aside className="stat-req" aria-label="필수요건">
          <span className="stat-req__tag mono">필수요건 · Requirement</span>
          <p className="stat-req__body">{stats.requirement}</p>
        </aside>
      </div>
    </section>
  );
}
