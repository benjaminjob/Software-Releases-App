import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Release } from '../types/release';
import { useThemeStore } from '../state/themeStore';
import { cn } from '../utils/cn';

interface ReleaseCardProps {
  release: Release;
  onPress?: () => void;
}

export const ReleaseCard: React.FC<ReleaseCardProps> = ({ release, onPress }) => {
  const { isDarkMode } = useThemeStore();

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: Release['status']) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-500/20 text-blue-400';
      case 'live':
        return 'bg-green-500/20 text-green-400';
      case 'ended':
        return 'bg-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getStatusText = (status: Release['status']) => {
    switch (status) {
      case 'upcoming':
        return 'Upcoming';
      case 'live':
        return 'Live';
      case 'ended':
        return 'Event ended';
      default:
        return 'Unknown';
    }
  };

  return (
    <Pressable
      onPress={onPress}
      className={cn(
        'mx-4 mb-4 p-6 rounded-2xl',
        isDarkMode 
          ? 'bg-gray-800/60 border border-gray-700' 
          : 'bg-white/90 border border-gray-200'
      )}
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
          <View className="flex-1">
            <Text className={cn(
              'text-xl font-semibold mb-1',
              isDarkMode ? 'text-white' : 'text-gray-900'
            )}>
              {release.title}
            </Text>
          </View>
        </View>
        <View className={cn(
          'px-3 py-1 rounded-full',
          getStatusColor(release.status)
        )}>
          <Text className="text-xs font-medium">
            {getStatusText(release.status)}
          </Text>
        </View>
      </View>

      <View className="mb-4">
        <Text className={cn(
          'text-base mb-2',
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        )}>
          {release.endDate 
            ? `${formatDate(release.startDate)} — ${formatDate(release.endDate)}`
            : formatDate(release.startDate)
          }
        </Text>
        <Text className={cn(
          'text-sm leading-5',
          isDarkMode ? 'text-gray-400' : 'text-gray-600'
        )}>
          {release.description}
        </Text>
      </View>

      <View className="flex-row items-center justify-between">
        <Pressable 
          className="flex-row items-center"
          onPress={onPress}
        >
          <Text className={cn(
            'text-blue-500 font-medium mr-2',
            isDarkMode ? 'text-blue-400' : 'text-blue-600'
          )}>
            Learn more
          </Text>
          <Ionicons 
            name="open-outline" 
            size={16} 
            color={isDarkMode ? '#60A5FA' : '#2563EB'} 
          />
        </Pressable>

        <Pressable 
          className={cn(
            'flex-row items-center px-4 py-2 rounded-lg',
            isDarkMode 
              ? 'bg-gray-700 border border-gray-600' 
              : 'bg-gray-100 border border-gray-300'
          )}
        >
          <Ionicons 
            name="calendar-outline" 
            size={16} 
            color={isDarkMode ? '#9CA3AF' : '#6B7280'} 
          />
          <Text className={cn(
            'ml-2 text-sm font-medium',
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          )}>
            Add to Calendar
          </Text>
        </Pressable>
      </View>
    </Pressable>
  );
};