/*
 * 픽셀 스프라이트 엔진 — reference/mockup/Pixel Arcade Tycoon.dc.html 인라인 스크립트 이식.
 * ART_BIBLE: 새 그림체 발명 금지 — 매트릭스·팔레트·셰이딩 로직은 목업 원본과 동일하게 유지한다.
 * 신규 스프라이트는 같은 문자-매트릭스 형식으로 이 파일에만 추가한다.
 */

/** 팔레트 G 맵 (ART_BIBLE §팔레트 — 코드에서도 이 이름 사용) */
export const PALETTE: Record<string, string> = {
  O: '#1a1c2c', W: '#ffffff', E: '#1a1c2c', R: '#ff6b8a', Y: '#ffd23e', y: '#c99a1c',
  N: '#57d99b', C: '#7de0ff', K: '#141631', k: '#2b3050', g: '#9aa3c2', G: '#3a3f5c',
  P: '#ff9edb', Q: '#9fe8c1', D: '#d9a06b', d: '#a8763e', U: '#e8b06e', u: '#c98a4b',
  V: '#f2ead8',
}
const G = PALETTE

/** 자동 셰이딩 (스킨 .78, 기타 .72) — 수동 셰이드 금지 */
function sh(hex: string, f: number): string {
  const n = parseInt(hex.slice(1), 16)
  const r = Math.round(((n >> 16) & 255) * f)
  const g2 = Math.round(((n >> 8) & 255) * f)
  const b = Math.round((n & 255) * f)
  return '#' + ((1 << 24) + (r << 16) + (g2 << 8) + b).toString(16).slice(1)
}
const M = (s: string): string[] => s.split('|')

/* ── 캐릭터 파츠 (16w) ── */
const HEAD = M('....OOOOOOOO....|...OSSSSSSSSO...|..OSSSSSSSSSSO..|..OSSSSSSSSSSO..|..OSSSSSSSSSSO..|..OSSSSSSSSSSO..|...OSSSSSSSSO...|....OOOOOOOO....')
const BHEAD = M('....OOOOOOOO....|...OHHHHHHHHO...|..OHHHHHHHHHHO..|..OHhHHHHHHhHO..|..OHHHHHHHHHHO..|..OHhHHHHHhHHO..|...OHHHHHHHHO...|....OOOOOOOO....')
const BHOOD = M('...OOOOOOOOOO...|..OTTTTTTTTTTO..|.OTTTTTTTTTTTTO.|.OTtTTTTTTTTtTO.|.OTTTTTTTTTTTTO.|.OTTTTtTTtTTTTO.|.OTTTTTTTTTTTTO.|..OOOOOOOOOOOO..')
const TORS = M('..OTTTTTTTTTTO..|..OTTTTTTTTTTO..|..OTtTTTTTTtTO..|..OSTTTTTTTTSO..|...OBBBBBBBBO...|...OBBBBBBBBO...')
const TORC = M('..OTTTTTTTTTTO..|..OTTTTTTTTTTO..|..OTtTTTTTTtTO..|..OTTTTTTTTTTO..|...OBBBBBBBBO...|...OBBBBBBBBO...')
const ARMU = M('.OS..........SO.|.OT..........TO.')
const LEGS = M('....OBBO.OBBO...|....OBBO.OBBO...|....OFFO.OFFO...')
const LEGW = M('...OBBO...OBBO..|...OFFO...OBBO..|...........OFFO.')
const HAIR: Record<string, string[]> = {
  short: M('....OOOOOOOO....|...OHHHHHHHHO...|..OHHHHHHHHHHO..|..OHHhHHHHhHHO..|...H........H...'),
  dsgn: M('....OOOOOOOO....|...OHHHHHHHHO...|..OHHHHHHHHHHO..|..OHHHHHHHHA.O..|...A........A...|...A........A...|...A........A...|...A........A...'),
  hood: M('...OOOOOOOOOO...|..OTTTTTTTTTTO..|.OTTTTTTTTTTTTO.|.OTHHHHHHHHHHTO.|.OT..........TO.|.OT..........TO.|.OT..........TO.|.OT..........TO.|.OTT........TTO.|..OTTTTTTTTTTO..'),
  bun: M('.....OHHHHO.....|...OHHHHHHHHO...|..OHHHHHHHHHHO..|..OHHHHhhHHHHO..|...H........H...'),
  cap: M('....OOOOOOOO....|...OCCCCCCCCO...|..OCCCCWWCCCCO..|.OCCCCCCCCCCCCO.|...H........H...'),
  long: M('....OOOOOOOO....|...OHHHHHHHHO...|..OHHHHHHHHHHO..|..OHHHhHHhHHHO..|..OH........HO..|..OH........HO..|..OH........HO..|..OH........HO..|..OH........HO..|..Oh........hO..|..Oh........hO..'),
  side: M('....OOOOOOOO....|...OHHHHHHHHO...|..OHHHHHHHHHHO..|..OHHHHHHh...O..|...H............'),
  bald: M('................|................|................|.....W..........|...H........H...|...H........H...|...h........h...'),
}
const GLS = M('....GGG..GGG....|....GEGGGGEG....|....GGG..GGG....')
const MUST = M('.....HHH..HHH...')
const FACE: Record<string, string[]> = {
  normal: M('................|.....WE..WE.....|.....EE..EE.....|...R...OO...R...|................'),
  happy: M('................|.....E....E.....|....E.E..E.E....|...R...OO...R...|.......RR.......'),
  sad: M('......E..E......|.....EE..EE.....|.....EE..EE.C...|.......OO.......|......O..O......'),
  wow: M('................|.....YW..YW.....|.....WY..WY.....|...R...OO...R...|.......OO.......'),
  tired: M('................|................|.....EE..EE.....|.....ss..ss.....|.......OO.......'),
  focus: M('............C...|.....EE..EE.....|.....EE..EE.....|.......OO.......|................'),
  angry: M('....E......E....|.....EE..EE.....|.....EE..EE.....|......OOOO......|................'),
}
const FACEM: Record<string, string[]> = {
  normal: M('...R...OO...R...|................'),
  happy: M('...R...OO...R...|.......RR.......'),
  sad: M('.......OO.......|......O..O......'),
  wow: M('.......OO.......|.......OO.......'),
  tired: M('.......OO.......|................'),
  focus: M('.......OO.......|................'),
  angry: M('......OOOO......|................'),
}
const DEC: Record<string, { y: number; m: string[] }> = {
  collar: { y: 10, m: M('......WWWW......') },
  tie: { y: 10, m: M('.......RR.......|.......RR.......|........R.......') },
  straps: { y: 10, m: M('....A......A....|....A......A....|....A......A....') },
  dstr: { y: 10, m: M('.....W....W.....|.....W....W.....') },
  badge: { y: 11, m: M('....W...........') },
  dots: { y: 11, m: M('.....R..........|.........C......') },
  btn: { y: 11, m: M('.......W........|................|.......W........') },
}

