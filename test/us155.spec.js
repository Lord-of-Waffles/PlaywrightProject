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
        // select the drag tool
        await page.getByRole('button', {mattooltip : 'Draw rectangle area'});
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
        

    })

    // step 4 : open the results tab   
    await test.step('open results tab', async () => {

    })

});