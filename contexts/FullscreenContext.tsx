
import React, { createContext, useState, useEffect, useCallback } from 'react';

interface FullscreenContextType {
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  enterFullscreen: () => void;
}

export const FullscreenContext = createContext<FullscreenContextType | undefined>(undefined);

export const FullscreenProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isFullscreen, setIsFullscreen] = useState(!!document.fullscreenElement);

  const handleFullscreenChange = useCallback(() => {
    setIsFullscreen(!!document.fullscreenElement);
  }, []);

  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [handleFullscreenChange]);

  const enterFullscreen = useCallback(() => {
    if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
      });
    }
  }, []);

  const exitFullscreen = useCallback(() => {
    if (document.exitFullscreen && document.fullscreenElement) {
      document.exitFullscreen();
    }
  }, []);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      enterFullscreen();
    } else {
      exitFullscreen();
    }
  }, [enterFullscreen, exitFullscreen]);

  const value = { isFullscreen, toggleFullscreen, enterFullscreen };

  return (
    <FullscreenContext.Provider value={value}>
      {children}
    </FullscreenContext.Provider>
  );
};