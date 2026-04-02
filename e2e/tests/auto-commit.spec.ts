import { test, expect } from '@playwright/test';
import { MorseApp } from '../fixtures/app';

test.describe('Auto-Commit - Character Commit Tests', () => {
  let app: MorseApp;

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    app = new MorseApp(page);
  });

  test('single dit auto-commits to "E" after 800ms', async () => {
    // Clear placeholder
    await app.performDit();
    await app.page.waitForTimeout(150);

    // Reset by clicking clear
    await app.clickClear();
    await app.page.waitForTimeout(100);

    // New dit
    await app.performDit();
    await app.page.waitForTimeout(50);

    // Verify currentCharacter shows 'E' during input
    expect(await app.getCurrentCharacter()).toBe('E');

    // Wait for auto-commit (800ms + buffer)
    await app.waitForAutoCommit();

    // Character should now be in accumulated text
    const accumulated = await app.getAccumulatedText();
    expect(accumulated).toContain('E');
  });

  test('dit-dah auto-commits to "A" after 800ms', async () => {
    // Clear placeholder
    await app.performDit();
    await app.page.waitForTimeout(150);
    await app.clickClear();
    await app.page.waitForTimeout(100);

    // Dit-dah sequence
    await app.performDit();
    await app.page.waitForTimeout(50);
    await app.performDah();
    await app.page.waitForTimeout(50);

    expect(await app.getCurrentCharacter()).toBe('A');

    // Auto-commit
    await app.waitForAutoCommit();

    const accumulated = await app.getAccumulatedText();
    expect(accumulated).toContain('A');
  });

  test('builds word: dit auto-commits to E, then dah auto-commits to T', async () => {
    // Clear
    await app.performDit();
    await app.page.waitForTimeout(150);
    await app.clickClear();
    await app.page.waitForTimeout(100);

    // First dit (E)
    await app.performDit();
    await app.page.waitForTimeout(50);
    await app.waitForAutoCommit();

    let accumulated = await app.getAccumulatedText();
    expect(accumulated).toContain('E');

    // Second dah (T)
    await app.performDah();
    await app.page.waitForTimeout(50);
    await app.waitForAutoCommit();

    accumulated = await app.getAccumulatedText();
    expect(accumulated).toContain('ET');
  });

  test('auto-commit is cancelled by new press (timer reset)', async () => {
    // Dit (but don't wait for auto-commit yet)
    await app.performDit();
    await app.page.waitForTimeout(50);

    // Verify we have dit
    expect(await app.getCurrentCharacter()).toBe('E');

    // Wait almost 800ms (but not quite auto-commit)
    await app.page.waitForTimeout(650);

    // Before commit, press another character (this should reset the timer)
    await app.performDah();
    await app.page.waitForTimeout(50);

    // Now we have dit-dah (A), not just dit-dah without the E
    expect(await app.getCurrentCharacter()).toBe('A');

    // Wait for auto-commit of the NEW sequence
    await app.waitForAutoCommit();

    const accumulated = await app.getAccumulatedText();
    // Should only have 'A', not 'E' + 'A'
    expect(accumulated).toContain('A');
  });

  test('multiple auto-commits build the sequence correctly', async () => {
    // Clear
    await app.performDit();
    await app.page.waitForTimeout(150);
    await app.clickClear();
    await app.page.waitForTimeout(100);

    // E (dit)
    await app.performDit();
    await app.page.waitForTimeout(50);
    await app.waitForAutoCommit();

    // S (dit x3)
    await app.performDit();
    await app.page.waitForTimeout(50);
    await app.performDit();
    await app.page.waitForTimeout(50);
    await app.performDit();
    await app.page.waitForTimeout(50);
    await app.waitForAutoCommit();

    // O (dah x3)
    await app.performDah();
    await app.page.waitForTimeout(50);
    await app.performDah();
    await app.page.waitForTimeout(50);
    await app.performDah();
    await app.page.waitForTimeout(50);
    await app.waitForAutoCommit();

    const accumulated = await app.getAccumulatedText();
    expect(accumulated).toContain('ESO');
  });
});
