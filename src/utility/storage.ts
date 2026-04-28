import { Platform } from 'react-native';
import { createJSONStorage } from 'zustand/middleware';

export const appJSONStorage =
  Platform.OS === 'web'
    ? createJSONStorage(() => localStorage)
    : createJSONStorage(
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        () => require('@react-native-async-storage/async-storage').default,
      );
