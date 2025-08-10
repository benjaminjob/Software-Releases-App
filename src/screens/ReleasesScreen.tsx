import React, { useState } from 'react';
import { View, Text, ScrollView, Alert, Pressable, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useReleasesStore } from '../state/releasesStore';
import { useThemeStore } from '../state/themeStore';
import { ReleaseCard } from '../components/ReleaseCard';
import { ThemeToggle } from '../components/ThemeToggle';
import { SettingsScreen } from './SettingsScreen';
import { cn } from '../utils/cn';

export const ReleasesScreen: React.FC = () => {
  const { releases } = useReleasesStore();
  const { isDarkMode } = useThemeStore();
  const [showSettings, setShowSettings] = useState(false);

  // Debug logs (these won't show to user but help us debug)
  console.log('Releases:', releases?.length || 0);
  console.log('Dark mode:', isDarkMode);

  // Fallback if data isn't loaded
  if (!releases || releases.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-900">
        <Text className="text-white text-lg">Loading releases...</Text>
      </View>
    );
  }

  const handleReleasePress = (releaseTitle: string, url?: string) => {
    if (url) {
      Alert.alert(
        'Learn More',
        `Would you like to learn more about ${releaseTitle}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Open Link', 
            onPress: () => {
              // In a real app, you would use Linking.openURL(url)
              Alert.alert('Info', 'This would open the link in a browser');
            }
          }
        ]
      );
    }
  };

  const handleCalendarPress = (releaseTitle: string) => {
    Alert.alert(
      'Add to Calendar',
      `Would you like to add ${releaseTitle} to your calendar?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Add', 
          onPress: () => Alert.alert('Success', 'Event added to calendar!')
        }
      ]
    );
  };

  return (
    <View className="flex-1">
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      
      <View 
        className="flex-1"
        style={{
          backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc'
        }}
      >
        <ScrollView 
          className="flex-1" 
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View className="px-6 pt-16 pb-8">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center flex-1">
                <Text className="text-4xl mr-3">🚀</Text>
                <Text className={cn(
                  'text-3xl font-bold',
                  isDarkMode ? 'text-white' : 'text-gray-900'
                )}>
                  Major Tech Events
                </Text>
              </View>
              <Pressable
                onPress={() => setShowSettings(true)}
                className={cn(
                  'w-10 h-10 rounded-full items-center justify-center',
                  isDarkMode ? 'bg-gray-800/60' : 'bg-white/60'
                )}
              >
                <Ionicons 
                  name="settings-outline" 
                  size={20} 
                  color={isDarkMode ? '#E5E7EB' : '#374151'} 
                />
              </Pressable>
            </View>
            <Text className={cn(
              'text-lg mb-2 font-medium',
              isDarkMode ? 'text-green-400' : 'text-green-600'
            )}>
              & Countdowns
            </Text>
            <Text className={cn(
              'text-base leading-6 mb-2',
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            )}>
              Upcoming Apple, Home Assistant, Google, and Valve launches—all in one place.
            </Text>
            <Text className={cn(
              'text-base',
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            )}>
              Never miss the headlines again.
            </Text>
          </View>

          {/* Release Cards */}
          <View className="pb-8">
            {releases.map((release) => (
              <ReleaseCard
                key={release.id}
                release={release}
                onPress={() => handleReleasePress(release.title, release.learnMoreUrl)}
              />
            ))}
          </View>
        </ScrollView>

        {/* Theme Toggle - Can be moved to top-right by changing position prop */}
        <ThemeToggle position="bottom-left" />
        {/* Uncomment the line below and comment the line above to move toggle to top-right */}
        {/* <ThemeToggle position="top-right" /> */}
      </View>

      {/* Settings Modal */}
      <Modal
        visible={showSettings}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SettingsScreen onClose={() => setShowSettings(false)} />
      </Modal>
    </View>
  );
};