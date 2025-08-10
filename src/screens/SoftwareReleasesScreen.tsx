import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedScrollHandler } from 'react-native-reanimated';
import { DraggableThemeToggle } from '../components/DraggableThemeToggle';
import { SettingsModal } from '../components/SettingsModal';
import { BackToTopButton } from '../components/BackToTopButton';
import { useSettingsStore } from '../state/settingsStore';
import { getTimeUntil } from '../utils/countdown';

interface SoftwareReleasesScreenProps {
  onShowEvents: () => void;
}

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export const SoftwareReleasesScreen: React.FC<SoftwareReleasesScreenProps> = ({ onShowEvents }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showRecent, setShowRecent] = useState(false);
  const [showExactCountdown, setShowExactCountdown] = useState<Record<string, boolean>>({});
  const scrollY = useSharedValue(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const {
    isDarkMode,
    themeTogglePosition,
    showBackToTopText,
    showFiltersInMainView,
    showSortInMainView,
    showRecentlyReleased,
    selectedReleasesFilters,
    releasesSortBy,
    recentlyReleasedFilter,
    toggleTheme,
    setThemeTogglePosition,
    setSelectedReleasesFilters,
    setReleasesSortBy,
    setRecentlyReleasedFilter,
  } = useSettingsStore();

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const toggleFilter = (filter: string) => {
    const newFilters = selectedReleasesFilters.includes(filter) 
      ? selectedReleasesFilters.filter(f => f !== filter)
      : [...selectedReleasesFilters, filter];
    setSelectedReleasesFilters(newFilters);
  };

  const filters = [
    { id: 'apple', label: 'Apple', icon: '🍎' },
    { id: 'microsoft', label: 'Microsoft', icon: '🪟' },
    { id: 'home-assistant', label: 'Home Assistant', icon: '🏠' },
    { id: 'google', label: 'Google', icon: '🔍' }
  ];

  const allReleases = [
    {
      id: '1',
      title: 'iOS 26.0',
      icon: '📱',
      date: 'Sep 16, 2025',
      description: 'Major iOS 26 release with next-gen AI features, holographic interface, and neural processing.',
      status: 'Upcoming',
      confirmationLevel: 'official',
      category: 'apple'
    },
    {
      id: '2',
      title: 'macOS Redwood 26.0',
      icon: '💻',
      date: 'Oct 1, 2025',
      description: 'macOS Redwood 26 with revolutionary desktop experience and AI-powered workflows.',
      status: 'Upcoming',
      confirmationLevel: 'rumored',
      category: 'apple'
    },
    {
      id: '3',
      title: 'watchOS 26.0',
      icon: '⌚',
      date: 'Sep 16, 2025',
      description: 'watchOS 26 with advanced health monitoring, sleep tracking, and fitness innovations.',
      status: 'Upcoming',
      confirmationLevel: 'likely',
      category: 'apple'
    },
    {
      id: '4',
      title: 'Windows 12',
      icon: '🪟',
      date: 'Oct 15, 2025',
      description: 'Next generation Windows with AI Copilot integration and redesigned interface.',
      status: 'upcoming',
      confirmationLevel: 'rumored',
      category: 'microsoft'
    },
    {
      id: '5',
      title: 'Windows 11 24H2',
      icon: '🪟',
      date: 'Sep 2025',
      description: 'Major Windows 11 update with new features and performance improvements.',
      status: 'Upcoming',
      confirmationLevel: 'official',
      category: 'microsoft'
    },
    {
      id: '6',
      title: 'Home Assistant 2025.8',
      icon: '🏠',
      date: 'Aug 7, 2025',
      description: 'August Home Assistant release with new integrations, Matter support improvements.',
      status: 'Upcoming',
      confirmationLevel: 'official',
      category: 'home-assistant'
    },
    {
      id: '7',
      title: 'Home Assistant 2025.7',
      icon: '🏠',
      date: 'Jul 3, 2025',
      description: 'July release with enhanced automation features, new dashboard cards, and performance improvements.',
      status: 'Released',
      confirmationLevel: 'official',
      category: 'home-assistant'
    },
    {
      id: '8',
      title: 'Home Assistant 2025.9',
      icon: '🏠',
      date: 'Sep 4, 2025',
      description: 'September release with major architecture improvements and new integration framework.',
      status: 'upcoming',
      confirmationLevel: 'likely',
      category: 'home-assistant'
    },
    {
      id: '9',
      title: 'iPadOS 26.0',
      icon: '📱',
      date: 'Sep 16, 2025',
      description: 'iPadOS 26 with pro desktop features, advanced multitasking, and Apple Pencil Pro support.',
      status: 'Upcoming',
      confirmationLevel: 'official',
      category: 'apple'
    },
    {
      id: '10',
      title: 'tvOS 26.0',
      icon: '📺',
      date: 'Sep 16, 2025',
      description: 'tvOS 26 with spatial computing, enhanced gaming, and smart home integration.',
      status: 'Upcoming',
      confirmationLevel: 'likely',
      category: 'apple'
    },
    {
      id: '11',
      title: 'Android 16',
      icon: '🤖',
      date: 'Oct 2025',
      description: 'Next major Android release with enhanced privacy features and AI capabilities.',
      status: 'upcoming',
      confirmationLevel: 'speculative',
      category: 'google'
    },
    {
      id: '12',
      title: 'Chrome OS 126',
      icon: '🌐',
      date: 'Aug 2025',
      description: 'Chrome OS update with new productivity features and Android app improvements.',
      status: 'Released',
      confirmationLevel: 'official',
      category: 'google'
    }
  ];

  let filteredReleases = allReleases.filter(release => selectedReleasesFilters.includes(release.category));
  
  // Always separate upcoming and released items first
  const upcomingReleases = filteredReleases.filter(release => release.status !== 'Released');
  const recentReleases = filteredReleases.filter(release => release.status === 'Released');
  
  const sortReleases = (releases: typeof filteredReleases) => {
    return releases.sort((a, b) => {
      if (releasesSortBy === 'date') {
        return new Date(a.date.split(' ')[0]).getTime() - new Date(b.date.split(' ')[0]).getTime();
      } else {
        return a.title.localeCompare(b.title);
      }
    });
  };

  const sortedUpcoming = sortReleases(upcomingReleases);
  const sortedRecent = sortReleases(recentReleases);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Upcoming':
        return 'bg-blue-500 text-white shadow-lg';
      case 'Released':
        return 'bg-green-500 text-white shadow-lg';
      case 'Beta':
        return 'bg-orange-500 text-white shadow-lg';
      case 'Live':
        return 'bg-red-500 text-white shadow-lg';
      default:
        return 'bg-gray-500 text-white shadow-lg';
    }
  };

  const getConfirmationColor = (level: string) => {
    switch (level) {
      case 'official':
        return 'bg-green-500/20 text-green-500';
      case 'likely':
        return 'bg-blue-500/20 text-blue-500';
      case 'rumored':
        return 'bg-yellow-500/20 text-yellow-500';
      case 'speculative':
        return 'bg-gray-500/20 text-gray-500';
      default:
        return 'bg-gray-500/20 text-gray-500';
    }
  };

  const getConfirmationText = (level: string) => {
    switch (level) {
      case 'official':
        return 'Official';
      case 'likely':
        return 'Likely';
      case 'rumored':
        return 'Rumored';
      case 'speculative':
        return 'Speculative';
      default:
        return 'Unknown';
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc' }}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
      <AnimatedScrollView 
        ref={scrollViewRef}
        className="flex-1" 
        contentContainerStyle={{ paddingBottom: 100 }}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="px-6 pt-16 pb-6">
          <View className="flex-row items-start justify-between mb-3">
            <View className="flex-1 mr-4">
              <View className="flex-row items-center mb-2">
                <Text className="text-3xl mr-3">📦</Text>
                <Text className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Software Releases
                </Text>
              </View>
              <Text className={`text-base font-medium ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                & Updates
              </Text>
            </View>
            <View className="flex-row gap-2">
              <Pressable
                onPress={() => setShowSettings(true)}
                className={`w-8 h-8 rounded-lg items-center justify-center ${
                  isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-300'
                }`}
              >
                <Ionicons 
                  name="settings-outline" 
                  size={16} 
                  color={isDarkMode ? '#9CA3AF' : '#6B7280'} 
                />
              </Pressable>
              <Pressable
                onPress={onShowEvents}
                className={`px-3 py-2 rounded-lg flex-row items-center ${
                  isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-300'
                }`}
              >
                <Ionicons 
                  name="calendar-outline" 
                  size={14} 
                  color={isDarkMode ? '#9CA3AF' : '#6B7280'} 
                />
                <Text className={`ml-1 text-xs font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Events
                </Text>
              </Pressable>
            </View>
          </View>
          <Text className={`text-sm leading-5 mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Actual software releases for Apple, Microsoft, Google, and Home Assistant.
          </Text>
          <Text className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Track when new versions become available.
          </Text>
        </View>

        {/* Filters and Sort - Conditionally shown */}
        {(showFiltersInMainView || showSortInMainView) && (
          <View className="px-6 pb-6">
            {showFiltersInMainView && (
              <View className="mb-4">
                <Text className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Filter by company:
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {filters.map((filter) => (
                    <Pressable
                      key={filter.id}
                      onPress={() => toggleFilter(filter.id)}
                      className={`px-3 py-2 rounded-full flex-row items-center ${
                        selectedReleasesFilters.includes(filter.id)
                          ? 'bg-blue-500 border border-blue-400'
                          : isDarkMode 
                            ? 'bg-gray-800 border border-gray-600' 
                            : 'bg-gray-100 border border-gray-300'
                      }`}
                    >
                      <Text className="mr-1">{filter.icon}</Text>
                      <Text className={`text-sm font-medium ${
                        selectedReleasesFilters.includes(filter.id)
                          ? 'text-white'
                          : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {filter.label}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            )}
            
            {/* Recently Released Filter */}
            {showFiltersInMainView && (
              <View className="mb-4">
              <Text className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Recently released:
              </Text>
              <View className="flex-row gap-2">
                <Pressable
                  onPress={() => setRecentlyReleasedFilter('show-only')}
                  className={`px-3 py-2 rounded-lg ${
                    recentlyReleasedFilter === 'show-only'
                      ? 'bg-green-500 border border-green-400'
                      : isDarkMode 
                        ? 'bg-gray-800 border border-gray-700' 
                        : 'bg-white border border-gray-300'
                  }`}
                >
                  <Text className={`text-sm font-medium ${
                    recentlyReleasedFilter === 'show-only'
                      ? 'text-white'
                      : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Only
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setRecentlyReleasedFilter('include')}
                  className={`px-3 py-2 rounded-lg ${
                    recentlyReleasedFilter === 'include'
                      ? 'bg-blue-500 border border-blue-400'
                      : isDarkMode 
                        ? 'bg-gray-800 border border-gray-700' 
                        : 'bg-white border border-gray-300'
                  }`}
                >
                  <Text className={`text-sm font-medium ${
                    recentlyReleasedFilter === 'include'
                      ? 'text-white'
                      : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Include
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setRecentlyReleasedFilter('hide')}
                  className={`px-3 py-2 rounded-lg ${
                    recentlyReleasedFilter === 'hide'
                      ? 'bg-red-500 border border-red-400'
                      : isDarkMode 
                        ? 'bg-gray-800 border border-gray-700' 
                        : 'bg-white border border-gray-300'
                  }`}
                >
                  <Text className={`text-sm font-medium ${
                    recentlyReleasedFilter === 'hide'
                      ? 'text-white'
                      : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Hide
                  </Text>
                </Pressable>
              </View>
              </View>
            )}

            {showSortInMainView && (
              <View className="flex-row items-center">
                <Text className={`text-sm font-medium mr-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Sort by:
                </Text>
                <Pressable
                  onPress={() => setReleasesSortBy(releasesSortBy === 'date' ? 'name' : 'date')}
                  className={`px-4 py-2 rounded-lg flex-row items-center ${
                    isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-300'
                  }`}
                >
                  <Ionicons 
                    name={releasesSortBy === 'date' ? 'calendar-outline' : 'text-outline'} 
                    size={16} 
                    color={isDarkMode ? '#9CA3AF' : '#6B7280'} 
                  />
                  <Text className={`ml-2 text-sm font-medium ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {releasesSortBy === 'date' ? 'Date' : 'Name'}
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        )}

        {/* Release Cards */}
        {(recentlyReleasedFilter === 'show-only' ? sortedRecent : sortedUpcoming).map((release) => (
            <View
              key={release.id}
              className={`mx-4 mb-4 p-6 rounded-2xl ${
                isDarkMode ? 'bg-gray-800/60 border border-gray-700' : 'bg-white/90 border border-gray-200'
              }`}
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: isDarkMode ? 0.3 : 0.1,
                shadowRadius: 12,
                elevation: 8,
              }}
            >
              <View className="flex-row items-start justify-between mb-3">
                <View className="flex-row items-center flex-1">
                  <Text className="text-2xl mr-3">{release.icon}</Text>
                  <Text className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {release.title}
                  </Text>
                </View>
                <View className="flex-col items-end gap-1">
                  <View className={`px-3 py-1 rounded-full ${getStatusColor(release.status)}`}>
                    <Text className="text-xs font-bold capitalize">{release.status}</Text>
                  </View>
                  <View className={`px-2 py-0.5 rounded ${getConfirmationColor(release.confirmationLevel)}`}>
                    <Text className="text-xs font-semibold">{getConfirmationText(release.confirmationLevel)}</Text>
                  </View>
                </View>
              </View>

              <View className="mb-4">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className={`text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {release.date}
                  </Text>
                  {(release.status === 'Upcoming' || release.status === 'upcoming') && (
                    <Pressable
                      onPress={() => setShowExactCountdown(prev => ({
                        ...prev,
                        [release.id]: !prev[release.id]
                      }))}
                      className={`px-2 py-1 rounded ${
                        isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'
                      }`}
                    >
                      <Text className={`text-xs font-medium ${
                        isDarkMode ? 'text-blue-400' : 'text-blue-600'
                      }`}>
                        {getTimeUntil(release.date, showExactCountdown[release.id]) || `Until ${release.date}`}
                      </Text>
                    </Pressable>
                  )}
                </View>
                <Text className={`text-sm leading-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {release.description}
                </Text>
              </View>

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Text className={`font-medium mr-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    Download
                  </Text>
                  <Ionicons 
                    name="download-outline" 
                    size={16} 
                    color={isDarkMode ? '#60A5FA' : '#2563EB'} 
                  />
                </View>

                <View className={`flex-row items-center px-4 py-2 rounded-lg ${
                  isDarkMode ? 'bg-gray-700 border border-gray-600' : 'bg-gray-100 border border-gray-300'
                }`}>
                  <Ionicons 
                    name="checkmark-circle-outline" 
                    size={16} 
                    color={isDarkMode ? '#10B981' : '#059669'} 
                  />
                  <Text className={`ml-2 text-sm font-medium ${
                    isDarkMode ? 'text-green-400' : 'text-green-600'
                  }`}>
                    Released
                  </Text>
                </View>
              </View>
            </View>
        ))}

        {/* Show More Section for Recent Releases - only when showRecentlyReleased toggle is on and 'include' mode */}
        {showRecentlyReleased && recentlyReleasedFilter === 'include' && sortedRecent.length > 0 && (
          <View className="px-4 pb-6">
            <Pressable
              onPress={() => setShowRecent(!showRecent)}
              className={`flex-row items-center justify-center py-3 rounded-lg mb-4 ${
                isDarkMode ? 'bg-gray-800/40 border border-gray-700' : 'bg-gray-100 border border-gray-300'
              }`}
            >
              <Text className={`text-sm font-medium mr-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {showRecent ? 'Hide' : 'Show'} Recently Released ({sortedRecent.length})
              </Text>
              <Ionicons 
                name={showRecent ? 'chevron-up' : 'chevron-down'} 
                size={16} 
                color={isDarkMode ? '#9CA3AF' : '#6B7280'} 
              />
            </Pressable>

            {showRecent && sortedRecent.map((release) => (
              <View
                key={release.id}
                className={`mb-4 p-6 rounded-2xl ${
                  isDarkMode ? 'bg-gray-800/40 border border-gray-700' : 'bg-white/70 border border-gray-200'
                }`}
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: isDarkMode ? 0.2 : 0.05,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                <View className="flex-row items-start justify-between mb-3">
                  <View className="flex-row items-center flex-1">
                    <Text className="text-2xl mr-3">{release.icon}</Text>
                    <Text className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {release.title}
                    </Text>
                  </View>
                  <View className="flex-col items-end gap-1">
                    <View className={`px-3 py-1 rounded-full ${getStatusColor(release.status)}`}>
                      <Text className="text-xs font-bold capitalize">{release.status}</Text>
                    </View>
                    <View className={`px-2 py-0.5 rounded ${getConfirmationColor(release.confirmationLevel)}`}>
                      <Text className="text-xs font-semibold">{getConfirmationText(release.confirmationLevel)}</Text>
                    </View>
                  </View>
                </View>

                <View className="mb-4">
                  <Text className={`text-base mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {release.date}
                  </Text>
                  <Text className={`text-sm leading-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {release.description}
                  </Text>
                </View>

                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Text className={`font-medium mr-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      Download
                    </Text>
                    <Ionicons 
                      name="download-outline" 
                      size={16} 
                      color={isDarkMode ? '#60A5FA' : '#2563EB'} 
                    />
                  </View>

                  <View className={`flex-row items-center px-4 py-2 rounded-lg ${
                    isDarkMode ? 'bg-gray-700 border border-gray-600' : 'bg-gray-100 border border-gray-300'
                  }`}>
                    <Ionicons 
                      name="checkmark-circle-outline" 
                      size={16} 
                      color={isDarkMode ? '#10B981' : '#059669'} 
                    />
                    <Text className={`ml-2 text-sm font-medium ${
                      isDarkMode ? 'text-green-400' : 'text-green-600'
                    }`}>
                      Released
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </AnimatedScrollView>

      {/* Back to Top Button */}
      <BackToTopButton
        scrollY={scrollY}
        onPress={scrollToTop}
        isDarkMode={isDarkMode}
        showText={showBackToTopText}
      />

      {/* Draggable Theme Toggle */}
      <DraggableThemeToggle
        isDarkMode={isDarkMode}
        onToggle={toggleTheme}
        position={themeTogglePosition}
        onPositionChange={setThemeTogglePosition}
      />

      {/* Settings Modal */}
      <SettingsModal
        visible={showSettings}
        onClose={() => setShowSettings(false)}
        screenType="releases"
      />
    </View>
  );
};