# LLM 프록시 배포 (약 15~20분, 사용자 작업)

전제: Cloudflare 계정 (무료), Gemini API 키 (https://aistudio.google.com/apikey 무료 발급).

```bash
cd cloudflare
npx wrangler login                       # 브라우저로 Cloudflare 로그인
npx wrangler secret put GEMINI_API_KEY   # 프롬프트에 키 붙여넣기 (화면에 안 보임)
npx wrangler deploy                      # 출력에 워커 URL 이 나온다
```

배포 확인:

```bash
curl -s -X POST https://pixel-arcade-llm.<계정서브도메인>.workers.dev/generate \
  -H 'content-type: application/json' -H 'Origin: http://localhost:5173' \
  -d '{"kind":"naming","context":"장르: 액션 러너 / 콘셉트: 네온 시티"}'
# → {"text":"…"} 이면 성공
```

게임에 연결 (두 곳 모두 로컬 `.env` 기준 — 배포도 로컬 빌드로 이뤄진다):

1. **로컬 dev**: `.env` 에 `VITE_LLM_PROXY_URL=<워커 URL>` → `npm run dev` 재시작
2. **배포(Pages)**: 같은 `.env` 가 있는 상태에서 `bash scripts/deploy-pages.sh` 재실행 — 빌드 시점에 URL 이 번들에 포함되어 라이브 모드로 배포된다 (Actions 변수 아님 — 자동 워크플로는 현재 비활성, TECH_SPEC §배포 참조)

미배포/실패 시에도 게임은 pool 모드로 완전 동작한다 (심사 안전).

주의: `wrangler.toml` 의 `ALLOW_ORIGINS` 는 게임 오리진만 허용하도록 유지. 모델 변경도 같은 파일 `GEMINI_MODEL`.
무료 티어 한도(분당 요청)는 게임의 사이클당 3회 제한 + 캐시로 충분히 여유.