/* ── 캐릭터 정의 (ART_BIBLE §캐릭터 배정) ── */
interface CharDef {
  hair: string
  top: string
  bot: string
  style: keyof typeof HAIR
  skin?: string
  shoe?: string
  acc?: string
  cap?: string
  glasses?: 1
  mus?: 1
  dec?: (keyof typeof DEC)[]
}
const CH: Record<string, CharDef> = {
  pl: { hair: '#6b4a34', top: '#4f9d69', bot: '#3b4664', style: 'short', glasses: 1, dec: ['collar'] },
  ds: { hair: '#ff7eb6', acc: '#b388ff', top: '#ffd23e', bot: '#5c4a8f', style: 'dsgn', dec: ['dots'] },
  dv: { hair: '#2f2a3d', top: '#3d5a80', bot: '#2b3050', style: 'hood', dec: ['dstr'] },
  qa: { hair: '#d97742', top: '#ef6f6c', bot: '#41496b', style: 'bun', dec: ['badge'] },
  st: { hair: '#3a2e28', top: '#4cc9f0', bot: '#2b3050', style: 'cap', cap: '#ff5d5d', acc: '#ffd23e', dec: ['straps'] },
  st2: { hair: '#5b4a3f', top: '#ff9f45', bot: '#3b4664', style: 'cap', cap: '#4cc9f0', acc: '#57d99b', dec: ['straps'] },
  co: { hair: '#6d4ac2', top: '#57d99b', bot: '#31406e', style: 'long' },
  co2: { hair: '#c2443f', top: '#ff9edb', bot: '#2b3050', style: 'long' },
  of: { hair: '#2f2a3d', top: '#8f97ad', bot: '#3c4258', style: 'side', dec: ['tie'] },
  ma: { hair: '#9aa0b5', skin: '#f0b98c', top: '#8a5a3b', bot: '#4a4033', style: 'bald', glasses: 1, mus: 1, dec: ['btn'] },
}

type Grid = string[][]
function grid(w: number, h: number): Grid {
  return Array.from({ length: h }, () => Array<string>(w).fill('.'))
}
function st(g: Grid, rows: string[], x: number, y: number): void {
  rows.forEach((r, j) => {
    for (let i = 0; i < r.length; i++) {
      const c = r[i]
      if (c !== '.' && g[y + j] && x + i < g[0].length && x + i >= 0) g[y + j][x + i] = c
    }
  })
}

export interface SpriteGrid {
  rows: string[]
  pal: Record<string, string>
}

