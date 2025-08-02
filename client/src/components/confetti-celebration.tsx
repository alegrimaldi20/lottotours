import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from './sound-manager';

interface ConfettiCelebrationProps {
  trigger: boolean;
  duration?: number;
  intensity?: 'low' | 'medium' | 'high';
  colors?: string[];
  onComplete?: () => void;
}

export function ConfettiCelebration({
  trigger,
  duration = 3000,
  intensity = 'medium',
  colors = ['#FFD700', '#FFA500', '#FF69B4', '#9370DB', '#20B2AA', '#FF6347'],
  onComplete
}: ConfettiCelebrationProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  const { playSound } = useSound();

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (trigger) {
      setShowConfetti(true);
      playSound('win');
      
      const timer = setTimeout(() => {
        setShowConfetti(false);
        if (onComplete) onComplete();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [trigger, duration, playSound]);

  const getParticleCount = () => {
    switch (intensity) {
      case 'low': return 50;
      case 'medium': return 150;
      case 'high': return 300;
      default: return 150;
    }
  };

  return (
    <AnimatePresence>
      {showConfetti && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 pointer-events-none z-50"
        >
          <Confetti
            width={windowDimensions.width}
            height={windowDimensions.height}
            numberOfPieces={getParticleCount()}
            colors={colors}
            gravity={0.3}
            wind={0.05}
            recycle={false}
            run={showConfetti}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function WinCelebration({ trigger }: { trigger: boolean }) {
  return (
    <ConfettiCelebration
      trigger={trigger}
      duration={5000}
      intensity="high"
      colors={['#FFD700', '#FFA500', '#FFFF00', '#FFE55C']}
    />
  );
}