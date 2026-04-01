# Morse App

A React Native mobile application for learning Morse code through interactive tapping.

## Overview

This is an educational app that teaches Morse code by allowing users to tap out dit (short) and dah (long) sequences and receive immediate visual feedback of the character they encode. The app includes both automatic character recognition and manual mode, plus a visual Morse code tree for reference.

## How It Works

The core mechanic is simple:
1. Users press and hold the large touchable area at the bottom of the screen
2. Press duration determines the character:
   - **≤ 150ms** = dit (short tap)
   - **> 150ms** = dah (long press)
3. Characters are decoded using a binary tree structure where:
   - Left branch = dah
   - Right branch = dit
4. The app shows the current character as they type and adds it to the text display

## Features

- **Automatic Mode**: After ~800ms of inactivity, the current Morse sequence is converted to a character
- **Manual Mode**: Users manually confirm each character by pressing the text area
- **Visual Feedback**: 
  - Vibration on each tap
  - Animated background flash showing dit/dah duration
  - "dit"/"dah" text overlay during taps
- **Morse Tree**: Toggle a visual reference chart showing the Morse code tree structure
- **Clear**: Reset all text to start over

## Project Structure

```
morse-app/
├── App.js                 # Main app component (React Native class component)
├── package.json          # Dependencies (React Native, Expo, vector icons)
├── app.json              # Expo configuration
├── eas.json              # EAS Build configuration
├── babel.config.js       # Babel transpiler config
├── utility/
│   ├── morseTree.js      # Binary tree for Morse code character lookup
│   └── constants.js      # Tap type constants (DIT, DAH)
├── assets/
│   └── morse-tree.png    # Visual reference of the Morse code tree
└── __tests__/
    └── morseTreeTests.js # Unit tests for tree traversal
```

## Key Files

### App.js
The main application component. Features:
- Press timing logic (distinguishes dit from dah based on 150ms threshold)
- Animation handling for tap feedback (vibration, color transitions)
- State management for current sequence, parsed character, and text output
- Modal for showing the Morse tree image

### utility/morseTree.js
Binary tree data structure encoding the standard Morse code alphabet:
- Tree traversal function `getCharacterBySequence(sequence)`
- Supports letters A-Z, numbers 0-9, and symbols (period, comma, dash)
- Tree is structured according to http://www.learnmorsecode.com/pix/learn.gif

### utility/constants.js
Simple constants for tap types:
- `TAPTYPE_DIT = 1`
- `TAPTYPE_DAH = 2`

## Development Setup

### Install Dependencies
```bash
npm install
```

### Run the App
```bash
# Start the Expo development server
npm start

# Or run on specific platform
npm run ios
npm run android
npm run web
```

### Build for Production
```bash
# Build Android APK/AAB
eas build -p android --profile preview
```

## Technologies

- **React Native** (v0.64.3) - Cross-platform mobile framework
- **Expo** (v44.0.0) - Development and build platform
- **React** (v17.0.1) - Component framework
- **react-native-vector-icons** - FontAwesome icons for UI buttons

## Notes for Development

- The app uses class components rather than hooks
- Global variables track tap timing and interval state (`characterCheckerIntervalId`, `previousTapTime`, `startPressTime`)
- Animations are done with React Native's `Animated` API
- The original message display shows a Samuel Morse quote: "[What hath God wrought?]"
- Tree structure is immutable and defined at module level (no dynamic tree building)

## Testing

Unit tests for the Morse tree traversal are in `__tests__/morseTreeTests.js`. Run with your test runner.
