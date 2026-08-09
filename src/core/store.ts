/* 단일 상태 트리 + dispatch — 유일한 상태 변경 경로 (TECH_SPEC).
   reduce 는 순수 함수(Vitest 직접 테스트), 씬은 render(state) + 이벤트 → dispatch 만 한다. */
import { rng } from './rng'
import { TEAM } from '../data/personas'

/** GAME_DESIGN §1 상태 기계 */
export type Phase = 'title' | 'plan' | 'meeting' | 'decide' | 'place' | 'open' | 'report' | 'tryout'
/** HUD 탭 — 어느 공간을 보고 있는가 (phase 와 독립적으로 오갈 수 있다) */
export type Tab = 'meeting' | 'arcade'

export interface TeamMemberState {
  id: string
  name: string
  role: string
  level: number
  exp: number // 0..100, 100 도달 시 레벨업 (T9)
  condition: 'normal' | 'tired'
}

export interface GameState {
  phase: Phase
  tab: Tab
  seed: number
  coins: number
  reputation: number
  week: number
  team: TeamMemberState[]
  /** 오락실 슬롯 6개 — 배치된 게임 id 또는 null (배치는 T6) */
  slots: (string | null)[]
}

export type Action =
  | { type: 'START' } // 타이틀 → 회의실(plan)
  | { type: 'TAB'; tab: Tab }
  | { type: 'PHASE'; phase: Phase }
  | { type: 'RESET'; seed: number } // 새 게임 (setSeed 경유)

export function initialState(seed: number): GameState {
  return {
    phase: 'title',
    tab: 'meeting',
    seed,
    coins: 10000,
    reputation: 100,
    week: 1,
    team: TEAM.map((t) => ({ id: t.id, name: t.name, role: t.role, level: t.level, exp: 0, condition: 'normal' })),
    slots: Array<string | null>(6).fill(null),
  }
}

/** phase 가 소속된 공간 — 전환 시 탭을 따라가게 한다 (title 은 탭 없음) */
const TAB_OF: Record<Phase, Tab | null> = {
  title: null,
  plan: 'meeting',
  meeting: 'meeting',
  decide: 'meeting',
  place: 'arcade',
  open: 'arcade',
  report: 'arcade',
  tryout: 'arcade',
}

export function reduce(state: GameState, action: Action): GameState {
  switch (action.type) {
    case 'RESET':
      return initialState(action.seed)
    case 'START':
      return state.phase === 'title' ? { ...state, phase: 'plan', tab: 'meeting' } : state
    case 'TAB':
      return state.phase === 'title' ? state : { ...state, tab: action.tab }
    case 'PHASE':
      return { ...state, phase: action.phase, tab: TAB_OF[action.phase] ?? state.tab }
  }
}

export interface Store {
  getState(): GameState
  dispatch(action: Action): void
  subscribe(fn: (state: GameState) => void): () => void
}

function createStore(): Store {
  let state = initialState(rng.seed())
  const subs = new Set<(s: GameState) => void>()
  return {
    getState: () => state,
    dispatch(action) {
      state = reduce(state, action)
      subs.forEach((fn) => fn(state))
    },
    subscribe(fn) {
      subs.add(fn)
      return () => subs.delete(fn)
    },
  }
}

export const store = createStore()
