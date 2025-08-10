import React from 'react';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeStore } from '../state/themeStore';
import { cn } from '../utils/cn';

interface ThemeToggleProps {
  position?: 'bottom-left' | 'top-right';
  className?: string;
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  position = 'bottom-left',
  className 
}) => {
  const { isDarkMode, toggleTheme } = useThemeStore();

  const positionClasses = position === 'bottom-left' 
    ? 'absolute bottom-8 left-6' 
    : 'absolute top-16 right-6';

  return (
    <Pressable
      onPress={toggleTheme}
      className={cn(
        'w-12 h-12 rounded-full items-center justify-center z-50',
        isDarkMode 
          ? 'bg-gray-800/80 border border-gray-600' 
          : 'bg-white/80 border border-gray-300',
        positionClasses,
        className
      )}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 5,
      }}
    >
      <Ionicons 
        name={isDarkMode ? 'sunny' : 'moon'} 
        size={20} 
        color={isDarkMode ? '#F59E0B' : '#6B7280'} 
      />
    </Pressable>
  );
};