# Pixel Arcade Tycoon 🕹️

**AI 팀원들과 도트 게임을 만들고, AI 손님들의 반응을 보며 게임을 키워가는 오락실 타이쿤.**

NHN NAN 2026 Game × AI Hackathon 사전과제 제출작 (1인 참가).

> ▶️ **플레이**: https://minsub0922.github.io/pixel-arcade-tycoon/ *(main 푸시 시 자동 배포)*
> 🎬 플레이 영상: (제출 시 링크 추가)

## 어떻게 노는 게임인가

1. **회의실** — 장르·콘셉트·타깃·특징을 골라 게임을 기획하면, AI 팀원 4명(기획 도윤·디자인 루나·개발 준호·QA 세라)이 회의하고, 당신은 trade-off 결정을 내립니다.
2. **오락실** — 완성된 게임을 배치하면 성향이 다른 AI 손님들(학생·대학생·직장인·마니아)이 플레이하고 피드백을 남깁니다.
3. **개선** — 피드백 태그가 다음 회의 안건이 되고, 개선하면 재방문 손님이 알아봅니다. 팀원은 경험으로 성장하고 기억을 쌓습니다.
4. 러너 게임은 **직접 플레이**할 수도 있습니다 (원버튼 점프).

조작: 마우스/터치 클릭. 러너: 스페이스/탭. M: 음소거.

## 로컬 실행

```bash
npm install
npm run dev        # http://localhost:5173
```

LLM 라이브 모드(선택): `.env.example`을 `.env`로 복사해 값 설정. 설정이 없어도 게임은 사전 생성 콘텐츠로 완전 동작합니다.

```bash
npm run build      # 타입체크 + 프로덕션 빌드
npm run test       # 룰 엔진 단위 테스트 (Vitest)
npm run test:e2e   # 자동 플레이 시나리오 (Playwright)
npm run verify     # 위 전부 (완료 게이트)
```

## AI 활용 요약

- **런타임**: 팀원 회의 대사·게임 네이밍·손님 피드백을 Gemini로 생성 (Cloudflare Workers 프록시 경유 — 심사자는 키 불필요). 장애·미설정 시 사전 생성 풀로 무공지 폴백. 게임 수치는 100% 결정론적 룰 엔진이며 LLM은 표현만 담당.
- **개발**: Claude Code + Ralphy 자율 루프로 개발 (커밋 기록 참조), 도트 아트 전량 코드 정의 스프라이트.
- 상세: `submission/ai-tech-doc.md`

## 저장소 구조

`PRODUCT.md`(제품 정의) · `GAME_DESIGN.md`(룰·수치) · `TECH_SPEC.md`(구조·LLM 경계) · `ART_BIBLE.md`(도트 규칙) · `tasks.yaml`(개발 태스크) · `reference/mockup/`(디자인 목업 원본) · `submission/`(제출 문서)

## 에셋·라이선스

외부 이미지·오디오 에셋 없음(전부 코드 생성). 폰트: [NeoDunggeunmo](https://github.com/neodgm/neodgm)(SIL OFL — `public/fonts/` self-host, 라이선스 동봉), [Galmuri](https://galmuri.quiple.dev/)(SIL OFL — CDN). 상세 출처는 `submission/ai-tech-doc.md`.
