import './style.css'
import { renderArtDemo } from './art/demo'
import { fallbackCount, mountSprites } from './art/sprites'
import { clock } from './core/clock'
import { rng } from './core/rng'
import { store, type Action, type GameState } from './core/store'
import { renderArcade } from './scenes/arcade'
import { renderMeeting } from './scenes/meeting'
import { renderTitle } from './scenes/title'

/*
 * 부트스트랩 — ① 해시 라우팅 (#art 데모 시트 / 게임)
 * ② 1440×900 스테이지 스케일 fit(레터박스) ③ store 구독 → 씬 마운트 ④ __GAME_TEST__ 노출.
 */

const app = document.querySelector<HTMLDivElement>('#app')!
const dispatch = (a: Action): void => store.dispatch(a)

function fitStage(): void {
  const stage = app.querySelector<HTMLDivElement>('.stage')
  if (!stage) return
  stage.style.transform = `scale(${Math.min(window.innerWidth / 1440, window.innerHeight / 900)})`
}
window.addEventListener('resize', fitStage)

/* 씬 선택: title 은 전용 씬, 그 외에는 tab 이 보고 있는 공간을 렌더 */
function sceneFor(state: GameState): HTMLElement {
  if (state.phase === 'title') return renderTitle(dispatch)
  return state.tab === 'meeting' ? renderMeeting(state, dispatch) : renderArcade(state, dispatch)
}

let stage: HTMLDivElement | null = null
function renderGame(state: GameState): void {
  if (!stage) return
  stage.replaceChildren(sceneFor(state))
  mountSprites(stage)
}
store.subscribe(renderGame)

function route(): void {
  app.innerHTML = ''
  stage = null
  const isArt = location.hash === '#art'
  document.body.classList.toggle('scroll-page', isArt)
  if (isArt) {
    renderArtDemo(app)
    return
  }
  stage = document.createElement('div')
  stage.className = 'stage'
  app.appendChild(stage)
  renderGame(store.getState())
  fitStage()
}
window.addEventListener('hashchange', route)
clock.start()
route()

// ── 테스트 인터페이스 (TECH_SPEC — T2 최소 구현, 시뮬 필드는 이후 태스크가 채운다) ──
let clicks = 0
window.addEventListener('click', () => clicks++, true)

declare global {
  interface Window {
    __GAME_TEST__: {
      setSeed(seed: number): void
      loadScenario(id: string): void
      getState(): GameState
      step(ms: number): void
      dispatch(action: unknown): void
      getTelemetry(): unknown
      llmMode(): 'pool' | 'proxy' | 'direct'
    }
  }
}

window.__GAME_TEST__ = {
  setSeed(seed) {
    rng.setSeed(seed)
    clock.reset()
    store.dispatch({ type: 'RESET', seed })
  },
  loadScenario: () => {},
  getState: () => JSON.parse(JSON.stringify(store.getState())) as GameState,
  step: (ms) => clock.step(ms),
  dispatch: (a) => store.dispatch(a as Action),
  getTelemetry: () => ({
    cycles: 0,
    clicks,
    elapsedVirtualMs: clock.elapsedVirtualMs(),
    satisfactionByType: {},
    tagCounts: {},
    llmCalls: { pool: 0, proxy: 0, direct: 0 },
    spriteFallbackCount: fallbackCount(),
    sfxPlayedKinds: [],
  }),
  llmMode: () => 'pool',
}
