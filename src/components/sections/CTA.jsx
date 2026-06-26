import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap, SplitText, ScrollTrigger, useGSAP, prefersReduced } from '../../lib/gsap';
import { cta } from '../../data/content';
import Magnetic from '../Magnetic';
import './CTA.css';

export default function CTA() {
  const root = useRef(null);

  const { contextSafe } = useGSAP(
    () => {
      const el = root.current;
      const headingEl = el.querySelector('.cta-heading');
      let split;

      // ── continuous aurora drift (independent of scroll, runs unless reduced) ──
      if (!prefersReduced) {
        gsap.to('.cta-aurora--a', {
          xPercent: 18,
          yPercent: -14,
          duration: 17,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });
        gsap.to('.cta-aurora--b', {
          xPercent: -20,
          yPercent: 12,
          duration: 21,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });
        gsap.to('.cta-aurora--c', {
          xPercent: 14,
          yPercent: 18,
          duration: 25,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        });
        // slow rotation on the conic sweep layer
        gsap.to('.cta-sweep', {
          rotate: 360,
          duration: 60,
          ease: 'none',
          repeat: -1,
          transformOrigin: '50% 50%',
        });
        // scroll-driven parallax lift on the whole field
        gsap.to('.cta-field', {
          yPercent: -10,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 },
        });
      }

      const build = () => {
        if (prefersReduced) return;

        const tl = gsap.timeline({
          defaults: { ease: 'power4.out' },
          scrollTrigger: { trigger: el, start: 'top 78%', once: true },
        });

        split = new SplitText(headingEl, {
          type: 'lines',
          linesClass: 'cta-line',
          mask: 'lines',
        });

        tl.from('.cta-kicker', { opacity: 0, y: 18, duration: 0.7, ease: 'power2.out' }, 0)
          .from(
            split.lines,
            { yPercent: 118, opacity: 0, duration: 1, stagger: 0.12 },
            0.15
          )
          .from(
            '.cta-card',
            { opacity: 0, y: 46, duration: 0.9, ease: 'power3.out', stagger: 0.13 },
            0.5
          )
          .from(
            '.cta-card__index',
            { opacity: 0, scale: 0.4, duration: 0.7, ease: 'back.out(2)', stagger: 0.13 },
            0.62
          )
          .from('.cta-note', { opacity: 0, y: 16, duration: 0.7, ease: 'power2.out' }, 0.95);

        ScrollTrigger.refresh();
      };

      if (document.fonts?.ready) document.fonts.ready.then(contextSafe(build));
      else build();

      return () => split?.revert();
    },
    { scope: root }
  );

  return (
    <section className="section cta" id="cta" ref={root}>
      {/* animated aurora finale backdrop */}
      <div className="cta-field" aria-hidden="true">
        <span className="halo cta-aurora cta-aurora--a" />
        <span className="halo cta-aurora cta-aurora--b" />
        <span className="halo cta-aurora cta-aurora--c" />
        <span className="cta-sweep" />
      </div>
      <div className="grid-overlay cta-grid" aria-hidden="true" />

      <div className="container cta__inner">
        <header className="cta__head">
          <span className="kicker cta-kicker">{cta.kicker}</span>
          <h2 className="h-xl cta-heading">{cta.heading}</h2>
        </header>

        <ul className="cta__tracks">
          {cta.tracks.map((track, i) => {
            const isPrimary = Boolean(track.to);
            return (
              <li className="cta-card panel" key={track.who}>
                <span className="cta-card__index mono" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="cta-card__edge" aria-hidden="true" />

                <h3 className="h-md cta-card__who">{track.who}</h3>
                <p className="cta-card__desc">{track.desc}</p>

                <div className="cta-card__action">
                  <Magnetic strength={0.4}>
                    {isPrimary ? (
                      <Link to={track.to} className="btn btn--primary">
                        {track.action}
                        <span aria-hidden="true">→</span>
                      </Link>
                    ) : (
                      <a href={track.href} className="btn btn--ghost">
                        {track.action}
                        <span aria-hidden="true">→</span>
                      </a>
                    )}
                  </Magnetic>
                </div>
              </li>
            );
          })}
        </ul>

        <p className="cta-note">{cta.contactNote}</p>
      </div>
    </section>
  );
}
