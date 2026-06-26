import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';
import { gsap, useGSAP } from '../lib/gsap';
import './ThemeSwitcher.css';

export default function ThemeSwitcher() {
  const { theme, setTheme, themes } = useTheme();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const panelRef = useRef(null);
  const current = themes.find((t) => t.id === theme) ?? themes[0];

  // close on outside click / Escape
  useEffect(() => {
    if (!open) return undefined;
    const onClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('pointerdown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  useGSAP(
    () => {
      if (!open || !panelRef.current) return;
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: -10, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power3.out' }
      );
      gsap.fromTo(
        panelRef.current.querySelectorAll('[data-opt]'),
        { opacity: 0, x: 10 },
        { opacity: 1, x: 0, duration: 0.35, ease: 'power2.out', stagger: 0.05, delay: 0.05 }
      );
    },
    { dependencies: [open], scope: panelRef }
  );

  return (
    <div className="theme-switch" ref={wrapRef}>
      <button
        type="button"
        className="theme-switch__toggle"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="색상 테마 변경"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="theme-switch__dots" aria-hidden="true">
          {current.swatch.map((c) => (
            <i key={c} style={{ background: c }} />
          ))}
        </span>
        <span className="theme-switch__name mono">{current.name}</span>
      </button>

      {open && (
        <div className="theme-switch__panel" ref={panelRef} role="menu">
          <p className="theme-switch__hint mono">색상 시안 · 4 themes</p>
          {themes.map((t) => (
            <button
              key={t.id}
              type="button"
              data-opt
              role="menuitemradio"
              aria-checked={t.id === theme}
              className={`theme-switch__opt ${t.id === theme ? 'is-active' : ''}`}
              onClick={() => {
                setTheme(t.id);
                setOpen(false);
              }}
            >
              <span className="theme-switch__dots" aria-hidden="true">
                {t.swatch.map((c) => (
                  <i key={c} style={{ background: c }} />
                ))}
              </span>
              <span className="theme-switch__meta">
                <span className="theme-switch__opt-name">{t.name}</span>
                <span className="theme-switch__opt-desc">{t.desc}</span>
              </span>
              {t.id === theme && <span className="theme-switch__check" aria-hidden="true">●</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
