import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap, SplitText, useGSAP, prefersReduced } from '../../lib/gsap';
import { useSmoothScroll } from '../../context/SmoothScroll';
import ParticleField from '../ParticleField';
import Magnetic from '../Magnetic';
import { hero, site } from '../../data/content';
import './Hero.css';

export default function Hero() {
  const root = useRef(null);
  const { scrollTo } = useSmoothScroll();

  const { contextSafe } = useGSAP(
    () => {
      const el = root.current;
      const titleEl = el.querySelector('.hero__title');
      let split;

      const build = () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

        if (!prefersReduced) {
          split = new SplitText(titleEl, {
            type: 'lines,chars',
            mask: 'lines',
            linesClass: 'hero-line',
          });
          gsap.set(el.querySelectorAll('.hero__reveal'), { opacity: 0, y: 24 });
          tl.from('.hero__eyebrow', { opacity: 0, y: 18, duration: 0.7 }, 0.1)
            .from(
              split.chars,
              { yPercent: 122, opacity: 0, duration: 1, ease: 'power4.out', stagger: 0.016 },
              0.18
            )
            .to('.hero__reveal', { opacity: 1, y: 0, duration: 0.9, stagger: 0.12 }, 0.7)
            .from('.hero__wordmark', { opacity: 0, scale: 1.08, duration: 1.4, ease: 'power2.out' }, 0.1)
            .from('.hero__cue', { opacity: 0, y: -12, duration: 0.6 }, 1.1);
        }

        // continuous orbit ring
        if (!prefersReduced) {
          gsap.to('.hero__ring--a', { rotate: 360, duration: 38, ease: 'none', repeat: -1 });
          gsap.to('.hero__ring--b', { rotate: -360, duration: 52, ease: 'none', repeat: -1 });
          gsap.to('.hero__orb', {
            rotate: 360,
            duration: 14,
            ease: 'none',
            repeat: -1,
            transformOrigin: '50% 50%',
          });
        }

        // scroll parallax + fade out
        if (!prefersReduced) {
          gsap.to('.hero__content', {
            yPercent: -14,
            opacity: 0.18,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
          });
          gsap.to('.hero__wordmark', {
            yPercent: 24,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
          });
          gsap.to('.hero__visual', {
            yPercent: -8,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: 1 },
          });
        }
      };

      if (document.fonts?.ready) document.fonts.ready.then(contextSafe(build));
      else build();

      return () => split?.revert();
    },
    { scope: root }
  );

  return (
    <section className="hero" ref={root} id="top">
      <ParticleField density={0.00011} />
      <div className="hero__grad" aria-hidden="true" />
      <span className="halo hero__halo hero__halo--1" aria-hidden="true" />
      <span className="halo hero__halo hero__halo--2" aria-hidden="true" />
      <div className="grid-overlay" />

      <h2 className="hero__wordmark display" aria-hidden="true">
        {site.brand}
      </h2>

      <div className="container hero__content">
        <p className="hero__eyebrow kicker">{hero.eyebrow}</p>

        <h1 className="hero__title display">
          {hero.title[0]} <br />
          <em>{hero.title[1]}</em> <br />
          {hero.title[2]}
        </h1>

        <p className="hero__lead lead hero__reveal">{hero.lead}</p>

        <div className="hero__ctas hero__reveal">
          <Magnetic strength={0.45}>
            <button type="button" className="btn btn--primary" onClick={() => scrollTo('#concept')}>
              {hero.ctas[0].label}
              <span aria-hidden="true">↓</span>
            </button>
          </Magnetic>
          <Magnetic strength={0.35}>
            <Link to="/curriculum" className="btn btn--ghost">
              {hero.ctas[1].label}
              <span aria-hidden="true">→</span>
            </Link>
          </Magnetic>
        </div>

        <div className="hero__meta hero__reveal">
          <span className="logo-plate logo-plate--circle hero__pnu">
            <img src={`${import.meta.env.BASE_URL}logos/pnu-symbol-color.jpg`} alt="부산대학교 Pusan National University" />
          </span>
          <span className="mono">{site.platform}</span>
          <span className="hero__meta-div" />
          <span className="mono">{site.initiative}</span>
        </div>
      </div>

      {/* orbital visual */}
      <div className="hero__visual" aria-hidden="true">
        <svg viewBox="0 0 460 460" className="hero__rings">
          <circle className="hero__ring hero__ring--a" cx="230" cy="230" r="210" />
          <circle className="hero__ring hero__ring--b" cx="230" cy="230" r="150" />
          <circle className="hero__ring-core" cx="230" cy="230" r="78" />
          <g className="hero__orb">
            <circle cx="230" cy="20" r="7" className="hero__orb-dot" />
          </g>
          <g className="hero__orb hero__orb--2">
            <circle cx="230" cy="80" r="4.5" className="hero__orb-dot hero__orb-dot--2" />
          </g>
        </svg>
        <span className="hero__core-label display">AI</span>
      </div>

      <button
        type="button"
        className="hero__cue"
        onClick={() => scrollTo('#concept')}
        aria-label="아래로 스크롤"
      >
        <span className="mono">SCROLL</span>
        <span className="hero__cue-line" />
      </button>
    </section>
  );
}
