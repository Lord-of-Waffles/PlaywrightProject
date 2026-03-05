import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  // Perform authentication steps. Replace these actions with your own.
  await page.goto('https://citiwattsdev.hevs.ch');
  await page.getByRole("button", {name : "Go to app"}).click();

  // Dismiss cookie dialog if present
  const declineCookies = page.getByRole("button", {name : "Decline statistics cookies"});
  if (await declineCookies.isVisible({ timeout: 5000 }).catch(() => false)) {
    await declineCookies.click();
  }

  await page.getByRole("button", {name : "Login"}).click();


  await page.getByLabel('Username').fill('dehlya.herbelin@hes-so.ch');
  await page.locator('#password').fill('TfarVd6qaYHgKnm');
  await page.getByRole('button', { name: 'Sign In' }).click();
  // Wait until the page receives the cookies.
  //
  // Sometimes login flow sets cookies in the process of several redirects.
  // Wait for the final URL to ensure that the cookies are actually set.
  await page.waitForURL(/citiwattsdev\.hevs\.ch\/map/);
  // Verify login succeeded by checking the Account button is visible
  await expect(page.getByRole('button', { name: 'Account' })).toBeVisible();

  // End of authentication steps.

  await page.context().storageState({ path: authFile });
});