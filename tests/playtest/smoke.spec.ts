import { expect, test } from '@playwright/test'

/* S0 스모크 — 부팅·스케일·테스트 인터페이스. 시나리오 S1~S7 은 태스크 진행에 따라 추가된다. */

test('S0: 부팅과 테스트 인터페이스', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', (e) => errors.push(String(e)))
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text())
  })

  await page.goto('/')
  await expect(page.locator('.stage')).toBeVisible()

  const state = await page.evaluate(() => {
    window.__GAME_TEST__.setSeed(42)
    return window.__GAME_TEST__.getState() as { seed?: number }
  })
  expect(state.seed).toBe(42)

  await page.screenshot({ path: 'evidence/S0-boot.png' })
  expect(errors).toEqual([])
})

test('S0: 1280×720 레터박스 스케일', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 })
  await page.goto('/')
  const transform = await page.locator('.stage').evaluate((el) => getComputedStyle(el).transform)
  expect(transform).not.toBe('none')
})
