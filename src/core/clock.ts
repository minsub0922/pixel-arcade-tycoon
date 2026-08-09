/* 게임 타이밍 단일 소스 (TECH_SPEC) — 상태 로직에서 raw setTimeout/rAF 금지.
   실시간 rAF 드라이버와 __GAME_TEST__.step(ms) 가상 시간 가속이 같은 advance() 경로를 탄다.
   elapsedVirtualMs = 실시간 + step 누적 (QUALITY_BAR A6·A7 판정 기준). */

interface Timer {
  id: number
  at: number // 가상 시간 만기(ms)
  interval: number | null // every() 면 반복 주기
  cb: () => void
}

let timers: Timer[] = []
let vnow = 0
let elapsed = 0
let nextId = 1
let started = false

function advance(ms: number): void {
  elapsed += ms
  const target = vnow + ms
  let fired = 0
  for (;;) {
    let next: Timer | null = null
    for (const t of timers) if (t.at <= target && (next === null || t.at < next.at)) next = t
    if (next === null) break
    if (++fired > 10000) {
      // 0ms 자기 재등록 같은 폭주 방호 — 상태를 멈추지 않고 프레임을 끊는다
      console.warn('[clock] 한 advance 에서 타이머 10000회 초과 — 남은 만기는 다음 프레임으로')
      break
    }
    vnow = next.at
    if (next.interval !== null) next.at += next.interval
    else timers = timers.filter((t) => t !== next)
    next.cb()
  }
  vnow = target
}

export const clock = {
  /** ms 후 1회 실행. 반환 id 로 cancel 가능 */
  after(ms: number, cb: () => void): number {
    const id = nextId++
    timers.push({ id, at: vnow + Math.max(0, ms), interval: null, cb })
    return id
  },
  /** ms 주기 반복 (최소 1ms — 0 주기 무한루프 방지) */
  every(ms: number, cb: () => void): number {
    const period = Math.max(1, ms)
    const id = nextId++
    timers.push({ id, at: vnow + period, interval: period, cb })
    return id
  },
  cancel(id: number): void {
    timers = timers.filter((t) => t.id !== id)
  },
  /** 현재 가상 시간(ms) */
  now(): number {
    return vnow
  },
  elapsedVirtualMs(): number {
    return Math.round(elapsed)
  },
  /** 테스트 가속 — 만기 콜백을 동기 실행하며 ms 만큼 전진 */
  step(ms: number): void {
    advance(ms)
  },
  /** 새 게임 — 대기 타이머·시간 전부 초기화 */
  reset(): void {
    timers = []
    vnow = 0
    elapsed = 0
  },
  /** 실시간 드라이버 (브라우저 전용, 1회) — rAF 는 clock 내부에서만 사용한다 */
  start(): void {
    if (started || typeof requestAnimationFrame === 'undefined') return
    started = true
    let last = performance.now()
    const frame = (ts: number): void => {
      advance(Math.min(Math.max(ts - last, 0), 100)) // 탭 비활성 복귀 시 폭주 방지 캡
      last = ts
      requestAnimationFrame(frame)
    }
    requestAnimationFrame(frame)
  },
}
