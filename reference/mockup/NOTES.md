# 목업 원본 노트

- `Pixel Arcade Tycoon.dc.html` — 사용자가 Claude Design 으로 제작한 승인 목업 (2026-08-08). **아트·UI 의 단일 기준** (ART_BIBLE.md 참조).
  - 구조: 1a 회의실 / 1b 오락실 / 1c 아바타 시트 / 1d 컴포넌트 시트 (라인 41~697)
  - **인라인 스크립트(라인 698~1006)에 픽셀 스프라이트 엔진 원본** — T1 에서 `src/art/sprites.ts` 로 이식
- `support.js` — Claude Design 문서(.dc) 뷰어 런타임. 게임에는 사용하지 않음. 목업을 로컬에서 열어볼 때 필요:
  `cd reference/mockup && python3 -m http.server 8899` → http://localhost:8899/Pixel%20Arcade%20Tycoon.dc.html
- 이 폴더는 **수정 금지** (AGENTS.md). 원본 출처: 사용자 Claude Design 프로젝트 "Pixel Arcade Tycoon mockups".
- 목업과 게임의 차이: 목업 속 수치·문구는 예시 데이터. 실제 규칙·수치는 GAME_DESIGN.md 가 기준.
