//@ts-check
// As a user I want to register on the platform

import { test, expect } from '@playwright/test';

test.beforeEach(async ({ context, page }) => {
    await context.clearCookies();
    // Use an anonymous function to clear storage safely
    await page.addInitScript(() => {
        window.localStorage.clear();
        window.sessionStorage.clear();
    });
});


// test that we can access the maps page
test('Go to maps', async ({ page }) => {
    await page.goto('https://citiwattsdev.hevs.ch/');

    await page.getByRole('button', { name: 'Go to app' }).click();

    await expect(page).toHaveURL('https://citiwattsdev.hevs.ch/map')
});



// test
test('Navigate to Login page', async ({ page }) => {

    

    await test.step('Navigate to login', async () => {

        await page.goto('https://citiwattsdev.hevs.ch/map');

        // Dismiss cookie dialog if present

        /*const declineCookies = page.getByRole("button", {name : "Decline statistics cookies"});
        if (await declineCookies.isVisible({ timeout: 5000 }).catch(() => false)) {
            await declineCookies.click();
        }
        */

        //await page.getByLabel('Login').click();
        await expect(page.locator('.spinner')).toBeHidden();
        const declineCookies = page.getByRole("button", { name: "Decline statistics cookies" });

        // Wait up to 5s for the banner to actually show up in the DOM/UI
        try {
            await declineCookies.waitFor({ state: 'visible', timeout: 5000 });
            await declineCookies.click();
            // CRITICAL: Wait for it to disappear so it doesn't block the next click
            await expect(declineCookies).toBeHidden(); 
        } catch (e) {
            // If it never shows up, that's fine, we move on
            console.log("Cookie banner didn't appear.");
        }
        await page.getByRole('button', { name: 'Login' }).dispatchEvent('click');
    });

    await test.step('Fill form', async () => {

        await page.getByRole('link', { name: 'Register' }).click();

        await page.getByLabel('First name').fill('James');

        await page.getByLabel('Last name').fill('Jameson');

        await page.getByLabel('Email').fill('ben.worton@gmail.com');

        await page.locator('#password').fill('Affection6-Smuggler2-Gully8');

        await page.getByLabel('Confirm password').fill('Affection6-Smuggler2-Gully8');

        await page.getByLabel('I agree to the terms and conditions').check();

        await page.getByRole('button', { name: 'Register' }).click();

        await expect(page).toHaveTitle(/Sign in to Toolbox Login/)
    });

});