// As a user I want selection tools that are both handy and do not obstruct visibility
import { test, expect } from '@playwright/test';

test('selection tools are handy and do not obstruct visibility', async ({ page }) => {

    // step 1 : navigate to map page
    await test.step('navigate to cittywatts map', async () => {
        await page.goto('https://citiwattsdev.hevs.ch/map');
        await expect(page).toHaveTitle(/Toolbox/);

        // wait for the map to fully load
        await page.waitForTimeout(3000);

        // dismiss any error toast if present
        const closeToast = page.getByRole('button', { name: 'close' });
        if (await closeToast.isVisible().catch(() => false)) {
            await closeToast.click();
        }
    })

    // step 2 : select an area on the map using click tool
    await test.step('select area with click tool', async () => {
        // make sure the click tool is active
        await page.getByRole('button', { name: 'Click' }).click();

        // click on the map to select an area
        await page.mouse.click(800, 400);

        // wait for selection to register
        await page.waitForTimeout(2000);

        // verify the clear button becomes enabled (a selection was made)
        const clearBtn = page.getByRole('button', { name: 'Clear', exact: true });
        await expect(clearBtn).toBeEnabled({ timeout: 10000 });
    })

    // step 3 : clear the selection
    await test.step('clear selection', async () => {
        const clearBtn = page.getByRole('button', { name: 'Clear', exact: true });
        await clearBtn.click();
        await page.waitForTimeout(500);

        // verify the clear button is disabled again (selection was cleared)
        await expect(clearBtn).toBeDisabled();
    })

    // step 4 : drag the selection toolbar to a new position
    await test.step('drag selection toolbar to new position', async () => {
        // the grab handle is a button with aria-label="Grab" using Angular CDK drag
        const grabHandle = page.getByRole('button', { name: 'Grab' });
        await expect(grabHandle).toBeVisible();

        // get the initial position of the toolbar
        const initialBox = await grabHandle.boundingBox();
        const startX = initialBox.x + initialBox.width / 2;
        const startY = initialBox.y + initialBox.height / 2;

        // drag the toolbar 300px to the right and 200px down
        const offsetX = 300;
        const offsetY = 200;

        await page.mouse.move(startX, startY);
        await page.mouse.down();
        await page.mouse.move(startX + offsetX, startY + offsetY, { steps: 10 });
        await page.mouse.up();

        await page.waitForTimeout(500);

        // verify the toolbar moved to the new position
        const newBox = await grabHandle.boundingBox();
        expect(Math.abs(newBox.x - initialBox.x)).toBeGreaterThan(50);
        expect(Math.abs(newBox.y - initialBox.y)).toBeGreaterThan(50);
    })

    // step 5 : verify toolbar stays in new position after clicking a tool
    await test.step('toolbar stays in new position after using a tool', async () => {
        const grabHandle = page.getByRole('button', { name: 'Grab' });
        const positionBefore = await grabHandle.boundingBox();

        // click the click/pointer tool
        await page.getByRole('button', { name: 'Click' }).click();

        // verify toolbar didn't move back
        const positionAfter = await grabHandle.boundingBox();
        expect(Math.abs(positionAfter.x - positionBefore.x)).toBeLessThan(5);
        expect(Math.abs(positionAfter.y - positionBefore.y)).toBeLessThan(5);
    })

});
