# TECH_SPEC — Pixel Arcade Tycoon

## 스택과 근거

- **Vite + TypeScript(strict)**, 프레임워크 없음. UI = DOM/CSS(인라인 스타일 지양, `src/style.css` + 클래스), 스프라이트 = `<canvas>` 픽셀 렌더.
- 근거: 기준 목업(`reference/mockup/`)이 동일 방식으로 완성되어 있어 이식 비용 최소. Phaser 등 엔진 도입은 기각(DECISIONS #7).
- 러너 미니게임만 별도 requestAnimationFrame 루프의 단일 canvas.
- 대상: 데스크톱 Chrome 최신(기준), Safari/모바일 Chrome 동작 확인. 1440×900 논리 해상도 → 뷰포트에 맞춰 CSS `transform: scale()` 레터박스.

## 모듈 구조

```
src/
  main.ts            부트스트랩, 씬 마운트, __GAME_TEST__ 노출
  style.css          팔레트 CSS 변수, 공용 컴포넌트 클래스 (ART_BIBLE 참조)
  core/
    store.ts         단일 상태 트리 + subscribe + dispatch(액션) — 유일한 상태 변경 경로
    rng.ts           mulberry32 seeded RNG. Math.random 사용 금지(연출 포함 전부 이 모듈)
    sim.ts           영업 시뮬·판정 룰 (GAME_DESIGN §5 수식 그대로, 순수 함수)
    economy.ts       코인·평판·주차 진행 (순수 함수)
    tags.ts          피드백 태그 파생·집계 → 다음 안건 생성
    memory.ts        팀원 기억 카드·손님 방문 이력
    save.ts          localStorage 직렬화 (버전 필드 포함, 실패 시 새 게임)
  scenes/
    meeting.ts       회의실 (PLAN/MEETING/DECIDE)
    arcade.ts        오락실 (PLACE/OPEN/REPORT)
    tryout.ts        러너 직접 플레이
  art/
    sprites.ts       픽셀 스프라이트 엔진 (목업 이식 — 팔레트·파츠·캐릭터·아이콘·캐비닛·타일)
    fx.ts            코인 플로트, 감정 칩 팝, 화면 전환 등 이펙트
  llm/
    client.ts        LLM 어댑터 (아래)
    prompts.ts       프롬프트 빌더 (kind별)
    pools.ts         사전 생성 풀 로더·선택기 (seed 기반, 중복 회피)
  data/              choices/personas/decisions/balance + pools/*.json
  sound.ts           jsfxr 스타일 절차적 SFX (Web Audio, 외부 파일 없음)
```

- 상태 변경은 반드시 `store.dispatch(action)` — 씬은 상태를 직접 만지지 않는다. 씬 = render(state) + 이벤트 → dispatch.
- 씬 전환: `store.state.phase` 구독으로 마운트/언마운트. 팝업/모달 없음 (오버레이는 TRYOUT·코치마크만).

## LLM 경계 (가장 중요한 규칙)

- LLM 출력이 바꿀 수 있는 것: **표시 문자열** (회의 대사, 게임 이름, 피드백 대사, 재방문 대사) — 전부.
- LLM 출력이 바꿀 수 없는 것: 수치, 태그, 판정, 상태 전환 — 전부 `core/`가 seed 기반으로 계산한 뒤, LLM에는 "이 결과를 이 인물의 말투로 표현하라"만 요청한다.
- 출력 검증: JSON 스키마(문자열 필드만), 40자(대사)/16자(이름) 초과 시 잘라내기, 실패·부적합 시 즉시 풀 폴백. 재시도 없음(지연 예산).

### 어댑터 3단 (`llm/client.ts`)

```
mode 판정: VITE_LLM_PROXY_URL 있음 → proxy / DEV && GEMINI_API_KEY 있음 → direct / 그 외 → pool
호출 규약: generate(kind, context) → Promise<string>  (kind: meeting|naming|feedback|revisit)
예산: 사이클당 최대 3회 (meeting 1, naming 1, feedback 묶음 1). 타임아웃 2.5s → pool 폴백.
UI 규칙: 로딩 스피너 금지 — 대기 중엔 '작업 중' 점 3개 말풍선 연출로 흡수. pool 폴백은 무공지(끊김 없이).
동일 (kind, contextKey) 캐시: sessionStorage.
```

- `pool` 모드: `src/data/pools/*.json`에서 컨텍스트 키(장르×결정×유형×만족구간)로 후보를 찾고 seed RNG로 선택, 세션 내 중복 회피. **pool 모드만으로 전 루프 완주 가능해야 한다.**
- `proxy` 모드: `POST {VITE_LLM_PROXY_URL}/generate` `{kind, context}` → `{text}`. 프록시가 키 보관 (`cloudflare/`).
- `direct` 모드: dev 전용. Gemini `generateContent` 직접 호출. **키는 .env, 절대 커밋·번들 금지** (`import.meta.env.DEV` 가드로 프로덕션 번들에서 코드 제거).

### 사전 생성 풀

- 시드 풀은 저장소에 커밋 (`src/data/pools/`). `scripts/pregen.mjs`가 GEMINI_API_KEY로 풀을 재생성·확장 (빌드 타임 L2 활용 — AI 기술 문서 소재).

## 결정성·재현

- 전역 RNG는 `rng.ts` 단일 인스턴스. `__GAME_TEST__.setSeed(n)` 후 동일 입력 시퀀스 = 동일 상태.
- 연출 타이밍은 게임 결과에 영향 금지 (연출 스킵해도 상태 동일).

## 테스트 인터페이스 (dev/test 빌드에서만)

```ts
window.__GAME_TEST__ = {
  setSeed(seed: number): void          // 새 게임 + seed 고정
  loadScenario(id: string): void       // tests/playtest/scenarios.ts 정의 상태로 점프
  getState(): GameState                // 구조체 스냅샷(직렬화 가능)
  step(ms: number): void               // 시뮬·연출 타이머 강제 진행
  dispatch(action): void               // 액션 직접 주입(입력 시뮬)
  getTelemetry(): Telemetry            // 사이클 수, 만족도 분포, 태그 집계, LLM 호출 수/모드
  llmMode(): 'pool'|'proxy'|'direct'
}
```

Playwright는 이 인터페이스 + 실제 클릭 병행. 스크린샷 증거는 `evidence/`에 저장.

## 명령 (package.json)

| 명령 | 내용 |
|---|---|
| `npm run dev` | Vite dev 서버 (5173) |
| `npm run build` | `tsc --noEmit && vite build` |
| `npm run preview` | 빌드 결과 로컬 서빙 (4173) |
| `npm run test` | Vitest (core 룰 단위 테스트) |
| `npm run test:e2e` | Playwright (시나리오 — dev 서버 자동 기동) |
| `npm run verify` | build + test + test:e2e (Ralphy 완료 게이트) |
| `npm run pregen` | 콘텐츠 풀 재생성 (GEMINI_API_KEY 필요, 선택) |

## 배포

- GitHub Pages: `.github/workflows/deploy.yml` — push(main) → build → Pages. `vite.config.ts` `base: '/pixel-arcade-tycoon/'`.
- 저장소 public (`minsub0922/pixel-arcade-tycoon`). 커밋 기록 유지 — squash 금지.
- Cloudflare Workers 프록시: `cloudflare/` 참조 (사용자가 배포, 선택적). 배포 후 GitHub Actions 변수 `VITE_LLM_PROXY_URL` 설정 → 재배포로 라이브 모드 활성화. 미설정이어도 제출물은 pool 모드로 완전 동작.

## 성능 목표

- 60fps(데스크톱), 첫 로드 < 3초(에셋이 코드라 번들 < 300KB 목표), 입력 반응 < 100ms.
- 스프라이트는 최초 1회 오프스크린 캔버스에 그려 캐시 (매 프레임 재도장 금지). 걷기 등 애니메이션은 CSS steps() 우선.

## 오류 처리

- 전역 error/unhandledrejection 핸들러 → 콘솔 + 화면 우하단 도트 토스트(개발 모드) / 프로덕션은 조용히 복구.
- LLM 오류는 사용자에게 절대 노출하지 않는다 (폴백이 항상 존재).
- localStorage 손상 → 백업 무시하고 새 게임 (크래시 금지).
