# AX·PBL — PNU AX-PBL Teaching Studio

부산대학교 **AX-PBL** 웹사이트. React + Vite + GSAP. 폐쇄망 대응(폰트·GSAP 전부 로컬 번들, 외부 CDN 런타임 의존성 0).

## 구조
- `src/` — 메인 사이트(React SPA): 색상 4종 실시간 전환, GSAP 스크롤 연출, `/curriculum` 교과목 카탈로그, `/cases` 운영 사례
- `src/data/` — 출처(AX-PBL 핵심자료)에서 정리한 콘텐츠·교과목 데이터
- `concepts/` — 디자인 시안 12종 갤러리(`index.html`) + 컨셉 목업(5–10) + 3D(11–12) + `vendor/`(로컬 폰트·GSAP) + 평가용 문서
- `deploy/` — 배포 키트(Dockerfile · nginx · docker-compose · DEPLOY.md)
- `public/` — 로고·개념도·자체호스팅 폰트(fonts/)

## 시안 구성
- 1–4 : 동일 디자인, 색상만 다른 4종(AI Future / Heritage / Warm / Industrial)
- 5–10 : 컨셉별 디자인 6종
- 11–12 : 3D 인터랙티브 2종

## 개발 / 빌드
```bash
npm install
npm run dev      # 로컬 개발
npm run build    # dist/ 정적 산출물
```

## 배포(요약)
정적 빌드(`dist/`)를 리버스 프록시(nginx)의 정적 루트에 배치하면 됨. 자세한 절차는 `deploy/DEPLOY.md`.
