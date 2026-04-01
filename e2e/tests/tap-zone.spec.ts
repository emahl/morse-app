import { test, expect } from '@playwright/test';
import { MorseApp } from '../fixtures/app';

test.describe('Tap Zone - Input Tests', () => {
  let app: MorseApp;

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    app = new MorseApp(page);
  });

  test('short press (100ms) = dit → current character shows "E"', async () => {
    // Perform a dit press
    await app.performDit();
    await app.page.waitForTimeout(50);

    // A single dit should decode to 'E'
    const currentChar = await app.getCurrentCharacter();
    expect(currentChar).toBe('E');
  });

  test('long press (250ms) = dah → current character shows "T"', async () => {
    // Perform a dah press
    await app.performDah();
    await app.page.waitForTimeout(50);

    // A single dah should decode to 'T'
    const currentChar = await app.getCurrentCharacter();
    expect(currentChar).toBe('T');
  });

  test('dit + dah = "A"', async () => {
    // Dit
    await app.performDit();
    await app.page.waitForTimeout(50);
    expect(await app.getCurrentCharacter()).toBe('E');

    // Dah (without waiting for auto-commit)
    await app.performDah();
    await app.page.waitForTimeout(50);

    // Should now show 'A' (dit-dah)
    const currentChar = await app.getCurrentCharacter();
    expect(currentChar).toBe('A');
  });

  test('dah + dit = "N"', async () => {
    // Dah
    await app.performDah();
    await app.page.waitForTimeout(50);
    expect(await app.getCurrentCharacter()).toBe('T');

    // Dit
    await app.performDit();
    await app.page.waitForTimeout(50);

    // Should now show 'N' (dah-dit)
    const currentChar = await app.getCurrentCharacter();
    expect(currentChar).toBe('N');
  });

  test('dit + dit = "I"', async () => {
    // Dit
    await app.performDit();
    await app.page.waitForTimeout(50);

    // Dit
    await app.performDit();
    await app.page.waitForTimeout(50);

    const currentChar = await app.getCurrentCharacter();
    expect(currentChar).toBe('I');
  });

  test('dit + dit + dit = "S"', async () => {
    // Dit x3
    await app.performDit();
    await app.page.waitForTimeout(50);
    await app.performDit();
    await app.page.waitForTimeout(50);
    await app.performDit();
    await app.page.waitForTimeout(50);

    const currentChar = await app.getCurrentCharacter();
    expect(currentChar).toBe('S');
  });

  test('dah + dah = "M"', async () => {
    // Dah x2
    await app.performDah();
    await app.page.waitForTimeout(50);
    await app.performDah();
    await app.page.waitForTimeout(50);

    const currentChar = await app.getCurrentCharacter();
    expect(currentChar).toBe('M');
  });
});
