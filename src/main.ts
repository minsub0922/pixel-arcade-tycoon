import './style.css'
import { renderArtDemo } from './art/demo'
import { rng } from './core/rng'

/*
 * 부트스트랩 (스캐폴드 단계).
 * T2에서 store/씬 시스템으로 대체된다 — 이 파일의 역할은
 * ① 해시 라우팅 (#art 데모 시트 / 그 외 부트 화면)
 * ② 1440×900 스테이지 스케일 fit ③ __GAME_TEST__ 노출.
 */

const app = document.querySelector<HTMLDivElement>('#app')!

function fitStage(): void {
  const stage = app.querySelector<HTMLDivElement>('.stage')
  if (!stage) return
  const scale = Math.min(window.innerWidth / 1440, window.innerHeight / 900)
  stage.style.transform = `scale(${scale})`
}
window.addEventListener('resize', fitStage)

function renderBoot(): void {
  const stage = document.createElement('div')
  stage.className = 'stage'
  app.appendChild(stage)
  stage.innerHTML = `
    <div style="height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:18px">
      <h1 style="margin:0;font-size:34px;font-weight:normal;color:var(--yellow);text-shadow:4px 4px 0 #000;animation:neonf 4s infinite">
        PIXEL ARCADE TYCOON</h1>
      <p style="margin:0;font-size:14px;color:var(--text-mute)">scaffold OK — T2(씬 시스템)부터 시작하세요 · <a href="#art" style="color:var(--point)">#art 스프라이트 시트</a></p>
      <div class="chip" style="background:var(--bg-card-dark);color:var(--pastel-mint);border-color:var(--ink)">v0.1.0 · seed 기반 결정론 · pool LLM</div>
    </div>`
  fitStage()
}

function route(): void {
  app.innerHTML = ''
  const isArt = location.hash === '#art'
  document.body.classList.toggle('scroll-page', isArt)
  if (isArt) renderArtDemo(app)
  else renderBoot()
}
window.addEventListener('hashchange', route)
route()

// ── 테스트 인터페이스 (T2에서 실제 store 와 연결, 지금은 부팅 검증용 스텁) ──
declare global {
  interface Window {
    __GAME_TEST__: {
      setSeed(seed: number): void
      loadScenario(id: string): void
      getState(): unknown
      step(ms: number): void
      dispatch(action: unknown): void
      getTelemetry(): unknown
      llmMode(): 'pool' | 'proxy' | 'direct'
    }
  }
}

window.__GAME_TEST__ = {
  setSeed: (seed) => rng.setSeed(seed),
  loadScenario: () => {},
  getState: () => ({ phase: 'boot', seed: rng.seed() }),
  step: () => {},
  dispatch: () => {},
  getTelemetry: () => ({ cycles: 0, llmCalls: 0 }),
  llmMode: () => 'pool',
}
