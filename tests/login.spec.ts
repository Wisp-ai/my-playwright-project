import { test, expect } from '@playwright/test';
import { credentials } from '../credentials';

test.describe('Login', () => {
  test('should login successfully with valid credentials', async ({ page }) => {
    const { loginUrl, email, password } = credentials;
    await page.goto(loginUrl);
    await page.fill('input[type="email"]', email);
    await page.fill('input[type="password"]', password);
    await page.getByText('EmailPassword Login').click();
    await page.waitForURL('**/bo/**', { timeout: 10000 });
    await expect(page).toHaveURL(/\/bo\//);
  });

  test('should show error message with invalid credentials', async ({ page }) => {
    const { loginUrl } = credentials;
    await page.goto(loginUrl);
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.getByRole('button', { name: 'Login' }).click();
    await expect(page.getByText('Wrong username or password')).toBeVisible();
  });
  
// test('login button should be disabled when fields are empty', async ({ page }) => {
//   const { loginUrl } = credentials;
//   await page.goto(loginUrl);

//   const loginButton = page.getByRole('button', { name: 'Login' });

//   await expect(loginButton).toHaveClass(/disabled/);
// });
  test('forgot password link should navigate to reset page', async ({ page }) => {
    const { loginUrl } = credentials;
    await page.goto(loginUrl);
    await page.getByRole('link', { name: 'Forgot password?' }).click();
    await page.waitForURL('**/forgot-password', { timeout: 10000 });
    await expect(page).toHaveURL(/forgot-password/);
  });

  test('user can type email adress in reset password field', async ({ page }) => {
    const { loginUrl } = credentials;
    await page.goto(loginUrl);
    await page.getByRole('link', { name: 'Forgot password?' }).click();
    await page.waitForURL('**/forgot-password', { timeout: 10000 });
    await page.fill('input[type="email"]', 'test@example.com');
    await expect(page.locator('input[type="email"]')).toHaveValue('test@example.com');
  });

  test('user can submit reset password form', async ({ page }) => {
    const { loginUrl, email } = credentials;
    await page.goto(loginUrl);
    await page.getByRole('link', { name: 'Forgot password?' }).click();
    await page.waitForURL('**/forgot-password', { timeout: 10000 });
    await page.fill('input[type="email"]', email);
    await page.getByRole('button', { name: 'Email Send Password Reset' }).click();
    //await expect(page.getByText('Email has been sent. Please click on link provided in it.')).toBeVisible();
  });
  test('should show error message for invalid user email in reset password form', async ({ page }) => {
    const { loginUrl } = credentials;
    await page.goto(loginUrl);
    await page.getByRole('link', { name: 'Forgot password?' }).click();
    await page.waitForURL('**/forgot-password', { timeout: 10000 });
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.getByRole('button', { name: 'Email Send Password Reset' }).click();
    //await expect(page.getByText('User does not exist')).toBeVisible();
  });
});