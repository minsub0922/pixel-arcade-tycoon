/*
 * #art 데모 시트 — 목업 1c(아바타)·1d(컴포넌트) 계열의 스프라이트 검증 페이지.
 * 게임 씬이 아닌 개발용 라우트: 전 스프라이트를 data-sprite 로 나열하고 mountSprites 로 렌더.
 */
import { mountSprites } from './sprites'

interface DemoChar {
  k: string
  n: string
  c: string
  role?: string
}
const TEAM: DemoChar[] = [
  { k: 'pl', n: '도윤', role: '기획자', c: '#4f9d69' },
  { k: 'ds', n: '루나', role: '디자이너', c: '#e0559c' },
  { k: 'dv', n: '준호', role: '개발자', c: '#3d5a80' },
  { k: 'qa', n: '세라', role: 'QA', c: '#c2443f' },
]
const CUSTOMERS: DemoChar[] = [
  { k: 'st', n: '학생', c: '#4cc9f0' },
  { k: 'st2', n: '학생 2', c: '#4cc9f0' },
  { k: 'co', n: '대학생', c: '#57d99b' },
  { k: 'co2', n: '대학생 2', c: '#57d99b' },
  { k: 'of', n: '직장인', c: '#ffd23e' },
  { k: 'ma', n: '마니아', c: '#b388ff' },
]
const TEAM_POSES: [string, string][] = [
  ['stand:normal', '기본'], ['walk:happy', '걷기'], ['cheer:happy', '환호'], ['back:normal', '뒷모습'],
]
const CUST_POSES: [string, string][] = [
  ['walk:normal', '걷기'], ['back:normal', '플레이(뒷모습)'], ['cheer:wow', '환호'], ['sad:sad', '실망'],
]
const FACES = ['normal', 'happy', 'sad', 'wow', 'tired', 'focus', 'angry']
const EMOTIONS = [
  ['heart', '좋아요'], ['star', '감동'], ['wow', '신남'], ['music', '흥겨움'],
  ['anger', '화남'], ['cloud', '실망'], ['sweat', '당황'], ['zzz', '지루함'],
  ['q', '궁금'], ['ex', '발견!'], ['bulb', '아이디어'], ['bug', '버그'],
  ['coin', '지불'], ['chk', '만족'], ['up', '실력 상승'], ['spark', '충돌'],
]
const GENRES = [
  ['runner', '액션 러너'], ['shooter', '슈팅'], ['puzzle', '퍼즐'], ['rhythm', '리듬'],
]
const SKINS = ['blue', 'pink', 'purple', 'yellow', 'mint']
const ITEMS = ['laptop', 'note', 'tablet', 'coffee', 'mag', 'clip', 'brief', 'phone', 'palette', 'trophy']
const PROPS = [
  ['table', '테이블 44×19'], ['plant', '화분 14×17'], ['shelf', '선반 24×18'], ['window', '창문 26×18'],
]
const TILES = [
  ['wood', '회의실 바닥'], ['carpet', '오락실 카펫'], ['walk', '보도'],
]

const cell = (inner: string, label: string): string =>
  `<div style="display:flex;flex-direction:column;align-items:center;gap:4px">${inner}<span style="font-size:10px;color:var(--text-mute)">${label}</span></div>`
const spr = (spec: string, scale: number): string =>
  `<canvas data-sprite="${spec}" data-scale="${scale}"></canvas>`
const section = (title: string, body: string): string =>
  `<section class="card-dark" style="padding:14px;display:flex;flex-direction:column;gap:10px">
     <div style="font-size:13px;color:var(--point);letter-spacing:2px">▚ ${title}</div>${body}</section>`

