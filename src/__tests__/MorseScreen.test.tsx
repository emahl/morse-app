import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MorseScreen } from '../components/MorseScreen';
import { useMorseStore } from '../store/morseStore';
import { ORIGINAL_MESSAGE } from '../utility/constants';

describe('MorseScreen Integration', () => {
  beforeEach(() => {
    const { clearAll } = useMorseStore.getState();
    clearAll();
  });

  test('renders without crashing', () => {
    const { container } = render(<MorseScreen />);
    expect(container).toBeTruthy();
  });

  test('displays placeholder text on initial load', () => {
    render(<MorseScreen />);
    expect(screen.getByText(ORIGINAL_MESSAGE)).toBeTruthy();
  });

  test('renders all control buttons', () => {
    render(<MorseScreen />);

    // Look for button texts (mocked vector icons render children)
    expect(screen.getByText('Show tree')).toBeTruthy();
    expect(screen.getByText('Clear all text')).toBeTruthy();
  });

  test('toggle switch is rendered and operable', () => {
    const { getByRole } = render(<MorseScreen />);
    const switchElement = getByRole('switch');

    expect(switchElement).toBeTruthy();
  });

  test('clicking clear button resets text to placeholder', () => {
    render(<MorseScreen />);

    // Simulate setting some text
    useMorseStore.setState({ text: 'HELLO' });

    // Find and click clear button
    const clearButton = screen.getByText('Clear all text').closest('View') || screen.getByText('Clear all text').parentElement;
    if (clearButton) {
      fireEvent.click(clearButton);
    }

    // Text should be reset to placeholder
    expect(useMorseStore.getState().text).toBe(ORIGINAL_MESSAGE);
  });

  test('toggle switch changes automatic mode', () => {
    render(<MorseScreen />);
    const initialMode = useMorseStore.getState().automaticModeEnabled;

    const switchElement = screen.getByRole('switch');
    fireEvent.click(switchElement);

    expect(useMorseStore.getState().automaticModeEnabled).toBe(!initialMode);
  });

  test('show tree button toggles morse tree visibility', () => {
    render(<MorseScreen />);
    const initialShowTree = useMorseStore.getState().showMorseTree;

    const showTreeButton = screen.getByText('Show tree').closest('View') || screen.getByText('Show tree').parentElement;
    if (showTreeButton) {
      fireEvent.click(showTreeButton);
    }

    expect(useMorseStore.getState().showMorseTree).toBe(!initialShowTree);
  });

  test('show tree button label changes when toggled', () => {
    const { rerender } = render(<MorseScreen />);

    expect(screen.getByText('Show tree')).toBeTruthy();

    useMorseStore.getState().toggleMorseTree();
    rerender(<MorseScreen />);

    expect(screen.getByText('Hide tree')).toBeTruthy();
  });
});
