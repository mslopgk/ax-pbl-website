import { useRef, useEffect } from 'react';
import { prefersReduced } from '../lib/gsap';
import './ParticleField.css';

/**
 * Canvas constellation field. Reads --glow / --glow-2 from the active theme so it
 * recolors when the palette switches. Pauses when scrolled offscreen.
 */
export default function ParticleField({ density = 0.00009, className = '', linkDist = 132 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let raf = null;
    let w = 0;
    let h = 0;
    let dpr = 1;
    let particles = [];
    let running = false;

    const readColors = () => {
      const cs = getComputedStyle(document.documentElement);
      return {
        a: cs.getPropertyValue('--glow').trim() || '0,229,255',
        b: cs.getPropertyValue('--glow-2').trim() || '124,92,255',
        strength: parseFloat(cs.getPropertyValue('--halo-strength')) || 1,
      };
    };
    let colors = readColors();

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.max(1, w * dpr);
      canvas.height = Math.max(1, h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(150, Math.round(w * h * density));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.26,
        vy: (Math.random() - 0.5) * 0.26,
        r: Math.random() * 1.7 + 0.4,
        c: Math.random() > 0.5,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const maxD = linkDist;
      const s = colors.strength;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const d = Math.hypot(dx, dy);
          if (d < maxD) {
            ctx.strokeStyle = `rgba(${colors.a},${(1 - d / maxD) * 0.45 * s})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
        ctx.fillStyle = `rgba(${p.c ? colors.a : colors.b},${0.85 * Math.min(1, s + 0.2)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const loop = () => {
      draw();
      if (running) raf = requestAnimationFrame(loop);
    };

    const startLoop = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(loop);
    };
    const stopLoop = () => {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = null;
    };

    resize();
    if (prefersReduced) {
      draw(); // single static frame
    } else {
      startLoop();
    }

    const onResize = () => {
      colors = readColors();
      resize();
    };
    window.addEventListener('resize', onResize);

    const io = new IntersectionObserver(
      ([entry]) => {
        if (prefersReduced) return;
        if (entry.isIntersecting) startLoop();
        else stopLoop();
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    const mo = new MutationObserver(() => {
      colors = readColors();
      if (prefersReduced) draw();
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return () => {
      stopLoop();
      window.removeEventListener('resize', onResize);
      io.disconnect();
      mo.disconnect();
    };
  }, [density, linkDist]);

  return <canvas ref={canvasRef} className={`particle-field ${className}`} aria-hidden="true" />;
}