/** 캐릭터 16×19 파츠 조립 — 미정의 key 는 null */
export function chGrid(key: string, pose: string, face: string): SpriteGrid | null {
  const c = CH[key]
  if (!c) return null
  const g = grid(16, 19)
  const dy = pose === 'sad' ? 1 : 0
  st(g, pose === 'walk' ? LEGW : LEGS, 0, 16)
  if (pose === 'cheer') {
    st(g, ARMU, 0, 8)
    st(g, TORC, 0, 10)
  } else st(g, TORS, 0, 10)
  ;(c.dec || []).forEach((k) => st(g, DEC[k].m, 0, DEC[k].y))
  if (pose === 'back') {
    st(g, c.style === 'hood' ? BHOOD : BHEAD, 0, 1 + dy)
  } else {
    st(g, HEAD, 0, 2 + dy)
    st(g, HAIR[c.style] || HAIR.short, 0, dy)
    if (pose === 'cheer') st(g, ARMU, 0, 8)
    if (c.glasses) {
      st(g, GLS, 0, 4 + dy)
      st(g, FACEM[face] || FACEM.normal, 0, 7 + dy)
    } else st(g, FACE[face] || FACE.normal, 0, 4 + dy)
    if (c.mus) st(g, MUST, 0, 7 + dy)
  }
  const pal = {
    ...G,
    S: c.skin || '#ffcda4', s: sh(c.skin || '#ffcda4', 0.78),
    H: c.hair, h: sh(c.hair, 0.72),
    T: c.top, t: sh(c.top, 0.72),
    B: c.bot, b: sh(c.bot, 0.72),
    F: c.shoe || '#20243d',
    A: c.acc || '#ffd23e',
    C: c.cap || '#ff5d5d',
  }
  return { rows: g.map((r) => r.join('')), pal }
}

/* ── 아이콘 8×8 (감정·상태 16종 + 시스템) ── */
const IC: Record<string, string> = {
  heart: '.OO..OO.|ORWOORRO|ORRRRRRO|ORRRRRRO|.ORRRRO.|..ORRO..|...OO...|........',
  star: '...OO...|..OYYO..|OOOYYOOO|OYYWYYYO|.OYYYYO.|.OYYYYO.|OYYOOYYO|OO....OO',
  coin: '..OOOO..|.OYYYYO.|OYWWYYYO|OYWYYYyO|OYYYYYyO|OYYYyyyO|.OYYYYO.|..OOOO..',
  bulb: '..OOOO..|.OYYYYO.|.OYWYYO.|.OYYYYO.|..OYYO..|..OggO..|..OggO..|...OO...',
  wrench: '.GG..GG.|.GG..GG.|.GGGGGG.|..GGGG..|...GG...|...GG...|...GG...|..GGGG..',
  bug: '.O....O.|..O..O..|..OOOO..|.ORRRRO.|ORRKKRRO|ORKRRKRO|.ORRRRO.|..OOOO..',
  note: '.OOOOOO.|.OWWWWO.|.OWggWO.|.OWWWWO.|.OWggWO.|.OWWWWO.|.OOOOOO.|........',
  mag: '.OOO....|OCCCO...|OCWCO...|OCCCO...|.OOOO...|....OO..|.....OO.|........',
  music: '....KK..|....K.K.|....K...|....K...|..KKK...|.KKKK...|..KK....|........',
  zzz: 'GGGG....|..G.....|.G......|GGGG....|.....GGG|......G.|.....GGG|........',
  anger: 'R..RR..R|.R.RR.R.|..RRRR..|RRR..RRR|..RRRR..|.R.RR.R.|R..RR..R|........',
  sweat: '...C....|...CC...|..CCCC..|.CCCCCC.|.CWCCCC.|.CCCCCC.|..CCCC..|...CC...',
  chk: '......NN|.....NNN|....NNN.|NN.NNN..|NNNNN...|.NNN....|..N.....|........',
  x: 'RR....RR|.RR..RR.|..RRRR..|...RR...|..RRRR..|.RR..RR.|RR....RR|........',
  up: '...NN...|..NNNN..|.NNNNNN.|NNNNNNNN|...NN...|...NN...|...NN...|........',
  q: '..OOOO..|.OO..OO.|.....OO.|....OO..|...OO...|........|...OO...|........',
  ex: '...RR...|...RR...|...RR...|...RR...|...RR...|........|...RR...|........',
  tdots: '........|........|........|OO.OO.OO|OO.OO.OO|........|........|........',
  pad: '.OOOOOO.|OggggggO|OgWggRgO|OggggYgO|.OOOOOO.|........|........|........',
  spark: 'Y..Y..Y.|.Y.Y.Y..|..YYY...|YYYYYYY.|..YYY...|.Y.Y.Y..|Y..Y..Y.|........',
  cloud: '........|..ggg...|.ggggg..|gggggggg|gggggggg|.gggggg.|........|........',
  wow: '.Y..Y.Y.|Y.YY.Y..|.YYYY...|YYYWYYY.|.YYYY...|..YY....|.Y..Y...|........',
  palette: '..OOOO..|.ODDDDO.|ODRDYDDO|ODDDDCDO|ODDOODDO|.ODDDDO.|..OOOO..|........',
  mem: '.OOOOOO.|.OPPPPO.|.OPWWPO.|.OPWWPO.|.OPPPPO.|.OOOOO..|........|........',
  skl: '...YY...|..YYYY..|.YYYYYY.|YYYYYYYY|.YYYYYY.|..YYYY..|...YY...|........',
  won: '.OOOOOO.|OYYYYYYO|OYKYKYYO|OYYKYYYO|OYKYKYYO|OYYYYYYO|.OOOOOO.|........',
}

