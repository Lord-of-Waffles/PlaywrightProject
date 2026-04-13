// As a user I want to filter my results by category
import { test, expect } from '@playwright/test';

test('filter results by category', async ({ page }) => {

    // step 1 : navigate to map page
    await test.step('navigate to cittywatts map', async () => {
        // GOTO map page
        await page.goto('https://citiwattsdev.hevs.ch/map');

        // check that the title is correct
        await expect(page).toHaveTitle(/Toolbox/);
    })

    // step 2 : select areas by clicking on the map
    await test.step('select areas', async () => {
        // use the click tool to select areas (workaround for rectangle WFS issue)
        await page.getByRole('button', { name: 'Click' }).click();

        // click on the map to select an area
        await page.mouse.click(800, 400);

        // wait for selection to register
        await page.waitForTimeout(2000);

        // verify that the clear button is enabled (area was selected)
        await expect(page.getByRole('button', { name: 'Clear', exact: true })).toBeEnabled({ timeout: 10000 });
    })


    // step 3 : select layers 
    await test.step('select layers', async () => {
        // select layers from Buildings, Population, and Mobility categories
        await page.getByRole('checkbox', { name: 'Heat density total' }).click();
        await page.getByRole('checkbox', { name: 'Population total 2012' }).click();
        await page.getByRole('checkbox', { name: 'Motorization rate' }).click();

    })

    // step 4 : open the results tab and filter by category
    await test.step('filter results by category', async () => {

        // click on Results tab to open it
        //await page.getByText('Results').click();

        // wait for results to load
        await page.waitForTimeout(2000);

        const dropdown = page.locator('mat-select').first();

        // select Buildings
        await dropdown.click();
        await page.getByRole('option', { name: 'Buildings' }).click();
        await expect(dropdown).toContainText('Buildings');

        // select Population
        await dropdown.click();
        await page.getByRole('option', { name: 'Population' }).click();
        await expect(dropdown).toContainText('Population');

        // select Mobility
        await dropdown.click();
        await page.getByRole('option', { name: 'Mobility' }).click();
        await expect(dropdown).toContainText('Mobility');

        // select Results overview (back to default)
        await dropdown.click();
        await page.getByRole('option', { name: 'Results overview' }).click();
        await expect(dropdown).toContainText('Results overview');
    })

});