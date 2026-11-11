import { defineConfig } from '@playwright/test'

const baseURL = process.env.BASE_URL || 'http://localhost:5173'

export default defineConfig({
  testDir: '.',
  outputDir: '../test-results',
  reporter: 'list',
  use: {
    baseURL,
    viewport: { width: 390, height: 844 }, // phone width
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    trace: 'off',
  },
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: 'npm run dev -- --port 5173 --strictPort',
        url: baseURL,
        reuseExistingServer: true,
        cwd: '..',
      },
})