/** 아이콘 매트릭스 (8행) — 미정의 name 은 null. 유닛 테스트·검증용 */
export function iconGrid(name: string): string[] | null {
  return IC[name] ? M(IC[name]) : null
}

/* ── 아이템 (소형 가변) ── */
const IT: Record<string, string> = {
  laptop: '.OOOOOOOOOO.|OKNNKKNKKKKO|OKNKKNNKKKKO|OKKKKKKKKKKO|.OOOOOOOOOO.|OggggggggggO|OgggWWWWgggO|.OOOOOOOOOO.',
  note: '.OOOOOOOO.|OWWWOOWWWO|OWggOOggWO|OWggOOggWO|OWWWOOWWWO|.OOOOOOOO.',
  tablet: '.OOOOOOO.|OWWWWWWWO|OWRRWCWWO|OWRWWCCWO|OWWYYWWWO|OWWWWWWWO|.OOOOOOO.',
  coffee: '..W.W..|.W.W...|.OOOOO.|.OuuuO.|.OuuuOO|.OuuuOO|.OOOOO.',
  mag: '.OOO....|OCCCO...|OCWCO...|OCCCO...|.OOOO...|....OO..|.....OO.|......OO',
  clip: '...OO....|.OOOOOO..|.OWWWWO..|.OWNggO..|.OWWWWO..|.OWNggO..|.OWWWWO..|.OOOOOO..',
  brief: '....OOO....|...O...O...|OOOOOOOOOOO|ODDDDDDDDDO|ODDDDWDDDDO|ODDDDDDDDDO|OOOOOOOOOOO',
  phone: 'OOOOO|OCCCO|OCCCO|OCCCO|OCCCO|OWWWO|OOOOO',
  palette: '..OOOOOO..|.ODDDDDDO.|ODRDYDCDDO|ODDDDDDODO|.ODDDDDDO.|..OOOOOO..',
  trophy: '.OOOOOOO.|OYYYYYYYO|OYYYYYYYO|.OYYYYYO.|..OYYYO..|...OYO...|..OYYYO..|.OOOOOOO.',
}

