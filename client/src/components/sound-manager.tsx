import React, { createContext, useContext, useEffect, useState } from 'react';
import { Howl, Howler } from 'howler';
import { Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SoundContextType {
  playSound: (soundType: SoundType) => void;
  isMuted: boolean;
  toggleMute: () => void;
  setVolume: (volume: number) => void;
}

type SoundType = 'click' | 'success' | 'error' | 'lottery' | 'coin' | 'win' | 'background';

const SoundContext = createContext<SoundContextType | undefined>(undefined);

// Sound URLs (using data URLs for embedded sounds)
const SOUNDS = {
  click: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsE',
  success: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsE',
  error: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsE',
  lottery: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsE',
  coin: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsE',
  win: 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsEOHjB8N2QQAoUXrTp66hVFApGn+DyvmEeAz2X1O/PdCsE'
};

const soundInstances: Record<SoundType, Howl> = {} as Record<SoundType, Howl>;

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem('soundMuted') === 'true';
  });

  useEffect(() => {
    // Initialize all sounds
    Object.entries(SOUNDS).forEach(([key, src]) => {
      soundInstances[key as SoundType] = new Howl({
        src: [src],
        volume: 0.3,
        preload: true,
      });
    });

    // Set initial mute state
    Howler.mute(isMuted);
  }, [isMuted]);

  const playSound = (soundType: SoundType) => {
    if (!isMuted && soundInstances[soundType]) {
      soundInstances[soundType].play();
    }
  };

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    Howler.mute(newMutedState);
    localStorage.setItem('soundMuted', newMutedState.toString());
  };

  const setVolume = (volume: number) => {
    Howler.volume(volume);
  };

  return (
    <SoundContext.Provider value={{ playSound, isMuted, toggleMute, setVolume }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
}

export function SoundToggle() {
  const { isMuted, toggleMute } = useSound();
  
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleMute}
      className="fixed top-4 right-4 z-50 bg-black/20 backdrop-blur-sm border border-gold-400/30"
      data-testid="button-toggle-sound"
    >
      {isMuted ? (
        <VolumeX className="w-4 h-4 text-gold-400" />
      ) : (
        <Volume2 className="w-4 h-4 text-gold-400" />
      )}
    </Button>
  );
}