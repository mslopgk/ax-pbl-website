import { useRef, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { gsap, ScrollTrigger, useGSAP, prefersReduced } from '../lib/gsap';
import { courses, domains, summary, majorRequirements } from '../data/courses';
import { site } from '../data/content';
import Reveal from '../components/Reveal';
import SectionHeading from '../components/SectionHeading';
import './Curriculum.css';

const norm = (s) => (s ?? '').toString().toLowerCase();

export default function Curriculum() {
  const root = useRef(null);
  const gridRef = useRef(null);
  const [activeDomain, setActiveDomain] = useState('전체');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = norm(query.trim());
    return courses.filter((c) => {
      const inDomain = activeDomain === '전체' || c.domain === activeDomain;
      if (!inDomain) return false;
      if (!q) return true;
      const hay = [c.name, c.nameEn, c.dept, c.college, c.id, c.method, c.pblType]
        .map(norm)
        .join(' ');
      return hay.includes(q);
    });
  }, [activeDomain, query]);

  // per-domain counts for the chip badges
  const counts = useMemo(() => {
    const map = { 전체: courses.length };
    for (const c of courses) map[c.domain] = (map[c.domain] || 0) + 1;
    return map;
  }, []);

  // header / toolbar entrance (run once)
  useGSAP(
    () => {
      if (prefersReduced) return;
      gsap.from('.cur-summary__cell', {
        opacity: 0,
        y: 16,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: { trigger: '.cur-summary', start: 'top 88%', once: true },
      });
      gsap.from('.cur-tool', {
        opacity: 0,
        y: 14,
        duration: 0.65,
        ease: 'power3.out',
        stagger: 0.05,
        scrollTrigger: { trigger: '.cur-toolbar', start: 'top 90%', once: true },
      });
    },
    { scope: root }
  );

  // re-animate the visible cards on every filter / search change
  useGSAP(
    () => {
      if (prefersReduced) return;
      const cards = gridRef.current?.querySelectorAll('.cur-card');
      if (!cards?.length) return;
      gsap.from(cards, {
        opacity: 0,
        y: 22,
        scale: 0.97,
        duration: 0.55,
        ease: 'power3.out',
        stagger: { each: 0.04, from: 'start' },
        clearProps: 'opacity,transform',
      });
      ScrollTrigger.refresh();
    },
    { dependencies: [filtered.length, activeDomain, query], scope: root }
  );

  return (
    <div className="cur" ref={root}>
      <span className="halo cur-halo cur-halo--1" aria-hidden="true" />
      <span className="halo cur-halo cur-halo--2" aria-hidden="true" />
      <div className="grid-overlay cur-grid" aria-hidden="true" />

      {/* ── HEADER ─────────────────────────────────────────────────── */}
      <header className="cur-header">
        <div className="container">
          <Reveal as="nav" className="cur-crumb" y={12} aria-label="breadcrumb">
            <Link to="/" className="cur-crumb__link mono">
              <span aria-hidden="true">←</span> {site.brand}
            </Link>
            <span className="cur-crumb__sep mono" aria-hidden="true">/</span>
            <span className="cur-crumb__here mono">Curriculum</span>
          </Reveal>

          <SectionHeading
            as="h1"
            kicker="Curriculum"
            heading={'PBL 교과목\n카탈로그'}
            sub="2025 부산대학교 교육과정 전체에서 PBL(문제중심학습)이 명시된 교과목과 전공 요건을 한곳에 모았습니다. 도메인으로 좁히고 키워드로 찾아보세요."
          />

          {/* summary strip */}
          <div className="cur-summary panel" role="group" aria-label="추출 개요">
            <div className="cur-summary__cell">
              <span className="cur-summary__label mono">SOURCE</span>
              <span className="cur-summary__value">{summary.source}</span>
            </div>
            <span className="cur-summary__div" aria-hidden="true" />
            <div className="cur-summary__cell">
              <span className="cur-summary__label mono">SCOPE</span>
              <span className="cur-summary__value">{summary.scope}</span>
            </div>
            <span className="cur-summary__div" aria-hidden="true" />
            <div className="cur-summary__cell">
              <span className="cur-summary__label mono">RESULT</span>
              <span className="cur-summary__value cur-summary__value--accent">PBL 명시 {courses.length}건</span>
            </div>
          </div>
        </div>
      </header>

      {/* ── TOOLBAR ────────────────────────────────────────────────── */}
      <div className="cur-toolbar">
        <div className="container cur-toolbar__inner">
          <div className="cur-filters cur-tool" role="group" aria-label="도메인 필터">
            {domains.map((d) => {
              const active = d === activeDomain;
              return (
                <button
                  key={d}
                  type="button"
                  className={`cur-chip${active ? ' is-active' : ''}`}
                  aria-pressed={active}
                  onClick={() => setActiveDomain(d)}
                >
                  <span className="cur-chip__label">{d}</span>
                  <span className="cur-chip__count mono">{counts[d] ?? 0}</span>
                </button>
              );
            })}
          </div>

          <div className="cur-search cur-tool">
            <svg className="cur-search__icon" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="11" cy="11" r="7" />
              <line x1="16.5" y1="16.5" x2="21" y2="21" />
            </svg>
            <input
              type="search"
              className="cur-search__input"
              placeholder="교과목·전공·코드·방식 검색"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="교과목 검색"
            />
            {query && (
              <button
                type="button"
                className="cur-search__clear"
                onClick={() => setQuery('')}
                aria-label="검색어 지우기"
              >
                ×
              </button>
            )}
          </div>
        </div>

        <div className="container cur-resultbar">
          <p className="cur-result mono" aria-live="polite">
            <span className="cur-result__num">{filtered.length}</span>
            <span className="cur-result__total">/ {courses.length}</span>
            <span className="cur-result__txt"> 건 표시</span>
            {activeDomain !== '전체' && (
              <span className="cur-result__ctx"> · {activeDomain}</span>
            )}
            {query && <span className="cur-result__ctx"> · “{query}”</span>}
          </p>
          {(activeDomain !== '전체' || query) && (
            <button
              type="button"
              className="cur-reset mono"
              onClick={() => {
                setActiveDomain('전체');
                setQuery('');
              }}
            >
              필터 초기화 ×
            </button>
          )}
        </div>
      </div>

      {/* ── GRID ───────────────────────────────────────────────────── */}
      <section className="section section--tight cur-catalog" aria-label="교과목 목록">
        <div className="container">
          {filtered.length === 0 ? (
            <div className="cur-empty panel">
              <span className="cur-empty__mark mono" aria-hidden="true">∅</span>
              <p className="cur-empty__title h-md">일치하는 교과목이 없습니다</p>
              <p className="cur-empty__sub text-dim">
                다른 키워드를 입력하거나 도메인 필터를 넓혀 보세요.
              </p>
              <button
                type="button"
                className="btn btn--ghost"
                onClick={() => {
                  setActiveDomain('전체');
                  setQuery('');
                }}
              >
                전체 보기
              </button>
            </div>
          ) : (
            <ul className="cur-grid-list" ref={gridRef}>
              {filtered.map((c) => (
                <li className="cur-card panel" key={c.id}>
                  <div className="cur-card__top">
                    <span className="cur-card__id mono">{c.id}</span>
                    <span
                      className={`cur-card__extract mono${
                        c.target === '전공 운영목표' ? ' is-goal' : ''
                      }`}
                    >
                      {c.extract}
                    </span>
                  </div>

                  <h3 className="cur-card__name">{c.name}</h3>
                  <p className="cur-card__en mono text-dim">{c.nameEn}</p>

                  <div className="cur-card__tags">
                    <span className="chip cur-card__tag">{c.college}</span>
                    <span className="chip cur-card__tag">{c.dept}</span>
                  </div>

                  <span className="cur-card__pbl">
                    <span className="cur-card__dot" aria-hidden="true" />
                    {c.pblType}
                  </span>

                  <p className="cur-card__method text-dim">{c.method}</p>

                  <div className="cur-card__outputs" aria-label="산출물">
                    {c.outputs.map((o, i) => (
                      <span className="cur-card__out mono" key={i}>
                        {o}
                      </span>
                    ))}
                  </div>

                  <footer className="cur-card__foot">
                    <span className="cur-card__src mono text-mute">{c.source}</span>
                    {c.credits && (
                      <span className="cur-card__credits mono text-mute">{c.credits}</span>
                    )}
                  </footer>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* ── MAJOR REQUIREMENTS ─────────────────────────────────────── */}
      <section className="section section--tight cur-req" aria-label="전공 필수요건">
        <div className="container">
          <SectionHeading
            kicker="Requirements"
            heading="전공 필수요건"
            sub="개별 교과목과 별도로, 전공 차원에서 PBL 이수가 명시·권고된 요건과 운영목표입니다."
          />

          <Reveal as="ol" className="cur-req-list" stagger={0.1} y={26}>
            {majorRequirements.map((r, i) => (
              <li className="cur-req-card panel" data-reveal key={r.major + i}>
                <span className="cur-req-card__no mono" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="cur-req-card__body">
                  <div className="cur-req-card__head">
                    <h3 className="cur-req-card__major">{r.major}</h3>
                    <span
                      className={`cur-req-card__kind mono${
                        r.kind === '필수요건' ? ' is-must' : ''
                      }`}
                    >
                      {r.kind}
                    </span>
                  </div>
                  <p className="cur-req-card__text">{r.body}</p>
                  <span className="cur-req-card__src mono text-mute">{r.source}</span>
                </div>
              </li>
            ))}
          </Reveal>

          <Reveal className="cur-foot-note" y={18}>
            <p className="text-mute mono cur-note">{summary.followUp}</p>
            <Link to="/" className="btn btn--ghost cur-back">
              <span aria-hidden="true">←</span> 홈으로 돌아가기
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
