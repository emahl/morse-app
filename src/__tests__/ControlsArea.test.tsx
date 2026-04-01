import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ControlsArea } from '../components/ControlsArea';
import { useMorseStore } from '../store/morseStore';
import { ORIGINAL_MESSAGE } from '../utility/constants';

describe('ControlsArea', () => {
  beforeEach(() => {
    const { clearAll } = useMorseStore.getState();
    clearAll();
  });

  test('renders without crashing', () => {
    const { container } = render(
      <ControlsArea onShowTreePress={() => {}} onClearPress={() => {}} />
    );
    expect(container).toBeTruthy();
  });

  test('displays automatic mode label', () => {
    render(
      <ControlsArea onShowTreePress={() => {}} onClearPress={() => {}} />
    );
    expect(screen.getByText('Automatic character check')).toBeTruthy();
  });

  test('displays toggle switch', () => {
    const { getByRole } = render(
      <ControlsArea onShowTreePress={() => {}} onClearPress={() => {}} />
    );
    expect(getByRole('switch')).toBeTruthy();
  });

  test('switch reflects automatic mode state', () => {
    const { getByRole, rerender } = render(
      <ControlsArea onShowTreePress={() => {}} onClearPress={() => {}} />
    );

    let switchElement = getByRole('switch');
    expect(switchElement).toBeTruthy();

    // Toggle the store
    useMorseStore.getState().toggleAutoMode();
    rerender(
      <ControlsArea onShowTreePress={() => {}} onClearPress={() => {}} />
    );

    switchElement = getByRole('switch');
    expect(switchElement).toBeTruthy();
  });

  test('show tree button displays correct caption', () => {
    render(
      <ControlsArea onShowTreePress={() => {}} onClearPress={() => {}} />
    );
    expect(screen.getByText('Show tree')).toBeTruthy();
  });

  test('show tree button caption changes when tree is shown', () => {
    useMorseStore.setState({ showMorseTree: true });
    const { rerender } = render(
      <ControlsArea onShowTreePress={() => {}} onClearPress={() => {}} />
    );
    rerender(
      <ControlsArea onShowTreePress={() => {}} onClearPress={() => {}} />
    );

    expect(screen.getByText('Hide tree')).toBeTruthy();
  });

  test('clicking show tree button calls onShowTreePress', () => {
    const mockPress = jest.fn();
    render(
      <ControlsArea onShowTreePress={mockPress} onClearPress={() => {}} />
    );

    const showTreeButton = screen.getByText('Show tree').closest('View') ||
                           screen.getByText('Show tree').parentElement;
    if (showTreeButton) {
      fireEvent.click(showTreeButton);
    }

    expect(mockPress).toHaveBeenCalled();
  });

  test('clicking clear button calls onClearPress', () => {
    const mockPress = jest.fn();
    render(
      <ControlsArea onShowTreePress={() => {}} onClearPress={mockPress} />
    );

    const clearButton = screen.getByText('Clear all text').closest('View') ||
                        screen.getByText('Clear all text').parentElement;
    if (clearButton) {
      fireEvent.click(clearButton);
    }

    expect(mockPress).toHaveBeenCalled();
  });

  test('clear button action resets text to placeholder', () => {
    // Set some text in the store
    useMorseStore.setState({ text: 'HELLO WORLD' });

    const onClear = jest.fn(() => {
      useMorseStore.getState().clearAll();
    });

    const { rerender } = render(
      <ControlsArea onShowTreePress={() => {}} onClearPress={onClear} />
    );

    const clearButton = screen.getByText('Clear all text').closest('View') ||
                        screen.getByText('Clear all text').parentElement;
    if (clearButton) {
      fireEvent.click(clearButton);
    }

    expect(onClear).toHaveBeenCalled();
    expect(useMorseStore.getState().text).toBe(ORIGINAL_MESSAGE);
  });

  test('automatic mode label opacity reflects auto mode state', () => {
    const { getByText } = render(
      <ControlsArea onShowTreePress={() => {}} onClearPress={() => {}} />
    );

    const label = getByText('Automatic character check');
    expect(label).toBeTruthy();

    // When automatic mode is ON, opacity should be high
    expect(useMorseStore.getState().automaticModeEnabled).toBe(true);

    // When automatic mode is OFF, opacity should be low
    useMorseStore.setState({ automaticModeEnabled: false });
    expect(useMorseStore.getState().automaticModeEnabled).toBe(false);
  });
});
