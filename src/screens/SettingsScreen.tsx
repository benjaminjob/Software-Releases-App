import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../state/themeStore';
import { cn } from '../utils/cn';

interface SettingsScreenProps {
  onClose: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onClose }) => {
  const { isDarkMode } = useThemeStore();

  return (
    <View className="flex-1">
      <View className={cn(
        'flex-1 p-6',
        isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
      )}>
        {/* Header */}
        <View className="flex-row items-center justify-between mb-8 pt-8">
          <Text className={cn(
            'text-2xl font-bold',
            isDarkMode ? 'text-white' : 'text-gray-900'
          )}>
            Settings
          </Text>
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

        {/* Settings Content */}
        <View className={cn(
          'p-6 rounded-2xl',
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        )}>
          <Text className={cn(
            'text-lg font-semibold mb-4',
            isDarkMode ? 'text-white' : 'text-gray-900'
          )}>
            Theme Toggle Position
          </Text>
          
          <Text className={cn(
            'text-sm mb-4',
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          )}>
            The theme toggle can be positioned either in the bottom-left corner (default) or moved to the top-right corner. 
            To change this, modify the ThemeToggle component position prop in ReleasesScreen.tsx.
          </Text>

          <View className={cn(
            'p-4 rounded-lg',
            isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
          )}>
            <Text className={cn(
              'text-sm font-mono',
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            )}>
              {`<ThemeToggle position="bottom-left" />`}
            </Text>
            <Text className={cn(
              'text-xs mt-2',
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            )}>
              Change to "top-right" to move the toggle
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};