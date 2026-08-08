# AGENTS — 코드 에이전트 운영 가이드

fresh context로 투입된 에이전트는 이 문서를 먼저 읽고, 태스크 착수 전 아래 명세를 확인한다.

## 필독 순서

1. `PRODUCT.md` — 무엇을 왜 만드는가 (D-1 마감 컨텍스트)
2. 담당 태스크의 `description` (tasks.yaml)
3. 관련 명세: 룰·수치 = `GAME_DESIGN.md` · 구조·경계 = `TECH_SPEC.md` · 비주얼 = `ART_BIBLE.md`
4. 시나리오 = `PLAYTEST_SCENARIOS.md`, 품질 = `QUALITY_BAR.md`

## 명령

```bash
npm run dev        # dev 서버 http://localhost:5173 (백그라운드 실행 후 작업)
npm run build      # 타입체크 + 프로덕션 빌드
npm run test       # Vitest 룰 단위 테스트
npm run test:e2e   # Playwright 시나리오 (dev 서버 자동 기동, evidence/ 에 스크린샷)
npm run verify     # build + test + test:e2e — 태스크 완료 게이트
```

종료: dev 서버는 작업 종료 시 kill. 포트 5173 점유 확인 후 재사용.

## 철칙

1. **한 번에 태스크 하나.** tasks.yaml에서 completed: false인 첫 태스크만. 다른 태스크 파일 선반영 금지.
2. **실행해서 눈으로 확인 전에 완료 선언 금지.** 빌드 성공 ≠ 완료. 태스크의 Verification을 실제 수행하고 Required evidence를 `evidence/`에 남긴다.
3. **테스트·게이트 약화 금지.** 실패하는 테스트를 지우거나 skip 처리하지 않는다. 시나리오 기대값 수정은 GAME_DESIGN 수치 변경이 근거일 때만(그 경우 두 파일을 함께 수정).
4. **수정 금지 영역**: `reference/` (목업 원본), `01_공고`·`02_사전과제` (저장소 밖), `.env`.
5. **LLM 경계 준수**: 수치·판정 로직에 LLM 응답을 절대 연결하지 않는다 (TECH_SPEC).
6. **아트는 sprites.ts 시스템으로만.** 외부 이미지·이모지·새 팔레트 색 금지 (ART_BIBLE 금지 패턴).
7. **Math.random 금지** — `core/rng.ts`만 사용 (연출 포함).
8. **의존성 추가 금지** — 현재 package.json에 있는 것만. 꼭 필요하면 태스크를 중단하고 사유를 보고.
9. **비밀키**: .env는 읽되 값을 로그·커밋·번들에 노출 금지. `.env.example`만 갱신.
10. **실존 확인되지 않은 외부 URL 기입 금지** — 특히 submission/ 의 영상 링크 등 "HUMAN-ONLY" 표기 항목은 절대 채우지 않는다 (사람이 실제 업로드 후 기입).

## 아키텍처 요약 (재사용 패턴)

- 상태 변경은 `store.dispatch(action)` 단일 경로. 씬 = `render(state)` + 이벤트 → dispatch. 씬이 직접 DOM 상태를 들고 있지 않기.
- 판정·경제 로직은 `core/*.ts` 순수 함수 → Vitest로 직접 테스트.
- 스프라이트: `PX.paint(canvas, 'ch:pl:stand:happy', scale)` / `data-sprite` 속성 스캔 헬퍼. 신규 스프라이트는 문자-매트릭스로 추가.
- 대사: `llm/client.generate(kind, context)` — pool 폴백이 항상 존재. UI는 mode를 신경 쓰지 않는다.

## 증거 규칙

- 스크린샷: `evidence/T<번호>-<이름>.png` (Playwright). 상태 어서션: 테스트 통과 로그.
- `devlog.md`에 3~5줄 append: 무엇을 했고, 무엇이 어려웠고, 프롬프트/AI를 어떻게 썼는지 (제출용 AI 활용 문서의 재료가 된다).

## 완료 보고 형식

```
DONE: <태스크 제목>
- 구현: <핵심 변경 1~3줄>
- 검증: <실행한 명령과 결과>
- 증거: <evidence/ 파일명>
- 남은 리스크: <있으면>
```

## 운영 지식 갱신

작업 중 발견한 재현 가능한 사실(빌드 함정, 브라우저 이슈, 명령 수정)은 이 문서의 아래 "Field Notes" 섹션에 추가한다. 제품 요구사항은 여기 쓰지 않는다.

## Field Notes

- (에이전트가 추가)
