# AX-PBL 배포 가이드 — axedu.pusan.ac.kr (임시 도메인)

대상 서버: `164.125.19.178` (SSH 계정: ubuntu · 비밀번호는 별도 전달) · Docker 멀티컨테이너 호스트

> ⚠️ 이 서버의 22번 포트는 **외부에서 접속이 차단**되어 있습니다(부산대 캠퍼스망/VPN 전용으로 추정).
> 따라서 **캠퍼스 네트워크(또는 교내 VPN)에 연결된 PC**에서 아래를 실행하세요.
> (이 환경에서는 서버에 도달할 수 없어 자동 배포가 불가했습니다.)

기존에 떠 있는 다른 컨테이너를 **건드리지 않고** axedu 서비스만 추가하는 절차입니다.

---

## 0. 소스 서버로 올리기
캠퍼스망 PC에서 (이 프로젝트 폴더 `ax-pbl-website` 전체를 전송):
```bash
# 압축 후 전송 (node_modules/dist 제외)
tar --exclude=node_modules --exclude=dist -czf axpbl.tgz -C /경로/ ax-pbl-website
scp axpbl.tgz ubuntu@164.125.19.178:~/        # 비밀번호: <별도 전달>
ssh ubuntu@164.125.19.178                      # 비밀번호: <별도 전달>
# (서버에서)
tar xzf axpbl.tgz && cd ax-pbl-website
```

## 1. 기존 환경 점검 (먼저 반드시 실행 — 무엇도 바꾸지 말 것)
```bash
docker ps --format 'table {{.Names}}\t{{.Image}}\t{{.Ports}}'
docker network ls
# 리버스 프록시 종류 추정
docker ps --filter name=traefik; docker ps --filter name=proxy; docker ps --filter name=nginx
ss -ltnp | grep -E ':80|:443' || true
```
→ 출력으로 **리버스 프록시 종류**(Traefik / nginx-proxy / 수동 nginx)와 **프록시 네트워크 이름**을 확인합니다.

## 2. 라우팅 방식 선택 (`deploy/docker-compose.axedu.yml` 편집)
- **Traefik** 사용 중 → Option A 라벨 주석 해제 + `networks: proxy`의 `name:`을 1번에서 확인한 네트워크로 설정
- **nginx-proxy(jwilder)** 사용 중 → Option B 환경변수 주석 해제 + 동일하게 네트워크 설정
- **수동 nginx / 잘 모름** → Option C(기본값, `8088:80` 포트 발행) 그대로 두고 3·4번 진행

## 3. 배포 (axedu 서비스만 빌드·기동)
```bash
cd ~/ax-pbl-website
docker compose -f deploy/docker-compose.axedu.yml up -d --build
docker logs -f axedu-axpbl     # 시작 로그 확인 후 Ctrl-C
curl -I http://127.0.0.1:8088  # Option C일 때 200 확인
```

## 4. 도메인 연결
- **Traefik/nginx-proxy(A·B)**: 라벨/환경변수로 자동 라우팅됨 → `http://axedu.pusan.ac.kr` 접속 확인
- **수동 nginx(C)**: 프런트 nginx에 vhost 추가 (예시):
  ```nginx
  server {
    listen 80;
    server_name axedu.pusan.ac.kr;
    location / { proxy_pass http://127.0.0.1:8088; proxy_set_header Host $host; }
  }
  ```
  그리고 `nginx -t && nginx -s reload` (또는 프록시 컨테이너 재로드).
- **DNS**: `axedu.pusan.ac.kr` A 레코드가 이 서버를 가리켜야 함. 아직 미배정이면 테스트 PC의 hosts에
  `164.125.19.178 axedu.pusan.ac.kr` 추가해 임시 확인.

## 5. 동작 확인 체크리스트
- `/` 히어로 + 테마 전환 버튼 / `/curriculum` 새로고침 시 200 (SPA fallback) / `/cases`
- `/concepts/` 갤러리 12종 / `/concepts/11-campus-bridge.html` 3D 로딩
- `/logos/pnu-signature.jpg` 200

## 롤백
```bash
docker compose -f deploy/docker-compose.axedu.yml down   # axedu만 내림 (다른 컨테이너 영향 없음)
```

---
### 참고: 자동 배포가 막힌 이유
이 작업 환경에서 `ssh ubuntu@164.125.19.178`(포트 22)가 **timeout**(샌드박스 해제 후에도 동일)이라 도달 불가했습니다. 캠퍼스망에서 접속하시면 위 절차로 5분 내 배포됩니다. 캠퍼스망 PC에서 `! ssh ...`로 붙으시면, 제가 단계별 명령을 이어서 안내할 수 있습니다.
