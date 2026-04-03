import { create } from 'zustand';

interface ServerStore {
  isServerDown: boolean;
  setServerDown: (down: boolean) => void;
}

export const useServerStore = create<ServerStore>((set) => ({
  isServerDown: false,
  setServerDown: (down) => set({ isServerDown: down }),
}));
