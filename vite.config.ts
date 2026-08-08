import { defineConfig } from 'vite'

// GitHub Pages 배포 경로. dev/preview 로컬에서는 '/'
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/pixel-arcade-tycoon/' : '/',
  build: {
    target: 'es2022',
    assetsInlineLimit: 8192,
  },
  server: { port: 5173, strictPort: true },
  preview: { port: 4173, strictPort: true },
  test: {
    include: ['tests/unit/**/*.test.ts'],
    environment: 'node',
  },
}))
