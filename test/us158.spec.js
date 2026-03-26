// As a user I want to be protected against actions that would compromise my CM results.

import { test, expect } from '@playwright/test';

test.beforeEach(async ({ context, page }) => {
    await context.clearCookies();
    await page.addInitScript(() => {
        window.localStorage.clear();
        window.sessionStorage.clear();
    });
})
const mapSite = 'https://citiwattsdev.hevs.ch/map'

// Demand modules
// Scale heat and cool density maps
// multiplication factor
test('Negative multiplication factor is not possible', async ({page}) => {

    await test.step('Navigate to CM', async () => {
        await page.goto(mapSite);
        await page.getByRole('button', { name: 'Accept all cookies' }).click();
        await page.locator('#mat-tab-group-0-label-1').getByText('calculate Calculations').click();
        await page.getByRole('button', { name: 'CM - Scale heat and cool' }).click();
    });


    await test.step('Test Calculation module minimum', async () => {
        await page.getByRole('textbox', { name: 'Multiplication factor' }).click();
        await page.getByRole('textbox', { name: 'Multiplication factor' }).fill('-1');
        await page.getByRole('textbox', { name: 'Multiplication factor' }).press('Enter');
        await expect(page.getByRole('textbox', { name: 'Multiplication factor' })).toHaveValue('1');
    });

});

test('Multiplication factor above 10 not possible', async ({page}) => {
    await test.step('Navigate to CM', async () => {
        await page.goto(mapSite);
        await page.getByRole('button', { name: 'Accept all cookies' }).click();
        await page.locator('#mat-tab-group-0-label-1').getByText('calculate Calculations').click();
        await page.getByRole('button', { name: 'CM - Scale heat and cool' }).click();
    });

    await test.step('Test Calculation module maximum', async () => {
        await page.getByRole('textbox', { name: 'Multiplication factor' }).click();
        await page.getByRole('textbox', { name: 'Multiplication factor' }).fill('11');
        await page.getByRole('textbox', { name: 'Multiplication factor' }).press('Enter');
        await expect(page.getByRole('textbox', { name: 'Multiplication factor' })).toHaveValue('1');

    });
});

test('Multiplication factor between 1-10 is possible', async ({page}) => {
    await test.step('Navigate to CM', async () => {
        await page.goto(mapSite);
        await page.getByRole('button', { name: 'Accept all cookies' }).click();
        await page.locator('#mat-tab-group-0-label-1').getByText('calculate Calculations').click();
        await page.getByRole('button', { name: 'CM - Scale heat and cool' }).click();
    });

    await test.step('Test Calculation module works', async () => {
        await page.getByRole('textbox', { name: 'Multiplication factor' }).click();
        await page.getByRole('textbox', { name: 'Multiplication factor' }).fill('5');
        await page.getByRole('textbox', { name: 'Multiplication factor' }).press('Enter');
        await expect(page.getByRole('textbox', { name: 'Multiplication factor' })).toHaveValue('5');
    });
});

//layer input

test('All heat demand density layers are selectable', async ({page}) => {
    await test.step('Navigate to CM', async () => {
        await page.goto(mapSite);
        await page.getByRole('button', { name: 'Accept all cookies' }).click();
        await page.locator('#mat-tab-group-0-label-1').getByText('calculate Calculations').click();
        await page.getByRole('button', { name: 'CM - Scale heat and cool' }).click();
    });

    await test.step('Cycle through layer inputs', async () => {
        await page.getByRole('region', { name: 'Layer inputs' }).getByRole('combobox').selectOption('Heat density residential sector');
        await page.getByRole('region', { name: 'Layer inputs' }).getByRole('combobox').selectOption('Heat density non-residential sector');
        await page.getByRole('region', { name: 'Layer inputs' }).getByRole('combobox').selectOption('Cooling density total');
        await expect(page.getByRole('region', { name: 'Layer inputs' }).getByRole('combobox')).toHaveValue('Cooling density total');    });
});

