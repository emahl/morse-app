import { test, expect } from '@playwright/test';
import { MorseApp } from '../fixtures/app';

test.describe('Controls Area - Button & Switch Tests', () => {
  let app: MorseApp;

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    app = new MorseApp(page);
  });

  test('auto mode switch toggles label opacity', async () => {
    // Get initial opacity
    const modeLabel = app.page.locator('text=Automatic character check');
    const initialOpacity = await modeLabel.evaluate((el) =>
      window.getComputedStyle(el).opacity
    );

    // Opacity should be 1 initially (enabled by default)
    expect(parseFloat(initialOpacity)).toBe(1);

    // Toggle the switch
    await app.toggleAutoMode();
    await app.page.waitForTimeout(100);

    // Opacity should now be 0.5 (disabled)
    const disabledOpacity = await modeLabel.evaluate((el) =>
      window.getComputedStyle(el).opacity
    );
    expect(parseFloat(disabledOpacity)).toBe(0.5);

    // Toggle again
    await app.toggleAutoMode();
    await app.page.waitForTimeout(100);

    // Opacity should be back to 1
    const reenabledOpacity = await modeLabel.evaluate((el) =>
      window.getComputedStyle(el).opacity
    );
    expect(parseFloat(reenabledOpacity)).toBe(1);
  });

  test('show tree button is clickable', async () => {
    // Locate the button by its text content
    const button = app.page.locator('text=/Need help\\?|Got it\\!/');

    // Button should be visible initially
    await expect(button).toBeVisible();
  });

  test('clear button resets text to placeholder', async () => {
    // Accumulate some text (dit = E)
    await app.performDit();
    await app.page.waitForTimeout(50);
    await app.waitForAutoCommit();

    // Verify text was added
    let accumulated = await app.getAccumulatedText();
    expect(accumulated).toContain('E');

    // Click clear
    await app.clickClear();
    await app.page.waitForTimeout(100);

    // Text should be reset to placeholder
    const cleared = await app.getAccumulatedText();
    expect(cleared).toContain('[What hath God wrought?]');
  });

  test('clear button clears multiple characters', async () => {
    // Accumulate multiple characters
    await app.performDit();
    await app.page.waitForTimeout(50);
    await app.waitForAutoCommit();

    await app.performDah();
    await app.page.waitForTimeout(50);
    await app.waitForAutoCommit();

    // Verify we have 'ET' (dit + dah)
    let accumulated = await app.getAccumulatedText();
    expect(accumulated).toContain('ET');

    // Clear
    await app.clickClear();
    await app.page.waitForTimeout(100);

    // Should be back to placeholder
    const cleared = await app.getAccumulatedText();
    expect(cleared).toContain('[What hath God wrought?]');
  });

  test('tree overlay shows Morse Tree header when Need help? button is clicked', async () => {
    // Click "Need help?" button to show tree
    await app.clickShowTree();
    await app.page.waitForTimeout(500);

    // Morse Tree header should be visible
    const treeHeader = app.page.locator('text=Morse Tree');
    await expect(treeHeader).toBeVisible();
  });
});
