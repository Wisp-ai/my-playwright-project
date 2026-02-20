import {test, expect} from '@playwright/test';

test('login test', async ({page}) => {
  await page.goto('/bo/login');
  await page.getByLabel('Email').fill('b.ljubicic.mijic@mbtech.rs');
  await page.getByLabel('Password').fill('demoTest123');
    await page.click('lib-button[type="submit"] button');
    await expect(page).toHaveURL('https://stg.admiralbet.rs/bo/players');
});
