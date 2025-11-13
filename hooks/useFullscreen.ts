
import { useContext } from 'react';
import { FullscreenContext } from '../contexts/FullscreenContext';

export const useFullscreen = () => {
  const context = useContext(FullscreenContext);
  if (context === undefined) {
    throw new Error('useFullscreen must be used within a FullscreenProvider');
  }
  return context;
};