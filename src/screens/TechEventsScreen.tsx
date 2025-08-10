import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, useAnimatedScrollHandler } from 'react-native-reanimated';
import { DraggableThemeToggle } from '../components/DraggableThemeToggle';
import { SettingsModal } from '../components/SettingsModal';
import { BackToTopButton } from '../components/BackToTopButton';
import { getTimeUntil } from '../utils/countdown';
import { useSettingsStore } from '../state/settingsStore';

interface TechEventsScreenProps {
  onShowReleases: () => void;
}

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

export const TechEventsScreen: React.FC<TechEventsScreenProps> = ({ onShowReleases }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [showRecent, setShowRecent] = useState(false);
  const [showExactCountdown, setShowExactCountdown] = useState<Record<string, boolean>>({});
  
  const {
    isDarkMode,
    themeTogglePosition,
    showBackToTopText,
    showFiltersInMainView,
    showSortInMainView,
    showRecentlyReleased,
    selectedEventsFilters,
    eventsSortBy,
    recentlyEndedFilter,
    toggleTheme,
    setThemeTogglePosition,
    setSelectedEventsFilters,
    setEventsSortBy,
    setRecentlyEndedFilter,
  } = useSettingsStore();
  
  const scrollY = useSharedValue(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToTop = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const toggleFilter = (filter: string) => {
    const newFilters = selectedEventsFilters.includes(filter)
      ? selectedEventsFilters.filter(f => f !== filter)
      : [...selectedEventsFilters, filter];
    setSelectedEventsFilters(newFilters);
  };

  const filters = [
    { id: 'apple', label: 'Apple', icon: '🍎' },
    { id: 'google', label: 'Google', icon: '🔍' },
    { id: 'microsoft', label: 'Microsoft', icon: '🪟' },
    { id: 'valve', label: 'Valve', icon: '🎮' },
    { id: 'home-assistant', label: 'Home Assistant', icon: '🏠' },
    { id: 'samsung', label: 'Samsung', icon: '📱' }
  ];

  const allEvents = [
    {
      id: '1',
      title: 'Apple WWDC 2025',
      icon: '🍎',
      date: 'Jun 11, 2025 — Jun 13, 2025',
      description: "Apple's Worldwide Developers Conference: iOS 19, visionOS, macOS & more announcements.",
      status: 'Event ended',
      confirmationLevel: 'official',
      category: 'apple'
    },
    {
      id: '2',
      title: 'Google I/O 2025',
      icon: '🔍',
      date: 'May 14, 2025 — May 16, 2025',
      description: "Google's annual developer conference with Android 16, AI and Chrome OS updates.",
      status: 'Event ended',
      confirmationLevel: 'official',
      category: 'google'
    },
    {
      id: '3',
      title: 'Apple September Event',
      icon: '🍎',
      date: 'Sep 10, 2025',
      description: 'Expected iPhone 27 announcement and iOS 26 release date reveal.',
      status: 'Upcoming',
      confirmationLevel: 'rumored',
      category: 'apple'
    },
    {
      id: '4',
      title: 'Valve Steam Deck 2 Reveal',
      icon: '🎮',
      date: 'Aug 15, 2025 — Aug 18, 2025',
      description: "Valve's next-generation portable gaming device and SteamOS updates.",
      status: 'Upcoming',
      category: 'valve'
    },
    {
      id: '5',
      title: 'Microsoft Build 2025',
      icon: '🪟',
      date: 'May 21, 2025 — May 23, 2025',
      description: 'Microsoft developer conference with Windows 12 and Azure AI announcements.',
      status: 'Event ended',
      category: 'microsoft'
    },
    {
      id: '6',
      title: 'Home Assistant Conference',
      icon: '🏠',
      date: 'Oct 12, 2025 — Oct 13, 2025',
      description: 'Annual Home Assistant conference with new integrations and roadmap updates.',
      status: 'Upcoming',
      category: 'home-assistant'
    },
    {
      id: '7',
      title: 'Samsung Developer Conference',
      icon: '📱',
      date: 'Oct 29, 2025 — Oct 30, 2025',
      description: 'Samsung SDC with One UI 8, Galaxy AI, and Tizen updates.',
      status: 'Upcoming',
      category: 'samsung'
    },
    {
      id: '8',
      title: 'Apple October Event',
      icon: '🍎',
      date: 'Oct 15, 2025',
      description: 'Rumored iPad Pro and Mac updates with M4 Pro chips.',
      status: 'Upcoming',
      confirmationLevel: 'speculative',
      category: 'apple'
    },
    {
      id: '9',
      title: 'Microsoft Ignite 2025',
      icon: '🪟',
      date: 'Nov 18, 2025 — Nov 22, 2025',
      description: 'Microsoft enterprise conference with Windows Server and Office updates.',
      status: 'Upcoming',
      confirmationLevel: 'official',
      category: 'microsoft'
    }
  ];

  let filteredEvents = allEvents.filter(event => selectedEventsFilters.includes(event.category));
  
  // Apply recently ended filter
  if (recentlyEndedFilter === 'show-only') {
    filteredEvents = filteredEvents.filter(event => event.status === 'Event ended');
  } else if (recentlyEndedFilter === 'hide') {
    filteredEvents = filteredEvents.filter(event => event.status !== 'Event ended');
  }
  
  // Separate upcoming and ended events for expandable section
  const upcomingEvents = filteredEvents.filter(event => event.status !== 'Event ended');
  const recentEvents = filteredEvents.filter(event => event.status === 'Event ended');
  
  const sortEvents = (events: typeof filteredEvents) => {
    return events.sort((a, b) => {
      if (eventsSortBy === 'date') {
        return new Date(a.date.split(' ')[0]).getTime() - new Date(b.date.split(' ')[0]).getTime();
      } else {
        return a.title.localeCompare(b.title);
      }
    });
  };

  const sortedUpcoming = sortEvents(upcomingEvents);
  const sortedRecent = sortEvents(recentEvents);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Upcoming':
        return 'bg-blue-500 text-white shadow-lg';
      case 'Live':
        return 'bg-green-500 text-white shadow-lg';
      case 'Event ended':
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
                <Text className="text-3xl mr-3">🚀</Text>
                <Text className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  Tech Events
                </Text>
              </View>
              <Text className={`text-base font-medium ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                & Conferences
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
                onPress={onShowReleases}
                className={`px-3 py-2 rounded-lg flex-row items-center ${
                  isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-300'
                }`}
              >
                <Ionicons 
                  name="cube-outline" 
                  size={14} 
                  color={isDarkMode ? '#9CA3AF' : '#6B7280'} 
                />
                <Text className={`ml-1 text-xs font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Releases
                </Text>
              </Pressable>
            </View>
          </View>
          <Text className={`text-sm leading-5 mb-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Major conferences and events where software releases are announced.
          </Text>
          <Text className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            Never miss the headlines again.
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
                        selectedEventsFilters.includes(filter.id)
                          ? 'bg-blue-500 border border-blue-400'
                          : isDarkMode 
                            ? 'bg-gray-800 border border-gray-600' 
                            : 'bg-gray-100 border border-gray-300'
                      }`}
                    >
                      <Text className="mr-1">{filter.icon}</Text>
                      <Text className={`text-sm font-medium ${
                        selectedEventsFilters.includes(filter.id)
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
            
            {/* Recently Ended Filter */}
            {showFiltersInMainView && (
              <View className="mb-4">
              <Text className={`text-sm font-medium mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Recently ended events:
              </Text>
              <View className="flex-row gap-2">
                <Pressable
                  onPress={() => setRecentlyEndedFilter('show-only')}
                  className={`px-3 py-2 rounded-lg ${
                    recentlyEndedFilter === 'show-only'
                      ? 'bg-green-500 border border-green-400'
                      : isDarkMode 
                        ? 'bg-gray-800 border border-gray-700' 
                        : 'bg-white border border-gray-300'
                  }`}
                >
                  <Text className={`text-sm font-medium ${
                    recentlyEndedFilter === 'show-only'
                      ? 'text-white'
                      : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Only
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setRecentlyEndedFilter('include')}
                  className={`px-3 py-2 rounded-lg ${
                    recentlyEndedFilter === 'include'
                      ? 'bg-blue-500 border border-blue-400'
                      : isDarkMode 
                        ? 'bg-gray-800 border border-gray-700' 
                        : 'bg-white border border-gray-300'
                  }`}
                >
                  <Text className={`text-sm font-medium ${
                    recentlyEndedFilter === 'include'
                      ? 'text-white'
                      : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    Include
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setRecentlyEndedFilter('hide')}
                  className={`px-3 py-2 rounded-lg ${
                    recentlyEndedFilter === 'hide'
                      ? 'bg-red-500 border border-red-400'
                      : isDarkMode 
                        ? 'bg-gray-800 border border-gray-700' 
                        : 'bg-white border border-gray-300'
                  }`}
                >
                  <Text className={`text-sm font-medium ${
                    recentlyEndedFilter === 'hide'
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
                  onPress={() => setEventsSortBy(eventsSortBy === 'date' ? 'name' : 'date')}
                  className={`px-4 py-2 rounded-lg flex-row items-center ${
                    isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-300'
                  }`}
                >
                  <Ionicons 
                    name={eventsSortBy === 'date' ? 'calendar-outline' : 'text-outline'} 
                    size={16} 
                    color={isDarkMode ? '#9CA3AF' : '#6B7280'} 
                  />
                  <Text className={`ml-2 text-sm font-medium ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>
                    {eventsSortBy === 'date' ? 'Date' : 'Name'}
                  </Text>
                </Pressable>
              </View>
            )}
          </View>
        )}

        {/* Event Cards */}
        {recentlyEndedFilter === 'show-only' ? (
          sortedRecent.map((event) => (
            <View
              key={event.id}
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
                  <Text className="text-2xl mr-3">{event.icon}</Text>
                  <Text className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {event.title}
                  </Text>
                </View>
                <View className={`px-3 py-1 rounded-full ${getStatusColor(event.status)}`}>
                  <Text className="text-xs font-bold">{event.status}</Text>
                </View>
              </View>
              <View className="mb-4">
                <Text className={`text-base mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {event.date}
                </Text>
                <Text className={`text-sm leading-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {event.description}
                </Text>
              </View>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Text className={`font-medium mr-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                    Watch Recap
                  </Text>
                  <Ionicons name="play-circle-outline" size={16} color={isDarkMode ? '#60A5FA' : '#2563EB'} />
                </View>
                <View className={`flex-row items-center px-4 py-2 rounded-lg ${isDarkMode ? 'bg-gray-700 border border-gray-600' : 'bg-gray-100 border border-gray-300'}`}>
                  <Ionicons name="checkmark-circle-outline" size={16} color={isDarkMode ? '#EF4444' : '#DC2626'} />
                  <Text className={`ml-2 text-sm font-medium ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>Ended</Text>
                </View>
              </View>
            </View>
          ))
        ) : (
          sortedUpcoming.map((event) => (
          <View
            key={event.id}
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
                <Text className="text-2xl mr-3">{event.icon}</Text>
                <Text className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {event.title}
                </Text>
              </View>
              <View className="flex-col items-end gap-1">
                <View className={`px-3 py-1 rounded-full ${getStatusColor(event.status)}`}>
                  <Text className="text-xs font-bold capitalize">{event.status}</Text>
                </View>
                <View className={`px-2 py-0.5 rounded ${getConfirmationColor(event.confirmationLevel)}`}>
                  <Text className="text-xs font-semibold">{getConfirmationText(event.confirmationLevel)}</Text>
                </View>
              </View>
            </View>



            <View className="mb-4">
              <View className="flex-row items-center justify-between mb-2">
                <Text className={`text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {event.date}
                </Text>
                {(event.status === 'Upcoming' || event.status === 'upcoming') && (
                  <Pressable
                    onPress={() => setShowExactCountdown(prev => ({
                      ...prev,
                      [event.id]: !prev[event.id]
                    }))}
                    className={`px-2 py-1 rounded ${
                      isDarkMode ? 'bg-green-900/30' : 'bg-green-100'
                    }`}
                  >
                    <Text className={`text-xs font-medium ${
                      isDarkMode ? 'text-green-400' : 'text-green-600'
                    }`}>
                      {getTimeUntil(event.date, showExactCountdown[event.id]) || `Until ${event.date}`}
                    </Text>
                  </Pressable>
                )}
              </View>
              <Text className={`text-sm leading-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {event.description}
              </Text>
            </View>

            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Text className={`font-medium mr-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  Learn more
                </Text>
                <Ionicons 
                  name="open-outline" 
                  size={16} 
                  color={isDarkMode ? '#60A5FA' : '#2563EB'} 
                />
              </View>

              <View className={`flex-row items-center px-4 py-2 rounded-lg ${
                isDarkMode ? 'bg-gray-700 border border-gray-600' : 'bg-gray-100 border border-gray-300'
              }`}>
                <Ionicons 
                  name="calendar-outline" 
                  size={16} 
                  color={isDarkMode ? '#9CA3AF' : '#6B7280'} 
                />
                <Text className={`ml-2 text-sm font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Add to Calendar
                </Text>
              </View>
            </View>
          </View>
          ))
        )}

        {/* Show More Section for Recent Events - controlled by showRecentlyReleased toggle */}
        {showRecentlyReleased && recentlyEndedFilter === 'include' && sortedRecent.length > 0 && (
          <View className="px-4 pb-6">
            <Pressable
              onPress={() => setShowRecent(!showRecent)}
              className={`flex-row items-center justify-center py-3 rounded-lg mb-4 ${
                isDarkMode ? 'bg-gray-800/40 border border-gray-700' : 'bg-gray-100 border border-gray-300'
              }`}
            >
              <Text className={`text-sm font-medium mr-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {showRecent ? 'Hide' : 'Show'} Recently Ended ({sortedRecent.length})
              </Text>
              <Ionicons 
                name={showRecent ? 'chevron-up' : 'chevron-down'} 
                size={16} 
                color={isDarkMode ? '#9CA3AF' : '#6B7280'} 
              />
            </Pressable>

            {showRecent && sortedRecent.map((event) => (
              <View
                key={event.id}
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
                    <Text className="text-2xl mr-3">{event.icon}</Text>
                    <Text className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {event.title}
                    </Text>
                  </View>
                  <View className="flex-col items-end gap-1">
                    <View className={`px-3 py-1 rounded-full ${getStatusColor(event.status)}`}>
                      <Text className="text-xs font-bold capitalize">{event.status}</Text>
                    </View>
                    <View className={`px-2 py-0.5 rounded ${getConfirmationColor(event.confirmationLevel)}`}>
                      <Text className="text-xs font-semibold">{getConfirmationText(event.confirmationLevel)}</Text>
                    </View>
                  </View>
                </View>

                <View className="mb-4">
                  <Text className={`text-base mb-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {event.date}
                  </Text>
                  <Text className={`text-sm leading-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {event.description}
                  </Text>
                </View>

                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center">
                    <Text className={`font-medium mr-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                      Watch Recap
                    </Text>
                    <Ionicons 
                      name="play-circle-outline" 
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
                      color={isDarkMode ? '#EF4444' : '#DC2626'} 
                    />
                    <Text className={`ml-2 text-sm font-medium ${
                      isDarkMode ? 'text-red-400' : 'text-red-600'
                    }`}>
                      Ended
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
        screenType="events"
      />
    </View>
  );
};