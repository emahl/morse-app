import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MorseScreen } from '../components/MorseScreen';
import { useMorseStore } from '../store/morseStore';
import { useNavigationStore } from '../store/navigationStore';
import { ORIGINAL_MESSAGE } from '../utility/constants';

describe('MorseScreen Integration', () => {
  beforeEach(() => {
    useMorseStore.getState().clearAll();
    useMorseStore.setState({ showMorseTree: false, showSettings: false });
    useNavigationStore.setState({ currentScreen: 'free' });
  });

  test('renders without crashing', () => {
    const { container } = render(<MorseScreen />);
    expect(container).toBeTruthy();
  });

  test('displays placeholder text on initial load', () => {
    render(<MorseScreen />);
    expect(screen.getByText(ORIGINAL_MESSAGE)).toBeTruthy();
  });

  test('renders show tree button by aria-label', () => {
    const { getByLabelText } = render(<MorseScreen />);
    expect(getByLabelText('Show morse tree')).toBeTruthy();
  });

  test('renders clear button by aria-label', () => {
    const { getByLabelText } = render(<MorseScreen />);
    expect(getByLabelText('Clear all text')).toBeTruthy();
  });

  test('renders settings button by aria-label', () => {
    const { getByLabelText } = render(<MorseScreen />);
    expect(getByLabelText('Open settings')).toBeTruthy();
  });

  test('renders back button by aria-label', () => {
    const { getByLabelText } = render(<MorseScreen />);
    expect(getByLabelText('Go back')).toBeTruthy();
  });

  test('clicking clear button resets text to placeholder', () => {
    const { getByLabelText } = render(<MorseScreen />);
    useMorseStore.setState({ text: 'HELLO' });

    fireEvent.click(getByLabelText('Clear all text'));

    expect(useMorseStore.getState().text).toBe(ORIGINAL_MESSAGE);
  });

  test('settings button toggles settings panel', () => {
    const { getByLabelText } = render(<MorseScreen />);
    expect(useMorseStore.getState().showSettings).toBe(false);

    fireEvent.click(getByLabelText('Open settings'));

    expect(useMorseStore.getState().showSettings).toBe(true);
  });

  test('show tree button toggles morse tree visibility', () => {
    const { getByLabelText } = render(<MorseScreen />);
    const initial = useMorseStore.getState().showMorseTree;

    fireEvent.click(getByLabelText('Show morse tree'));

    expect(useMorseStore.getState().showMorseTree).toBe(!initial);
  });

  test('show tree button aria-label updates after toggle', () => {
    useMorseStore.setState({ showMorseTree: false });
    const { getByLabelText, rerender } = render(<MorseScreen />);

    expect(getByLabelText('Show morse tree')).toBeTruthy();

    useMorseStore.getState().toggleMorseTree();
    rerender(<MorseScreen />);

    expect(getByLabelText('Hide morse tree')).toBeTruthy();
  });

  test('back button navigates to menu', () => {
    const { getByLabelText } = render(<MorseScreen />);

    fireEvent.click(getByLabelText('Go back'));

    expect(useNavigationStore.getState().currentScreen).toBe('menu');
  });
});
