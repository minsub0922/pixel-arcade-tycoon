import { defineConfig, loadEnv } from 'vite'

// base './' — 해시 라우팅만 쓰므로 dev/preview/GitHub Pages 모두에서 동작 (절대 경로 base 는 preview 를 깨뜨림)
export default defineConfig(({ command, mode }) => ({
  base: './',
  // dev 서버에서만 Gemini 키를 주입 (프로덕션 번들에는 빈 문자열로 대체되어 키가 절대 포함되지 않음)
  define: {
    __GEMINI_KEY_DEV__: JSON.stringify(
      command === 'serve' ? (loadEnv(mode, '.', '').GEMINI_API_KEY ?? '') : '',
    ),
  },
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
