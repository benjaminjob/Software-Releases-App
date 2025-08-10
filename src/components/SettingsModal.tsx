import React from 'react';
import { View, Text, Pressable, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSettingsStore } from '../state/settingsStore';
import { cn } from '../utils/cn';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
  screenType: 'releases' | 'events';
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  visible,
  onClose,
  screenType,
}) => {
  const {
    isDarkMode,
    themeTogglePosition,
    showBackToTopText,
    showFiltersInMainView,
    showSortInMainView,
    showRecentlyReleased,
    selectedReleasesFilters,
    selectedEventsFilters,
    releasesSortBy,
    eventsSortBy,
    recentlyReleasedFilter,
    recentlyEndedFilter,
    setThemeTogglePosition,
    setShowBackToTopText,
    setShowFiltersInMainView,
    setShowSortInMainView,
    setShowRecentlyReleased,
    setSelectedReleasesFilters,
    setSelectedEventsFilters,
    setReleasesSortBy,
    setEventsSortBy,
    setRecentlyReleasedFilter,
    setRecentlyEndedFilter,
    resetToDefaults,
  } = useSettingsStore();

  const isReleasesScreen = screenType === 'releases';
  const currentFilters = isReleasesScreen ? selectedReleasesFilters : selectedEventsFilters;
  const currentSortBy = isReleasesScreen ? releasesSortBy : eventsSortBy;
  const currentFilterValue = isReleasesScreen ? recentlyReleasedFilter : recentlyEndedFilter;
  
  const filters = isReleasesScreen 
    ? [
        { id: 'apple', label: 'Apple', icon: '🍎' },
        { id: 'microsoft', label: 'Microsoft', icon: '🪟' },
        { id: 'home-assistant', label: 'Home Assistant', icon: '🏠' },
        { id: 'google', label: 'Google', icon: '🔍' }
      ]
    : [
        { id: 'apple', label: 'Apple', icon: '🍎' },
        { id: 'google', label: 'Google', icon: '🔍' },
        { id: 'microsoft', label: 'Microsoft', icon: '🪟' },
        { id: 'valve', label: 'Valve', icon: '🎮' },
        { id: 'home-assistant', label: 'Home Assistant', icon: '🏠' },
        { id: 'samsung', label: 'Samsung', icon: '📱' }
      ];

  const toggleFilter = (filterId: string) => {
    const newFilters = currentFilters.includes(filterId)
      ? currentFilters.filter(f => f !== filterId)
      : [...currentFilters, filterId];
    
    if (isReleasesScreen) {
      setSelectedReleasesFilters(newFilters);
    } else {
      setSelectedEventsFilters(newFilters);
    }
  };

  const setSortBy = (sort: 'date' | 'name') => {
    if (isReleasesScreen) {
      setReleasesSortBy(sort);
    } else {
      setEventsSortBy(sort);
    }
  };
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      transparent={false}
    >
      <View className={cn(
        'flex-1',
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      )}>
        {/* Header */}
        <View className="flex-row items-center justify-between p-6 pt-16">
          <Text className={cn(
            'text-2xl font-bold',
            isDarkMode ? 'text-white' : 'text-gray-900'
          )}>
            Settings
          </Text>
          <View className="flex-row gap-2">
            <Pressable
              onPress={() => {
                resetToDefaults();
                // Show a brief feedback (you could add a toast here)
              }}
              className={cn(
                'px-3 py-2 rounded-lg',
                isDarkMode ? 'bg-orange-600' : 'bg-orange-500'
              )}
            >
              <Text className="text-white text-sm font-medium">
                Reset
              </Text>
            </Pressable>
            <Pressable
              onPress={onClose}
              className={cn(
                'w-10 h-10 rounded-full items-center justify-center',
                isDarkMode ? 'bg-gray-800' : 'bg-gray-200'
              )}
            >
              <Ionicons 
                name="close" 
                size={20} 
                color={isDarkMode ? '#E5E7EB' : '#374151'} 
              />
            </Pressable>
          </View>
        </View>

        {/* Settings Content */}
        <ScrollView className="px-6" showsVerticalScrollIndicator={false}>
          {/* Theme Toggle Position */}
          <View className={cn(
            'p-6 rounded-2xl mb-4',
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          )}>
            <Text className={cn(
              'text-lg font-semibold mb-4',
              isDarkMode ? 'text-white' : 'text-gray-900'
            )}>
              Theme Toggle Position
            </Text>
            
            <View className="space-y-3">
              <Pressable
                onPress={() => setThemeTogglePosition('bottom-left')}
                className={cn(
                  'flex-row items-center p-4 rounded-lg border',
                  themeTogglePosition === 'bottom-left'
                    ? 'bg-blue-500/20 border-blue-500'
                    : isDarkMode 
                      ? 'bg-gray-700 border-gray-600' 
                      : 'bg-gray-100 border-gray-300'
                )}
              >
                <View className={cn(
                  'w-5 h-5 rounded-full border-2 mr-3 items-center justify-center',
                  themeTogglePosition === 'bottom-left'
                    ? 'border-blue-500'
                    : isDarkMode ? 'border-gray-500' : 'border-gray-400'
                )}>
                  {themeTogglePosition === 'bottom-left' && (
                    <View className="w-2 h-2 rounded-full bg-blue-500" />
                  )}
                </View>
                <Text className={cn(
                  'font-medium',
                  themeTogglePosition === 'bottom-left'
                    ? 'text-blue-600'
                    : isDarkMode ? 'text-white' : 'text-gray-900'
                )}>
                  Bottom Left
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setThemeTogglePosition('top-left')}
                className={cn(
                  'flex-row items-center p-4 rounded-lg border',
                  themeTogglePosition === 'top-left'
                    ? 'bg-blue-500/20 border-blue-500'
                    : isDarkMode 
                      ? 'bg-gray-700 border-gray-600' 
                      : 'bg-gray-100 border-gray-300'
                )}
              >
                <View className={cn(
                  'w-5 h-5 rounded-full border-2 mr-3 items-center justify-center',
                  themeTogglePosition === 'top-left'
                    ? 'border-blue-500'
                    : isDarkMode ? 'border-gray-500' : 'border-gray-400'
                )}>
                  {themeTogglePosition === 'top-left' && (
                    <View className="w-2 h-2 rounded-full bg-blue-500" />
                  )}
                </View>
                <Text className={cn(
                  'font-medium',
                  themeTogglePosition === 'top-left'
                    ? 'text-blue-600'
                    : isDarkMode ? 'text-white' : 'text-gray-900'
                )}>
                  Top Left
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Back to Top Button */}
          <View className={cn(
            'p-6 rounded-2xl mb-4',
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          )}>
            <Text className={cn(
              'text-lg font-semibold mb-4',
              isDarkMode ? 'text-white' : 'text-gray-900'
            )}>
              Back to Top Button
            </Text>
            
            <Pressable
              onPress={() => setShowBackToTopText(!showBackToTopText)}
              className={cn(
                'flex-row items-center justify-between p-4 rounded-lg border',
                isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'
              )}
            >
              <Text className={cn(
                'font-medium',
                isDarkMode ? 'text-white' : 'text-gray-900'
              )}>
                Show "Top" text
              </Text>
              <View className={cn(
                'w-12 h-6 rounded-full p-1',
                showBackToTopText ? 'bg-blue-500' : 'bg-gray-400'
              )}>
                <View className={cn(
                  'w-4 h-4 rounded-full bg-white transition-all',
                  showBackToTopText ? 'translate-x-6' : 'translate-x-0'
                )} />
              </View>
            </Pressable>
          </View>

          {/* Interface Options */}
          <View className={cn(
            'p-6 rounded-2xl mb-4',
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          )}>
            <View className="flex-row items-center justify-between mb-4">
              <Text className={cn(
                'text-lg font-semibold',
                isDarkMode ? 'text-white' : 'text-gray-900'
              )}>
                Interface Options
              </Text>
              <Pressable
                onPress={() => {
                  const allEnabled = showFiltersInMainView && showSortInMainView && showRecentlyReleased;
                  setShowFiltersInMainView(!allEnabled);
                  setShowSortInMainView(!allEnabled);
                  setShowRecentlyReleased(!allEnabled);
                }}
                className={cn(
                  'px-3 py-1 rounded-lg',
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                )}
              >
                <Text className={cn(
                  'text-xs font-medium',
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                )}>
                  {showFiltersInMainView && showSortInMainView && showRecentlyReleased ? 'Disable All' : 'Enable All'}
                </Text>
              </Pressable>
            </View>
            
            <View className="space-y-4">
              <Pressable
                onPress={() => setShowFiltersInMainView(!showFiltersInMainView)}
                className={cn(
                  'flex-row items-center justify-between p-4 rounded-lg border',
                  isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'
                )}
              >
                <Text className={cn(
                  'font-medium',
                  isDarkMode ? 'text-white' : 'text-gray-900'
                )}>
                  Show filters in main view
                </Text>
                <View className={cn(
                  'w-12 h-6 rounded-full p-1',
                  showFiltersInMainView ? 'bg-blue-500' : 'bg-gray-400'
                )}>
                  <View className={cn(
                    'w-4 h-4 rounded-full bg-white transition-all',
                    showFiltersInMainView ? 'translate-x-6' : 'translate-x-0'
                  )} />
                </View>
              </Pressable>

              <Pressable
                onPress={() => setShowSortInMainView(!showSortInMainView)}
                className={cn(
                  'flex-row items-center justify-between p-4 rounded-lg border',
                  isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'
                )}
              >
                <Text className={cn(
                  'font-medium',
                  isDarkMode ? 'text-white' : 'text-gray-900'
                )}>
                  Show sort in main view
                </Text>
                <View className={cn(
                  'w-12 h-6 rounded-full p-1',
                  showSortInMainView ? 'bg-blue-500' : 'bg-gray-400'
                )}>
                  <View className={cn(
                    'w-4 h-4 rounded-full bg-white transition-all',
                    showSortInMainView ? 'translate-x-6' : 'translate-x-0'
                  )} />
                </View>
              </Pressable>

              <Pressable
                onPress={() => setShowRecentlyReleased(!showRecentlyReleased)}
                className={cn(
                  'flex-row items-center justify-between p-4 rounded-lg border',
                  isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-300'
                )}
              >
                <Text className={cn(
                  'font-medium',
                  isDarkMode ? 'text-white' : 'text-gray-900'
                )}>
                  Show recently released items
                </Text>
                <View className={cn(
                  'w-12 h-6 rounded-full p-1',
                  showRecentlyReleased ? 'bg-blue-500' : 'bg-gray-400'
                )}>
                  <View className={cn(
                    'w-4 h-4 rounded-full bg-white transition-all',
                    showRecentlyReleased ? 'translate-x-6' : 'translate-x-0'
                  )} />
                </View>
              </Pressable>
            </View>
          </View>

          {/* Filters */}
          <View className={cn(
            'p-6 rounded-2xl mb-4',
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          )}>
            <View className="flex-row items-center justify-between mb-4">
              <Text className={cn(
                'text-lg font-semibold',
                isDarkMode ? 'text-white' : 'text-gray-900'
              )}>
                Filter by Company
              </Text>
              <Pressable
                onPress={() => {
                  const allSelected = filters.every(f => currentFilters.includes(f.id));
                  const newFilters = allSelected ? [] : filters.map(f => f.id);
                  
                  if (isReleasesScreen) {
                    setSelectedReleasesFilters(newFilters);
                  } else {
                    setSelectedEventsFilters(newFilters);
                  }
                }}
                className={cn(
                  'px-3 py-1 rounded-lg',
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                )}
              >
                <Text className={cn(
                  'text-xs font-medium',
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                )}>
                  {filters.every(f => currentFilters.includes(f.id)) ? 'Deselect All' : 'Select All'}
                </Text>
              </Pressable>
            </View>
            
            <View className="flex-row flex-wrap gap-2">
              {filters.map((filter) => (
                <Pressable
                  key={filter.id}
                  onPress={() => toggleFilter(filter.id)}
                  className={cn(
                    'px-3 py-2 rounded-full flex-row items-center',
                    currentFilters.includes(filter.id)
                      ? 'bg-blue-500 border border-blue-400'
                      : isDarkMode 
                        ? 'bg-gray-700 border border-gray-600' 
                        : 'bg-gray-100 border border-gray-300'
                  )}
                >
                  <Text className="mr-1">{filter.icon}</Text>
                  <Text className={cn(
                    'text-sm font-medium',
                    currentFilters.includes(filter.id)
                      ? 'text-white'
                      : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  )}>
                    {filter.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Recently Released/Ended Filter Options */}
          <View className={cn(
            'p-6 rounded-2xl mb-4',
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          )}>
            <Text className={cn(
              'text-lg font-semibold mb-4',
              isDarkMode ? 'text-white' : 'text-gray-900'
            )}>
              {isReleasesScreen ? 'Recently Released' : 'Recently Ended Events'}
            </Text>
            
            <View className="flex-row gap-2">
              <Pressable
                onPress={() => {
                  if (isReleasesScreen) {
                    setRecentlyReleasedFilter('show-only');
                  } else {
                    setRecentlyEndedFilter('show-only');
                  }
                }}
                className={cn(
                  'px-3 py-2 rounded-lg',
                  currentFilterValue === 'show-only'
                    ? 'bg-green-500 border border-green-400'
                    : isDarkMode 
                      ? 'bg-gray-700 border border-gray-600' 
                      : 'bg-gray-100 border border-gray-300'
                )}
              >
                <Text className={cn(
                  'text-sm font-medium',
                  currentFilterValue === 'show-only'
                    ? 'text-white'
                    : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                )}>
                  Only
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  if (isReleasesScreen) {
                    setRecentlyReleasedFilter('include');
                  } else {
                    setRecentlyEndedFilter('include');
                  }
                }}
                className={cn(
                  'px-3 py-2 rounded-lg',
                  currentFilterValue === 'include'
                    ? 'bg-blue-500 border border-blue-400'
                    : isDarkMode 
                      ? 'bg-gray-700 border border-gray-600' 
                      : 'bg-gray-100 border border-gray-300'
                )}
              >
                <Text className={cn(
                  'text-sm font-medium',
                  currentFilterValue === 'include'
                    ? 'text-white'
                    : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                )}>
                  Include
                </Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  if (isReleasesScreen) {
                    setRecentlyReleasedFilter('hide');
                  } else {
                    setRecentlyEndedFilter('hide');
                  }
                }}
                className={cn(
                  'px-3 py-2 rounded-lg',
                  currentFilterValue === 'hide'
                    ? 'bg-red-500 border border-red-400'
                    : isDarkMode 
                      ? 'bg-gray-700 border border-gray-600' 
                      : 'bg-gray-100 border border-gray-300'
                )}
              >
                <Text className={cn(
                  'text-sm font-medium',
                  currentFilterValue === 'hide'
                    ? 'text-white'
                    : isDarkMode ? 'text-gray-300' : 'text-gray-700'
                )}>
                  Hide
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Sort Options */}
          <View className={cn(
            'p-6 rounded-2xl mb-4',
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          )}>
            <Text className={cn(
              'text-lg font-semibold mb-4',
              isDarkMode ? 'text-white' : 'text-gray-900'
            )}>
              Sort Order
            </Text>
            
            <View className="space-y-3">
              <Pressable
                onPress={() => setSortBy('date')}
                className={cn(
                  'flex-row items-center p-4 rounded-lg border',
                  currentSortBy === 'date'
                    ? 'bg-blue-500/20 border-blue-500'
                    : isDarkMode 
                      ? 'bg-gray-700 border-gray-600' 
                      : 'bg-gray-100 border-gray-300'
                )}
              >
                <View className={cn(
                  'w-5 h-5 rounded-full border-2 mr-3 items-center justify-center',
                  currentSortBy === 'date'
                    ? 'border-blue-500'
                    : isDarkMode ? 'border-gray-500' : 'border-gray-400'
                )}>
                  {currentSortBy === 'date' && (
                    <View className="w-2 h-2 rounded-full bg-blue-500" />
                  )}
                </View>
                <Ionicons 
                  name="calendar-outline" 
                  size={18} 
                  color={isDarkMode ? '#9CA3AF' : '#6B7280'} 
                />
                <Text className={cn(
                  'ml-2 font-medium',
                  currentSortBy === 'date'
                    ? 'text-blue-600'
                    : isDarkMode ? 'text-white' : 'text-gray-900'
                )}>
                  By Date
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setSortBy('name')}
                className={cn(
                  'flex-row items-center p-4 rounded-lg border',
                  currentSortBy === 'name'
                    ? 'bg-blue-500/20 border-blue-500'
                    : isDarkMode 
                      ? 'bg-gray-700 border-gray-600' 
                      : 'bg-gray-100 border-gray-300'
                )}
              >
                <View className={cn(
                  'w-5 h-5 rounded-full border-2 mr-3 items-center justify-center',
                  currentSortBy === 'name'
                    ? 'border-blue-500'
                    : isDarkMode ? 'border-gray-500' : 'border-gray-400'
                )}>
                  {currentSortBy === 'name' && (
                    <View className="w-2 h-2 rounded-full bg-blue-500" />
                  )}
                </View>
                <Ionicons 
                  name="text-outline" 
                  size={18} 
                  color={isDarkMode ? '#9CA3AF' : '#6B7280'} 
                />
                <Text className={cn(
                  'ml-2 font-medium',
                  currentSortBy === 'name'
                    ? 'text-blue-600'
                    : isDarkMode ? 'text-white' : 'text-gray-900'
                )}>
                  By Name
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Data Sources */}
          <View className={cn(
            'p-6 rounded-2xl mb-6',
            isDarkMode ? 'bg-gray-800' : 'bg-white'
          )}>
            <Text className={cn(
              'text-lg font-semibold mb-4',
              isDarkMode ? 'text-white' : 'text-gray-900'
            )}>
              Data Sources
            </Text>
            
            <View className="space-y-3">
              <View>
                <Text className={cn(
                  'text-sm font-medium mb-1',
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                )}>
                  Apple Software Releases
                </Text>
                <Text className={cn(
                  'text-xs',
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                )}>
                  developer.apple.com, Apple Developer Portal
                </Text>
              </View>

              <View>
                <Text className={cn(
                  'text-sm font-medium mb-1',
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                )}>
                  Home Assistant Releases
                </Text>
                <Text className={cn(
                  'text-xs',
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                )}>
                  home-assistant.io, GitHub Releases
                </Text>
              </View>

              <View>
                <Text className={cn(
                  'text-sm font-medium mb-1',
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                )}>
                  Microsoft & Google Events
                </Text>
                <Text className={cn(
                  'text-xs',
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                )}>
                  Official announcements, developer conferences
                </Text>
              </View>

              <View>
                <Text className={cn(
                  'text-sm font-medium mb-1',
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                )}>
                  Gaming & Hardware
                </Text>
                <Text className={cn(
                  'text-xs',
                  isDarkMode ? 'text-gray-400' : 'text-gray-600'
                )}>
                  Valve, Samsung official channels
                </Text>
              </View>
            </View>

            <View className={cn(
              'mt-4 p-3 rounded-lg',
              isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
            )}>
              <Text className={cn(
                'text-xs text-center',
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              )}>
                Release dates and information are estimates based on official announcements and historical patterns. Actual release dates may vary.
              </Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};