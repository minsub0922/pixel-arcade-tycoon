import { expect, test } from '@playwright/test'

/* T1 — #art 스프라이트 데모 시트: 전 스프라이트 렌더 + 폴백 + pixelated 검증 */

test('T1: #art 데모 시트 렌더', async ({ page }) => {
  const errors: string[] = []
  const warns: string[] = []
  page.on('pageerror', (e) => errors.push(String(e)))
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text())
    if (m.type() === 'warning') warns.push(m.text())
  })

  await page.goto('/#art')
  await expect(page.locator('.art-sheet')).toBeVisible()

  // 캐릭터: 10키 × 4포즈+ (팀원 16 + 손님 24 + 표정 14)
  await expect(page.locator('canvas[data-sprite^="ch:"]')).toHaveCount(16 + 24 + 14 + 1)
  await expect(page.locator('canvas[data-sprite^="icon:"]')).toHaveCount(16)
  await expect(page.locator('canvas[data-sprite^="thumb:"]')).toHaveCount(4)
  await expect(page.locator('canvas[data-sprite^="cab:std:"]')).toHaveCount(20)
  await expect(page.locator('[data-tile]')).toHaveCount(3)

  // 캔버스 크기 = 그리드×scale (ch 16×19 @4)
  const ch = page.locator('canvas[data-sprite="ch:pl:stand:normal"]')
  await expect(ch).toHaveJSProperty('width', 64)
  await expect(ch).toHaveJSProperty('height', 76)
  const rendering = await ch.evaluate((el) => getComputedStyle(el).imageRendering)
  expect(rendering).toBe('pixelated')

  // 캐비닛 20×24 @3
  const cab = page.locator('canvas[data-sprite="cab:std:blue:runner"]')
  await expect(cab).toHaveJSProperty('width', 60)
  await expect(cab).toHaveJSProperty('height', 72)

  // 미정의 spec → 16×16 회색 ? 폴백, console.error 없이 warn 1회
  const fb = page.locator('canvas[data-sprite="ch:zz:stand:normal"]')
  await expect(fb).toHaveJSProperty('width', 64)
  await expect(fb).toHaveJSProperty('height', 64)

  // 타일 배경 적용 확인
  const tileBg = await page.locator('[data-tile="wood"]').evaluate((el) => getComputedStyle(el).backgroundImage)
  expect(tileBg).toContain('data:image/png')

  expect(errors).toEqual([])
  expect(warns.filter((w) => w.includes('미정의 spec'))).toHaveLength(1)

  await page.screenshot({ path: 'evidence/T1-art-sheet.png', fullPage: true })
})

test('T1: 부트 화면은 그대로 유지 (그 외 해시)', async ({ page }) => {
  await page.goto('/#nope')
  await expect(page.locator('.stage')).toBeVisible()
  await expect(page.locator('.art-sheet')).toHaveCount(0)
})
