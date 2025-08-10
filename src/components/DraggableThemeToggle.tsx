import React, { useState } from 'react';
import { Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { cn } from '../utils/cn';

interface DraggableThemeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
  position: 'bottom-left' | 'top-left';
  onPositionChange: (position: 'bottom-left' | 'top-left') => void;
}

export const DraggableThemeToggle: React.FC<DraggableThemeToggleProps> = ({
  isDarkMode,
  onToggle,
  position,
  onPositionChange,
}) => {
  const translateY = useSharedValue(0);
  const [isDragging, setIsDragging] = useState(false);

  const gesture = Gesture.Pan()
    .onStart(() => {
      runOnJS(setIsDragging)(true);
    })
    .onUpdate((event) => {
      translateY.value = event.translationY;
    })
    .onEnd((event) => {
      runOnJS(setIsDragging)(false);
      
      // Determine new position based on drag direction
      const threshold = 200; // Minimum drag distance to change position
      
      if (Math.abs(event.translationY) > threshold) {
        if (event.translationY > 0 && position === 'top-left') {
          // Dragged down from top-left to bottom-left
          runOnJS(onPositionChange)('bottom-left');
        } else if (event.translationY < 0 && position === 'bottom-left') {
          // Dragged up from bottom-left to top-left
          runOnJS(onPositionChange)('top-left');
        }
      }
      
      // Return to original position
      translateY.value = withSpring(0);
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: isDragging ? 0.8 : 1,
  }));

  const positionClasses = position === 'bottom-left' 
    ? 'absolute bottom-8 left-6' 
    : 'absolute top-20 left-6';

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[animatedStyle]}
        className={cn(
          'w-12 h-12 rounded-full items-center justify-center z-50',
          positionClasses
        )}
      >
        <Pressable
          onPress={onToggle}
          className={cn(
            'w-full h-full rounded-full items-center justify-center',
            isDarkMode 
              ? 'bg-gray-800/80 border border-gray-600' 
              : 'bg-white/80 border border-gray-300'
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
      </Animated.View>
    </GestureDetector>
  );
};