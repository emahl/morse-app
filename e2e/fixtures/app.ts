import { Page } from '@playwright/test';

/**
 * Page Object / Fixture for Morse App
 * Encapsulates common interactions like dit/dah presses
 */
export class MorseApp {
  constructor(public page: Page) {}

  /**
   * Perform a "dit" (short press) — hold for ~100ms (under 150ms threshold)
   */
  async performDit() {
    const box = await this.page.locator('[data-testid="tap-zone"]').boundingBox();
    if (!box) throw new Error('tap-zone not found');

    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;

    await this.page.mouse.move(cx, cy);
    await this.page.mouse.down();
    await this.page.waitForTimeout(100); // Under 150ms threshold = dit
    await this.page.mouse.up();
  }

  /**
   * Perform a "dah" (long press) — hold for ~250ms (over 150ms threshold)
   */
  async performDah() {
    const box = await this.page.locator('[data-testid="tap-zone"]').boundingBox();
    if (!box) throw new Error('tap-zone not found');

    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;

    await this.page.mouse.move(cx, cy);
    await this.page.mouse.down();
    await this.page.waitForTimeout(250); // Over 150ms threshold = dah
    await this.page.mouse.up();
  }

  /**
   * Wait for the auto-commit timer (800ms CHARACTER_DELAY_DURATION)
   */
  async waitForAutoCommit() {
    await this.page.waitForTimeout(1000); // Slightly over 800ms
  }

  /**
   * Get the current character preview text
   */
  async getCurrentCharacter(): Promise<string> {
    return this.page.locator('[data-testid="current-character"]').textContent() || '';
  }

  /**
   * Get the accumulated text
   */
  async getAccumulatedText(): Promise<string> {
    return this.page.locator('[data-testid="accumulated-text"]').textContent() || '';
  }

  /**
   * Get the dit/dah overlay text
   */
  async getDitDahText(): Promise<string> {
    return this.page.locator('[data-testid="dit-dah-text"]').textContent() || '';
  }

  /**
   * Click the "Clear all text" button
   */
  async clickClear() {
    await this.page.locator('text=Clear all text').click();
  }

  /**
   * Click the "Need help?" / "Got it!" button
   */
  async clickShowTree() {
    await this.page.locator('text=/Need help\\?|Got it\\!/').click();
  }

  /**
   * Toggle the auto mode switch
   */
  async toggleAutoMode() {
    await this.page.locator('role=switch').click();
  }
}
