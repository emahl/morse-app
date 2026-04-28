# Morse App

A React Native / Expo app for learning Morse code. Users tap a large press zone to input dits and dahs, which are decoded in real time and accumulated as text. Includes a structured learning mode with guided levels.

## Stack

- **Expo 54** / **React Native 0.81.5** (New Architecture enabled)
- **react-native-reanimated v4** for animations
- **react-native-gesture-handler v2** for tap detection (LongPress gesture)
- **Zustand v5** for state management (with `persist` middleware for settings + progress)
- **@react-native-async-storage/async-storage** for native persistence (web uses localStorage)
- **Playwright** for E2E tests (runs against Expo web)
- **Jest + jsdom** for unit/component tests

## Commands

```bash
npm run web          # Start Expo dev server and open in browser
npm test             # Run Jest unit tests
npm run test:e2e     # Run Playwright E2E tests (requires dev server running)
npm run test:e2e -- --update-snapshots  # Update screenshot snapshots
npm run test:e2e:ui  # Playwright interactive UI
```

## Project Structure

```
src/
  components/
    HeaderBar.tsx        # Top bar: back button, tree toggle, settings toggle, clear
    MainMenu.tsx         # Landing screen — Free Mode + Learn Morse Code cards
    MorseScreen.tsx      # Free mode root — composes HeaderBar, tree, settings, TapZone
    MorseTreeOverlay.tsx # Inline collapsible morse tree panel
    SettingsOverlay.tsx  # Animated settings panel (auto-commit, thresholds, audio, haptics)
    TapZone.tsx          # Large press zone (dit/dah input) for free mode
    TextDisplayArea.tsx  # Shows current character + accumulated text
    educational/
      EduTapZone.tsx            # Press zone for learning mode challenges
      LessonCard.tsx            # Teach phase: large character + MorsePlayback
      LevelScreen.tsx           # Active challenge UI (progress dots, feedback bar, milestone)
      LevelSelectScreen.tsx     # Grid of unlockable levels
      MorseInputChallenge.tsx   # Challenge: tap the morse code for a character
      MorsePlayback.tsx         # Animated sequence display with audio; used in lessons
      MultipleChoiceChallenge.tsx # Challenge: identify a morse sequence
      SkillSelectScreen.tsx     # One-time onboarding: beginner / intermediate / experienced
  hooks/
    usePressInput.ts     # Shared gesture + animation hook for TapZone / EduTapZone
  store/
    educationalStore.ts  # Zustand store — level progress, challenge state (persisted)
    morseStore.ts        # Zustand store — free mode state + settings (persisted)
    navigationStore.ts   # Zustand store — current screen (menu | free | level-select | level)
  data/
    levels.ts            # Level definitions, challenge types, isLevelUnlocked helper
  utility/
    constants.ts         # Timing thresholds, tap types
    morseAudio.ts        # Audio feedback (react-native-audio-api oscillators)
    morseTree.ts         # Binary tree structure for morse decoding
    storage.ts           # Platform-aware zustand persist storage (localStorage / AsyncStorage)
  __tests__/             # Jest unit + component tests
e2e/
  tests/                 # Playwright test specs
  fixtures/app.ts        # MorseApp page object — navigate to free mode before using TapZone helpers
```

## Key Concepts

**Input**: A press under 150ms = dit (·), over 150ms = dah (−). Both thresholds are configurable in Settings. After 800ms of inactivity, the current morse sequence auto-commits to a character (free mode) or auto-submits the answer (learning mode).

**Morse tree**: Binary tree where left = dah, right = dit. The active path lights up in coral as the user taps.

**Tree dimensions**: All computed from `useWindowDimensions()` inside the component so they stay responsive on resize. `LEVEL_HEIGHT` is capped by screen height (38% max) to prevent overflow on small screens.

**Navigation**: Simple stack-free navigation via `navigationStore` (menu → free | level-select → level). No react-navigation dependency — screens are rendered conditionally in `App.tsx`.

**Persistence**: `morseStore` persists user settings (thresholds, audio, haptics, auto-commit) and `educationalStore` persists `completedLevelIds`. Both use `zustand/middleware` persist with platform-aware storage.

**Learning levels**: Defined statically in `src/data/levels.ts`. Each level opens with `lesson` challenge cards that teach the letter (auto-playing morse + audio), then transitions to `multiple-choice` recognition, then `morse-input` recall. Each level has a `milestone` string shown on the completion screen. `morseSequence` is optional on `MultipleChoiceChallenge` — omit it for text-only questions. Level N unlocks only when level N-1 is completed (all levels unlock for the 'experienced' skill level).

**Skill level**: Set once on first entry to educational mode (`SkillSelectScreen`). Stored in `educationalStore.skillLevel`. `'experienced'` users have all levels unlocked from the start.

## Design Tokens

```
background:     #2C2B28   warm dark
surface:        #373532   cards / text area
elevated:       #3E3B38   header bar
accent:         #E8806A   coral — active states, highlights
accentLight:    #F0A090   active node borders
textPrimary:    #F5F3EF   warm white
textSecondary:  #9A9590   muted labels
border:         #4A4744   dividers, inactive nodes
```

## Testing Notes

- E2E tests must navigate to the relevant screen before interacting — the app now starts at the main menu. Call `app.navigateToFreeMode()` or click the appropriate card first.
- E2E tests use `data-testid` attributes and `aria-label` for element selection — keep these stable when refactoring
- Header buttons are icon-only; use `aria-label` to find them (`[aria-label="Clear all text"]`, `[aria-label="Show morse tree"]`)
- Settings panel starts closed — open it via `[aria-label="Open settings"]` before asserting on `auto-mode-switch`
- Screenshot snapshots are in `e2e/tests/text-display.spec.ts-snapshots/` — run with `--update-snapshots` after visual changes
- Do not commit `playwright-report/` or `test-results/` directories