/* ── 소품 (절차 생성: 테이블 44×19 · 화분 14×17 · 선반 24×18 · 창문 26×18) ── */
function grid2(w: number, h: number, f?: string): Grid {
  return Array.from({ length: h }, () => Array<string>(w).fill(f || '.'))
}
export function propGrid(name: string): SpriteGrid | null {
  if (name === 'table') {
    const w = 44
    const g = grid2(w, 19)
    for (let y = 0; y < 12; y++)
      for (let x = 0; x < w; x++) {
        const edge = (y === 0 || y === 11) && x > 3 && x < w - 4
        const side = (x === 2 || x === 3 || x === w - 3 || x === w - 4) && y > 0 && y < 11
        if (edge || side) g[y][x] = 'O'
        else if (y > 0 && y < 11 && x > 3 && x < w - 4)
          g[y][x] = y === 1 || x === 4 || x === w - 5 ? 'U' : y % 3 === 0 ? 'u' : 'U'
      }
    for (let y = 12; y < 15; y++) for (let x = 4; x < w - 4; x++) g[y][x] = y === 14 ? 'O' : 'd'
    for (const x of [6, 7, w - 8, w - 7]) for (let y = 15; y < 18; y++) g[y][x] = 'O'
    return { rows: g.map((r) => r.join('')), pal: { ...G, U: '#e8b06e', u: '#d99a54', d: '#a8763e' } }
  }
  if (name === 'plant') {
    const g = grid2(14, 17)
    const leaf: [number, number][] = [[6, 0], [5, 1], [6, 1], [7, 1], [4, 2], [5, 2], [6, 2], [7, 2], [8, 2], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3], [8, 3], [9, 3], [2, 4], [3, 4], [4, 4], [6, 4], [7, 4], [8, 4], [9, 4], [10, 4], [3, 5], [4, 5], [5, 5], [6, 5], [8, 5], [9, 5], [4, 6], [5, 6], [6, 6], [7, 6], [8, 6], [9, 6], [10, 6], [5, 7], [6, 7], [7, 7], [8, 7]]
    leaf.forEach(([x, y]) => (g[y][x] = (x + y) % 3 ? 'N' : 'n'))
    for (let x = 5; x < 9; x++) g[8][x] = 'n'
    for (let x = 3; x < 11; x++) g[9][x] = 'O'
    for (let y = 10; y < 16; y++) {
      g[y][3] = 'O'
      g[y][10] = 'O'
      for (let x = 4; x < 10; x++) g[y][x] = y === 10 ? 'D' : x === 4 ? 'd' : 'D'
    }
    for (let x = 3; x < 11; x++) g[16][x] = 'O'
    return { rows: g.map((r) => r.join('')), pal: { ...G, N: '#57d99b', n: '#2c8f60', D: '#e07b4f', d: '#b3563a' } }
  }
  if (name === 'shelf') {
    const w = 24
    const g = grid2(w, 18)
    for (let x = 0; x < w; x++) {
      g[0][x] = 'O'
      g[8][x] = 'O'
      g[17][x] = 'O'
    }
    for (let y = 0; y < 18; y++) {
      g[y][0] = 'O'
      g[y][w - 1] = 'O'
    }
    for (let y = 1; y < 8; y++) for (let x = 1; x < w - 1; x++) g[y][x] = 'D'
    for (let y = 9; y < 17; y++) for (let x = 1; x < w - 1; x++) g[y][x] = 'd'
    ;([[3, 3, 'Y'], [4, 3, 'Y'], [3, 4, 'Y'], [4, 4, 'Y'], [8, 2, 'C'], [8, 3, 'C'], [8, 4, 'C'], [12, 3, 'P'], [13, 3, 'P'], [12, 4, 'P'], [13, 4, 'P'], [17, 2, 'N'], [18, 3, 'N'], [17, 4, 'N'], [18, 4, 'N'], [17, 3, 'N'], [4, 12, 'W'], [5, 12, 'W'], [4, 13, 'W'], [5, 13, 'W'], [10, 11, 'R'], [10, 12, 'R'], [11, 12, 'R'], [15, 12, 'g'], [16, 12, 'g'], [15, 13, 'g'], [16, 13, 'g']] as [number, number, string][]).forEach(([x, y, c]) => (g[y][x] = c))
    return { rows: g.map((r) => r.join('')), pal: { ...G, D: '#c98a4b', d: '#a8763e' } }
  }
  if (name === 'window') {
    const w = 26
    const h = 18
    const g = grid2(w, h, 'K')
    for (let x = 0; x < w; x++) {
      g[0][x] = 'O'
      g[h - 1][x] = 'O'
    }
    for (let y = 0; y < h; y++) {
      g[y][0] = 'O'
      g[y][12] = 'O'
      g[y][13] = 'O'
      g[y][w - 1] = 'O'
    }
    for (let x = 0; x < w; x++) g[9][x] = 'O'
    ;([[3, 3], [8, 2], [5, 6], [10, 7], [16, 4], [21, 2], [19, 7], [23, 6], [4, 12], [9, 15], [17, 12], [22, 14], [15, 15]] as [number, number][]).forEach(([x, y]) => {
      if (g[y][x] === 'K') g[y][x] = 'W'
    })
    ;([[17, 2], [18, 2], [17, 3], [18, 3], [16, 3]] as [number, number][]).forEach(([x, y]) => (g[y][x] = 'Y'))
    return { rows: g.map((r) => r.join('')), pal: { ...G, K: '#1b1f45' } }
  }
  return null
}

