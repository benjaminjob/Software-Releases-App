import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsStore {
  isDarkMode: boolean;
  themeTogglePosition: 'bottom-left' | 'top-left';
  showBackToTopText: boolean;
  showFiltersInMainView: boolean;
  showSortInMainView: boolean;
  showRecentlyReleased: boolean;
  selectedReleasesFilters: string[];
  selectedEventsFilters: string[];
  releasesSortBy: 'date' | 'name';
  eventsSortBy: 'date' | 'name';
  recentlyReleasedFilter: 'show-only' | 'include' | 'hide';
  recentlyEndedFilter: 'show-only' | 'include' | 'hide';
  
  toggleTheme: () => void;
  setThemeTogglePosition: (position: 'bottom-left' | 'top-left') => void;
  setShowBackToTopText: (show: boolean) => void;
  setShowFiltersInMainView: (show: boolean) => void;
  setShowSortInMainView: (show: boolean) => void;
  setShowRecentlyReleased: (show: boolean) => void;
  setSelectedReleasesFilters: (filters: string[]) => void;
  setSelectedEventsFilters: (filters: string[]) => void;
  setReleasesSortBy: (sort: 'date' | 'name') => void;
  setEventsSortBy: (sort: 'date' | 'name') => void;
  setRecentlyReleasedFilter: (filter: 'show-only' | 'include' | 'hide') => void;
  setRecentlyEndedFilter: (filter: 'show-only' | 'include' | 'hide') => void;
  resetToDefaults: () => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      isDarkMode: true,
      themeTogglePosition: 'bottom-left',
      showBackToTopText: true,
      showFiltersInMainView: true,
      showSortInMainView: true,
      showRecentlyReleased: true,
      selectedReleasesFilters: ['apple', 'home-assistant', 'microsoft'],
      selectedEventsFilters: ['apple', 'microsoft', 'valve', 'home-assistant'],
      releasesSortBy: 'date',
      eventsSortBy: 'date',
      recentlyReleasedFilter: 'include',
      recentlyEndedFilter: 'include',
      
      toggleTheme: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      setThemeTogglePosition: (position) => set({ themeTogglePosition: position }),
      setShowBackToTopText: (show) => set({ showBackToTopText: show }),
      setShowFiltersInMainView: (show) => set({ showFiltersInMainView: show }),
      setShowSortInMainView: (show) => set({ showSortInMainView: show }),
      setShowRecentlyReleased: (show) => set({ showRecentlyReleased: show }),
      setSelectedReleasesFilters: (filters) => set({ selectedReleasesFilters: filters }),
      setSelectedEventsFilters: (filters) => set({ selectedEventsFilters: filters }),
      setReleasesSortBy: (sort) => set({ releasesSortBy: sort }),
      setEventsSortBy: (sort) => set({ eventsSortBy: sort }),
      setRecentlyReleasedFilter: (filter) => set({ recentlyReleasedFilter: filter }),
      setRecentlyEndedFilter: (filter) => set({ recentlyEndedFilter: filter }),
      resetToDefaults: () => set({
        isDarkMode: true,
        themeTogglePosition: 'bottom-left',
        showBackToTopText: true,
        showFiltersInMainView: true,
        showSortInMainView: true,
        showRecentlyReleased: true,
        selectedReleasesFilters: ['apple', 'home-assistant', 'microsoft'],
        selectedEventsFilters: ['apple', 'microsoft', 'valve', 'home-assistant'],
        releasesSortBy: 'date',
        eventsSortBy: 'date',
        recentlyReleasedFilter: 'include',
        recentlyEndedFilter: 'include',
      }),
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);