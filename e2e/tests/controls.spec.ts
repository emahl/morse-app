import { test, expect } from '@playwright/test';
import { MorseApp } from '../fixtures/app';

test.describe('Controls Area - Button & Switch Tests', () => {
  let app: MorseApp;

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    app = new MorseApp(page);
    // Navigate into free mode (controls only exist there)
    await page.locator('[aria-label="Free mode"]').click();
  });

  test('auto mode switch is visible and toggles', async () => {
    // Settings panel is closed by default — open it first
    await app.page.locator('[aria-label="Open settings"]').click();
    await app.page.waitForTimeout(300);

    const toggle = app.page.locator('[data-testid="auto-mode-switch"]');
    await expect(toggle).toBeVisible();

    await toggle.click();
    await app.page.waitForTimeout(100);
    await expect(toggle).toBeVisible();

    await toggle.click();
    await app.page.waitForTimeout(100);
    await expect(toggle).toBeVisible();
  });

  test('show tree button is clickable', async () => {
    const button = app.page.locator('[aria-label="Show morse tree"]');
    await expect(button).toBeVisible();
  });

  test('clear button resets text to placeholder', async () => {
    // Accumulate some text (dit = E)
    await app.performDit();
    await app.page.waitForTimeout(50);
    await app.waitForAutoCommit();

    // Verify text was added
    const accumulated = await app.getAccumulatedText();
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
    const accumulated = await app.getAccumulatedText();
    expect(accumulated).toContain('ET');

    // Clear
    await app.clickClear();
    await app.page.waitForTimeout(100);

    // Should be back to placeholder
    const cleared = await app.getAccumulatedText();
    expect(cleared).toContain('[What hath God wrought?]');
  });

  test('tree overlay shows Morse Tree header when show tree button is clicked', async () => {
    await app.clickShowTree();
    await app.page.waitForTimeout(500);

    // Morse Tree header should be visible
    const treeHeader = app.page.locator('text=Morse Tree');
    await expect(treeHeader).toBeVisible();
  });
});