/* ── 게임 썸네일 22×14 (runner/shooter/puzzle/rhythm) ── */
function thumb(ctx: CanvasRenderingContext2D, type: string, s: number): void {
  const R = (x: number, y: number, w: number, h: number, c: string): void => {
    ctx.fillStyle = c
    ctx.fillRect(x * s, y * s, w * s, h * s)
  }
  R(0, 0, 22, 14, type === 'puzzle' ? '#1a1330' : type === 'rhythm' ? '#240f2e' : '#12142e')
  if (type === 'runner') {
    R(0, 11, 22, 3, '#2b3050')
    R(0, 11, 22, 1, '#ff5d8f')
    ;[[2, 7, 2], [8, 5, 3], [15, 8, 3]].forEach(([x, y, w]) => R(x, y, w, 1, '#4cc9f0'))
    ;[[3, 3], [9, 2], [16, 5], [12, 8]].forEach(([x, y]) => R(x, y, 1, 1, '#ffd23e'))
    R(5, 8, 2, 3, '#ffd23e')
    R(5, 7, 2, 1, '#ffcda4')
    R(19, 9, 1, 2, '#ff5d5d')
    ;[[1, 1], [6, 1], [13, 1], [20, 2], [18, 0]].forEach(([x, y]) => R(x, y, 1, 1, '#3c4a8a'))
  } else if (type === 'shooter') {
    ;[[2, 2], [6, 1], [11, 3], [16, 1], [19, 4], [4, 8], [14, 7], [20, 9], [9, 11]].forEach(([x, y]) => R(x, y, 1, 1, '#8f97ad'))
    R(10, 10, 3, 2, '#7de0ff')
    R(11, 9, 1, 1, '#7de0ff')
    R(11, 12, 1, 1, '#ff9f45')
    ;[[4, 3], [9, 2], [14, 3], [6, 5], [12, 5]].forEach(([x, y]) => R(x, y, 2, 1, '#ff5d8f'))
    R(11, 6, 1, 2, '#ffd23e')
    R(5, 7, 1, 2, '#ffd23e')
  } else if (type === 'puzzle') {
    const cs = ['#ff5d8f', '#ffd23e', '#4cc9f0', '#57d99b', '#b388ff']
    for (let i = 0; i < 6; i++) for (let j = 0; j < 4; j++) R(2 + i * 3, 1 + j * 3, 2, 2, cs[(i * 7 + j * 3) % 5])
    R(2, 13, 18, 1, '#ffd23e')
  } else if (type === 'rhythm') {
    for (let i = 0; i < 4; i++) R(3 + i * 4, 0, 1, 14, '#3c2a52')
    ;([[3, 2, '#ff5d8f'], [7, 6, '#4cc9f0'], [11, 3, '#ffd23e'], [15, 8, '#57d99b'], [7, 11, '#ff5d8f'], [3, 9, '#4cc9f0']] as [number, number, string][]).forEach(([x, y, c]) => R(x, y, 2, 2, c))
    R(2, 12, 16, 1, '#ffffff')
  }
}

/* ── 렌더 코어 — 캔버스 크기 = 그리드×scale ── */
function draw(cv: HTMLCanvasElement, rows: string[], pal: Record<string, string>, s: number): CanvasRenderingContext2D {
  const h = rows.length
  const w = Math.max(...rows.map((r) => r.length))
  cv.width = w * s
  cv.height = h * s
  cv.style.width = w * s + 'px'
  cv.style.height = h * s + 'px'
  const ctx = cv.getContext('2d')!
  ctx.clearRect(0, 0, cv.width, cv.height)
  rows.forEach((r, y) => {
    for (let x = 0; x < r.length; x++) {
      const c = r[x]
      if (c === '.' || c === ' ') continue
      ctx.fillStyle = pal[c] || G[c] || '#f0f'
      ctx.fillRect(x * s, y * s, s, s)
    }
  })
  return ctx
}

/* ── 폴백: 회색 '?' 16×16 (ART_BIBLE §placeholder — 미정의 spec 대기용) ── */
const FALLBACK: string[] = (() => {
  const g = grid2(16, 16, 'G')
  for (let i = 0; i < 16; i++) {
    g[0][i] = 'O'
    g[15][i] = 'O'
    g[i][0] = 'O'
    g[i][15] = 'O'
  }
  const glyph: [number, number][] = [[5, 3], [6, 3], [7, 3], [8, 3], [9, 3], [4, 4], [5, 4], [9, 4], [10, 4], [9, 5], [10, 5], [8, 6], [9, 6], [7, 7], [8, 7], [7, 8], [8, 8], [7, 11], [8, 11], [7, 12], [8, 12]]
  glyph.forEach(([x, y]) => (g[y][x] = 'g'))
  return g.map((r) => r.join(''))
})()
const warned = new Set<string>()

/**
 * 스프라이트 렌더. spec = 'ch:pl:stand:happy' | 'icon:bulb' | 'item:laptop' |
 * 'prop:table' | 'thumb:runner' | 'cab:std:blue:runner' | 'cab:claw'.
 * 미정의 spec 은 회색 '?' 폴백을 그리고 false 반환 (spec 당 warn 1회).
 */
export function paint(cv: HTMLCanvasElement, spec: string, s: number): boolean {
  const p = spec.split(':')
  if (p[0] === 'ch') {
    const o = chGrid(p[1], p[2] || 'stand', p[3] || 'normal')
    if (o) {
      draw(cv, o.rows, o.pal, s)
      return true
    }
  } else if (p[0] === 'icon') {
    const m = IC[p[1]]
    if (m) {
      draw(cv, M(m), { ...G, s: '#c9956e' }, s)
      return true
    }
  } else if (p[0] === 'item') {
    const m = IT[p[1]]
    if (m) {
      draw(cv, M(m), { ...G, u: '#6b4226' }, s)
      return true
    }
  } else if (p[0] === 'prop') {
    const o = propGrid(p[1])
    if (o) {
      draw(cv, o.rows, o.pal, s)
      return true
    }
  } else if (p[0] === 'thumb') {
    if (['runner', 'shooter', 'puzzle', 'rhythm'].includes(p[1])) {
      cv.width = 22 * s
      cv.height = 14 * s
      cv.style.width = 22 * s + 'px'
      cv.style.height = 14 * s + 'px'
      thumb(cv.getContext('2d')!, p[1], s)
      return true
    }
  } else if (p[0] === 'cab') {
    if (cab(cv, p[1], p[2] || 'blue', p[3] || 'runner', s)) return true
  }
  if (!warned.has(spec)) {
    warned.add(spec)
    console.warn(`[sprites] 미정의 spec "${spec}" — 회색 ? 폴백으로 렌더`)
  }
  draw(cv, FALLBACK, G, s)
  return false
}

