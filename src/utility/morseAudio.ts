import { AudioContext } from 'react-native-audio-api';

const MORSE_FREQUENCY = 700; // Hz
const DIT_DURATION = 150; // ms
const DAH_DURATION = 300; // ms
const GAIN_VALUE = 0.3; // 0–1

let audioContext: AudioContext | null = null;

async function initializeAudioContext(): Promise<void> {
  if (!audioContext) {
    try {
      audioContext = new AudioContext();
    } catch (error) {
      console.error('Failed to create AudioContext:', error);
    }
  }
}

async function playTone(duration: number): Promise<void> {
  try {
    await initializeAudioContext();
    if (!audioContext) return;

    if (audioContext.state === 'suspended') {
      await audioContext.resume();
    }

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.frequency.setValueAtTime(MORSE_FREQUENCY, audioContext.currentTime);
    oscillator.type = 'sine';
    gainNode.gain.setValueAtTime(GAIN_VALUE, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioContext.currentTime + duration / 1000,
    );

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
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
