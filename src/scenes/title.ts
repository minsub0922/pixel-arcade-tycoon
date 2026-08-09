/* 타이틀 — 도트 네온 로고 + 팀원·캐비닛 스프라이트, 시작 버튼 → plan */
import type { Action } from '../core/store'

const CABS = ['cab:std:pink:runner', 'cab:std:blue:shooter', 'cab:std:purple:puzzle', 'cab:std:yellow:rhythm', 'cab:std:mint:shooter']
const CHARS = ['ch:pl:stand:happy', 'ch:ds:stand:happy', 'ch:dv:stand:normal', 'ch:qa:stand:normal']

export function renderTitle(dispatch: (a: Action) => void): HTMLElement {
  const el = document.createElement('div')
  el.className = 'scene title-scene'
  el.innerHTML = `
    <div class="title-cabs">${CABS.map(
      (c) => `<canvas data-sprite="${c}" data-scale="4" style="width:80px;height:96px"></canvas>`,
    ).join('')}</div>
    <div class="title-logo"><span class="l1">PIXEL ARCADE</span><span class="l2">TYCOON</span></div>
    <div class="title-sub">AI 팀원과 게임을 만들고, AI 손님의 반응으로 키워가는 오락실</div>
    <div class="title-team">${CHARS.map(
      (c, i) =>
        `<div class="bobber" style="animation-duration:${1.2 + i * 0.25}s;animation-delay:${i * 0.2}s"><canvas data-sprite="${c}" data-scale="4" style="width:64px;height:76px"></canvas></div>`,
    ).join('')}</div>
    <button class="btn-cta title-start">▶ 시작하기</button>`
  el.querySelector('.title-start')!.addEventListener('click', () => dispatch({ type: 'START' }))
  return el
}
