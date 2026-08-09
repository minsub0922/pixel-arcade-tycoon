/* 공용 HUD 바 (목업 1a/1b 상단) — 코인·평판·주차 + 회의실/오락실 탭 */
import type { Action, GameState, Tab } from '../core/store'

export function renderHud(state: GameState, dispatch: (a: Action) => void): HTMLElement {
  const el = document.createElement('div')
  el.className = 'hud'
  el.innerHTML = `
    <div class="hud-stat"><canvas data-sprite="icon:coin" data-scale="3" style="width:24px;height:24px"></canvas><span class="v" style="color:var(--yellow)">${state.coins.toLocaleString('ko-KR')}</span></div>
    <div class="hud-stat"><canvas data-sprite="icon:star" data-scale="3" style="width:24px;height:24px"></canvas><span class="v" style="color:var(--orange)">${state.reputation}</span><span class="l">평판</span></div>
    <div class="hud-stat"><span class="v" style="color:var(--point)">${state.week}주차</span></div>
    <div class="hud-spacer"></div>
    <div class="tabs">
      <button class="tab${state.tab === 'meeting' ? ' active-meeting' : ''}" data-tab="meeting"><canvas data-sprite="icon:bulb" data-scale="2" style="width:16px;height:16px"></canvas>회의실</button>
      <button class="tab${state.tab === 'arcade' ? ' active-arcade' : ''}" data-tab="arcade"><canvas data-sprite="icon:pad" data-scale="2" style="width:16px;height:10px"></canvas>오락실</button>
    </div>`
  el.querySelectorAll<HTMLButtonElement>('.tab').forEach((b) =>
    b.addEventListener('click', () => dispatch({ type: 'TAB', tab: b.dataset.tab as Tab })),
  )
  return el
}
