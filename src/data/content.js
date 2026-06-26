// ────────────────────────────────────────────────────────────────────────────
// AX-PBL 콘텐츠 데이터 — 출처: AX-PBL.hwpx / AX-PBL_개념도.jpg / 2025 PBL 추출 리스트
// 모든 문구는 원문을 기반으로 정리됨. 임의 수치/연락처는 placeholder 로 표기.
// ────────────────────────────────────────────────────────────────────────────

export const site = {
  org: '부산대학교',
  orgEn: 'Pusan National University',
  platform: 'PNU AX-PBL Teaching Studio',
  brand: 'AX·PBL',
  program: 'AX-PBL · URP',
  tagline: '지식의 습득을 넘어, AI와 함께 문제를 정의하고 해결하는 실천적 교육',
  taglineEn: 'Beyond acquiring knowledge — defining and solving real problems together with AI.',
  initiative: 'Arise PNU · 같이 더 높게',
};

// ── HERO 보조 카피 ──────────────────────────────────────────────────────────
export const hero = {
  eyebrow: 'Problem-Based Learning × AI Transformation',
  title: ['문제로 배우고', 'AI와 함께', '해결하는 교육'],
  titleEn: 'AX-PBL',
  lead:
    '부산대학교 AX-PBL은 학부생의 진학 의지와 AX 역량을 동남권 산업 수요와 연결하는 ' +
    '교육·연구개발·산학협력의 복합체입니다.',
  ctas: [
    { label: 'AX-PBL 알아보기', href: '#concept', kind: 'primary' },
    { label: '교과목 카탈로그', to: '/curriculum', kind: 'ghost' },
  ],
};

// ── PBL 개념 & 역사 ─────────────────────────────────────────────────────────
export const concept = {
  kicker: 'What is PBL',
  heading: 'PBL은 트렌드가 아니라\n반세기 검증된 교수학습 모델입니다',
  intro:
    'PBL(Problem-Based Learning)은 일시적인 교육 트렌드가 아닌, 반세기 동안 고등교육의 ' +
    '효과성을 입증해 온 정통성 있는 교수학습 모델입니다.',
  // 역사 타임라인
  timeline: [
    {
      year: '1969',
      tag: 'McMaster 의과대학',
      title: '혁신의 출발',
      body:
        '하워드 배로우(Howard Barrows) 교수가 주입식 의학 교육의 한계 — ‘파편화된 지식’을 ' +
        '극복하기 위해 PBL을 최초로 도입했습니다.',
    },
    {
      year: '문제',
      tag: '지식의 파편화',
      title: '암기는 했지만 진단하지 못했다',
      body:
        '당시 의대생들은 엄청난 양의 의학 지식을 외웠지만, 정작 병원 현장에서 환자를 마주했을 ' +
        '때 병명을 진단하지 못하는 심각한 ‘지식의 파편화’를 겪었습니다.',
    },
    {
      year: '해결',
      tag: 'Ill-structured Problem',
      title: '문제를 먼저 던지다',
      body:
        '배로우 교수는 주입식 강의를 버리고, 실제 환자의 증상 시나리오(문제)를 먼저 던진 뒤 ' +
        '학생이 스스로 진단하고 치료법을 찾게 했습니다. 결과는 대성공, 전 세계로 확산되었습니다.',
    },
    {
      year: 'Now',
      tag: 'Competency-Based',
      title: '역량 중심 학습의 핵심',
      body:
        '단일한 정답이 없는 복잡한 현실 세계의 문제를 중심으로, 학습자가 주도적으로 협력·사유하며 ' +
        '해결책을 도출하는 역량 중심 학습(Competency-Based Learning)의 핵심입니다.',
    },
  ],
  // 전통적 교육적 정의 — 4 기둥
  pillars: [
    {
      en: 'Self-directed Learning',
      ko: '자기주도적 학습',
      body: '교수가 지식을 주입하는 것이 아니라, 학생이 스스로 필요한 지식을 찾아 나섭니다.',
    },
    {
      en: 'Collaborative Learning',
      ko: '협동 학습',
      body: '팀원들과 소통·토론하며 집단지성으로 문제를 해결합니다.',
    },
    {
      en: 'Ill-structured Problem',
      ko: '비구조화 문제',
      body: '정답이 정해져 있지 않고 현실에 존재할 법한 복잡한 문제를 해결하며 지식을 습득합니다.',
    },
    {
      en: 'Facilitator',
      ko: '퍼실리테이터',
      body: "교수는 ‘지식 전달자’가 아닌, 올바른 방향으로 나아가도록 길을 열어주는 ‘조력자·안내자’입니다.",
    },
  ],
};

