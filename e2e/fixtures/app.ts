import { Page } from '@playwright/test';

/**
 * Page Object / Fixture for Morse App.
 * For free-mode tests call navigateToFreeMode() first.
 * For learn-mode tests call resetAndNavigateToLearnMode() first.
 */
export class MorseApp {
  constructor(public page: Page) {}

  /** Clear persisted state and reload so every test starts clean. */
  async reset() {
    await this.page.evaluate(() => window.localStorage.clear());
    await this.page.reload();
    await this.page.waitForSelector('text=MORSE CODE');
  }

  // ── Free mode ─────────────────────────────────────────────────────────────

  async navigateToFreeMode() {
    await this.page.locator('[aria-label="Free mode"]').click();
  }

  async performDit() {
    const box = await this.page.locator('[data-testid="tap-zone"]').boundingBox();
    if (!box) throw new Error('tap-zone not found');
    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;
    await this.page.mouse.move(cx, cy);
    await this.page.mouse.down();
    await this.page.waitForTimeout(100);
    await this.page.mouse.up();
  }

  async performDah() {
    const box = await this.page.locator('[data-testid="tap-zone"]').boundingBox();
    if (!box) throw new Error('tap-zone not found');
    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;
    await this.page.mouse.move(cx, cy);
    await this.page.mouse.down();
    await this.page.waitForTimeout(350); // Over 250ms threshold = dah
    await this.page.mouse.up();
  }

  async waitForAutoCommit() {
    await this.page.waitForTimeout(1000);
  }

  async getCurrentCharacter(): Promise<string> {
    return await this.page.locator('[data-testid="current-character"]').textContent() ?? '';
  }

  async getAccumulatedText(): Promise<string> {
    return await this.page.locator('[data-testid="accumulated-text"]').textContent() ?? '';
  }

  async getDitDahText(): Promise<string> {
    return await this.page.locator('[data-testid="dit-dah-text"]').textContent() ?? '';
  }

  async clickClear() {
    await this.page.locator('[aria-label="Clear all text"]').click();
  }

  async clickShowTree() {
    await this.page.locator('[aria-label="Show morse tree"], [aria-label="Hide morse tree"]').click();
  }

  async toggleAutoMode() {
    const isOpen = await this.page.locator('[data-testid="auto-mode-switch"]').isVisible();
    if (!isOpen) {
      await this.page.locator('[aria-label="Open settings"], [aria-label="Close settings"]').click();
      await this.page.waitForTimeout(300);
    }
    await this.page.locator('[data-testid="auto-mode-switch"]').click();
  }

  // ── Learn mode ────────────────────────────────────────────────────────────

  /** Navigate from MainMenu into the learn flow (handles skill-select if needed). */
  async navigateToLearnMode() {
    await this.page.locator('[aria-label="Learn morse code"]').click();
  }

  async selectSkillLevel(level: 'Complete beginner' | 'Some experience' | 'I know morse') {
    await this.page.getByText(level).click();
    await this.page.waitForSelector('text=Learn Morse Code');
  }

  async openLevel(levelNumber: number) {
    await this.page.locator(`[aria-label^="Level ${levelNumber}:"]`).click();
  }

  /** Advance past all lesson cards in the current level until a quiz challenge appears. */
  async skipLessons() {
    while (await this.page.locator('[aria-label="Got it"]').isVisible()) {
      await this.page.locator('[aria-label="Got it"]').click();
      await this.page.waitForTimeout(150);
    }
  }

  async tapOption(option: string) {
    await this.page.locator(`[aria-label="Option ${option}"]`).click();
  }

  async clickNext() {
    await this.page.locator('[aria-label="Next challenge"]').click();
  }

  async clickRetry() {
    await this.page.locator('[aria-label="Retry challenge"]').click();
  }
}
