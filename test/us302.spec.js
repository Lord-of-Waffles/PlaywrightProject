// As a user I want to use snapshots shared to me
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ context, page }) => {
    await context.clearCookies();
})

test('Test that user can use shared snapshots', async ({ page }) => {
    test.setTimeout(120_000);

    await test.step('Log in', async () => {
        await page.goto('https://citiwattsdev.hevs.ch/map');
        //await page.getByRole('button', { name: 'Accept all cookies '}).click();
        await page.getByRole('button', { name: 'Login' }).click();
        await page.getByRole('textbox', { name: 'Username' }).click();
        await page.getByRole('textbox', { name: 'Username' }).fill('ben.worton@gmail.com');
        await page.getByRole('textbox', { name: 'Password' }).click();
        await page.getByRole('textbox', { name: 'Password' }).fill('Persuaded2-Persevere2-Outsmart2-Unbounded9-Unwoven2');
        await page.getByRole('button', { name: 'Sign In' }).click();
        await Promise.all([
            page.waitForURL('**/map**'), 
        ]);
        await expect(page.getByRole('button', { name: 'Select a snapshot' })).toBeVisible({ timeout: 15000 });

});

    await test.step('Verify the shared snapshot exists', async () => {
        // Ensure the button is ready
        await expect(page.getByRole('button', { name: 'Select a snapshot' })).toBeVisible();
        await page.getByRole('button', { name: 'Select a snapshot' }).click();
        await expect(page.getByRole('cell', { name: 'test_snapshot' })).toBeVisible();
        await page.locator('#mat-mdc-dialog-0').getByText('person').hover();
        await expect(page.locator('.mat-mdc-tooltip-surface').getByText('Shared by zarothic.ion@gmail.')).toBeVisible();
        await expect(page.getByRole('cell', { name: '/03/2026' })).toBeVisible();
        await expect(page.getByRole('cell').nth(1)).toBeVisible();
    });

    await test.step('Verify refresh works', async () => {
        const responsePromise = page.waitForResponse(response => 
            response.url().includes('/api/snapshots/shared') && response.request().method() === 'GET');
        await page.getByRole('button').filter({ hasText: 'refresh' }).click();
        const response = await responsePromise;
        expect([200, 304]).toContain(response.status());
    });

    await test.step('Apply snapshot', async () => {
        const responsePromise = page.waitForResponse(response => {
            const url = response.url();
            return url.includes('geoserver/hotmaps/wms') && 
                url.includes('request=GetFeature') && 
                url.includes('typeNames=hotmaps:population');
        }, { timeout: 30000 });
        await page.getByRole('button', { name: 'Apply snapshot' }).click();
        const response = await responsePromise;
        expect(response.status()).toBe(200);
    });
});