// ── AX-PBL 비전 & 가치 제안 ─────────────────────────────────────────────────
export const vision = {
  kicker: 'Why AX-PBL',
  heading: '현대적 확장: AX-PBL 커리큘럼',
  statement: site.tagline,
  // Value Proposition — 두 주체의 Pain Point → 해결
  value: [
    {
      who: '교수진',
      role: 'For Faculty',
      pain: '고도화된 PBL 수업 설계 및 AI 툴 연계에 대한 행정적·시간적 부담',
      solutionTitle: 'AX-PBL 표준 가이드라인 제공',
      solution:
        '전공별 최적화된 학습 목표와 생성형 AI 활용 프롬프트 템플릿을 연계하여, 몇 번의 클릭만으로 ' +
        '표준 강의계획서 수립이 가능합니다.',
    },
    {
      who: '학생',
      role: 'For Students',
      pain: '단순 이론 중심 수업과 실질적 반영의 어려움, 그리고 취업 역량 포트폴리오 구축의 어려움',
      solutionTitle: '실전 역량 중심의 디지털 포트폴리오',
      solution:
        '산업계·사회의 실제 문제를 AI와 협업하여 해결하는 과정을 추적하고, 이를 검증된 역량 ' +
        '인증서 형태로 자동 시각화·축적합니다.',
    },
  ],
};

// ── 7대 콘텐츠 패키지 ───────────────────────────────────────────────────────
export const packages = {
  kicker: 'Teaching Studio',
  heading: 'AX-PBL 콘텐츠 7대 패키지',
  sub: 'PNU AX-PBL Teaching Studio 플랫폼이 제공하는 핵심 구성요소',
  items: [
    {
      no: '01',
      name: '3LAYER-BPF 콘텐츠',
      en: 'Basic → Practical → Field',
      body: '기본 이론(Basic Theory) → 실무 역량(Practical Skill) → 현장 훈련(Field Training)의 3단계 구조.',
    },
    {
      no: '02',
      name: '문제해결형 AX-PBL',
      en: 'Problem-Solving Model',
      body:
        '학생이 문제를 직접 발견하고, AI와 함께 확장적으로 분석한 뒤, 실행 가능한 해결안을 ' +
        '설계·검증하는 수업 모델. 더 넓게 보고, 깊게 정의하고, 다양하게 만들고, 엄격하게 검증합니다.',
    },
    {
      no: '03',
      name: '산업·지역 Problem Bank',
      en: 'Problem Bank',
      body:
        '기업·공공기관·지역사회·학내 부서가 문제를 등록하는 문제은행. 부산대 수업과 산업·지역 현장을 ' +
        '연결하는 문제 매칭 시스템입니다.',
    },
    {
      no: '04',
      name: 'AI Co-Design Studio',
      en: 'AI Co-Design Studio',
      body:
        'AI를 검색 도구가 아니라 수업설계와 문제해결의 공동 설계자로 활용. 학생은 AI에 분석가·비판자·' +
        '정책자문가·사용자 대변인 역할을 부여해 사고를 확장합니다.',
    },
    {
      no: '05',
      name: 'AX Impact Portfolio',
      en: 'AX Impact Portfolio',
      body:
        '학생 산출물을 역량 증빙자료, 취업·진로 포트폴리오, 우수사례, 성과보고 자료로 자동 축적합니다.',
    },
    {
      no: '06',
      name: '표준 강의계획 템플릿',
      en: 'Course Design Template',
      body:
        '전공별 학습 목표와 생성형 AI 프롬프트 템플릿을 연계해, 클릭 몇 번으로 표준 강의계획서를 ' +
        '수립할 수 있는 교수 지원 도구.',
    },
    {
      no: '07',
      name: '역량 인증 & 시각화',
      en: 'Competency Certification',
      body:
        'AI 협업 문제해결 과정을 추적하여 검증된 역량 인증서 형태로 자동 시각화·축적하는 인증 체계.',
    },
  ],
};

