import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.config.{js,ts,cjs}',
        '**/.eslintrc.{js,cjs}',
        '**/*.d.ts',
        'src/main.ts',
        'src/App.vue',
        'src/router/**',
        'src/views/**',
        'src/components/**',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@dashboardized/widgets': resolve(__dirname, '../../packages/widgets/src/index.ts'),
      '@dashboardized/ui': resolve(__dirname, '../../packages/ui/src/index.ts'),
      '@dashboardized/types': resolve(__dirname, '../../packages/types/src/index.ts'),
    },
  },
})
