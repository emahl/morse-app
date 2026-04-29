import { test, expect } from '@playwright/test';
import { MorseApp } from '../fixtures/app';

test.describe('Learn mode', () => {
  let app: MorseApp;

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    app = new MorseApp(page);
    await app.reset();
  });

  // ── Onboarding ─────────────────────────────────────────────────────────────

  test('shows skill-select screen on first visit to learn mode', async () => {
    await app.navigateToLearnMode();
    await expect(app.page.getByText('Before we start')).toBeVisible();
    await expect(app.page.getByText('Complete beginner')).toBeVisible();
    await expect(app.page.getByText('Some experience')).toBeVisible();
    await expect(app.page.getByText('I know morse')).toBeVisible();
  });

  test('selecting skill level navigates to level select', async () => {
    await app.navigateToLearnMode();
    await app.selectSkillLevel('Complete beginner');
    await expect(app.page.getByText('Learn Morse Code')).toBeVisible();
    await expect(app.page.locator('[aria-label^="Level 1:"]')).toBeVisible();
  });

  test('skips skill-select on second visit', async () => {
    await app.navigateToLearnMode();
    await app.selectSkillLevel('Complete beginner');
    // Go back to menu
    await app.page.locator('[aria-label="Go back"]').click();
    await app.page.locator('[aria-label="Go back"]').click();
    // Go to learn again — should skip straight to level select
    await app.navigateToLearnMode();
    await expect(app.page.getByText('Learn Morse Code')).toBeVisible();
    await expect(app.page.getByText('Before we start')).not.toBeVisible();
  });

  test('experienced skill level unlocks all levels', async () => {
    await app.navigateToLearnMode();
    await app.selectSkillLevel('I know morse');
    // All 5 levels should be accessible (not locked/dimmed)
    for (let i = 1; i <= 5; i++) {
      await expect(app.page.locator(`[aria-label^="Level ${i}:"]`)).toBeVisible();
    }
  });

  // ── Level and lesson flow ───────────────────────────────────────────────────

  test('opening a level shows the first lesson card with "Got it"', async () => {
    await app.navigateToLearnMode();
    await app.selectSkillLevel('Complete beginner');
    await app.openLevel(1);
    await expect(app.page.locator('[aria-label="Got it"]')).toBeVisible();
  });

  test('"Got it" advances past lesson cards to first quiz challenge', async () => {
    await app.navigateToLearnMode();
    await app.selectSkillLevel('Complete beginner');
    await app.openLevel(1);
    await app.skipLessons();
    // After lessons, a multiple-choice challenge should appear (no "Got it" button)
    await expect(app.page.locator('[aria-label="Got it"]')).not.toBeVisible();
    await expect(app.page.locator('[aria-label^="Option "]').first()).toBeVisible();
  });

  // ── Multiple-choice: correct answer ────────────────────────────────────────

  test('correct answer shows "Correct!" and Next button', async () => {
    await app.navigateToLearnMode();
    await app.selectSkillLevel('Complete beginner');
    await app.openLevel(1);
    await app.skipLessons();

    // First MC challenge: · · · = S. Tap the correct answer.
    await app.tapOption('S');

    await expect(app.page.getByText('Correct!')).toBeVisible();
    await expect(app.page.locator('[aria-label="Next challenge"]')).toBeVisible();
    await expect(app.page.locator('[aria-label="Retry challenge"]')).not.toBeVisible();
  });

  test('correct answer does not show Retry button', async () => {
    await app.navigateToLearnMode();
    await app.selectSkillLevel('Complete beginner');
    await app.openLevel(1);
    await app.skipLessons();

    await app.tapOption('S');

    await expect(app.page.locator('[aria-label="Retry challenge"]')).not.toBeVisible();
  });

  test('"Next" after correct answer advances to next challenge', async () => {
    await app.navigateToLearnMode();
    await app.selectSkillLevel('Complete beginner');
    await app.openLevel(1);
    await app.skipLessons();

    await app.tapOption('S');
    await app.clickNext();

    // Next challenge should be loaded: previous feedback is gone
    await expect(app.page.getByText('Correct!')).not.toBeVisible();
    await expect(app.page.locator('[aria-label^="Option "]').first()).toBeVisible();
  });

  // ── Multiple-choice: wrong answer ──────────────────────────────────────────

  test('wrong answer shows "Wrong — try again!" and Retry button', async () => {
    await app.navigateToLearnMode();
    await app.selectSkillLevel('Complete beginner');
    await app.openLevel(1);
    await app.skipLessons();

    // Tap a wrong option (E is wrong for · · ·)
    await app.tapOption('E');

    await expect(app.page.getByText('Wrong — try again!')).toBeVisible();
    await expect(app.page.locator('[aria-label="Retry challenge"]')).toBeVisible();
    await expect(app.page.locator('[aria-label="Next challenge"]')).not.toBeVisible();
  });

  test('wrong answer does not reveal the correct answer text', async () => {
    await app.navigateToLearnMode();
    await app.selectSkillLevel('Complete beginner');
    await app.openLevel(1);
    await app.skipLessons();

    await app.tapOption('E');

    // The correct answer "S" should NOT appear in any feedback text
    await expect(app.page.getByText(/answer.*S/i)).not.toBeVisible();
    await expect(app.page.getByText(/S is correct/i)).not.toBeVisible();
  });

  test('wrong answer feedback does not contain Next button', async () => {
    await app.navigateToLearnMode();
    await app.selectSkillLevel('Complete beginner');
    await app.openLevel(1);
    await app.skipLessons();

    await app.tapOption('E');

    await expect(app.page.locator('[aria-label="Next challenge"]')).not.toBeVisible();
  });

  test('Retry resets the challenge so the player can answer again', async () => {
    await app.navigateToLearnMode();
    await app.selectSkillLevel('Complete beginner');
    await app.openLevel(1);
    await app.skipLessons();

    await app.tapOption('E');
    await expect(app.page.getByText('Wrong — try again!')).toBeVisible();

    await app.clickRetry();

    // Feedback should be gone; options should be re-enabled
    await expect(app.page.getByText('Wrong — try again!')).not.toBeVisible();
    await expect(app.page.locator('[aria-label="Option S"]')).toBeVisible();
    await expect(app.page.locator('[aria-label="Option S"]').getAttribute('aria-disabled')).resolves.not.toBe('true');
  });

  test('can answer correctly after a retry', async () => {
    await app.navigateToLearnMode();
    await app.selectSkillLevel('Complete beginner');
    await app.openLevel(1);
    await app.skipLessons();

    // Wrong first
    await app.tapOption('E');
    await app.clickRetry();

    // Correct second attempt
    await app.tapOption('S');
    await expect(app.page.getByText('Correct!')).toBeVisible();
    await expect(app.page.locator('[aria-label="Next challenge"]')).toBeVisible();
  });

  // ── Level completion ────────────────────────────────────────────────────────

  test('completing all challenges shows the level complete screen with milestone', async () => {
    await app.navigateToLearnMode();
    await app.selectSkillLevel('Complete beginner');
    await app.openLevel(1);
    await app.skipLessons();

    // Answer all remaining MC + input challenges in Level 1
    // MC: · · · = S
    await app.tapOption('S'); await app.clickNext();
    // MC: − − − = O
    await app.tapOption('O'); await app.clickNext();
    // MC: · · · − − − · · · = SOS
    await app.tapOption('SOS'); await app.clickNext();

    // Morse input challenges - tap the correct sequences then wait for auto-submit
    // Input: S = · · · — we interact with the edu-tap-zone (3 short presses)
    const eduTapZone = app.page.locator('[data-testid="edu-tap-zone"]');
    const box = await eduTapZone.boundingBox();
    if (box) {
      const cx = box.x + box.width / 2;
      const cy = box.y + box.height / 2;
      // Tap S: 3 dits
      for (let i = 0; i < 3; i++) {
        await app.page.mouse.move(cx, cy);
        await app.page.mouse.down();
        await app.page.waitForTimeout(80);
        await app.page.mouse.up();
        await app.page.waitForTimeout(100);
      }
      await app.page.waitForTimeout(1000); // wait for auto-submit
      // After correct, click Next
      const next = app.page.locator('[aria-label="Next challenge"]');
      if (await next.isVisible()) await next.click();

      // Tap O: 3 dahs
      for (let i = 0; i < 3; i++) {
        await app.page.mouse.move(cx, cy);
        await app.page.mouse.down();
        await app.page.waitForTimeout(250);
        await app.page.mouse.up();
        await app.page.waitForTimeout(100);
      }
      await app.page.waitForTimeout(1000);
      const next2 = app.page.locator('[aria-label="Next challenge"]');
      if (await next2.isVisible()) await next2.click();
    }

    // Should see level complete screen
    await expect(app.page.getByText('Level complete!')).toBeVisible({ timeout: 3000 });
    await expect(app.page.getByText(/SOS/)).toBeVisible();
  });
});
