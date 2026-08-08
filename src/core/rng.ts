/* 전역 seeded RNG — 게임 내 모든 난수는 이 모듈만 사용한다 (연출 포함). Math.random 금지. */

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

let current = mulberry32(42)
let currentSeed = 42
const forks = new Map<string, () => number>()

export const rng = {
  setSeed(seed: number): void {
    currentSeed = seed
    current = mulberry32(seed)
    forks.clear()
  },
  /**
   * 파생 스트림 — 연출/fx 는 반드시 fork 를 사용한다.
   * 게임 상태 로직은 기본 스트림(next/int/pick/roll), 연출은 fork('fx') 등 —
   * 서로 소비 순서가 독립이라 연출을 스킵해도 상태 결과가 동일하다 (TECH_SPEC §결정성).
   */
  fork(label: string): () => number {
    let f = forks.get(label)
    if (!f) {
      let h = 2166136261
      for (const c of label) h = Math.imul(h ^ c.charCodeAt(0), 16777619)
      f = mulberry32((currentSeed ^ h) >>> 0)
      forks.set(label, f)
    }
    return f
  },
  seed(): number {
    return currentSeed
  },
  /** [0,1) */
  next(): number {
    return current()
  },
  /** 정수 [min, max] */
  int(min: number, max: number): number {
    return min + Math.floor(current() * (max - min + 1))
  },
  pick<T>(arr: readonly T[]): T {
    return arr[Math.floor(current() * arr.length)]
  },
  /** n번 굴린 d면체 합 (예: roll(2,4) = 2d4) */
  roll(n: number, d: number): number {
    let s = 0
    for (let i = 0; i < n; i++) s += 1 + Math.floor(current() * d)
    return s
  },
}
