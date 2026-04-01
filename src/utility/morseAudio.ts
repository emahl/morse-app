/**
 * Morse Audio Utility
 * Uses react-native-audio-api to generate Morse code tones
 * Dit: 700Hz tone for 150ms
 * Dah: 700Hz tone for 300ms
 */

import { AudioContext } from 'react-native-audio-api';

// Constants for Morse audio
const MORSE_FREQUENCY = 700; // Hz
const DIT_DURATION = 150; // ms
const DAH_DURATION = 300; // ms
const GAIN_VALUE = 0.3; // Volume (0-1)

let audioContext: AudioContext | null = null;
let currentOscillator: any = null;
let currentGainNode: any = null;

async function initializeAudioContext(): Promise<void> {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
}

async function playTone(duration: number): Promise<void> {
  try {
    await initializeAudioContext();

    if (!audioContext) {
      console.warn('AudioContext not available');
      return;
    }

    // Resume context if suspended
    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    // Create oscillator and gain nodes
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.frequency.setValueAtTime(MORSE_FREQUENCY, audioContext.currentTime);
    oscillator.type = 'sine';

    gainNode.gain.setValueAtTime(GAIN_VALUE, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + duration / 1000
    );

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);

    currentOscillator = oscillator;
    currentGainNode = gainNode;
  } catch (error) {
    console.error('Error playing tone:', error);
  }
}

export async function playDitTone(): Promise<void> {
  await playTone(DIT_DURATION);
}

export async function playDahTone(): Promise<void> {
  await playTone(DAH_DURATION);
}

export async function stopTone(): Promise<void> {
  if (currentOscillator && audioContext) {
    try {
      currentOscillator.stop(audioContext.currentTime);
    } catch (error) {
      console.error('Error stopping tone:', error);
    }
    currentOscillator = null;
    currentGainNode = null;
  }
}
