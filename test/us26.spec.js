// As a user I want to add a personal layer of type geosjon

import { test, expect } from '@playwright/test';

const geojsonFilePath = 'data/pantagruel.geojson';

test('add a personal layer of type geosjon', async ({ page }) => {

    // step 0 : login to have the personal layer thingy 

    // step 1 : navigate to map page
    await test.step('navigate to cittywatts map', async () => {
        //GOTO map page
        await page.goto('https://citiwattsdev.hevs.ch/map');

        // check that the title is correct
        await expect(page).toHaveTitle('citiwatts - Toolbox');
    })

    // step 2 : find select + change map to hectare
    await test.step('change map', async () => {
        // find selector (select element) & select the value
        await page.locator('#selectSelectableAreas').selectOption({label: 'Hectare'});

        // check the selector value is good
        await expect(page.locator('#selectSelectableAreas')).toHaveValue('Hectare');

    })

    // step 3 : click upload and upload file 
    await test.step('upload GeoJson file', async () => {
        // directly put file in input (no need to click on upload button)
        await page.locator('#file').setInputFiles(geojsonFilePath);

        //maybe wait loading ?
    })


    // step 4 : check that the uploaded layer was indeed uploaded  
    await test.step('validate uploaded layer', async () => {
        // try to select layer ? 
        

    })

});
