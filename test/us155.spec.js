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

    // step 2 : select areas by click-and-drag on the map
    // Source - https://stackoverflow.com/a/67897824
    await test.step('select areas', async () => {
        // select the drag tool - rectangle button
        await page.getByRole('button', { name: 'Rectangle' }).click();
        
        // drag to select a region on the map
        await page.mouse.move(600, 300);
        await page.mouse.down();
        await page.mouse.move(1200, 450, { steps: 5 });
        await page.mouse.up();

        // wait for selection to register
        await page.waitForTimeout(1000);
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