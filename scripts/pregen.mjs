/**
 * 콘텐츠 풀 재생성·확장 (빌드 타임 L2 — 선택 실행)
 * 사용: GEMINI_API_KEY 를 .env 또는 환경변수로 설정 후 `npm run pregen`
 * 동작: 각 풀 키에 대해 Gemini 로 추가 후보를 생성해 기존 풀에 병합(중복 제거).
 * 시드 풀은 항상 유지된다 — 이 스크립트 없이도 게임은 완주 가능해야 한다.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const poolsDir = resolve(root, 'src/data/pools')

// .env 간이 파서 (의존성 금지)
if (existsSync(resolve(root, '.env'))) {
  for (const line of readFileSync(resolve(root, '.env'), 'utf8').split('\n')) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/)
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2]
  }
}

const KEY = process.env.GEMINI_API_KEY
const MODEL = process.env.VITE_GEMINI_MODEL || 'gemini-2.5-flash-lite'
if (!KEY) {
  console.log('GEMINI_API_KEY 없음 — 시드 풀 그대로 사용합니다 (정상 동작).')
  process.exit(0)
}

async function gen(system, user) {
  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: system }] },
        contents: [{ role: 'user', parts: [{ text: user }] }],
        generationConfig: { temperature: 1.0, maxOutputTokens: 400, responseMimeType: 'application/json' },
      }),
    },
  )
  if (!r.ok) throw new Error(`gemini ${r.status}`)
  const data = await r.json()
  const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || '[]'
  return JSON.parse(text)
}

const SYS = '한국 오락실 도트 게임의 대사 라이터. 요청된 JSON 배열만 출력. 각 항목 40자 이내, 따옴표 문자 금지, 자연스러운 한국어 구어체.'

async function expandFeedback() {
  const file = resolve(poolsDir, 'feedback.json')
  const pool = JSON.parse(readFileSync(file, 'utf8'))
  const personas = {
    student: '학생(가격 민감, 화려한 액션 선호, 반말 호들갑)',
    college: '대학생(랭킹 경쟁 좋아함, 쿨한 반말)',
    office: '직장인(짧은 판 선호, 존댓말, 담백)',
    mania: '중년 게임 마니아(고전 슈팅·고난도 선호, ~군/~일세 말투)',
  }
  for (const [key, arr] of Object.entries(pool)) {
    if (arr.length >= 6) continue
    const [cust, band, tag] = key.split('.')
    try {
      const extra = await gen(
        SYS,
        `${personas[cust]}가 오락실 게임을 하고 남기는 한 줄 감상 4개를 JSON 배열로. 톤: ${
          band === 'pos' ? '만족' : band === 'neg' ? '불만' : '보통'
        }${tag !== '_' ? `, 주제: ${tag}` : ''}. 기존과 다르게: ${arr.join(' / ')}`,
      )
      pool[key] = [...new Set([...arr, ...extra.filter((s) => typeof s === 'string' && s.length <= 40)])]
      console.log(`feedback ${key}: ${arr.length} → ${pool[key].length}`)
    } catch (e) {
      console.warn(`skip ${key}: ${e.message}`)
    }
  }
  writeFileSync(file, JSON.stringify(pool, null, 2) + '\n')
}

await expandFeedback()
console.log('pregen 완료. git diff 로 결과를 확인하고 커밋하세요.')
