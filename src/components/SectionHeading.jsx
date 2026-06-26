import { useRef } from 'react';
import { gsap, SplitText, useGSAP, prefersReduced } from '../lib/gsap';
import './SectionHeading.css';

/**
 * Standard section header: mono kicker + display heading (line-mask reveal) + optional sub.
 * Props: kicker, heading (supports \n line breaks), sub, align ('left'|'center'), as (h2/h3), id
 */
export default function SectionHeading({
  kicker,
  heading,
  sub,
  align = 'left',
  as: Heading = 'h2',
  className = '',
}) {
  const ref = useRef(null);

  const { contextSafe } = useGSAP(
    () => {
      if (prefersReduced) return;
      const el = ref.current;
      const headingEl = el.querySelector('[data-split]');
      let split;

      const run = () => {
        split = new SplitText(headingEl, {
          type: 'lines',
          linesClass: 'sh-line',
          mask: 'lines',
        });
        gsap.from(split.lines, {
          yPercent: 115,
          opacity: 0,
          duration: 1,
          ease: 'power4.out',
          stagger: 0.1,
          scrollTrigger: { trigger: el, start: 'top 82%', once: true },
        });
      };

      // wait for webfonts so line splitting measures correctly
      if (document.fonts?.ready) {
        document.fonts.ready.then(contextSafe(run));
      } else {
        run();
      }

      const others = el.querySelectorAll('[data-reveal]');
      if (others.length) {
        gsap.from(others, {
          opacity: 0,
          y: 18,
          duration: 0.8,
          ease: 'power2.out',
          stagger: 0.08,
          scrollTrigger: { trigger: el, start: 'top 80%', once: true },
        });
      }

      return () => split?.revert();
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={`section-head sh sh--${align} ${className}`}>
      {kicker && (
        <span className="kicker" data-reveal>
          {kicker}
        </span>
      )}
      <Heading className="h-lg" data-split>
        {heading}
      </Heading>
      {sub && (
        <p className="lead sh-sub" data-reveal>
          {sub}
        </p>
      )}
    </div>
  );
}
