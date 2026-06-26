import { useEffect, useRef, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { SmoothScrollProvider, useSmoothScroll } from './context/SmoothScroll';
import { ScrollTrigger } from './lib/gsap';
import Nav from './components/Nav';
import Footer from './components/Footer';
import ScrollProgress from './components/ScrollProgress';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';

// Routed sub-pages are split out of the landing bundle.
const Curriculum = lazy(() => import('./pages/Curriculum'));
const Cases = lazy(() => import('./pages/Cases'));

function ScrollManager() {
  const { scrollTo } = useSmoothScroll();
  const location = useLocation();
  const navigate = useNavigate();
  const clearedRef = useRef(false);

  useEffect(() => {
    if (location.state?.scrollTo) {
      const target = location.state.scrollTo;
      const t = setTimeout(() => scrollTo(target), 360);
      // Clear the navigation state once so a refresh / back-nav doesn't re-scroll.
      if (!clearedRef.current) {
        clearedRef.current = true;
        navigate(location.pathname, { replace: true, state: {} });
      }
      return () => clearTimeout(t);
    }
    clearedRef.current = false;
    window.scrollTo(0, 0);
    const r = setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => clearTimeout(r);
  }, [location.pathname, location.state, scrollTo, navigate]);

  useEffect(() => {
    // Refresh after fonts settle. The delayed second pass is a catch-all: any
    // section that builds its triggers inside its own fonts.ready callback gets
    // its positions recomputed once everything is laid out.
    const refresh = () => ScrollTrigger.refresh();
    let t2;
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        refresh();
        t2 = setTimeout(refresh, 350);
      });
    } else {
      t2 = setTimeout(refresh, 350);
    }
    return () => clearTimeout(t2);
  }, []);

  return null;
}

export default function App() {
  return (
    <BrowserRouter basename="/site">
      <a href="#main" className="skip-link">본문 바로가기</a>
      <ThemeProvider>
        <SmoothScrollProvider>
          <ScrollManager />
          <div className="noise" aria-hidden="true" />
          <ScrollProgress />
          <Nav />
          <main id="main">
            <ErrorBoundary>
              <Suspense fallback={<div className="route-fallback" aria-busy="true" />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/curriculum" element={<Curriculum />} />
                  <Route path="/cases" element={<Cases />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </main>
          <Footer />
        </SmoothScrollProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}
