/* 팀원 4명 정의 (GAME_DESIGN §4). 상태(exp·condition)는 store 가 들고,
   여기는 불변 정의 + 표시용 색(목업 1a 오버헤드/배지 색 그대로)만 둔다. */

export type TeamId = 'pl' | 'ds' | 'dv' | 'qa'

export interface TeamDef {
  id: TeamId
  name: string
  role: string
  bias: string // 추천 편향 — 회의 추천 배지·패널 표시에 사용
  level: number
  chip: string // 오버헤드 이름 칩 글자색
  badge: string // 역할 배지 배경색
}

export const TEAM: readonly TeamDef[] = [
  { id: 'pl', name: '도윤', role: '기획', bias: '재미 우선', level: 4, chip: '#9fe8c1', badge: '#4f9d69' },
  { id: 'ds', name: '루나', role: '디자인', bias: '콘셉트·완성도', level: 3, chip: '#ff9edb', badge: '#e0559c' },
  { id: 'dv', name: '준호', role: '개발', bias: '빠른 출시', level: 5, chip: '#9db8ff', badge: '#3d5a80' },
  { id: 'qa', name: '세라', role: 'QA', bias: '완성도 우선', level: 2, chip: '#ffb3ae', badge: '#c2443f' },
]

export function teamDef(id: string): TeamDef {
  return TEAM.find((t) => t.id === id) ?? TEAM[0]
}
