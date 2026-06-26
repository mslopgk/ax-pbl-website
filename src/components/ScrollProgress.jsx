import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP } from '../lib/gsap';
import './ScrollProgress.css';

export default function ScrollProgress() {
  const ref = useRef(null);

  useGSAP(() => {
    gsap.set(ref.current, { scaleX: 0, transformOrigin: 'left center' });
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        gsap.to(ref.current, { scaleX: self.progress, duration: 0.2, ease: 'none', overwrite: true });
      },
    });
    return () => st.kill();
  });

  return (
    <div className="scroll-progress" aria-hidden="true">
      <div className="scroll-progress__bar" ref={ref} />
    </div>
  );
}
