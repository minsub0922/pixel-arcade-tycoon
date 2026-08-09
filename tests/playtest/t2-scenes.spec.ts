import { expect, test, type Page } from '@playwright/test'

/* T2 — 타이틀 → 회의실 진입, HUD, 탭 왕복, 리사이즈 레터박스 (목업 1a/1b 골격) */

function watchErrors(page: Page): string[] {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(String(e)))
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text())
  })
  return errors
}

test('T2: 타이틀 → 회의실 → 오락실 왕복, 콘솔 에러 0', async ({ page }) => {
  const errors = watchErrors(page)
  await page.goto('/')

  // 타이틀: 도트 로고 + 시작 버튼
  await expect(page.locator('.title-logo')).toBeVisible()
  await page.click('.title-start')

  // 회의실: HUD 초기값 + 팀원 4명 idle
  await expect(page.locator('.scene.meeting')).toBeVisible()
  await expect(page.locator('.hud')).toContainText('10,000')
  await expect(page.locator('.hud')).toContainText('100')
  await expect(page.locator('.hud')).toContainText('1주차')
  await expect(page.locator('.meeting .actor')).toHaveCount(4)
  await expect(page.locator('.meeting .actor .bobber')).toHaveCount(4)
  await page.screenshot({ path: 'evidence/T2-meeting.png' })

  // 오락실: 빈 슬롯 6개 + 카펫 바닥
  await page.click('.tab[data-tab="arcade"]')
  await expect(page.locator('.scene.arcade')).toBeVisible()
  await expect(page.locator('.slot-empty')).toHaveCount(6)
  const carpetBg = await page
    .locator('.arcade-floor')
    .evaluate((el) => getComputedStyle(el).backgroundImage)
  expect(carpetBg).toContain('url(')
  await page.screenshot({ path: 'evidence/T2-arcade.png' })

  // 탭 왕복 복귀
  await page.click('.tab[data-tab="meeting"]')
  await expect(page.locator('.scene.meeting')).toBeVisible()

  // 세 화면 전부에서 '?' 폴백 스프라이트 0 (ART_BIBLE placeholder 정책)
  const fallbacks = await page.evaluate(
    () => (window.__GAME_TEST__.getTelemetry() as { spriteFallbackCount: number }).spriteFallbackCount,
  )
  expect(fallbacks).toBe(0)

  expect(errors).toEqual([])
})

test('T2: 탭 전환 < 100ms (dispatch → DOM 반영 동기)', async ({ page }) => {
  await page.goto('/')
  await page.click('.title-start')
  const ms = await page.evaluate(() => {
    const t0 = performance.now()
    window.__GAME_TEST__.dispatch({ type: 'TAB', tab: 'arcade' })
    if (!document.querySelector('.scene.arcade')) throw new Error('오락실 씬이 마운트되지 않음')
    return performance.now() - t0
  })
  expect(ms).toBeLessThan(100)
})

test('T2: 1280×720 리사이즈 레터박스 유지', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 })
  await page.goto('/')
  await page.click('.title-start')
  const scale = await page.locator('.stage').evaluate((el) => {
    const m = new DOMMatrix(getComputedStyle(el).transform)
    return m.a
  })
  expect(scale).toBeCloseTo(720 / 900, 2)
  await page.screenshot({ path: 'evidence/T2-resize-1280x720.png' })
})

test('T2: __GAME_TEST__ — getState 직렬화, setSeed 리셋, step', async ({ page }) => {
  await page.goto('/')
  await page.click('.title-start')

  const result = await page.evaluate(() => {
    const g = window.__GAME_TEST__
    const before = g.getState()
    g.setSeed(7)
    const after = g.getState()
    g.step(500)
    return {
      beforePhase: before.phase,
      serializable: JSON.stringify(after).length > 0,
      after,
      telemetry: g.getTelemetry() as { elapsedVirtualMs: number },
    }
  })
  expect(result.beforePhase).toBe('plan')
  expect(result.serializable).toBe(true)
  expect(result.after.seed).toBe(7)
  expect(result.after.phase).toBe('title')
  expect(result.after.coins).toBe(10000)
  expect(result.telemetry.elapsedVirtualMs).toBeGreaterThanOrEqual(500)
})
