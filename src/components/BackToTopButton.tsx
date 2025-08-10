import React from 'react';
import { Pressable, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  withSpring,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { cn } from '../utils/cn';

interface BackToTopButtonProps {
  scrollY: Animated.SharedValue<number>;
  onPress: () => void;
  isDarkMode: boolean;
  showText?: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const BackToTopButton: React.FC<BackToTopButtonProps> = ({
  scrollY,
  onPress,
  isDarkMode,
  showText = true,
}) => {
  const animatedStyle = useAnimatedStyle(() => {
    // Show button when scrolled down more than 200px
    const opacity = interpolate(
      scrollY.value,
      [0, 200, 300],
      [0, 0, 1],
      Extrapolate.CLAMP
    );

    const translateY = interpolate(
      scrollY.value,
      [0, 200, 300],
      [50, 50, 0],
      Extrapolate.CLAMP
    );

    return {
      opacity: withSpring(opacity, { damping: 15 }),
      transform: [{ translateY: withSpring(translateY, { damping: 15 }) }],
    };
  });

  return (
    <AnimatedPressable
      onPress={onPress}
      style={[
        animatedStyle,
        {
          position: 'absolute',
          bottom: 30, // Much lower, closer to bottom
          left: '50%',
          marginLeft: showText ? -32 : -28, // Adjust for text width
          width: showText ? 64 : 56,
          height: 28, // Squashed oval - half the width
          borderRadius: 28, // Full height for oval shape
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 8,
          elevation: 8,
          zIndex: 40,
        },
      ]}
      className={cn(
        'items-center justify-center flex-row',
        isDarkMode 
          ? 'bg-gray-800/90 border border-gray-600' 
          : 'bg-white/90 border border-gray-300'
      )}
    >
      <Ionicons 
        name="chevron-up" 
        size={16} 
        color={isDarkMode ? '#E5E7EB' : '#374151'} 
      />
      {showText && (
        <Text className={cn(
          'ml-1 text-xs font-medium',
          isDarkMode ? 'text-gray-200' : 'text-gray-700'
        )}>
          Top
        </Text>
      )}
    </AnimatedPressable>
  );
};