// ── Problem Bank 5대 분류 ───────────────────────────────────────────────────
export const problemBank = {
  kicker: 'Problem Bank',
  heading: '동남권 수요에 기반한 문제은행',
  sub: '기업·공공기관·지역사회·학내 부서가 문제를 등록하고, 부산대 수업과 현장을 연결합니다.',
  categories: [
    {
      id: '01',
      name: '산업 AX 문제',
      en: 'Industrial AX',
      items: ['지역기업의 AI 도입', '업무 자동화', '고객 데이터 분석'],
    },
    {
      id: '02',
      name: '지역사회 문제',
      en: 'Community',
      items: ['전통시장 활성화', '청년 정주', '고령층 디지털 격차'],
    },
    {
      id: '03',
      name: '공공정책 문제',
      en: 'Public Policy',
      items: ['대학 행정서비스 개선', '지역·교통·복지', '환경'],
    },
    {
      id: '04',
      name: '문화콘텐츠 문제',
      en: 'Culture',
      items: ['지역문화 스토리텔링', '관광콘텐츠', '캐릭터·브랜드 개발'],
    },
    {
      id: '05',
      name: 'ESG 문제',
      en: 'ESG',
      items: ['탄소저감', '자원순환', '사회적 가치 측정'],
    },
  ],
};

// ── 3LAYER-BPF 모델 ─────────────────────────────────────────────────────────
export const layerModel = {
  kicker: 'The Model',
  heading: '3LAYER-BPF',
  sub: '기본 이론에서 현장 훈련까지, 세 개의 레이어로 쌓는 AX-PBL',
  layers: [
    {
      key: 'B',
      name: 'Basic Theory',
      ko: '기본 이론',
      body: '전공 기초 지식과 문제의 맥락을 이해하는 토대 단계.',
    },
    {
      key: 'P',
      name: 'Practical Skill',
      ko: '실무 역량',
      body: 'AI 도구와 협업하며 분석·설계·검증 역량을 체득하는 단계.',
    },
    {
      key: 'F',
      name: 'Field Training',
      ko: '현장 훈련',
      body: '산업·지역 현장의 실제 문제에 역량을 적용하고 성과를 축적하는 단계.',
    },
  ],
};

// ── 운영 사례 (1~4기) ───────────────────────────────────────────────────────
export const cases = {
  kicker: 'In Practice',
  heading: '3LAYER-BPF AX-PBL 운영 사례',
  sub: '1기부터 4기까지, 학과와 산업·지역 현장을 잇는 실제 운영 과제',
  cohorts: [
    {
      gen: '1기',
      items: [
        {
          title: '자산관리 캡스톤 디자인',
          partner: '캠코 산학연계',
          dept: '경영학과',
          status: '개설완료',
        },
        {
          title: '지역사회 콘텐츠 개발',
          partner: '동구청 · 동래시장 · 서문시장 등',
          dept: '디자인학과',
          status: '개설완료',
        },
      ],
    },
    {
      gen: '2기',
      items: [
        {
          title: '에너지-환경-경제 실습',
          partner: '에너지경제연구원 · 환경연구원',
          dept: '경제학부',
          status: '26년 2학기 개설예정',
        },
        {
          title: '글로벌 마켓 5.0: 디지털 무역과 컨벤션 전략',
          partner: '벡스코 · 부산경제진흥원',
          dept: '무역학부',
          status: '26년 2학기 개설예정',
        },
      ],
    },
    {
      gen: '3기',
      items: [
        {
          title: '회계감사 프로젝트 랩',
          partner: '성현회계법인 부산본부 · 부산지방공인회계사회',
          dept: '경영학과',
          status: '26년 2학기 개설예정',
        },
        {
          title: '에코데이터 사이언스: 공공빅데이터 기반 지역 건강성 분석',
          partner: '국립생태원 · 부산환경공단 · 부산시청',
          dept: '미생물학과',
          status: '개설완료',
        },
        {
          title: '산학공감 AI+X 프로젝트',
          partner: '(재) 네이버커넥트',
          dept: 'AI융합교육원',
          status: '개설완료',
        },
      ],
    },
    {
      gen: '4기',
      items: [
        {
          title: 'Port Risk Studio: AI·데이터 항만·무역 리스크',
          partner: '신항만주식회사',
          dept: '경제통상대학 무역학부',
          status: '연구 진행중',
        },
        {
          title: '부산형 그린인프라 성능평가 스튜디오',
          partner: '부산도시공사 · 부산시청',
          dept: '생명자원과학대학 조경학과',
          status: '연구 진행중',
        },
        {
          title: '스마트 해상물류 관리',
          partner: '',
          dept: '경영대학 경영학과',
          status: '연구 진행중',
        },
      ],
    },
  ],
};

