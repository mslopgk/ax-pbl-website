import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap, ScrollTrigger, useGSAP, prefersReduced } from '../lib/gsap';
import { cases } from '../data/content';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';
import './Cases.css';

// Status → semantic token mapping (identical logic to the home CasesSection):
//   개설완료 = accent · 26년 2학기 개설예정 = accent-3 · 연구 진행중 = accent-2
function statusKind(status) {
  if (status.includes('완료')) return 'done';
  if (status.includes('예정')) return 'planned';
  return 'active'; // 진행중
}

const LEGEND = [
  { kind: 'done', label: '개설완료', note: 'Launched' },
  { kind: 'planned', label: '26년 2학기 개설예정', note: 'Planned · 2026-2' },
  { kind: 'active', label: '연구 진행중', note: 'In Research' },
];

export default function Cases() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (prefersReduced) return;
      const el = root.current;

      // ── Signature: vertical timeline spine fills as the page scrolls ──────
      const line = el.querySelector('.cases-spine__fill');
      if (line) {
        gsap.set(line, { scaleY: 0, transformOrigin: 'top center' });
        gsap.to(line, {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: el.querySelector('.cases-timeline'),
            start: 'top 60%',
            end: 'bottom 78%',
            scrub: 0.6,
          },
        });
      }

      // ── Per-cohort: node pops + cards rise in a staggered sweep ───────────
      const cohorts = gsap.utils.toArray(el.querySelectorAll('.cases-cohort'));
      cohorts.forEach((cohort) => {
        const node = cohort.querySelector('.cases-cohort__node');
        const label = cohort.querySelector('.cases-cohort__label');
        const cards = cohort.querySelectorAll('.cases-card');

        const tl = gsap.timeline({
          scrollTrigger: { trigger: cohort, start: 'top 78%', once: true },
        });

        tl.from(node, {
          scale: 0,
          opacity: 0,
          duration: 0.7,
          ease: 'back.out(2)',
        })
          .from(
            label,
            { xPercent: -8, opacity: 0, duration: 0.6, ease: 'power3.out' },
            '<0.1'
          )
          .from(
            cards,
            {
              y: 40,
              opacity: 0,
              duration: 0.8,
              ease: 'power3.out',
              stagger: 0.1,
            },
            '<0.05'
          );
      });

      // ── Active (진행중) status dots get a soft living pulse ────────────────
      gsap.to(el.querySelectorAll('.cases-card--active .cases-badge__dot'), {
        scale: 1.35,
        opacity: 0.55,
        duration: 1.1,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.18, from: 'random' },
      });

      ScrollTrigger.refresh();
    },
    { scope: root }
  );

  // total project count for the header readout
  const totalCases = cases.cohorts.reduce((n, c) => n + c.items.length, 0);

  return (
    <div className="casepage" ref={root}>
      <div className="grid-overlay" aria-hidden="true" />
      <span className="halo casepage__halo casepage__halo--1" aria-hidden="true" />
      <span className="halo casepage__halo casepage__halo--2" aria-hidden="true" />

      {/* ── Page header ─────────────────────────────────────────────────── */}
      <header className="casepage__head">
        <div className="container">
          <SectionHeading
            as="h1"
            kicker={cases.kicker}
            heading={cases.heading}
            sub={cases.sub}
            align="left"
          />

          <Reveal className="casepage__head-meta" y={20} delay={0.1} stagger={0.08}>
            <span className="casepage__count" data-reveal>
              <span className="casepage__count-num mono">{totalCases}</span>
              <span className="casepage__count-cap mono">운영 과제 · Cases</span>
            </span>
            <span className="casepage__count" data-reveal>
              <span className="casepage__count-num mono">{cases.cohorts.length}</span>
              <span className="casepage__count-cap mono">기수 · Cohorts</span>
            </span>
          </Reveal>

          {/* ── Status legend ───────────────────────────────────────────── */}
          <Reveal
            as="ul"
            className="cases-legend"
            y={20}
            delay={0.15}
            stagger={0.09}
            aria-label="운영 상태 범례"
          >
            {LEGEND.map((s) => (
              <li
                className={`cases-legend__item cases-legend__item--${s.kind}`}
                key={s.kind}
                data-reveal
              >
                <span className="cases-legend__dot" aria-hidden="true" />
                <span className="cases-legend__label">{s.label}</span>
                <span className="cases-legend__note mono">{s.note}</span>
              </li>
            ))}
          </Reveal>
        </div>
      </header>

      {/* ── Timeline of cohorts ─────────────────────────────────────────── */}
      <div className="container">
        <div className="cases-timeline">
          <span className="cases-spine" aria-hidden="true">
            <span className="cases-spine__track" />
            <span className="cases-spine__fill" />
          </span>

          {cases.cohorts.map((cohort, ci) => (
            <section
              className="cases-cohort"
              key={cohort.gen}
              aria-label={`${cohort.gen} 운영 사례`}
            >
              <span className="cases-cohort__node" aria-hidden="true">
                <span className="cases-cohort__node-core" />
              </span>

              <div className="cases-cohort__head">
                <h2 className="cases-cohort__label mono">
                  <span className="cases-cohort__gen">{cohort.gen}</span>
                  <span className="cases-cohort__seq" aria-hidden="true">
                    {String(ci + 1).padStart(2, '0')} / {String(cases.cohorts.length).padStart(2, '0')}
                  </span>
                </h2>
                <span className="cases-cohort__rule" aria-hidden="true" />
              </div>

              <ul className="cases-grid">
                {cohort.items.map((item) => {
                  const kind = statusKind(item.status);
                  return (
                    <li
                      className={`cases-card panel cases-card--${kind}`}
                      key={item.title}
                    >
                      <span className="cases-card__edge" aria-hidden="true" />

                      <div className="cases-card__top">
                        <span className={`cases-badge cases-badge--${kind}`}>
                          <span className="cases-badge__dot" aria-hidden="true" />
                          {item.status}
                        </span>
                        <span className="chip cases-card__dept">{item.dept}</span>
                      </div>

                      <h3 className="cases-card__title h-md">{item.title}</h3>

                      <div className="cases-card__partner">
                        <span className="cases-card__partner-cap mono">파트너 · Partner</span>
                        <span className="cases-card__partner-name">{item.partner}</span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      </div>

      {/* ── CTA ─────────────────────────────────────────────────────────── */}
      <Reveal className="cases-cta" y={36} start="top 86%">
        <div className="container">
          <div className="cases-cta__panel panel">
            <span className="halo cases-cta__halo" aria-hidden="true" />
            <p className="kicker">Next</p>
            <h2 className="cases-cta__title h-lg">
              현장 과제를 <span className="gradient-text">교과목</span>으로
            </h2>
            <p className="cases-cta__sub lead">
              3LAYER-BPF 운영 사례는 부산대 AX-PBL 교과목 카탈로그와 직접 연결됩니다.
              전공별 과목 구조를 확인해 보세요.
            </p>
            <div className="cases-cta__actions">
              <Link to="/curriculum" className="btn btn--primary">
                교과목 카탈로그 보기
                <span aria-hidden="true">→</span>
              </Link>
              <Link to="/" className="btn btn--ghost">
                홈으로 돌아가기
                <span aria-hidden="true">↑</span>
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
