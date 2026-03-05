// As a user I want to add a personal layer of type geosjon

import { test, expect } from '@playwright/test';

const geojsonFilePath = 'data/pantagruel.geojson';

test('add a personal layer of type geosjon', async ({ page }) => {


    // step 0 : login to have the personal layer thingy 
    // i guess = idk really lets try without it cause I'm currently logged in 

    // step 1 : navigate to map page
    await test.step('navigate to cittywatts map', async () => {
        //GOTO map page
        await page.goto('https://citiwattsdev.hevs.ch/map');

        // check that the title is correct
        await expect(page).toHaveTitle(/Toolbox/);
    })

    // step 2 : find layer tab -> button "add personal layer"
    await test.step('Add personal layer', async () => {
        // find and click on personal layer button 
        // yes a specific step for that cause if it doesnt work then it means there is a problem :) 
        // and also i think the next step deserves its own step 
        await page.getByRole("button", { name : "Add a personal layer", exact: true }).click();

        //check that the form is visible
        await expect(page.getByRole('dialog', { name: 'Personal layer' })).toBeVisible();

    })

    // step 3 : use form
    await test.step('upload GeoJson file', async () => {
        // select form
        let formModal = page.getByRole('dialog', { name: 'Personal layer' });

        // directly put file in input (no need to click on upload button)
        await formModal.locator('input[type="file"]').setInputFiles(geojsonFilePath);

        // add file type
        await formModal.getByRole('combobox', { name: 'Select the layer type' }).click({ force: true });
        await page.locator('#mat-option-0').getByText('Geojson').click();

        // click on upload layer button
        await formModal.getByRole("button", {name : "Upload layer"}).click();

        // wait for the dialog to close (upload complete)
        await expect(page.getByRole('dialog', { name: 'Personal layer' })).toBeHidden();
    })


    // step 4 : check that the uploaded layer was indeed uploaded
    await test.step('validate uploaded layer', async () => {
        // check that the layer name appears in the personal layers section
        const uploadedLayer = page.locator('app-card-layer-personal').filter({ hasText: 'pantagruel' }).first();
        await expect(uploadedLayer).toBeVisible();

        // select the layer to display it on the map
        await uploadedLayer.getByRole('checkbox').click();
        await expect(uploadedLayer.getByRole('checkbox')).toBeChecked();

        // dismiss the toast notification so it doesn't interfere with the screenshot
        const closeToast = page.getByRole('button', { name: 'close' });
        if (await closeToast.isVisible().catch(() => false)) {
            await closeToast.click();
        }

        // wait for map tiles to load
        await page.waitForTimeout(3000);

        // visual comparison: take a screenshot of the map and compare with the provided reference
        await expect(page).toHaveScreenshot('us26-geojson-layer.png', {
            maxDiffPixelRatio: 0.1,
        });
    })

});
