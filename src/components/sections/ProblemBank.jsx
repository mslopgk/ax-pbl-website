import { useRef, useState, useLayoutEffect } from 'react';
import { gsap, ScrollTrigger, useGSAP, prefersReduced } from '../../lib/gsap';
import { problemBank } from '../../data/content';
import SectionHeading from '../SectionHeading';
import './ProblemBank.css';

export default function ProblemBank() {
  const root = useRef(null);
  const listRef = useRef(null);
  const indicatorRef = useRef(null);
  const detailRef = useRef(null);
  const itemsRef = useRef(null);
  const btnRefs = useRef([]);

  const moveX = useRef(null);
  const moveY = useRef(null);
  const moveW = useRef(null);
  const moveH = useRef(null);
  const placedOnce = useRef(false);
  const mounted = useRef(false);

  const [active, setActive] = useState(0);
  const cats = problemBank.categories;
  const cat = cats[active];

  // ── place the sliding highlight behind the active button ──────────────────
  const positionIndicator = (animate) => {
    const bar = indicatorRef.current;
    const list = listRef.current;
    const btn = btnRefs.current[active];
    if (!bar || !list || !btn) return;

    const lr = list.getBoundingClientRect();
    const br = btn.getBoundingClientRect();
    const x = br.left - lr.left + list.scrollLeft;
    const y = br.top - lr.top + list.scrollTop;

    if (!animate || prefersReduced || !placedOnce.current) {
      gsap.set(bar, { x, y, width: br.width, height: br.height });
      placedOnce.current = true;
      return;
    }
    moveX.current?.(x);
    moveY.current?.(y);
    moveW.current?.(br.width);
    moveH.current?.(br.height);
  };

  useGSAP(
    () => {
      const bar = indicatorRef.current;
      moveX.current = gsap.quickTo(bar, 'x', { duration: 0.5, ease: 'power3.out' });
      moveY.current = gsap.quickTo(bar, 'y', { duration: 0.5, ease: 'power3.out' });
      moveW.current = gsap.quickTo(bar, 'width', { duration: 0.5, ease: 'power3.out' });
      moveH.current = gsap.quickTo(bar, 'height', { duration: 0.5, ease: 'power3.out' });

      positionIndicator(false);

      // entrance — list buttons stagger, panel rises
      if (!prefersReduced) {
        gsap.from(listRef.current.querySelectorAll('.pbank__cat'), {
          opacity: 0,
          x: -26,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: { trigger: root.current, start: 'top 78%', once: true },
          onComplete: () => positionIndicator(false),
        });
        gsap.from(detailRef.current, {
          opacity: 0,
          y: 34,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: detailRef.current, start: 'top 86%', once: true },
        });
      }

      // re-measure once webfonts settle (tab metrics shift after font swap)
      if (document.fonts?.ready) document.fonts.ready.then(() => positionIndicator(false));

      const onResize = () => {
        positionIndicator(false);
        ScrollTrigger.refresh();
      };
      window.addEventListener('resize', onResize);
      return () => window.removeEventListener('resize', onResize);
    },
    { scope: root }
  );

  // ── on active change: slide indicator + crossfade detail + stagger items ──
  useLayoutEffect(() => {
    positionIndicator(true);
    // skip the very first run (mount) — only animate genuine selections
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (prefersReduced) return;

    const detail = detailRef.current;
    const items = itemsRef.current?.children;
    gsap.fromTo(
      detail,
      { opacity: 0, y: 18 },
      { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
    );
    if (items?.length) {
      gsap.fromTo(
        items,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.06, delay: 0.08 }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  return (
    <section className="section pbank" id="problembank" ref={root}>
      <span className="halo pbank__halo pbank__halo--1" aria-hidden="true" />
      <span className="halo pbank__halo pbank__halo--2" aria-hidden="true" />
      <div className="grid-overlay" aria-hidden="true" />

      <div className="container pbank__inner">
        <SectionHeading
          kicker={problemBank.kicker}
          heading={problemBank.heading}
          sub={problemBank.sub}
        />

        <div className="pbank__note" data-pbank-note>
          <span className="pbank__note-dot" aria-hidden="true" />
          <span className="mono pbank__note-a">부산대 수업</span>
          <span className="pbank__note-link" aria-hidden="true">↔</span>
          <span className="mono pbank__note-b">산업 · 지역 현장</span>
        </div>

        <div className="pbank__explorer">
          {/* ── category selector ── */}
          <div className="pbank__list" ref={listRef} role="tablist" aria-label="문제 카테고리">
            <span className="pbank__indicator" ref={indicatorRef} aria-hidden="true" />
            {cats.map((c, i) => (
              <button
                key={c.id}
                ref={(el) => (btnRefs.current[i] = el)}
                type="button"
                role="tab"
                id={`pbank-tab-${c.id}`}
                aria-selected={i === active}
                aria-controls="pbank-panel"
                className={`pbank__cat ${i === active ? 'is-active' : ''}`}
                onClick={() => setActive(i)}
              >
                <span className="pbank__cat-num mono">{c.id}</span>
                <span className="pbank__cat-text">
                  <span className="pbank__cat-name">{c.name}</span>
                  <span className="pbank__cat-en mono">{c.en}</span>
                </span>
                <span className="pbank__cat-arrow" aria-hidden="true">→</span>
              </button>
            ))}
          </div>

          {/* ── detail panel ── */}
          <div
            className="panel pbank__detail"
            id="pbank-panel"
            role="tabpanel"
            aria-labelledby={`pbank-tab-${cat.id}`}
            ref={detailRef}
          >
            <div className="pbank__detail-head">
              <span className="pbank__index display" aria-hidden="true">
                {cat.id}
              </span>
              <div className="pbank__detail-titles">
                <span className="pbank__detail-en mono">{cat.en}</span>
                <h3 className="h-md pbank__detail-name">{cat.name}</h3>
              </div>
            </div>

            <p className="pbank__detail-label mono">등록 문제 유형</p>
            <ul className="pbank__items" ref={itemsRef}>
              {cat.items.map((item) => (
                <li className="pbank__item" key={item}>
                  <span className="pbank__item-mark" aria-hidden="true" />
                  <span className="pbank__item-text">{item}</span>
                </li>
              ))}
            </ul>

            <div className="pbank__detail-foot">
              <span className="chip pbank__count">
                {String(cat.items.length).padStart(2, '0')} TYPES
              </span>
              <span className="mono pbank__detail-meta">
                {cat.id} / {String(cats.length).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