// ── 프로그램 개념도 (URP 구조) ──────────────────────────────────────────────
export const conceptMap = {
  kicker: 'Program Structure',
  heading: 'AX PBL · URP 프로그램 구조',
  sub: '학부생의 역량과 동남권 산업 수요를 잇는 교육·연구개발·산학협력의 복합체',
  nodes: [
    {
      id: 'student',
      label: '학부생',
      en: 'Undergraduate',
      tags: ['진학 의지', 'AX 역량'],
      note: '형식적 요건 문턱은 낮게, 주 전공 체계는 흔들지 않게.',
    },
    {
      id: 'core',
      label: 'AX PBL',
      en: 'The Complex',
      tags: ['교육', '연구개발', '지역·산학협력'],
      note: '교육·연구개발·지역/산학협력의 복합체.',
    },
    {
      id: 'lab',
      label: '연구소',
      en: 'Research',
      tags: ['BK21 4단계', '대학원·학부', '교수·Lab'],
      note: 'BK21 등 우수 대학원 인력 양성 기관이 대학원 프로그램 연계를 주도.',
    },
    {
      id: 'demand',
      label: '동남권 수요',
      en: 'Regional Demand',
      tags: ['산업체', 'RISE 사업단', '채용 연계'],
      note: '동남권 수요 기반 PBL 주제를 발굴·취합, 수백 개 이상의 주제 도출.',
    },
  ],
  principles: [
    'AX 역량의 형식적 요건 문턱을 낮게',
    '학부 고유의 주 전공 체계를 흔들지 않도록',
    'AX 역량 강화가 융합/연계/복수 전공 참여를 강압하지 않도록',
  ],
  linkages: [
    '동남권 수요에 기반한 PBL 주제를 발굴·취합 — 수백 개 이상 주제 도출',
    'BK21과 같은 우수 대학원 인력 양성 기관이 대학원 프로그램 연계를 강화',
    '산업체 전문가 참여, 겸임 교수 발굴 확대',
    '채용 연계 — 채용 우대 PBL 과제 우선 배정',
    '부족한 AX-PBL 과제 운영비는 RISE 사업 등과 연계',
  ],
};

// ── 임팩트 지표 (평가자·본부용) — 출처: 2025 PBL 추출 요약 ────────────────────
export const stats = {
  kicker: 'By the Numbers',
  heading: '2025 교육과정 PBL 추출 성과',
  sub: '2025 부산대학교 교육과정(PDF 983쪽 전체) PBL 키워드 분석 결과',
  metrics: [
    { value: 21, suffix: '건', label: 'PBL 명시 항목', note: '교과목 20 · 전공 운영목표 1' },
    { value: 20, suffix: '개', label: 'PBL 명시 교과목', note: '경영·의과·융합전공 전반' },
    { value: 4, suffix: '기', label: 'AX-PBL 운영 기수', note: '1기 ~ 4기 진행' },
    { value: 5, suffix: '개', label: 'Problem Bank 분류', note: '산업·지역·공공·문화·ESG' },
    { value: 983, suffix: '쪽', label: '분석 교육과정 분량', note: '2025 교육과정 PDF 전체' },
    { value: 3, suffix: '건', label: '별도 PBL 요건·목표', note: '필수요건 2 · 전공 교육목표 1 (물류·항만물류·데이터사이언스)' },
  ],
  requirement:
    '복수전공 36학점 · 부전공 21학점 · 마이크로디그리 12학점 과정에 PBL 3학점 이상 포함 (스마트국제물류융합전공 등)',
};

// ── CTA / 파트너 ────────────────────────────────────────────────────────────
export const cta = {
  kicker: "Let's build it together",
  heading: '같이 더 높게,\nAX-PBL에 함께하세요',
  tracks: [
    {
      who: '학부생·대학원생',
      desc: 'AX 역량을 쌓고, 실전 문제로 디지털 포트폴리오를 완성하세요.',
      action: '교과목 카탈로그 보기',
      to: '/curriculum',
    },
    {
      who: '교수진',
      desc: '표준 가이드라인과 AI Co-Design Studio로 PBL 수업을 손쉽게 설계하세요.',
      action: '도입 문의',
      href: 'mailto:axpbl@pusan.ac.kr',
    },
    {
      who: '산업체·공공기관',
      desc: 'Problem Bank에 현장의 과제를 등록하고 우수 인재와 연결되세요.',
      action: '문제 등록 제안',
      href: 'mailto:axpbl@pusan.ac.kr',
    },
  ],
  contactNote: '※ 연락처/링크는 예시(placeholder)이며 실제 운영 정보로 교체가 필요합니다.',
};

export const nav = [
  { label: '개념', href: '#concept' },
  { label: '비전', href: '#vision' },
  { label: '콘텐츠', href: '#packages' },
  { label: 'Problem Bank', href: '#problembank' },
  { label: '사례', href: '#cases' },
  { label: '구조', href: '#structure' },
];
