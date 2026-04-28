import { create } from 'zustand';

export type AppScreen = 'menu' | 'skill-select' | 'free' | 'level-select' | 'level';

interface NavigationStore {
  currentScreen: AppScreen;
  navigateTo: (screen: AppScreen) => void;
}

export const useNavigationStore = create<NavigationStore>((set) => ({
  currentScreen: 'menu',
  navigateTo: (screen) => set({ currentScreen: screen }),
}));
