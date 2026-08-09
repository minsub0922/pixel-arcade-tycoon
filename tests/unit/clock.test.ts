import { beforeEach, describe, expect, it } from 'vitest'
import { clock } from '../../src/core/clock'

beforeEach(() => clock.reset())

describe('clock', () => {
  it('after: step 으로 만기 시 1회 실행', () => {
    let n = 0
    clock.after(100, () => n++)
    clock.step(99)
    expect(n).toBe(0)
    clock.step(1)
    expect(n).toBe(1)
    clock.step(1000)
    expect(n).toBe(1)
  })

  it('every: 주기마다 반복, cancel 로 중단', () => {
    let n = 0
    const id = clock.every(10, () => n++)
    clock.step(35)
    expect(n).toBe(3)
    clock.cancel(id)
    clock.step(100)
    expect(n).toBe(3)
  })

  it('만기 순서대로 실행 — 한 step 안에서도 시간순', () => {
    const order: string[] = []
    clock.after(30, () => order.push('b'))
    clock.after(10, () => order.push('a'))
    clock.step(50)
    expect(order).toEqual(['a', 'b'])
  })

  it('콜백 안에서 등록한 타이머도 같은 step 에서 만기 처리', () => {
    let fired = false
    clock.after(10, () => clock.after(10, () => (fired = true)))
    clock.step(20)
    expect(fired).toBe(true)
  })

  it('elapsedVirtualMs 누적, reset 으로 초기화', () => {
    clock.step(500)
    clock.step(250)
    expect(clock.elapsedVirtualMs()).toBe(750)
    clock.reset()
    expect(clock.elapsedVirtualMs()).toBe(0)
  })

  it('every(0) 도 무한루프 없이 진행 (최소 1ms 주기)', () => {
    let n = 0
    clock.every(0, () => n++)
    clock.step(10)
    expect(n).toBe(10)
  })
})
