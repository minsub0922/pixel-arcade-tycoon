import { describe, expect, it } from 'vitest'
import { initialState, reduce } from '../../src/core/store'

describe('initialState', () => {
  it('GAME_DESIGN §6 시작 자원 — 코인 10,000 · 평판 100 · 1주차', () => {
    const s = initialState(42)
    expect(s.phase).toBe('title')
    expect(s.coins).toBe(10000)
    expect(s.reputation).toBe(100)
    expect(s.week).toBe(1)
    expect(s.team).toHaveLength(4)
    expect(s.slots).toEqual([null, null, null, null, null, null])
  })

  it('직렬화 가능 (getState 스냅샷 계약)', () => {
    const s = initialState(7)
    expect(JSON.parse(JSON.stringify(s))).toEqual(s)
  })
})

describe('reduce', () => {
  it('START: title → plan, 회의실 탭', () => {
    const s = reduce(initialState(1), { type: 'START' })
    expect(s.phase).toBe('plan')
    expect(s.tab).toBe('meeting')
  })

  it('START 는 title 에서만 동작', () => {
    const s = { ...initialState(1), phase: 'plan' as const }
    expect(reduce(s, { type: 'START' })).toBe(s)
  })

  it('TAB: 두 공간을 오간다 (title 에서는 무시)', () => {
    const title = initialState(1)
    expect(reduce(title, { type: 'TAB', tab: 'arcade' })).toBe(title)
    const s = reduce(title, { type: 'START' })
    expect(reduce(s, { type: 'TAB', tab: 'arcade' }).tab).toBe('arcade')
    expect(reduce(reduce(s, { type: 'TAB', tab: 'arcade' }), { type: 'TAB', tab: 'meeting' }).tab).toBe('meeting')
  })

  it('PHASE: phase 소속 공간으로 탭이 따라간다', () => {
    const s = reduce(initialState(1), { type: 'START' })
    const placed = reduce(s, { type: 'PHASE', phase: 'place' })
    expect(placed.phase).toBe('place')
    expect(placed.tab).toBe('arcade')
    const meeting = reduce(placed, { type: 'PHASE', phase: 'meeting' })
    expect(meeting.tab).toBe('meeting')
  })

  it('RESET: seed 로 새 게임', () => {
    const s = reduce(initialState(1), { type: 'START' })
    const r = reduce(s, { type: 'RESET', seed: 99 })
    expect(r.phase).toBe('title')
    expect(r.seed).toBe(99)
    expect(r.coins).toBe(10000)
  })
})
