# AI 활용 기술 문서 — Pixel Arcade Tycoon

> 제출 전 PDF 변환. `(제출 시 확정)` 은 T13에서 실제 구현·프롬프트로 갱신된다.

## 1. 개요 — "AI로 만든, AI가 게임을 만드는 게임"

이 프로젝트는 AI를 세 층위로 사용한다.

| 층위 | 내용 |
|---|---|
| 게임 속 AI (런타임) | AI 팀원 4명과 AI 손님 4유형이 게임 제작·평가의 주체로 등장. 대사·게임 이름·피드백을 LLM(Gemini)이 실시간 생성 |
| 콘텐츠 생성 (빌드 타임) | 대사 풀을 LLM으로 대량 사전 생성해 정적 포함 — 오프라인·장애 시에도 동일한 경험 |
| 개발 도구 | Claude Code + Ralphy 자율 루프가 명세→태스크→구현→자동 플레이테스트를 반복. 도트 아트 전량을 코드로 생성 |

## 2. 아키텍처

```
[브라우저 (GitHub Pages 정적 배포)]
  게임 룰 엔진 (TypeScript, 결정론적·seed 기반)  ←— 수치·판정의 유일한 주체
  LLM 어댑터: pool(기본) → proxy(라이브) → direct(dev 전용)
      │ POST {kind, context}
      ▼
[Cloudflare Workers 프록시] — API 키는 서버 secret (클라이언트 무키)
      │ generateContent
      ▼
[Gemini (gemini-2.5-flash-lite)]
```

### 설계 원칙: LLM 경계

- LLM은 **표시 문자열만** 생성한다(회의 대사·게임 이름·손님 감상). 게임 수치·판정·상태 전환은 100% 결정론적 룰 엔진 — 같은 seed·같은 입력이면 항상 같은 결과.
- 근거: ① 심사자가 언제 실행해도 재현 가능 ② LLM 실패가 게임을 깨지 못함 ③ 밸런스 붕괴 원천 차단.
- 3단 폴백: 프록시 미설정·타임아웃(2.5s)·오류 시 사전 생성 풀로 **무공지 전환** — 심사 환경에서 유료 키가 전혀 필요 없다.

### memory / multi-turn / self-improvement

- 손님은 방문 이력을 기억한다: 이전 사이클의 불만 항목이 개선되면 재방문 대사로 언급 ("지난번보다 판정이 좋아졌네").
- 팀원은 결산 경험으로 EXP·레벨·스킬을 얻고 **기억 카드**("학생층은 경쟁을 좋아함")를 생성 — 이후 회의 추천과 LLM 대사 컨텍스트에 반영.

## 3. 주요 프롬프트

(제출 시 확정 — `cloudflare/worker.js` 의 시스템 프롬프트 4종 + `src/llm/prompts.ts` 의 컨텍스트 빌더 전문, 실패 사례와 개선 반복 포함)

## 4. 개발 과정에서의 AI 활용 (L1)

- **Claude Code (Fable 5)**: 저장소 조사 → 사용자 인터뷰 → 명세 7종·태스크 13종 생성 → 검증. 본 문서 포함 전 문서가 이 파이프라인의 산출물.
- **Ralphy 자율 루프**: fresh context 에이전트가 태스크당 1회씩 구현→자동 플레이(Playwright)→증거 저장→커밋. 커밋 히스토리가 과정의 증거다.
- **Claude Design**: UI 목업(회의실·오락실·아바타 시트·컴포넌트 시트)을 대화로 제작 — 목업의 코드 정의 스프라이트 엔진을 게임에 그대로 이식 (`reference/mockup/`).
- 개발 로그: 저장소 `devlog.md` (이터레이션별 프롬프트·실패·배움).

## 5. 외부 에셋 / 오픈소스 출처

| 항목 | 출처 | 라이선스 |
|---|---|---|
| 이미지·스프라이트 | 전량 코드 생성 (외부 이미지 0) | — |
| 효과음 | Web Audio 절차 생성 (외부 오디오 0) | — |
| 폰트 NeoDunggeunmo v1.601 | https://github.com/neodgm/neodgm — `public/fonts/` self-host, LICENSE.txt 동봉 | SIL OFL 1.1 |
| 폰트 Galmuri | https://galmuri.quiple.dev (jsdelivr CDN) | SIL OFL 1.1 |
| 빌드 도구 | Vite, TypeScript, Vitest, Playwright | MIT/Apache-2.0 |
| LLM | Google Gemini API (무료 티어) · Cloudflare Workers (무료) | 각 서비스 약관 |

## 6. 사용 AI 도구 총괄

Claude Code(개발 전 과정·문서), Claude Design(UI 목업), Ralphy(자율 구현 루프), Gemini API(런타임 대사·빌드 타임 콘텐츠 생성). 각 도구의 구체적 활용 내역은 §4 및 devlog.md.