/* ── 아케이드 기기 20×24 (스킨 5종 × 장르 스크린) + 인형뽑기 17×20 ── */
const SKIN: Record<string, { C: string; M: string; m: string }> = {
  blue: { C: '#3fb3e8', M: '#ff5d8f', m: '#ffd23e' },
  pink: { C: '#ff6ba9', M: '#7de0ff', m: '#fff45e' },
  purple: { C: '#8d6fe0', M: '#ffd23e', m: '#ff9edb' },
  yellow: { C: '#ffc542', M: '#8d6fe0', m: '#7de0ff' },
  mint: { C: '#3ecfa0', M: '#ff9f45', m: '#fff' },
}
const CABMAP = M('....OOOOOOOOOOOO....|...OMMMMMMMMMMMMO...|...OmMmMmMmMmMmMO...|..OCCCCCCCCCCCCCCO..|..OCOOOOOOOOOOOOCO..|..OCOKKKKKKKKKKOCO..|..OCOKKKKKKKKKKOCO..|..OCOKKKKKKKKKKOCO..|..OCOKKKKKKKKKKOCO..|..OCOKKKKKKKKKKOCO..|..OCOOOOOOOOOOOOCO..|..OCCCCCCCCCCCCCCO..|.OccccccccccccccccO.|.OcKKcRRcYYcNNccccO.|..OCCCCCCCCCCCCCCO..|..OCCCCCCCCCCCCCCO..|..OCCWWWWWWWWWWCCO..|..OCCWWkkWWkkWWCCO..|..OCCWWWWWWWWWWCCO..|..OCCCCCCCCCCCCCCO..|..OCCYKKYCCCCCCCCO..|..OccccccccccccccO..|...OOOOOOOOOOOOOO...|...OO..........OO...')
const CLAWMAP = M('...OOOOOOOOOOOOOO...|..OPPPPPPPPPPPPPPO..|..OPGGGGGGGGGGGGPO..|..OPGGGGGKGGGGGGPO..|..OPGGGGGKGGGGGGPO..|..OPGGGGKGKGGGGGPO..|..OPGGGGGGGGGGGGPO..|..OPGQQGGRRGGYYGPO..|..OPQQQRRRYYYQQQPO..|..OPPPPPPPPPPPPPPO..|..OPPPPKKKKPPPPPPO..|..OPPPPKkkKPPPPPPO..|..OPPPPKKKKPPPWPPO..|..OPPPPPPPPPPPPPPO..|..OppppppppppppppO..|...OOOOOOOOOOOOOO...|...OO..........OO...')
function cab(cv: HTMLCanvasElement, type: string, skin: string, game: string, s: number): boolean {
  const sk = SKIN[skin] || SKIN.blue
  if (type === 'claw') {
    const pal = { ...G, P: sk.C, p: sh(sk.C, 0.72), G: '#cdf3ff', Q: '#9fe8c1', R: '#ff9edb', Y: '#ffd23e', K: '#141631', k: '#2b3050' }
    draw(cv, CLAWMAP, pal, s)
    return true
  }
  if (type !== 'std') return false
  const pal = { ...G, C: sk.C, c: sh(sk.C, 0.72), M: sk.M, m: sk.m, K: '#10122b', k: '#2b3050', R: '#ff5d5d', Y: '#ffd23e', N: '#57d99b', W: '#f2ead8' }
  const ctx = draw(cv, CABMAP, pal, s)
  const R2 = (x: number, y: number, w: number, h: number, c: string): void => {
    ctx.fillStyle = c
    ctx.fillRect(x * s, y * s, w * s, h * s)
  }
  if (game === 'runner') {
    R2(5, 9, 10, 1, '#2b3050')
    R2(6, 7, 2, 2, '#ffd23e')
    R2(11, 8, 1, 1, '#ff5d8f')
    R2(9, 5, 2, 1, '#4cc9f0')
    R2(13, 6, 1, 1, '#ffd23e')
  }
  if (game === 'shooter') {
    R2(9, 8, 2, 1, '#7de0ff')
    R2(9, 5, 1, 1, '#ff5d8f')
    R2(12, 6, 1, 1, '#ff5d8f')
    R2(6, 6, 1, 1, '#8f97ad')
    R2(10, 7, 1, 1, '#ffd23e')
  }
  if (game === 'puzzle') {
    R2(6, 6, 2, 2, '#ff5d8f')
    R2(9, 6, 2, 2, '#ffd23e')
    R2(12, 6, 2, 2, '#4cc9f0')
    R2(7, 8, 2, 1, '#57d99b')
  }
  if (game === 'rhythm') {
    R2(6, 5, 1, 4, '#3c2a52')
    R2(9, 5, 1, 4, '#3c2a52')
    R2(12, 5, 1, 4, '#3c2a52')
    R2(6, 6, 1, 1, '#ff5d8f')
    R2(9, 7, 1, 1, '#4cc9f0')
    R2(12, 5, 1, 1, '#ffd23e')
  }
  return true
}

