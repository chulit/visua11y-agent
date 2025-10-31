import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom', // Enable JSDOM for DOM-related tests
    alias: [
      { find: '@', replacement: resolve(__dirname, './src') },
    ],
    testTimeout: 10000,
    setupFiles: ['./test/setup.ts'],
  },
  define: {
    'process.env.NODE_ENV': '"test"',
  },
  assetsInclude: [
    "**/*.html",
    "**/*.svg"
  ],
});