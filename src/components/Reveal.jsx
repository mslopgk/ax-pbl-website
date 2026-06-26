import { useRef } from 'react';
import { gsap, useGSAP, prefersReduced } from '../lib/gsap';

/**
 * Scroll-triggered reveal.
 *  - default: animates the element itself in (fade + rise).
 *  - stagger (number): animates direct descendants marked [data-reveal] in sequence.
 *
 * Props: as, y, x, delay, duration, stagger, start, scale, blur, className, ...rest
 */
export default function Reveal({
  as: Tag = 'div',
  children,
  y = 34,
  x = 0,
  delay = 0,
  duration = 0.95,
  stagger,
  start = 'top 84%',
  scale,
  className = '',
  style,
  ...rest
}) {
  const ref = useRef(null);

  useGSAP(
    () => {
      if (prefersReduced) return;
      const el = ref.current;
      const targets = stagger != null ? el.querySelectorAll('[data-reveal]') : [el];
      if (!targets.length) return;

      gsap.from(targets, {
        opacity: 0,
        y,
        x,
        scale: scale ?? 1,
        duration,
        delay,
        ease: 'power3.out',
        stagger: stagger ?? 0,
        scrollTrigger: { trigger: el, start, once: true },
      });
    },
    { scope: ref }
  );

  return (
    <Tag ref={ref} className={className} style={style} {...rest}>
      {children}
    </Tag>
  );
}
