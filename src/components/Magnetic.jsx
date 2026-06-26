import { useRef } from 'react';
import { gsap, useGSAP, prefersReduced } from '../lib/gsap';

/** Magnetic hover — child drifts toward the cursor and springs back. */
export default function Magnetic({ children, strength = 0.4, className = '' }) {
  const ref = useRef(null);
  const xTo = useRef(null);
  const yTo = useRef(null);

  useGSAP(
    () => {
      const el = ref.current;
      xTo.current = gsap.quickTo(el, 'x', { duration: 0.55, ease: 'power3.out' });
      yTo.current = gsap.quickTo(el, 'y', { duration: 0.55, ease: 'power3.out' });
    },
    { scope: ref }
  );

  const onMove = (e) => {
    if (prefersReduced) return;
    const r = ref.current.getBoundingClientRect();
    const mx = e.clientX - (r.left + r.width / 2);
    const my = e.clientY - (r.top + r.height / 2);
    xTo.current?.(mx * strength);
    yTo.current?.(my * strength);
  };
  const onLeave = () => {
    xTo.current?.(0);
    yTo.current?.(0);
  };

  return (
    <span
      ref={ref}
      className={`magnetic ${className}`}
      style={{ display: 'inline-flex', willChange: 'transform' }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      {children}
    </span>
  );
}
