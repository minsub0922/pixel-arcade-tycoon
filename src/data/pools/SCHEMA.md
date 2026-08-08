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
