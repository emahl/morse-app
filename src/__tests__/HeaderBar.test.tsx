import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { HeaderBar } from '../components/HeaderBar';
import { useMorseStore } from '../store/morseStore';
import { ORIGINAL_MESSAGE } from '../utility/constants';

describe('HeaderBar', () => {
  beforeEach(() => {
    useMorseStore.getState().clearAll();
    useMorseStore.setState({ showMorseTree: false, showSettings: false });
  });

  test('renders without crashing', () => {
    const { container } = render(<HeaderBar />);
    expect(container).toBeTruthy();
  });

  test('show tree button is accessible by aria-label', () => {
    const { getByLabelText } = render(<HeaderBar />);
    expect(getByLabelText('Show morse tree')).toBeTruthy();
  });

  test('clear button is accessible by aria-label', () => {
    const { getByLabelText } = render(<HeaderBar />);
    expect(getByLabelText('Clear all text')).toBeTruthy();
  });

  test('settings button is accessible by aria-label', () => {
    const { getByLabelText } = render(<HeaderBar />);
    expect(getByLabelText('Open settings')).toBeTruthy();
  });

  test('clicking clear button resets text to placeholder', () => {
    useMorseStore.setState({ text: 'HELLO WORLD' });
    const { getByLabelText } = render(<HeaderBar />);

    fireEvent.click(getByLabelText('Clear all text'));

    expect(useMorseStore.getState().text).toBe(ORIGINAL_MESSAGE);
  });

  test('clicking show tree button toggles morse tree visibility', () => {
    const initial = useMorseStore.getState().showMorseTree;
    const { getByLabelText } = render(<HeaderBar />);

    fireEvent.click(getByLabelText('Show morse tree'));

    expect(useMorseStore.getState().showMorseTree).toBe(!initial);
  });

  test('show tree button aria-label updates when tree is visible', () => {
    useMorseStore.setState({ showMorseTree: true });
    const { getByLabelText } = render(<HeaderBar />);
    expect(getByLabelText('Hide morse tree')).toBeTruthy();
  });

  test('clicking settings button toggles settings visibility', () => {
    const { getByLabelText } = render(<HeaderBar />);

    fireEvent.click(getByLabelText('Open settings'));

    expect(useMorseStore.getState().showSettings).toBe(true);
  });

  test('back button renders when onBack prop is provided', () => {
    const onBack = jest.fn();
    const { getByLabelText } = render(<HeaderBar onBack={onBack} />);
    expect(getByLabelText('Go back')).toBeTruthy();
  });

  test('back button calls onBack when clicked', () => {
    const onBack = jest.fn();
    const { getByLabelText } = render(<HeaderBar onBack={onBack} />);

    fireEvent.click(getByLabelText('Go back'));

    expect(onBack).toHaveBeenCalledTimes(1);
  });

  test('back button is not rendered when onBack prop is absent', () => {
    const { queryByLabelText } = render(<HeaderBar />);
    expect(queryByLabelText('Go back')).toBeFalsy();
  });
});
