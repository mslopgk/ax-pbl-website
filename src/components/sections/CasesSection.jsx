import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap, ScrollTrigger, useGSAP, prefersReduced } from '../../lib/gsap';
import { cases } from '../../data/content';
import Reveal from '../Reveal';
import SectionHeading from '../SectionHeading';
import Magnetic from '../Magnetic';
import './CasesSection.css';

/** Map a Korean status string to a semantic token group. */
function statusKind(status) {
  if (status.includes('완료')) return 'done'; // 개설완료  → accent (positive)
  if (status.includes('예정')) return 'pending'; // …개설예정 → accent-3 (pending)
  return 'active'; // 연구 진행중 → accent-2 (info)
}

const STATUS_LABEL = {
  done: 'COMPLETE',
  pending: 'SCHEDULED',
  active: 'IN PROGRESS',
};

export default function CasesSection() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (prefersReduced) return; // content is fully visible/usable without motion

      const el = root.current;
      const track = el.querySelector('.cases-track');
      const viewport = el.querySelector('.cases-viewport');
      const pinWrap = el.querySelector('.cases-pinwrap');
      const fill = el.querySelector('.cases-rail__fill');
      const markers = gsap.utils.toArray(el.querySelectorAll('.cases-marker'));
      const panels = gsap.utils.toArray(el.querySelectorAll('.cases-cohort, .cases-final'));

      // matchMedia → only ONE behavior active at a time.
      const mm = gsap.matchMedia();

      // ── DESKTOP / TABLET (≥860px): pinned horizontal scrub ──────────────────
      mm.add('(min-width: 860px)', () => {
        // distance the track must travel = its overflow past the viewport.
        const getDistance = () => track.scrollWidth - viewport.clientWidth;

        const horizontal = gsap.to(track, {
          x: () => -getDistance(),
          ease: 'none',
          scrollTrigger: {
            trigger: pinWrap,
            start: 'top top',
            // pin length scales with horizontal distance for a natural feel
            end: () => '+=' + (getDistance() + viewport.clientHeight * 0.6),
            pin: true,
            scrub: 1,
            anticipatePin: 1,
            invalidateOnRefresh: true, // recompute distance on resize/refresh
          },
        });

        // progress rail fill + active marker, driven by the same scrub
        ScrollTrigger.create({
          trigger: pinWrap,
          start: 'top top',
          end: () => '+=' + (getDistance() + viewport.clientHeight * 0.6),
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const p = self.progress;
            gsap.set(fill, { scaleX: p });
            // segments: 4 cohorts + 1 final = 5 stops
            const idx = Math.min(markers.length - 1, Math.round(p * markers.length));
            markers.forEach((m, i) => m.classList.toggle('is-active', i <= idx && i < markers.length));
          },
        });

        // depth: cards rise/settle as their panel enters the viewport horizontally
        panels.forEach((panel) => {
          const cards = panel.querySelectorAll('[data-cardrise]');
          if (!cards.length) return;
          gsap.from(cards, {
            y: 44,
            opacity: 0,
            duration: 0.9,
            ease: 'power3.out',
            stagger: 0.1,
            scrollTrigger: {
              trigger: panel,
              containerAnimation: horizontal,
              start: 'left 78%',
              once: true,
            },
          });
        });

        return () => {
          // matchMedia revert cleans the timeline + triggers automatically
        };
      });

      // ── MOBILE (<860px): no pin, vertical stack with reveals ────────────────
      mm.add('(max-width: 859px)', () => {
        gsap.set(track, { clearProps: 'transform' });
        const groups = gsap.utils.toArray(el.querySelectorAll('.cases-cohort, .cases-final'));
        groups.forEach((g) => {
          gsap.from(g.querySelectorAll('[data-cardrise]'), {
            y: 36,
            opacity: 0,
            duration: 0.8,
            ease: 'power3.out',
            stagger: 0.09,
            scrollTrigger: { trigger: g, start: 'top 84%', once: true },
          });
        });
      });

      // ensure layout measured after fonts settle (track width is font-dependent)
      if (document.fonts?.ready) {
        document.fonts.ready.then(() => ScrollTrigger.refresh());
      }

      return () => mm.revert();
    },
    { scope: root }
  );

  const totalCases = cases.cohorts.reduce((n, c) => n + c.items.length, 0);

  return (
    <section className="cases section" id="cases" ref={root}>
      <span className="halo cases-halo cases-halo--1" aria-hidden="true" />
      <span className="halo cases-halo cases-halo--2" aria-hidden="true" />
      <div className="grid-overlay" aria-hidden="true" />

      <div className="container cases-head">
        <SectionHeading
          kicker={cases.kicker}
          heading={cases.heading}
          sub={cases.sub}
          align="left"
        />
        <Reveal as="div" className="cases-head__meta" y={18} delay={0.1}>
          <span className="cases-head__count mono">
            <span className="cases-head__num gradient-text">{String(totalCases).padStart(2, '0')}</span>
            <span className="text-mute">RUNNING PROJECTS</span>
          </span>
        </Reveal>
      </div>

      {/* ── pinned horizontal stage ─────────────────────────────────────────── */}
      <div className="cases-pinwrap">
        <div className="cases-viewport">
          <div className="cases-track">
            {cases.cohorts.map((cohort, ci) => (
              <article className="cases-cohort" key={cohort.gen} aria-label={`${cohort.gen} 운영 사례`}>
                <span className="cases-cohort__ghost display" aria-hidden="true">
                  {ci + 1}
                </span>

                <header className="cases-cohort__head">
                  <span className="cases-cohort__index mono">
                    {String(ci + 1).padStart(2, '0')} / {String(cases.cohorts.length).padStart(2, '0')}
                  </span>
                  <h3 className="cases-cohort__gen h-md">
                    {cohort.gen}
                    <span className="cases-cohort__gen-en mono">COHORT</span>
                  </h3>
                </header>

                <div className="cases-cohort__cards">
                  {cohort.items.map((item) => {
                    const kind = statusKind(item.status);
                    return (
                      <div
                        className="panel cases-card"
                        data-cardrise
                        data-status={kind}
                        key={item.title}
                      >
                        <span className="cases-card__edge" aria-hidden="true" />
                        <div className="cases-card__top">
                          <span className="cases-card__badge" data-status={kind}>
                            <span className="cases-card__dot" aria-hidden="true" />
                            <span className="cases-card__badge-en mono">{STATUS_LABEL[kind]}</span>
                            <span className="cases-card__badge-ko">{item.status}</span>
                          </span>
                        </div>
                        <h4 className="cases-card__title h-md">{item.title}</h4>
                        <div className="cases-card__foot">
                          <span className="chip cases-card__dept">{item.dept}</span>
                          {item.partner && (
                            <p className="cases-card__partner mono text-dim">
                              <span className="cases-card__partner-tag" aria-hidden="true">↳</span>
                              {item.partner}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </article>
            ))}

            {/* final gateway panel */}
            <article className="cases-final" aria-label="전체 사례 보기">
              <span className="cases-final__ring" aria-hidden="true" />
              <p className="cases-final__kicker kicker">All Cohorts</p>
              <h3 className="cases-final__title h-lg">
                1기부터 4기까지,
                <br />
                <span className="gradient-text">현장에서 검증된 과제</span>
              </h3>
              <p className="cases-final__sub lead">
                {totalCases}개 과제의 운영 배경, 산학 파트너, 성과를 사례집에서 확인하세요.
              </p>
              <Magnetic strength={0.4}>
                <Link to="/cases" className="btn btn--primary cases-final__cta">
                  전체 사례 자세히 보기
                  <span aria-hidden="true">→</span>
                </Link>
              </Magnetic>
            </article>
          </div>
        </div>

        {/* cohort progress rail (desktop only) */}
        <div className="cases-rail" aria-hidden="true">
          <div className="cases-rail__line">
            <span className="cases-rail__fill" />
          </div>
          <ol className="cases-rail__marks">
            {cases.cohorts.map((c) => (
              <li className="cases-marker" key={c.gen}>
                <span className="cases-marker__node" />
                <span className="cases-marker__label mono">{c.gen}</span>
              </li>
            ))}
            <li className="cases-marker cases-marker--end">
              <span className="cases-marker__node" />
              <span className="cases-marker__label mono">ALL</span>
            </li>
          </ol>
        </div>
      </div>
    </section>
  );
}
