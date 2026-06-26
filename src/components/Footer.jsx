import { Link } from 'react-router-dom';
import { site, nav as navItems } from '../data/content';
import './Footer.css';

const B = import.meta.env.BASE_URL;
const PNU_LOGOS = [
  { src: B + 'logos/pnu-signature.jpg', label: '시그니처', alt: '부산대학교 시그니처 로고', wide: true },
  { src: B + 'logos/pnu-symbol-color.jpg', label: '심볼', alt: '부산대학교 심볼 마크' },
  { src: B + 'logos/pnu-wordmark-kr.jpg', label: '국문 워드마크', alt: '국립부산대학교 워드마크' },
  { src: B + 'logos/pnu-emblem.jpg', label: '워드마크', alt: '부산대학교 워드마크' },
  { src: B + 'logos/pnu-symbol-line.jpg', label: '심볼 라인', alt: '부산대학교 심볼 라인 버전' },
  { src: B + 'logos/pnu-symbol-grid.jpg', label: '심볼 그리드', alt: '부산대학교 심볼 구성 그리드' },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="grid-overlay" />
      <div className="container footer__inner">
        <div className="footer__brand">
          <p className="footer__mark display">{site.brand}</p>
          <p className="footer__platform mono">{site.platform}</p>
          <p className="footer__tag lead">{site.tagline}</p>
          <span className="logo-plate footer__signature">
            <img src={B + 'logos/pnu-signature.jpg'} alt="부산대학교 Pusan National University" />
          </span>
        </div>

        <div className="footer__cols">
          <div className="footer__col">
            <p className="footer__col-title mono">탐색</p>
            {navItems.map((n) => (
              <a key={n.href} href={n.href} className="footer__link">
                {n.label}
              </a>
            ))}
            <Link to="/curriculum" className="footer__link">
              교과목 카탈로그
            </Link>
          </div>
          <div className="footer__col">
            <p className="footer__col-title mono">기관</p>
            <span className="footer__link">{site.org}</span>
            <span className="footer__link">{site.orgEn}</span>
            <span className="footer__link">{site.initiative}</span>
          </div>
          <div className="footer__col">
            <p className="footer__col-title mono">문의</p>
            <a href="mailto:axpbl@pusan.ac.kr" className="footer__link">
              axpbl@pusan.ac.kr
            </a>
            <span className="footer__link footer__note">※ 연락처는 예시이며 실제 정보로 교체 필요</span>
          </div>
        </div>
      </div>

      <div className="container footer__identity">
        <p className="footer__col-title mono">부산대학교 공식 아이덴티티 · Visual Identity</p>
        <ul className="footer__logos">
          {PNU_LOGOS.map((l) => (
            <li key={l.src} className={`footer__logo ${l.wide ? 'footer__logo--wide' : ''}`}>
              <span className="logo-plate footer__logo-plate">
                <img src={l.src} alt={l.alt} loading="lazy" />
              </span>
              <span className="footer__logo-label mono">{l.label}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="container footer__bottom">
        <span className="mono">© {new Date().getFullYear()} {site.org} · AX-PBL</span>
        <span className="mono footer__credit">Beyond knowledge — solving with AI.</span>
      </div>
    </footer>
  );
}
