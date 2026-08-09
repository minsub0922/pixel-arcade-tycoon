/* 회의실 씬 (목업 1a 구도 — PLAN/MEETING/DECIDE 의 무대).
   T2: 골격 + 초기 상태 데이터. 기획 선택·회의 연출은 T3~T4 에서 이 위에 얹는다. */
import type { Action, GameState, TeamMemberState } from '../core/store'
import { teamDef } from '../data/personas'
import { renderHud } from './hud'

/* 팀원 배치 좌표·idle 리듬 (목업 1a 그대로) */
const SPOTS: Record<string, { left: string; top: number; z: number; dur: string; delay: string; face: string }> = {
  pl: { left: 'calc(50% - 268px)', top: 330, z: 22, dur: '1.4s', delay: '0s', face: 'happy' },
  ds: { left: 'calc(50% - 130px)', top: 242, z: 12, dur: '1.7s', delay: '.4s', face: 'happy' },
  dv: { left: 'calc(50% + 60px)', top: 242, z: 12, dur: '2.2s', delay: '0s', face: 'normal' },
  qa: { left: 'calc(50% + 196px)', top: 330, z: 22, dur: '1.5s', delay: '.8s', face: 'normal' },
}

function actor(m: TeamMemberState): string {
  const spot = SPOTS[m.id]
  const def = teamDef(m.id)
  const face = m.condition === 'tired' ? 'tired' : spot.face
  return `
    <div class="actor" style="left:${spot.left};top:${spot.top}px;z-index:${spot.z}">
      <div class="actor-shadow"></div>
      <div class="bobber" style="animation-duration:${spot.dur};animation-delay:${spot.delay}">
        <div class="overhead"><span class="overhead-name" style="color:${def.chip}">${m.name} · ${m.role} Lv${m.level}</span></div>
        <canvas data-sprite="ch:${m.id}:stand:${face}" data-scale="5" style="width:80px;height:95px"></canvas>
      </div>
    </div>`
}

function memberCard(m: TeamMemberState): string {
  const def = teamDef(m.id)
  return `
    <div class="member-card">
      <canvas data-sprite="ch:${m.id}:stand:normal" data-scale="3" style="width:48px;height:57px;flex:none"></canvas>
      <div class="member-info">
        <div class="member-name">${m.name} <span class="role-badge" style="background:${def.badge}">${m.role} Lv${m.level}</span></div>
        <div class="exp-bar"><div style="width:${m.exp}%"></div></div>
        <div class="member-note">성향: ${def.bias}</div>
      </div>
    </div>`
}

export function renderMeeting(state: GameState, dispatch: (a: Action) => void): HTMLElement {
  const el = document.createElement('div')
  el.className = 'scene meeting'
  el.appendChild(renderHud(state, dispatch))
  el.insertAdjacentHTML(
    'beforeend',
    `
    <div class="scene-body">
      <div class="side-panel left">
        <div class="panel-title">▚ 현재 게임 기획</div>
        <div class="dashed-slot"><span class="plus">+</span>아직 기획한 게임이 없습니다</div>
        <div class="v-spacer"></div>
        <div class="tip-box">회의에서 장르·콘셉트·타깃·특징을 고르면 <span style="color:var(--yellow)">첫 게임</span> 제작이 시작됩니다.</div>
      </div>
      <div class="scene-floor meeting-floor" data-tile="wood">
        <div class="meeting-wall"></div>
        <div class="meeting-wall-trim"></div>
        <div class="plan-board">
          <span class="board-label">게임 기획 보드</span>
          <span class="board-empty">첫 기획을 기다리는 중…</span>
        </div>
        <div class="win-frame"><canvas data-sprite="prop:window" data-scale="5" style="width:130px;height:90px"></canvas></div>
        <div class="prop" style="left:30px;top:170px;z-index:11"><canvas data-sprite="prop:shelf" data-scale="4" style="width:96px;height:72px"></canvas></div>
        <div class="meeting-rug"></div>
        <div class="prop" style="left:50%;top:378px;transform:translateX(-50%);z-index:20"><canvas data-sprite="prop:table" data-scale="5" style="width:220px;height:95px"></canvas></div>
        <div class="prop" style="left:50%;top:372px;transform:translateX(-146px);z-index:21"><canvas data-sprite="item:laptop" data-scale="3" style="width:36px;height:24px"></canvas></div>
        <div class="prop" style="left:50%;top:390px;transform:translateX(46px);z-index:21"><canvas data-sprite="item:note" data-scale="3" style="width:30px;height:18px"></canvas></div>
        <div class="prop" style="left:50%;top:404px;transform:translateX(-40px);z-index:21"><canvas data-sprite="item:coffee" data-scale="3" style="width:21px;height:21px"></canvas></div>
        <div class="prop" style="left:50%;top:369px;transform:translateX(100px);z-index:21"><canvas data-sprite="item:tablet" data-scale="3" style="width:27px;height:21px"></canvas></div>
        ${state.team.map(actor).join('')}
        <div class="prop" style="left:22px;bottom:20px;z-index:30"><canvas data-sprite="prop:plant" data-scale="5" style="width:70px;height:85px"></canvas></div>
        <div class="prop" style="right:20px;bottom:24px;z-index:30"><canvas data-sprite="prop:plant" data-scale="4" style="width:56px;height:68px"></canvas></div>
      </div>
      <div class="side-panel right">
        <div class="panel-title">▚ 팀원 에이전트</div>
        ${state.team.map(memberCard).join('')}
        <div class="v-spacer"></div>
        <div class="tip-box">Tip. 팀원은 손님 피드백을 겪을수록 <span style="color:var(--yellow)">기억</span>을 쌓고 새 <span style="color:var(--pastel-pink)">스킬</span>을 배웁니다.</div>
      </div>
    </div>
    <div class="bottom-bar">
      <div class="agenda-head">
        <div class="panel-title small">▚ 이번 회의 안건</div>
        <div class="agenda-q">첫 게임, 무엇을 만들까?</div>
        <div class="agenda-sub">기획을 고르면 팀원 회의가 시작됩니다</div>
      </div>
    </div>`,
  )
  return el
}
