import { describe, expect, it } from 'vitest'
import { mulberry32, rng } from '../../src/core/rng'

describe('seeded rng', () => {
  it('같은 seed = 같은 수열 (결정성)', () => {
    const a = mulberry32(42)
    const b = mulberry32(42)
    for (let i = 0; i < 100; i++) expect(a()).toBe(b())
  })

  it('다른 seed = 다른 수열', () => {
    const a = mulberry32(1)
    const b = mulberry32(2)
    const seqA = Array.from({ length: 10 }, () => a())
    const seqB = Array.from({ length: 10 }, () => b())
    expect(seqA).not.toEqual(seqB)
  })

  it('int/roll 범위 준수', () => {
    rng.setSeed(7)
    for (let i = 0; i < 200; i++) {
      const v = rng.int(3, 9)
      expect(v).toBeGreaterThanOrEqual(3)
      expect(v).toBeLessThanOrEqual(9)
      const r = rng.roll(2, 4)
      expect(r).toBeGreaterThanOrEqual(2)
      expect(r).toBeLessThanOrEqual(8)
    }
  })

  it('fork 스트림은 기본 스트림과 독립 (연출 스킵 결정성)', () => {
    rng.setSeed(42)
    const a1 = rng.next()
    rng.fork('fx')() // fx 스트림 소비
    const a2 = rng.next()

    rng.setSeed(42)
    const b1 = rng.next()
    // 이번엔 fx 를 소비하지 않음 — 기본 스트림 결과는 동일해야 한다
    const b2 = rng.next()

    expect([a1, a2]).toEqual([b1, b2])
    rng.setSeed(42)
    const f1 = rng.fork('fx')()
    rng.setSeed(42)
    expect(rng.fork('fx')()).toBe(f1) // fork 자체도 seed 재현 가능
  })

  it('setSeed 로 재현 가능', () => {
    rng.setSeed(123)
    const first = [rng.next(), rng.next(), rng.next()]
    rng.setSeed(123)
    const second = [rng.next(), rng.next(), rng.next()]
    expect(first).toEqual(second)
  })
})
