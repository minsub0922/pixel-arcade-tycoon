# devlog — AI 활용 기록 (제출 문서의 재료)

## 2026-08-09 02:18 · Ralphy iteration 1 (T1) + Claude Code 마감

- 목업 인라인 스프라이트 엔진을 `src/art/sprites.ts`(TS, 25.6KB)로 이식 — 팔레트·캐릭터 조립(16×19)·아이콘·캐비닛·타일 전부. `#art` 데모 시트 + 유닛 8종 + e2e 2종 작성.
- Ralphy 프로세스가 verify/커밋 직전 중단됨 → Claude Code 가 작업 회수: 죽은 dev 서버(전체 e2e 실패 원인) 정리 후 verify green 확인, T1 완료 처리. 증거: evidence/T1-art-sheet.png.
- 배움: 자율 루프 중단 시에도 워킹 트리의 작업은 검증만 통과하면 회수 가능 — "검증 가능한 작은 태스크" 구조 덕분.

형식: 날짜/주체 · 무엇을 · 어떻게(프롬프트/도구) · 결과/배움. 각 Ralphy 이터레이션이 3~5줄 append.

## 2026-08-09 · Claude Code (setup)

- 저장소 조사 → 심층 인터뷰 2라운드(용도·재미 축·게임 실체·LLM 전제·템플릿·아트·프록시·참가 형태) → Setup Readiness Review 승인.
- 사용자의 Claude Design 목업(Pixel Arcade Tycoon mockups) 원본 HTML+스프라이트 엔진을 브라우저 자동화(콘솔 API·다운로드)로 추출해 `reference/mockup/` 확보 — 아트 시스템을 발명하지 않고 이식하기로 결정 (DECISIONS #6·#7).
- 명세 7종 + tasks.yaml 13태스크 + 스캐폴드(Vite/TS/Vitest/Playwright) + Workers 프록시 + 시드 대사 풀 작성.
- 배움: 정적 배포에서 LLM 키 노출 문제 → 프록시(키는 서버 secret) + 커밋된 사전 생성 풀 폴백의 3단 구조로 해결. 게임 수치는 LLM 경계 밖(결정론적 룰 엔진)에 두어 재현성·심사 안정성 확보.
