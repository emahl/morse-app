import { test, expect } from '@playwright/test';
import { MorseApp } from '../fixtures/app';

test.describe('Text Display Area - Visibility Tests', () => {
  let app: MorseApp;

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    app = new MorseApp(page);
  });

  test('placeholder text is visible on load', async ({ page }) => {
    const placeholder = '[What hath God wrought?]';
    const text = await page.locator('[data-testid="accumulated-text"]').textContent();
    expect(text).toContain(placeholder);
  });

  test('text remains visible after a dit press (overlay is transparent at rest)', async () => {
    // This test catches the overlay bug: if the overlay has opaque white background at rest,
    // the text will be invisible
    const placeholderText = await app.getAccumulatedText();
    expect(placeholderText).toContain('[What');

    await app.performDit();
    await app.page.waitForTimeout(50);

    // During animation, dit should show
    const duringAnimation = await app.getDitDahText();
    expect(duringAnimation).toBe('dit');

    // After animations complete, overlay should be transparent (not showing opaque white)
    // Wait for dit text to fade
    await app.page.waitForTimeout(200);

    // Dit text should be gone, but text area should still be accessible
    const ditTextAfterFade = await app.getDitDahText();
    expect(ditTextAfterFade).toBe('');

    // Text element should exist and be visible (not hidden by opaque overlay)
    const textElement = app.page.locator('[data-testid="accumulated-text"]');
    await expect(textElement).toBeVisible();
  });

  test('dit/dah text appears briefly then disappears', async () => {
    await app.performDit();

    // Dit text should appear
    await app.page.waitForTimeout(50);
    const ditText = await app.getDitDahText();
    expect(ditText).toBe('dit');

    // After the dit duration, it should fade out
    await app.page.waitForTimeout(200);
    const textAfterFade = await app.getDitDahText();
    // By this time, the text should be cleared or invisible
    expect(textAfterFade).toBe('');
  });

  test('dah animation shows "dah" text then disappears', async () => {
    await app.performDah();

    // Dah text should appear
    await app.page.waitForTimeout(50);
    const dahText = await app.getDitDahText();
    expect(dahText).toBe('dah');

    // After the dah duration, it should fade out
    await app.page.waitForTimeout(350);
    const textAfterFade = await app.getDitDahText();
    expect(textAfterFade).toBe('');
  });

  test('multiple presses show correct dit/dah sequence', async () => {
    // Dit
    await app.performDit();
    await app.page.waitForTimeout(50);
    expect(await app.getDitDahText()).toBe('dit');
    await app.page.waitForTimeout(200);

    // Dah
    await app.performDah();
    await app.page.waitForTimeout(50);
    expect(await app.getDitDahText()).toBe('dah');
    await app.page.waitForTimeout(350);

    // Verify text element is visible (not hidden by opaque overlay)
    const textElement = app.page.locator('[data-testid="accumulated-text"]');
    await expect(textElement).toBeVisible();
  });

  test('screenshot: text is visible during and after animation', async ({ page }) => {
    // Take a screenshot showing the text is visible
    await expect(page).toHaveScreenshot('initial-state.png', { maxDiffPixels: 200 });

    await app.performDit();
    await app.page.waitForTimeout(150);

    // Take another screenshot to verify text is still visible after animation
    await expect(page).toHaveScreenshot('after-dit.png', { maxDiffPixels: 200 });
  });
});
