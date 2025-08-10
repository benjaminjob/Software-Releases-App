import { create } from 'zustand';
import { Release } from '../types/release';

interface ReleasesStore {
  releases: Release[];
  setReleases: (releases: Release[]) => void;
}

// Mock data for software releases
const mockReleases: Release[] = [
  {
    id: '1',
    title: 'Apple WWDC 2025',
    company: 'apple',
    startDate: '2025-06-11',
    endDate: '2025-06-13',
    description: "Apple's Worldwide Developers Conference: iOS 19, visionOS & more.",
    status: 'ended',
    icon: '🍎',
    learnMoreUrl: 'https://developer.apple.com/wwdc/'
  },
  {
    id: '2',
    title: 'iOS 19 Public Release',
    company: 'apple',
    startDate: '2025-09-16',
    description: "Public release of iOS 19 with AI features and improved privacy controls.",
    status: 'upcoming',
    icon: '📱',
    learnMoreUrl: 'https://developer.apple.com/ios/'
  },
  {
    id: '3',
    title: 'Home Assistant 2025.8',
    company: 'home-assistant',
    startDate: '2025-08-07',
    description: "August Home Assistant release with new integrations and performance improvements.",
    status: 'upcoming',
    icon: '🏠',
    learnMoreUrl: 'https://home-assistant.io/'
  },
  {
    id: '4',
    title: 'Home Assistant 2025.7',
    company: 'home-assistant',
    startDate: '2025-07-03',
    description: "July Home Assistant release with enhanced automation features and UI updates.",
    status: 'ended',
    icon: '🏠',
    learnMoreUrl: 'https://home-assistant.io/'
  },
  {
    id: '5',
    title: 'Google I/O 2025',
    company: 'google',
    startDate: '2025-05-14',
    endDate: '2025-05-16',
    description: "Google's annual developer conference with AI and Android updates.",
    status: 'ended',
    icon: '🔍',
    learnMoreUrl: 'https://io.google/'
  },
  {
    id: '6',
    title: 'Valve Deckard Reveal?',
    company: 'valve',
    startDate: '2025-07-15',
    endDate: '2025-07-18',
    description: "Valve's next-gen VR Deckard launch event.",
    status: 'ended',
    icon: '🎮',
    learnMoreUrl: 'https://store.steampowered.com/'
  },
  {
    id: '7',
    title: 'Home Assistant 2025.9',
    company: 'home-assistant',
    startDate: '2025-09-04',
    description: "September Home Assistant release with major architecture improvements.",
    status: 'upcoming',
    icon: '🏠',
    learnMoreUrl: 'https://home-assistant.io/'
  },
  {
    id: '8',
    title: 'watchOS 12 Release',
    company: 'apple',
    startDate: '2025-09-16',
    description: "New watchOS with advanced health monitoring and fitness tracking.",
    status: 'upcoming',
    icon: '⌚',
    learnMoreUrl: 'https://developer.apple.com/watchos/'
  }
];

export const useReleasesStore = create<ReleasesStore>()((set) => ({
  releases: mockReleases,
  setReleases: (releases) => set({ releases }),
}));