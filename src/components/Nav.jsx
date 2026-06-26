import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSmoothScroll } from '../context/SmoothScroll';
import { gsap, useGSAP } from '../lib/gsap';
import ThemeSwitcher from './ThemeSwitcher';
import { nav as navItems, site } from '../data/content';
import './Nav.css';

export default function Nav() {
  const { scrollTo } = useSmoothScroll();
  const location = useLocation();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);
  const menuRef = useRef(null);
  const onHome = location.pathname === '/';

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 36);
      setHidden(y > 360 && y > lastY.current);
      lastY.current = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  // close the mobile menu on Escape while it is open
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [menuOpen]);

  useGSAP(
    () => {
      if (!menuOpen || !menuRef.current) return;
      gsap.fromTo(
        menuRef.current.querySelectorAll('[data-mitem]'),
        { opacity: 0, y: 26 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out', stagger: 0.06, delay: 0.08 }
      );
    },
    { dependencies: [menuOpen], scope: menuRef }
  );

  const goAnchor = (href) => {
    setMenuOpen(false);
    if (onHome) {
      scrollTo(href);
    } else {
      navigate('/', { state: { scrollTo: href } });
    }
  };

  return (
    <>
      <header className={`nav ${scrolled ? 'is-scrolled' : ''} ${hidden && !menuOpen ? 'is-hidden' : ''}`}>
        <div className="nav__inner container">
          <Link to="/" className="nav__brand" onClick={() => setMenuOpen(false)} aria-label="부산대학교 AX-PBL 홈">
            <img className="nav__pnu" src={`${import.meta.env.BASE_URL}logos/pnu-symbol-color.jpg`} alt="부산대학교 Pusan National University" />
            <span className="nav__brand-text">
              <span className="nav__brand-mark">{site.brand}</span>
              <span className="nav__brand-sub mono">부산대학교 · PNU Teaching Studio</span>
            </span>
          </Link>

          <nav className="nav__links" aria-label="주요 섹션">
            {navItems.map((item) => (
              <button key={item.href} type="button" className="nav__link" onClick={() => goAnchor(item.href)}>
                {item.label}
              </button>
            ))}
            <Link to="/curriculum" className={`nav__link ${location.pathname === '/curriculum' ? 'is-active' : ''}`}>
              교과목
            </Link>
          </nav>

          <div className="nav__right">
            <ThemeSwitcher />
            <button
              type="button"
              className={`nav__burger ${menuOpen ? 'is-open' : ''}`}
              aria-label="메뉴"
              aria-expanded={menuOpen}
              aria-controls="nav-mobile-menu"
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div
          className="nav__mobile"
          ref={menuRef}
          id="nav-mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="모바일 메뉴"
        >
          <nav className="nav__mobile-links">
            {navItems.map((item) => (
              <button key={item.href} type="button" data-mitem className="nav__mobile-link" onClick={() => goAnchor(item.href)}>
                {item.label}
              </button>
            ))}
            <Link to="/curriculum" data-mitem className="nav__mobile-link" onClick={() => setMenuOpen(false)}>
              교과목 카탈로그
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
