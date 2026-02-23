import { defineConfig } from '@playwright/test';
import path from 'path';

export default defineConfig({
  testDir: './tests',
  testMatch: '**/*.spec.ts',
  timeout: 30 * 1000,
  webServer: undefined,
  use: {
    headless: false,
    actionTimeout: 10 * 1000,
    baseURL: 'https://stg.admiralbet.rs/bo/login',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
});