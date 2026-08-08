# 사전 생성 대사 풀 스키마

pool 모드(기본)와 라이브 폴백이 사용하는 커밋된 콘텐츠. `scripts/pregen.mjs`(GEMINI_API_KEY 필요)로 재생성·확장 가능하나, 이 시드 풀만으로 게임이 완주되어야 한다 (TECH_SPEC — LLM 경계).

선택 규칙: 컨텍스트 키 정확 매칭 → 없으면 `_` 폴백 키 → 그래도 없으면 하드코딩 기본 문구. 선택은 `core/rng.ts` seed 기반, 세션 내 최근 사용 회피.

| 파일 | 키 형식 | 값 |
|---|---|---|
| meeting.json | `<genre>` 또는 `decide.<fun\|polish\|ship>` | `{who: pl\|ds\|dv\|qa, text}` 배열 (40자 이내) |
| naming.json | `<genre>.<concept>` → `<genre>._` → `_._` | 이름 문자열 배열 (2~8자) |
| feedback.json | `<cust>.<pos\|mid\|neg>.<tag>` → `<cust>.<band>._` | 대사 배열. cust: student/college/office/mania |
| revisit.json | `<cust>` | 대사 배열. `{improvement}` 자리에 개선 항목 치환 |

placeholder: `{game}` 게임 이름, `{concept}` 콘셉트, `{improvement}` 개선 항목 — `llm/pools.ts`가 치환.

## 정식 콘텐츠 ID (단일 기준 — `src/data/ids.ts` 가 이 표를 코드로 정의하고, 모든 모듈은 그것만 import)

| 축 | ID ↔ 한글 라벨 |
|---|---|
| genre | runner=액션 러너 · shooter=슈팅 · puzzle=퍼즐 · rhythm=리듬 |
| concept | neon=네온 시티 · space=우주 · ghost=유령 저택 · candy=캔디 랜드 |
| cust(타깃/손님) | student=학생 · college=대학생 · office=직장인 · mania=마니아 |
| feature | combo=콤보 대시 · ranking=글로벌 랭킹 · story=스토리 모드 · hardcore=초고난도 모드 |
| decision | fun=재미 우선 · polish=완성도 우선 · ship=빠른 출시 |
| band | pos(만족≥75) · mid(45~74) · neg(<45) |
| tag | visual=+연출 · price=-가격 · difficulty=-난이도 · controls=-조작 · bugs=-버그 · playtime=+플레이타임 · ranking-request=랭킹 요청 |
| who(팀원) | pl=도윤(기획) · ds=루나(디자인) · dv=준호(개발) · qa=세라(QA) |

pool 키가 이 ID 와 다르면 조용히 `_` 폴백으로 새는 버그가 된다 — 새 키 추가 시 이 표와 `ids.ts` 를 함께 갱신할 것.
