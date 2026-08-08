/**
 * Pixel Arcade Tycoon — LLM 프록시 (Cloudflare Workers 무료 티어)
 *
 * 역할: 브라우저(정적 배포)가 API 키 없이 Gemini 를 쓰게 한다. 키는 워커 secret 에만 존재.
 * 배포: cloudflare/DEPLOY.md 참조. secret: GEMINI_API_KEY / vars: GEMINI_MODEL, ALLOW_ORIGINS
 *
 * 남용 방어: kind 허용목록, 컨텍스트 길이 제한, 오리진 제한, IP당 분당 호출 제한(캐시 기반 best-effort).
 */

const KINDS = new Set(['meeting', 'naming', 'feedback', 'revisit'])
const MAX_CONTEXT = 2000
const RATE_LIMIT_PER_MIN = 30

const SYSTEM = {
  meeting:
    '너는 도트 게임 회사의 팀원이다. 주어진 인물 정보와 회의 컨텍스트에 맞는 대사 한 줄을 한국어로 만들어라. 40자 이내, 따옴표 없이, 캐릭터 말투를 살려라. 숫자나 게임 수치를 새로 제안하지 마라.',
  naming:
    '주어진 장르·콘셉트에 어울리는 한국어 아케이드 게임 이름을 지어라. 2~8자, 이름만 출력. 특수문자 금지.',
  feedback:
    '너는 오락실 손님이다. 주어진 손님 성향과 플레이 결과에 맞는 한 줄 감상을 한국어로 말하라. 40자 이내, 따옴표 없이. 결과(만족/불만 요소)와 모순되면 안 된다.',
  revisit:
    '너는 오락실 재방문 손님이다. 지난번 불만이 개선된 것을 알아챈 한 줄 반응을 한국어로 말하라. 40자 이내, 따옴표 없이.',
}

function cors(origin, allowList) {
  const allowed = allowList.split(',').map((s) => s.trim())
  const ok = allowed.includes('*') || allowed.includes(origin)
  return {
    'Access-Control-Allow-Origin': ok ? origin : allowed[0] || '',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'content-type',
    'Access-Control-Max-Age': '86400',
  }
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || ''
    const headers = { 'content-type': 'application/json', ...cors(origin, env.ALLOW_ORIGINS || '*') }

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers })
    if (request.method !== 'POST' || new URL(request.url).pathname !== '/generate')
      return new Response(JSON.stringify({ error: 'not found' }), { status: 404, headers })

    // best-effort 레이트리밋 (Cache API — 무료, 근사치)
    const ip = request.headers.get('CF-Connecting-IP') || 'unknown'
    const minute = Math.floor(Date.now() / 60000)
    const rlKey = new Request(`https://rl.internal/${ip}/${minute}`)
    const cache = caches.default
    const prev = await cache.match(rlKey)
    const count = prev ? parseInt(await prev.text(), 10) + 1 : 1
    if (count > RATE_LIMIT_PER_MIN)
      return new Response(JSON.stringify({ error: 'rate limited' }), { status: 429, headers })
    await cache.put(rlKey, new Response(String(count), { headers: { 'cache-control': 'max-age=120' } }))

    let body
    try {
      body = await request.json()
    } catch {
      return new Response(JSON.stringify({ error: 'bad json' }), { status: 400, headers })
    }

    const { kind, context } = body || {}
    if (!KINDS.has(kind) || typeof context !== 'string' || context.length > MAX_CONTEXT)
      return new Response(JSON.stringify({ error: 'bad request' }), { status: 400, headers })

    const model = env.GEMINI_MODEL || 'gemini-2.5-flash-lite'
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${env.GEMINI_API_KEY}`

    try {
      const r = await fetch(url, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM[kind] }] },
          contents: [{ role: 'user', parts: [{ text: context }] }],
          generationConfig: { temperature: 0.9, maxOutputTokens: 80 },
        }),
        signal: AbortSignal.timeout(4000),
      })
      if (!r.ok) return new Response(JSON.stringify({ error: `upstream ${r.status}` }), { status: 502, headers })
      const data = await r.json()
      const text = data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('').trim() || ''
      if (!text) return new Response(JSON.stringify({ error: 'empty' }), { status: 502, headers })
      return new Response(JSON.stringify({ text }), { status: 200, headers })
    } catch {
      return new Response(JSON.stringify({ error: 'upstream timeout' }), { status: 504, headers })
    }
  },
}
