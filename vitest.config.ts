import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true, // Allow using `describe`, `it` without importing
    environment: 'node', // Node environment for Fastify
    include: ['src/**/*.spec.ts', 'src/**/*.test.ts'], // Path to your tests
    setupFiles: ['dotenv/config'],
    sequence: {
      concurrent: false,
    },
  },
})
