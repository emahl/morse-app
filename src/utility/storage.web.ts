import { createJSONStorage } from 'zustand/middleware';

export const appJSONStorage = createJSONStorage(() => localStorage);
