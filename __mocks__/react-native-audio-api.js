/**
 * Mock for react-native-audio-api
 * Stubs AudioContext and related Web Audio API objects
 */

const mockOscillator = {
  connect: jest.fn(),
  disconnect: jest.fn(),
  start: jest.fn(),
  stop: jest.fn(),
  frequency: {
    setValueAtTime: jest.fn(),
    exponentialRampToValueAtTime: jest.fn(),
  },
  type: 'sine',
};

const mockGainNode = {
  connect: jest.fn(),
  disconnect: jest.fn(),
  gain: {
    setValueAtTime: jest.fn(),
    exponentialRampToValueAtTime: jest.fn(),
  },
};

const mockAudioContext = {
  createOscillator: jest.fn(() => mockOscillator),
  createGain: jest.fn(() => mockGainNode),
  destination: {},
  currentTime: 0,
  state: 'running',
  resume: jest.fn().mockResolvedValue(undefined),
};

module.exports = {
  AudioContext: jest.fn(() => mockAudioContext),
};