// from here on out i'm using npx playwright codegen, much faster -  Ben
test('Navigating away from CM tab while CM is running is not possible: Heat Density', async ({page}) => {
    await page.goto(mapSite);
    await page.getByRole('button', { name: 'Accept all cookies' }).click();
    await page.locator('#mat-tab-group-0-label-1').getByText('calculate Calculations').click();
    await page.getByRole('button', { name: 'CM - Scale heat and cool' }).click();
    await page.getByRole('textbox', { name: 'Multiplication factor' }).click();
    await page.getByRole('textbox', { name: 'Multiplication factor' }).fill('5');
    await page.getByRole('combobox', { name: 'Go to place...' }).click();
    await page.getByRole('combobox', { name: 'Go to place...' }).fill('ipswich');
    await page.getByText('Ipswich, Suffolk, England,').click();
    await page.locator('#map').click();
    await page.getByRole('button', { name: 'Run CM' }).click();
    await expect(page.getByRole('button', { name: 'Back', exact: true })).toBeDisabled;
    await expect(page.getByRole('tab', { name: 'Layers' })).toBeDisabled;
})

test('Navigating away from CM tab while CM is running is not possible: EV Density', async ({page}) => {
    await page.goto(mapSite);
    await page.getByRole('button', { name: 'Accept all cookies' }).click();
    await page.locator('#mat-tab-group-0-label-1').getByText('calculate Calculations').click();
    await page.getByRole('button', { name: 'CM - Electric vehicle density' }).click();
    await page.getByRole('combobox', { name: 'Go to place...' }).click();
    await page.getByRole('combobox', { name: 'Go to place...' }).fill('suffolk');
    await page.getByText('Suffolk, England, United').click();
    await page.locator('#map').click();
    await page.getByRole('button', { name: 'Run CM' }).click();
    await expect(page.getByRole('button', { name: 'Back', exact: true })).toBeDisabled;
    await expect(page.getByRole('tab', { name: 'Layers' })).toBeDisabled;
})

test('Navigating away from CM tab while CM is running is not possible: Shallow geothermal potential', async ({page}) => {
    await page.goto(mapSite);
    await page.getByRole('button', { name: 'Accept all cookies' }).click();
    await page.locator('#mat-tab-group-0-label-1').getByText('calculate Calculations').click();
    await page.locator('#selectSelectableAreas').selectOption('NUTS 3');
    await page.getByRole('button', { name: 'CM - Shallow geothermal' }).click();
    await page.getByRole('combobox', { name: 'Go to place...' }).click();
    await page.getByRole('combobox', { name: 'Go to place...' }).fill('reykjavik');
    await page.getByRole('option', { name: 'Reykjavik, Capital Region,' }).click();
    await page.locator('#map').click();
    await page.getByRole('button', { name: 'Run CM' }).click();
    await page.getByText('layers Layers calculate Calculations', { exact: true }).click();
    await expect(page.getByRole('button', { name: 'Back', exact: true })).toBeDisabled;
    await expect(page.getByRole('tab', { name: 'Layers' })).toBeDisabled;
})

test('Verify spinner is working While CM is running', async ({ page }) => {
    test.setTimeout(120_000);
    await page.goto(mapSite);
    await page.getByRole('button', { name: 'Accept all cookies' }).click();
    await page.locator('#selectSelectableAreas').selectOption('NUTS 1');
    await page.locator('#mat-tab-group-0-label-1').getByText('calculate Calculations').click();
    await page.getByRole('button', { name: 'CM - Demand projection' }).click();
    await page.getByRole('combobox', { name: 'Go to place...' }).click();
    await page.getByRole('combobox', { name: 'Go to place...' }).fill('london');
    await page.getByText('Greater London, England, United Kingdom', { exact: true }).click();
    await page.locator('#map').click();
    await page.getByRole('button', { name: 'Run CM' }).click();
    await expect(page.locator('.uk-icon > svg')).toBeEnabled();
});
