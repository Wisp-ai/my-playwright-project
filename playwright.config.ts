import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  use: {
    headless: false,
    actionTimeout: 10 * 1000,
    baseURL: 'https://stg.admiralbet.rs/bo/login',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
});