/* ── 타일 (wood 32×16 · carpet 24×24 · walk 16×16) ── */
function mkTile(w: number, h: number, fn: (ctx: CanvasRenderingContext2D) => void): string {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  fn(c.getContext('2d')!)
  return c.toDataURL()
}
const _tiles: Record<string, string | null> = {}
export function tile(t: string): string | null {
  if (t in _tiles) return _tiles[t]
  let url: string | null = null
  if (t === 'wood')
    url = mkTile(32, 16, (ctx) => {
      ctx.fillStyle = '#c98a5b'
      ctx.fillRect(0, 0, 32, 16)
      ctx.fillStyle = '#c28353'
      ctx.fillRect(0, 8, 32, 8)
      ctx.fillStyle = '#a86f45'
      ctx.fillRect(0, 7, 32, 1)
      ctx.fillRect(0, 15, 32, 1)
      ctx.fillRect(9, 0, 1, 7)
      ctx.fillRect(25, 8, 1, 7)
      ctx.fillStyle = '#d49a67'
      ctx.fillRect(16, 3, 3, 1)
      ctx.fillRect(4, 11, 3, 1)
    })
  if (t === 'carpet')
    url = mkTile(24, 24, (ctx) => {
      ctx.fillStyle = '#1f2440'
      ctx.fillRect(0, 0, 24, 24)
      ctx.fillStyle = '#242a4a'
      for (let i = 0; i < 6; i++) ctx.fillRect((i * 7) % 24, (i * 11) % 24, 2, 2)
      const cs = ['#ff5d8f', '#4cc9f0', '#ffd23e', '#57d99b', '#b388ff']
      // 목업 원본의 고정 seed(7) LCG — 컨페티 배치가 항상 동일 (전역 rng 와 무관한 정적 텍스처)
      let sd = 7
      const rnd = (): number => {
        sd = (sd * 16807) % 2147483647
        return sd / 2147483647
      }
      for (let i = 0; i < 14; i++) {
        ctx.fillStyle = cs[i % 5]
        ctx.fillRect(Math.floor(rnd() * 23), Math.floor(rnd() * 23), 1, 1)
      }
    })
  if (t === 'walk')
    url = mkTile(16, 16, (ctx) => {
      ctx.fillStyle = '#a8adbd'
      ctx.fillRect(0, 0, 16, 16)
      ctx.fillStyle = '#9298a8'
      ctx.fillRect(0, 0, 8, 8)
      ctx.fillRect(8, 8, 8, 8)
      ctx.fillStyle = '#7c8294'
      ctx.fillRect(0, 0, 16, 1)
      ctx.fillRect(0, 8, 16, 1)
      ctx.fillRect(0, 0, 1, 16)
      ctx.fillRect(8, 0, 1, 16)
    })
  _tiles[t] = url
  return url
}
export function tileSize(t: string): string {
  return t === 'wood' ? '128px 64px' : t === 'carpet' ? '96px 96px' : '64px 64px'
}

/**
 * DOM 스캔 헬퍼 (목업 paintAll 이식) — root 아래
 * canvas[data-sprite][data-scale] 렌더 + [data-tile] 배경 적용. 재호출 시 변경분만 다시 그린다.
 */
export function mountSprites(root: ParentNode = document): void {
  root.querySelectorAll<HTMLCanvasElement>('canvas[data-sprite]').forEach((cv) => {
    const spec = cv.dataset.sprite!
    const sc = Number(cv.dataset.scale || 4)
    const key = `${spec}@${sc}`
    if (cv.dataset.painted === key) return
    paint(cv, spec, sc)
    cv.dataset.painted = key
  })
  root.querySelectorAll<HTMLElement>('[data-tile]').forEach((el) => {
    const t = el.dataset.tile!
    if (el.dataset.tiled === t) return
    const url = tile(t)
    if (!url) return
    el.style.backgroundImage = `url(${url})`
    el.style.backgroundSize = tileSize(t)
    el.dataset.tiled = t
  })
}
