import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: 'tests/playtest',
  timeout: 240_000,
  retries: 0,
  workers: 1, // 시나리오는 순차 — 결정성·FPS 측정 보호
  use: {
    baseURL: 'http://localhost:5173',
    viewport: { width: 1440, height: 900 },
    trace: 'retain-on-failure',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
    timeout: 30_000,
  },
})
