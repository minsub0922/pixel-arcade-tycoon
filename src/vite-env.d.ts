/// <reference types="vite/client" />

// vite.config.ts define — dev 서버에서만 실제 값, 프로덕션 번들에서는 항상 '' (키 비노출 보장)
declare const __GEMINI_KEY_DEV__: string
