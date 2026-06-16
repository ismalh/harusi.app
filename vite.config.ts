import { defineConfig } from '@lovable.dev/vite-tanstack-config';

export default defineConfig({
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
});