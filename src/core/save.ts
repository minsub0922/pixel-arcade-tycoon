/* localStorage 저장 스텁 (T2) — 자동 저장·이어하기 연결은 T10.
   버전 불일치·손상 데이터는 null 반환 → 호출부가 새 게임 시작 (크래시 금지, TECH_SPEC 오류 처리). */
import type { GameState } from './store'

const KEY = 'pat:save'
const VERSION = 1

export function save(state: GameState): boolean {
  try {
    localStorage.setItem(KEY, JSON.stringify({ v: VERSION, state }))
    return true
  } catch {
    return false
  }
}

export function load(): GameState | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as { v?: number; state?: GameState }
    if (data.v !== VERSION || !data.state || typeof data.state.phase !== 'string') return null
    return data.state
  } catch {
    return null
  }
}

export function clear(): void {
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* 저장 불가 환경 무시 */
  }
}