export function renderArtDemo(root: HTMLElement): void {
  const charRow = (chars: DemoChar[], poses: [string, string][]): string =>
    chars
      .map(
        (ch) => `
        <div style="display:flex;flex-direction:column;align-items:center;gap:6px">
          <div style="display:flex;gap:10px;align-items:flex-end">
            ${poses.map(([p, label]) => cell(spr(`ch:${ch.k}:${p}`, 4), label)).join('')}
          </div>
          <div style="display:flex;gap:5px;align-items:center">
            <span style="font-size:13px;color:${ch.c}">${ch.n}</span>
            ${ch.role ? `<span class="chip" style="background:${ch.c};color:#fff">${ch.role}</span>` : ''}
          </div>
        </div>`,
      )
      .join('')

  root.innerHTML = `
  <div class="art-sheet">
    <header style="display:flex;align-items:baseline;gap:12px">
      <span class="chip" style="background:rgba(255,255,255,.12);color:var(--cream)">#art</span>
      <h1 style="margin:0;font-size:19px;font-weight:normal;color:var(--cream)">스프라이트 데모 시트 — 목업 1c·1d 이식 검증</h1>
    </header>

    ${section('팀원 에이전트 × 포즈 (stand / walk / cheer / back)', `<div style="display:flex;gap:34px;flex-wrap:wrap">${charRow(TEAM, TEAM_POSES)}</div>`)}

    ${section('손님 에이전트 × 상태', `<div style="display:flex;gap:34px;flex-wrap:wrap">${charRow(CUSTOMERS, CUST_POSES)}</div>`)}

    ${section('표정 7종 (일반 얼굴 ds · 안경+수염 ma)', `
      <div style="display:flex;gap:18px;flex-wrap:wrap">
        ${FACES.map((f) => cell(spr(`ch:ds:stand:${f}`, 4), f)).join('')}
      </div>
      <div style="display:flex;gap:18px;flex-wrap:wrap">
        ${FACES.map((f) => cell(spr(`ch:ma:stand:${f}`, 4), f)).join('')}
      </div>`)}

    ${section('감정 · 상태 아이콘 16종 (8×8)', `
      <div style="display:flex;gap:12px;flex-wrap:wrap">
        ${EMOTIONS.map(([k, n]) =>
          cell(`<span style="background:#fff;border:2px solid var(--ink);box-shadow:2px 2px 0 rgba(0,0,0,.35);padding:4px;display:flex">${spr(`icon:${k}`, 3)}</span>`, n),
        ).join('')}
      </div>`)}

    ${section('게임 썸네일 22×14 × 장르 4종', `
      <div style="display:flex;gap:18px;flex-wrap:wrap">
        ${GENRES.map(([k, n]) => cell(`<span style="border:3px solid var(--ink);background:#12142e;display:flex;padding:3px">${spr(`thumb:${k}`, 6)}</span>`, n)).join('')}
      </div>`)}

    ${section('아케이드 캐비닛 20×24 — 5스킨 × 4장르 + 인형뽑기', `
      ${GENRES.map(
        ([g, n]) => `
        <div style="display:flex;gap:14px;align-items:flex-end">
          <span style="width:80px;font-size:11px;color:var(--text-mute)">${n}</span>
          ${SKINS.map((sk) => cell(spr(`cab:std:${sk}:${g}`, 3), sk)).join('')}
        </div>`,
      ).join('')}
      <div style="display:flex;gap:14px;align-items:flex-end">
        <span style="width:80px;font-size:11px;color:var(--text-mute)">장식</span>
        ${cell(spr('cab:claw', 3), 'claw 17×20')}
      </div>`)}

    ${section('소품 · 아이템', `
      <div style="display:flex;gap:22px;align-items:flex-end;flex-wrap:wrap">
        ${PROPS.map(([k, n]) => cell(spr(`prop:${k}`, 3), n)).join('')}
      </div>
      <div style="display:flex;gap:18px;align-items:flex-end;flex-wrap:wrap">
        ${ITEMS.map((k) => cell(spr(`item:${k}`, 3), k)).join('')}
      </div>`)}

    ${section('타일', `
      <div style="display:flex;gap:22px">
        ${TILES.map(([k, n]) => cell(`<div data-tile="${k}" style="width:192px;height:96px;border:3px solid var(--ink)"></div>`, `${k} — ${n}`)).join('')}
      </div>`)}

    ${section('폴백 (미정의 spec → 회색 ? · console.warn 1회)', `
      <div style="display:flex;gap:18px">
        ${cell(spr('ch:zz:stand:normal', 4), 'ch:zz (미정의)')}
      </div>`)}
  </div>`

  mountSprites(root)
}
