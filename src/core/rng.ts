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

export const rng = {
  setSeed(seed: number): void {
    currentSeed = seed
    current = mulberry32(seed)
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
