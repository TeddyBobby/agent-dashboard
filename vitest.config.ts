import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Pure function / data-generator tests only — no DOM needed.
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
