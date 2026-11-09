// Stack-agnostic: point BASE_URL at whatever local server the chosen stack uses.
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: '.',
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    viewport: { width: 390, height: 844 }, // phone width
    deviceScaleFactor: 2,
    trace: 'off',
  },
});
