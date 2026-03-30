import { create } from 'zustand';

export interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
  speed?: number;
  timestamp: number;
}

interface LocationStore {
  currentLocation: Location | null;
  isTracking: boolean;
  error: string | null;

  setLocation: (location: Location) => void;
  setTracking: (tracking: boolean) => void;
  setError: (error: string | null) => void;
  clearLocation: () => void;
}

export const useLocationStore = create<LocationStore>((set) => ({
  currentLocation: null,
  isTracking: false,
  error: null,

  setLocation: (location) => set({ currentLocation: location, error: null }),
  setTracking: (tracking) => set({ isTracking: tracking }),
  setError: (error) => set({ error }),
  clearLocation: () => set({ currentLocation: null }),
}));
