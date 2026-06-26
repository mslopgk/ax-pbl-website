import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP, prefersReduced } from '../../lib/gsap';
import { layerModel } from '../../data/content';
import SectionHeading from '../SectionHeading';
import './LayerModel.css';

export default function LayerModel() {
  const root = useRef(null);

  const { contextSafe } = useGSAP(
    () => {
      const el = root.current;
      const slabs = gsap.utils.toArray('.layer-slab', el);
      if (!slabs.length) return;

      const isMobile = () => window.innerWidth < 860;

      // ── Static end-state used both for reduced-motion and as the resting pose.
      const settle = () => {
        gsap.set(slabs, { opacity: 1, clearProps: 'transform' });
        const flow = el.querySelector('.layer-flow__path');
        const cap = el.querySelector('.layer-flow__cap');
        if (flow) gsap.set(flow, { drawSVG: '100%' });
        if (cap) gsap.set(cap, { opacity: 1 });
      };

      if (prefersReduced) {
        settle();
        return;
      }

      // ── Signature build: layers rise into the stack B → P → F, the upward
      //    flow line draws in sync, and a pulse climbs as each tier locks in.
      const build = () => {
        const flowPath = el.querySelector('.layer-flow__path');
        const flowCap = el.querySelector('.layer-flow__cap');
        const pulse = el.querySelector('.layer-flow__pulse');

        // entrance pose: each slab sits below + behind the resting stack
        gsap.set(slabs, {
          opacity: 0,
          yPercent: 38,
          z: isMobile() ? 0 : -260,
          rotateX: isMobile() ? 0 : 26,
          transformPerspective: 1100,
        });
        if (flowPath) gsap.set(flowPath, { drawSVG: '0%' });
        if (flowCap) gsap.set(flowCap, { opacity: 0 });
        if (pulse) gsap.set(pulse, { opacity: 0 });

        const tl = gsap.timeline({
          defaults: { ease: 'power3.out' },
          scrollTrigger: {
            trigger: el.querySelector('.layer-rig'),
            start: 'top 78%',
            once: true,
          },
        });

        // DOM order is F, P, B (top → bottom). Reveal bottom → top, i.e.
        // B first, then P, then F — so the stack builds upward as required.
        const lastIdx = slabs.length - 1;
        slabs.forEach((slab, i) => {
          const seq = lastIdx - i; // B = 0, P = 1, F = 2
          const at = seq * 0.42;
          tl.to(
            slab,
            {
              opacity: 1,
              yPercent: 0,
              z: isMobile() ? 0 : -i * 26,
              rotateX: isMobile() ? 0 : 13,
              duration: 1.05,
              ease: 'power4.out',
            },
            at
          );
          // each slab snaps with a brief glow flash on its rail dot
          const dot = slab.querySelector('.layer-slab__dot');
          if (dot) {
            tl.fromTo(
              dot,
              { scale: 0.4, opacity: 0 },
              { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(2.4)' },
              at + 0.45
            );
          }
        });

        // draw the upward flow line across the whole assembly
        if (flowPath) {
          tl.to(
            flowPath,
            { drawSVG: '100%', duration: slabs.length * 0.42 + 0.5, ease: 'none' },
            0.1
          );
        }
        if (flowCap) {
          tl.to(flowCap, { opacity: 1, duration: 0.4 }, '>-0.3');
        }

        // a light pulse continuously rising up the rail once assembled.
        // Created paused + gated by a ScrollTrigger so it never runs offscreen,
        // and lives inside the contextSafe build so it is reverted on unmount.
        if (pulse) {
          const loop = gsap.timeline({ repeat: -1, repeatDelay: 0.7, paused: true });
          loop
            .set(pulse, { attr: { cy: 100 }, opacity: 0 })
            .to(pulse, { opacity: 1, duration: 0.5, ease: 'none' }, 0)
            .to(pulse, { attr: { cy: 2 }, duration: 2.6, ease: 'power1.in' }, 0)
            .to(pulse, { opacity: 0, duration: 0.5, ease: 'none' }, 2.1);

          ScrollTrigger.create({
            trigger: el.querySelector('.layer-rig'),
            start: 'top bottom',
            end: 'bottom top',
            onToggle: (self) => (self.isActive ? loop.play() : loop.pause()),
          });
        }
      };

      // ── Continuous + scrubbed depth so the stack feels physical.
      const ambient = () => {
        if (isMobile()) return;
        // gentle scrubbed counter-parallax: slabs drift apart slightly on scroll
        slabs.forEach((slab, i) => {
          gsap.to(slab, {
            yPercent: (slabs.length - 1 - i) * -3.4,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          });
        });
        // the whole rig tilts a hair as it passes through view
        gsap.fromTo(
          el.querySelector('.layer-stack'),
          { '--rig-tilt': '4deg' },
          {
            '--rig-tilt': '-3deg',
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.2,
            },
          }
        );
      };

      if (document.fonts?.ready) document.fonts.ready.then(contextSafe(() => { build(); ambient(); }));
      else { build(); ambient(); }
    },
    { scope: root }
  );

  const total = layerModel.layers.length;

  return (
    <section className="layer section" id="layers" ref={root}>
      <span className="halo layer__halo layer__halo--1" aria-hidden="true" />
      <span className="halo layer__halo layer__halo--2" aria-hidden="true" />
      <div className="grid-overlay layer__grid" aria-hidden="true" />

      <div className="container layer__inner">
        <SectionHeading
          kicker={layerModel.kicker}
          heading={layerModel.heading}
          sub={layerModel.sub}
          align="left"
        />

        <div className="layer-rig">
          {/* upward flow rail connecting the three tiers */}
          <svg
            className="layer-flow"
            viewBox="0 0 24 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="layerFlowGrad" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="rgba(var(--glow), 0.15)" />
                <stop offset="55%" stopColor="rgba(var(--glow), 0.9)" />
                <stop offset="100%" stopColor="rgba(var(--glow-2), 1)" />
              </linearGradient>
            </defs>
            {/* faint full-height track */}
            <line
              className="layer-flow__track"
              x1="12"
              y1="100"
              x2="12"
              y2="0"
            />
            {/* animated drawn line (bottom → top) */}
            <line
              className="layer-flow__path"
              x1="12"
              y1="100"
              x2="12"
              y2="2"
            />
            {/* rising pulse */}
            <circle className="layer-flow__pulse" cx="12" cy="50" r="2.4" />
            {/* arrow cap at the top */}
            <path
              className="layer-flow__cap"
              d="M12 -1 L6.5 9 L12 5.4 L17.5 9 Z"
            />
          </svg>

          <ol className="layer-stack">
            {layerModel.layers
              .map((layer, idx) => ({ layer, idx }))
              .reverse()
              .map(({ layer, idx }) => (
                <li
                  className={`layer-slab panel layer-slab--${layer.key.toLowerCase()}`}
                  key={layer.key}
                >
                  <span className="layer-slab__dot" aria-hidden="true" />
                  <span className="layer-slab__index mono" aria-hidden="true">
                    {String(idx + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                  </span>

                  <span className="layer-slab__glyph display" aria-hidden="true">
                    {layer.key}
                  </span>

                  <div className="layer-slab__body">
                    <div className="layer-slab__head">
                      <h3 className="layer-slab__name h-md">{layer.name}</h3>
                      <span className="chip layer-slab__ko">{layer.ko}</span>
                    </div>
                    <p className="layer-slab__text text-dim">{layer.body}</p>
                  </div>

                  <span className="layer-slab__edge" aria-hidden="true" />
                </li>
              ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
