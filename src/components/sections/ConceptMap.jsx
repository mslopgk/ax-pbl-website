import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP, prefersReduced } from '../../lib/gsap';
import { conceptMap } from '../../data/content';
import SectionHeading from '../SectionHeading';
import './ConceptMap.css';

const flowOrder = ['student', 'core', 'lab', 'demand'];

/** Connector between two flow nodes — draws in via DrawSVG, renders both
 *  a horizontal and vertical glyph (CSS shows the right one per breakpoint). */
function Connector({ index }) {
  return (
    <div className="cmap-link" role="presentation" data-link={index}>
      {/* horizontal arrow (desktop) */}
      <svg
        className="cmap-link-h"
        viewBox="0 0 120 40"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path className="cmap-link-path" d="M2 20 H104" />
        <path className="cmap-link-head" d="M96 11 L116 20 L96 29" />
      </svg>
      {/* vertical arrow (mobile) */}
      <svg
        className="cmap-link-v"
        viewBox="0 0 40 120"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path className="cmap-link-path" d="M20 2 V104" />
        <path className="cmap-link-head" d="M11 96 L20 116 L29 96" />
      </svg>
      <span className="cmap-link-pulse" aria-hidden="true" />
    </div>
  );
}

export default function ConceptMap() {
  const root = useRef(null);

  useGSAP(
    () => {
      if (prefersReduced) return;
      const el = root.current;

      // continuous rotation on the core gear rings (hero ring aesthetic)
      gsap.to(el.querySelector('.cmap-ring--a'), {
        rotate: 360,
        transformOrigin: '50% 50%',
        duration: 30,
        ease: 'none',
        repeat: -1,
      });
      gsap.to(el.querySelector('.cmap-ring--b'), {
        rotate: -360,
        transformOrigin: '50% 50%',
        duration: 44,
        ease: 'none',
        repeat: -1,
      });
      gsap.to(el.querySelector('.cmap-ring-orbit'), {
        rotate: 360,
        transformOrigin: '50% 50%',
        duration: 12,
        ease: 'none',
        repeat: -1,
      });

      // signature entrance: nodes pop in flow order + connectors DrawSVG
      const nodes = gsap.utils.toArray(el.querySelectorAll('.cmap-node'));
      const links = gsap.utils.toArray(el.querySelectorAll('.cmap-link'));
      const paths = el.querySelectorAll('.cmap-link-path, .cmap-link-head');

      gsap.set(paths, { drawSVG: '0%' });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: el.querySelector('.cmap-flow'), start: 'top 78%', once: true },
      });

      nodes.forEach((node, i) => {
        tl.from(
          node,
          { opacity: 0, scale: 0.78, y: 26, duration: 0.62, ease: 'back.out(1.7)' },
          i * 0.26
        );
        if (links[i]) {
          tl.to(
            links[i].querySelectorAll('.cmap-link-path, .cmap-link-head'),
            { drawSVG: '100%', duration: 0.5, ease: 'power2.inOut' },
            i * 0.26 + 0.34
          );
          tl.fromTo(
            links[i].querySelector('.cmap-link-pulse'),
            { opacity: 0 },
            { opacity: 1, duration: 0.3 },
            i * 0.26 + 0.7
          );
        }
      });

      // travelling pulse along each connector once drawn
      links.forEach((link) => {
        const pulse = link.querySelector('.cmap-link-pulse');
        gsap.to(pulse, {
          keyframes: { '--cmap-travel': ['0%', '100%'] },
          duration: 2.4,
          ease: 'power1.inOut',
          repeat: -1,
          repeatDelay: 0.6,
          delay: gsap.utils.random(0, 1.2),
        });
      });

      // fonts + lazy figure shift layout; recompute trigger positions once settled.
      // useGSAP's scope reverts this section's own animations/triggers on cleanup —
      // never kill ScrollTrigger globally (it would destroy sibling sections' reveals).
      if (document.fonts?.ready) {
        document.fonts.ready.then(() => ScrollTrigger.refresh());
      }
    },
    { scope: root }
  );

  const nodeById = Object.fromEntries(conceptMap.nodes.map((n) => [n.id, n]));

  return (
    <section className="section cmap" id="structure" ref={root}>
      <span className="halo cmap-halo cmap-halo--1" aria-hidden="true" />
      <span className="halo cmap-halo cmap-halo--2" aria-hidden="true" />
      <div className="grid-overlay" aria-hidden="true" />

      <div className="container cmap-inner">
        <SectionHeading
          kicker={conceptMap.kicker}
          heading={conceptMap.heading}
          sub={conceptMap.sub}
          align="left"
        />

        {/* ── flow diagram ───────────────────────────────────────────── */}
        <div className="cmap-flow" role="list" aria-label="프로그램 구조 흐름도">
          {flowOrder.map((id, i) => {
            const node = nodeById[id];
            const isCore = id === 'core';
            return (
              <FlowItem key={id} node={node} isCore={isCore} index={i}>
                {i < flowOrder.length - 1 && <Connector index={i} />}
              </FlowItem>
            );
          })}
        </div>

        {/* ── operating principles ───────────────────────────────────── */}
        <div className="cmap-block">
          <div className="cmap-block-head">
            <span className="kicker">운영 원칙</span>
            <h3 className="h-md cmap-block-title">설계를 지탱하는 세 가지 원칙</h3>
          </div>
          <ol className="cmap-principles">
            {conceptMap.principles.map((p, i) => (
              <li className="panel cmap-principle" key={i}>
                <span className="mono cmap-principle-no">{String(i + 1).padStart(2, '0')}</span>
                <p className="cmap-principle-text">{p}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* ── linkage strategy + original diagram ────────────────────── */}
        <div className="cmap-grid">
          <div className="cmap-block cmap-linkwrap">
            <div className="cmap-block-head">
              <span className="kicker">연계 전략</span>
              <h3 className="h-md cmap-block-title">복합체를 작동시키는 연결</h3>
            </div>
            <ul className="cmap-linkages">
              {conceptMap.linkages.map((l, i) => (
                <li className="cmap-linkage" key={i}>
                  <span className="cmap-linkage-mark" aria-hidden="true">
                    <span className="cmap-linkage-dot" />
                  </span>
                  <span className="cmap-linkage-text">{l}</span>
                </li>
              ))}
            </ul>
          </div>

          <figure className="panel cmap-figure">
            <div className="cmap-figure-frame">
              <img
                src={`${import.meta.env.BASE_URL}concept-map.jpg`}
                alt="AX PBL · URP 프로그램 구조 개념도"
                loading="lazy"
                className="cmap-figure-img"
              />
              <span className="cmap-figure-scan" aria-hidden="true" />
            </div>
            <figcaption className="cmap-figure-cap">
              <span className="mono cmap-figure-tag">FIG.01</span>
              <span>원본 개념도</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

/** Single flow node card (+ trailing connector passed as children). */
function FlowItem({ node, isCore, index, children }) {
  return (
    <>
      <div className="cmap-cell" role="listitem">
        <article
          className={`panel cmap-node${isCore ? ' cmap-node--core' : ''}`}
          tabIndex={0}
          data-node={node.id}
          aria-label={`${node.label} ${node.en}`}
        >
          <span className="mono cmap-node-step" aria-hidden="true">
            {String(index + 1).padStart(2, '0')}
          </span>

          {isCore && (
            <span className="cmap-core-ring" aria-hidden="true">
              <svg viewBox="0 0 200 200" className="cmap-rings">
                <circle className="cmap-ring cmap-ring--a" cx="100" cy="100" r="92" />
                <circle className="cmap-ring cmap-ring--b" cx="100" cy="100" r="68" />
                <circle className="cmap-ring-core" cx="100" cy="100" r="46" />
                <g className="cmap-ring-orbit">
                  <circle className="cmap-ring-dot" cx="100" cy="8" r="5" />
                </g>
              </svg>
            </span>
          )}

          <div className="cmap-node-body">
            <h3 className="h-md cmap-node-label">{node.label}</h3>
            <span className="mono cmap-node-en">{node.en}</span>
            <div className="cmap-node-tags">
              {node.tags.map((t) => (
                <span className="chip cmap-node-chip" key={t}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          <p className="cmap-node-note" role="note">
            {node.note}
          </p>
        </article>
      </div>
      {children}
    </>
  );
}
