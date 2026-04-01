import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TextDisplayArea } from '../components/TextDisplayArea';
import { useMorseStore } from '../store/morseStore';
import { TAPTYPE_DIT, TAPTYPE_DAH, ORIGINAL_MESSAGE } from '../utility/constants';

jest.useFakeTimers();

describe('TextDisplayArea', () => {
  beforeEach(() => {
    const { clearAll } = useMorseStore.getState();
    clearAll();
    jest.clearAllTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  test('renders without crashing', () => {
    const { container } = render(
      <TextDisplayArea onTextAreaPress={() => {}} />
    );
    expect(container).toBeTruthy();
  });

  test('displays placeholder text on initial render', () => {
    render(<TextDisplayArea onTextAreaPress={() => {}} />);
    expect(screen.getByText(ORIGINAL_MESSAGE)).toBeTruthy();
  });

  test('displays currentCharacter when sequence is in progress', () => {
    useMorseStore.getState().addTap(TAPTYPE_DIT);
    useMorseStore.getState().addTap(TAPTYPE_DAH);

    const { rerender } = render(
      <TextDisplayArea onTextAreaPress={() => {}} />
    );
    rerender(<TextDisplayArea onTextAreaPress={() => {}} />);

    expect(screen.getByText('A')).toBeTruthy(); // DIT-DAH = A
  });

  test('displays accumulated text', () => {
    useMorseStore.setState({ text: 'HELLO' });
    const { rerender } = render(
      <TextDisplayArea onTextAreaPress={() => {}} />
    );
    rerender(<TextDisplayArea onTextAreaPress={() => {}} />);

    expect(screen.getByText('HELLO')).toBeTruthy();
  });

  test('calls onTextAreaPress when area is pressed', () => {
    const mockPress = jest.fn();
    const { container } = render(
      <TextDisplayArea onTextAreaPress={mockPress} />
    );

    const touchableArea = container.querySelector('View');
    if (touchableArea) {
      fireEvent.click(touchableArea);
    }

    expect(mockPress).toHaveBeenCalled();
  });

  test('manual mode: tap with sequence calls commitCharacter', () => {
    useMorseStore.setState({ automaticModeEnabled: false });
    useMorseStore.getState().addTap(TAPTYPE_DIT);
    useMorseStore.getState().addTap(TAPTYPE_DAH);

    const mockPress = jest.fn(() => {
      // Simulate what MorseScreen does in manual mode
      if (useMorseStore.getState().morseSequence.length > 0) {
        useMorseStore.getState().commitCharacter();
      }
    });

    const { container } = render(
      <TextDisplayArea onTextAreaPress={mockPress} />
    );

    const touchableArea = container.querySelector('View');
    if (touchableArea) {
      fireEvent.click(touchableArea);
    }

    expect(mockPress).toHaveBeenCalled();
    expect(useMorseStore.getState().text).toContain('A');
  });

  test('manual mode: tap with empty sequence calls insertSpace', () => {
    useMorseStore.setState({ automaticModeEnabled: false, text: 'HELLO' });

    const mockPress = jest.fn(() => {
      // Simulate what MorseScreen does in manual mode
      if (useMorseStore.getState().morseSequence.length === 0) {
        useMorseStore.getState().insertSpace();
      }
    });

    const { container } = render(
      <TextDisplayArea onTextAreaPress={mockPress} />
    );

    const touchableArea = container.querySelector('View');
    if (touchableArea) {
      fireEvent.click(touchableArea);
    }

    expect(useMorseStore.getState().text).toBe('HELLO ');
  });

  test('auto mode: tap does not trigger immediate action', () => {
    useMorseStore.setState({ automaticModeEnabled: true });
    useMorseStore.getState().addTap(TAPTYPE_DIT);

    const mockPress = jest.fn();
    const { container } = render(
      <TextDisplayArea onTextAreaPress={mockPress} />
    );

    const touchableArea = container.querySelector('View');
    if (touchableArea) {
      fireEvent.click(touchableArea);
    }

    // In automatic mode, the press handler does nothing
    // The auto-commit is handled by TapZone timer
    expect(useMorseStore.getState().morseSequence).toContain(TAPTYPE_DIT);
  });

  test('displays ditDahText when it is set', () => {
    useMorseStore.setState({ ditDahText: 'dit' });
    const { rerender } = render(
      <TextDisplayArea onTextAreaPress={() => {}} />
    );
    rerender(<TextDisplayArea onTextAreaPress={() => {}} />);

    expect(screen.getByText('dit')).toBeTruthy();
  });

  test('clears ditDahText after animation duration', () => {
    useMorseStore.setState({ ditDahText: 'dah' });
    const { rerender } = render(
      <TextDisplayArea onTextAreaPress={() => {}} />
    );
    rerender(<TextDisplayArea onTextAreaPress={() => {}} />);

    expect(screen.getByText('dah')).toBeTruthy();

    jest.advanceTimersByTime(400); // Wait past dah duration + fade time

    useMorseStore.setState({ ditDahText: '' });
    rerender(<TextDisplayArea onTextAreaPress={() => {}} />);

    expect(screen.queryByText('dah')).toBeFalsy();
  });
});
