/* 오락실 씬 (목업 1b 구도 — PLACE/OPEN/REPORT 의 무대).
   T2: 골격 + 초기 상태(빈 슬롯 6개·카펫 바닥). 배치·영업 시뮬은 T6~T7 에서 이 위에 얹는다. */
import type { Action, GameState } from '../core/store'
import { renderHud } from './hud'

/* 빈 슬롯 좌표 (중앙 영역 864×694 기준 — 뒷줄 3 + 앞줄 3) */
const SLOT_POS: { left: number; top: number }[] = [
  { left: 100, top: 170 },
  { left: 377, top: 170 },
  { left: 654, top: 170 },
  { left: 100, top: 410 },
  { left: 377, top: 410 },
  { left: 654, top: 410 },
]

function slot(i: number): string {
  const p = SLOT_POS[i]
  return `
    <div class="slot-empty" data-slot="${i}" style="left:${p.left}px;top:${p.top}px">
      <span class="plus">+</span><span class="sl">빈 슬롯</span><span class="ss">여기에 배치</span>
    </div>`
}

export function renderArcade(state: GameState, dispatch: (a: Action) => void): HTMLElement {
  const el = document.createElement('div')
  el.className = 'scene arcade'
  el.appendChild(renderHud(state, dispatch))
  el.insertAdjacentHTML(
    'beforeend',
    `
    <div class="scene-body">
      <div class="side-panel left">
        <div class="panel-title">▚ 보유 게임 0</div>
        <div class="dashed-slot"><span class="plus">+</span>새 게임은 회의실에서 제작</div>
        <div class="v-spacer"></div>
        <div class="tip-box">완성한 게임 카드를 <span style="color:var(--point)">빈 슬롯</span>에 배치하면 게임기가 설치됩니다.</div>
      </div>
      <div class="scene-floor arcade-floor" data-tile="carpet">
        <div class="arcade-wall"></div>
        <div class="neon-strip"></div>
        <div class="neon-sign">★ PIXEL ARCADE ★</div>
        <div class="neon-sub">COIN · PLAY · REPEAT</div>
        ${state.slots.map((_, i) => slot(i)).join('')}
        <div class="zone-label pink" style="left:344px;top:120px">중앙 인기 구역</div>
        <div class="zone-label purple" style="right:22px;top:120px">구석 마니아 구역</div>
        <div class="prop" style="left:12px;bottom:96px;z-index:20"><canvas data-sprite="cab:claw:pink:x" data-scale="4" style="width:80px;height:68px"></canvas></div>
        <div class="entrance" data-tile="walk">
          <div class="entrance-sign">OPEN 10:00-22:00</div>
        </div>
        <div class="zone-label green" style="right:246px;bottom:40px">입구 →</div>
      </div>
      <div class="side-panel right">
        <div class="panel-title">▚ 실시간 손님 반응</div>
        <div class="dashed-slot">영업을 시작하면 손님 반응이 표시됩니다</div>
        <div class="panel-title" style="margin-top:4px">▚ 유형별 만족도</div>
        <div class="stat-card">
          ${(['학생', '대학생', '직장인', '마니아'] as const)
            .map(
              (t, i) => `
          <div class="stat-row"><span class="k">${t}</span><div class="bar"><div style="width:0%;background:var(${['--c-student', '--c-college', '--c-office', '--c-mania'][i]})"></div></div><span class="n">—</span></div>`,
            )
            .join('')}
        </div>
        <div class="v-spacer"></div>
        <div class="tip-box">Tip. 손님 유형마다 선호 장르·난이도·가격 민감도가 다릅니다.</div>
      </div>
    </div>
    <div class="bottom-bar">
      <div class="agenda-head">
        <div class="panel-title small">▚ 선택 기기</div>
        <div class="agenda-q">아직 설치된 게임기가 없습니다</div>
        <div class="agenda-sub">회의실에서 첫 게임을 만들어 보세요</div>
      </div>
    </div>`,
  )
  return el
}
