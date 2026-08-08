import { describe, expect, it } from 'vitest'
import { PALETTE, chGrid, iconGrid, propGrid } from '../../src/art/sprites'

const CHAR_KEYS = ['pl', 'ds', 'dv', 'qa', 'st', 'st2', 'co', 'co2', 'of', 'ma']
const POSES = ['stand', 'walk', 'cheer', 'back', 'sad']
const FACES = ['normal', 'happy', 'sad', 'wow', 'tired', 'focus', 'angry']
const EMOTION_ICONS = ['heart', 'star', 'wow', 'music', 'anger', 'cloud', 'sweat', 'zzz', 'q', 'ex', 'bulb', 'bug', 'coin', 'chk', 'up', 'spark']

describe('sprites — 팔레트', () => {
  it('ART_BIBLE G 맵 키·hex 일치', () => {
    expect(PALETTE.O).toBe('#1a1c2c')
    expect(PALETTE.K).toBe('#141631')
    expect(PALETTE.k).toBe('#2b3050')
    expect(PALETTE.V).toBe('#f2ead8')
    expect(PALETTE.Y).toBe('#ffd23e')
    expect(PALETTE.y).toBe('#c99a1c')
    expect(PALETTE.N).toBe('#57d99b')
    expect(PALETTE.C).toBe('#7de0ff')
    expect(PALETTE.R).toBe('#ff6b8a')
    expect(PALETTE.P).toBe('#ff9edb')
    expect(PALETTE.Q).toBe('#9fe8c1')
    expect(PALETTE.g).toBe('#9aa3c2')
    expect(PALETTE.G).toBe('#3a3f5c')
    expect(PALETTE.D).toBe('#d9a06b')
    expect(PALETTE.d).toBe('#a8763e')
    expect(PALETTE.U).toBe('#e8b06e')
    expect(PALETTE.u).toBe('#c98a4b')
  })
})

describe('sprites — chGrid', () => {
  it('전 캐릭터 × 포즈: 16×19 그리드', () => {
    for (const key of CHAR_KEYS)
      for (const pose of POSES) {
        const o = chGrid(key, pose, 'normal')
        expect(o, `${key}:${pose}`).not.toBeNull()
        expect(o!.rows).toHaveLength(19)
        for (const row of o!.rows) expect(row, `${key}:${pose}`).toHaveLength(16)
      }
  })

  it('그리드의 모든 문자가 팔레트에 정의됨', () => {
    for (const key of CHAR_KEYS)
      for (const pose of POSES)
        for (const face of FACES) {
          const o = chGrid(key, pose, face)!
          for (const row of o.rows)
            for (const ch of row)
              if (ch !== '.') expect(o.pal[ch], `${key}:${pose}:${face} 문자 "${ch}"`).toMatch(/^#/)
        }
  })

  it('표정별 그리드가 실제로 달라진다', () => {
    const normal = chGrid('ds', 'stand', 'normal')!.rows.join()
    const happy = chGrid('ds', 'stand', 'happy')!.rows.join()
    expect(normal).not.toBe(happy)
  })

  it('미정의 키는 null', () => {
    expect(chGrid('zz', 'stand', 'normal')).toBeNull()
  })
})

describe('sprites — 아이콘·소품', () => {
  it('감정 아이콘 16종: 8×8, 팔레트 문자만 사용', () => {
    for (const name of EMOTION_ICONS) {
      const rows = iconGrid(name)
      expect(rows, name).not.toBeNull()
      expect(rows!).toHaveLength(8)
      for (const row of rows!) {
        expect(row).toHaveLength(8)
        for (const ch of row) if (ch !== '.') expect(PALETTE[ch], `${name} 문자 "${ch}"`).toMatch(/^#/)
      }
    }
  })

  it('소품 절차 생성 크기 (ART_BIBLE 규격)', () => {
    const sizes: Record<string, [number, number]> = {
      table: [44, 19], plant: [14, 17], shelf: [24, 18], window: [26, 18],
    }
    for (const [name, [w, h]] of Object.entries(sizes)) {
      const o = propGrid(name)
      expect(o, name).not.toBeNull()
      expect(o!.rows).toHaveLength(h)
      for (const row of o!.rows) expect(row, name).toHaveLength(w)
    }
    expect(propGrid('unknown')).toBeNull()
  })
})
