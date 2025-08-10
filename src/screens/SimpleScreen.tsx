import React, { useState } from 'react';
import { View } from 'react-native';
import { SoftwareReleasesScreen } from './SoftwareReleasesScreen';
import { TechEventsScreen } from './TechEventsScreen';

export const SimpleScreen: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<'releases' | 'events'>('releases');

  const showEvents = () => setCurrentScreen('events');
  const showReleases = () => setCurrentScreen('releases');

  if (currentScreen === 'events') {
    return <TechEventsScreen onShowReleases={showReleases} />;
  }

  return <SoftwareReleasesScreen onShowEvents={showEvents} />;
};