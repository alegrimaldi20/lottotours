import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimatedButton } from './animated-button';
import { useSound } from './sound-manager';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Shuffle, Sparkles } from 'lucide-react';

interface LotteryNumberSelectorProps {
  onNumbersSelected: (numbers: number[]) => void;
  maxNumbers?: number;
  numberRange?: { min: number; max: number };
  selectedNumbers?: number[];
}

export default function LotteryNumberSelector({
  onNumbersSelected,
  maxNumbers = 6,
  numberRange = { min: 1, max: 49 },
  selectedNumbers = []
}: LotteryNumberSelectorProps) {
  const [selected, setSelected] = useState<number[]>(selectedNumbers);
  const [isAnimating, setIsAnimating] = useState(false);
  const { playSound } = useSound();

  useEffect(() => {
    if (onNumbersSelected && typeof onNumbersSelected === 'function') {
      onNumbersSelected(selected);
    }
  }, [selected, onNumbersSelected]);

  const handleNumberClick = (number: number) => {
    if (isAnimating) return;
    
    playSound('click');
    
    if (selected.includes(number)) {
      setSelected(selected.filter(n => n !== number));
    } else if (selected.length < maxNumbers) {
      setSelected([...selected, number].sort((a, b) => a - b));
    }
  };

  const generateRandomNumbers = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    playSound('lottery');
    
    // Animation sequence
    const animationDuration = 2000;
    const intervals = [];
    
    // Quick random selections
    for (let i = 0; i < 20; i++) {
      const timeout = setTimeout(() => {
        const randomNumbers: number[] = [];
        while (randomNumbers.length < maxNumbers) {
          const randomNum = Math.floor(Math.random() * (numberRange.max - numberRange.min + 1)) + numberRange.min;
          if (!randomNumbers.includes(randomNum)) {
            randomNumbers.push(randomNum);
          }
        }
        setSelected(randomNumbers.sort((a, b) => a - b));
      }, (i * animationDuration) / 20);
      
      intervals.push(timeout);
    }
    
    // Final selection
    setTimeout(() => {
      const finalNumbers: number[] = [];
      while (finalNumbers.length < maxNumbers) {
        const randomNum = Math.floor(Math.random() * (numberRange.max - numberRange.min + 1)) + numberRange.min;
        if (!finalNumbers.includes(randomNum)) {
          finalNumbers.push(randomNum);
        }
      }
      setSelected(finalNumbers.sort((a, b) => a - b));
      setIsAnimating(false);
      playSound('success');
    }, animationDuration);
  };

  const clearSelection = () => {
    if (isAnimating) return;
    playSound('click');
    setSelected([]);
  };

  const getDiceIcon = (number: number) => {
    const icons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];
    const IconComponent = icons[(number - 1) % 6];
    return IconComponent;
  };

  const renderNumbers = () => {
    const numbers = [];
    for (let i = numberRange.min; i <= numberRange.max; i++) {
      numbers.push(i);
    }

    return numbers.map((number) => {
      const isSelected = selected.includes(number);
      const IconComponent = getDiceIcon(number);
      
      return (
        <motion.button
          key={number}
          onClick={() => handleNumberClick(number)}
          disabled={isAnimating}
          className={`
            relative w-12 h-12 rounded-lg border-2 transition-all duration-300
            flex items-center justify-center font-bold text-sm
            ${isSelected
              ? 'bg-gradient-to-r from-gold-400 to-gold-600 border-gold-300 text-black shadow-lg shadow-gold-400/50'
              : 'bg-gradient-to-r from-gray-700 to-gray-800 border-gray-600 text-white hover:border-gray-500'
            }
            ${isAnimating ? 'cursor-not-allowed opacity-50' : 'hover:scale-105 cursor-pointer'}
          `}
          whileHover={!isAnimating ? { scale: 1.1 } : {}}
          whileTap={!isAnimating ? { scale: 0.95 } : {}}
          data-testid={`number-${number}`}
        >
          <AnimatePresence>
            {isSelected && (
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Sparkles className="w-3 h-3 text-gold-200 absolute top-1 right-1" />
              </motion.div>
            )}
          </AnimatePresence>
          
          <motion.span
            animate={isAnimating ? {
              scale: [1, 1.2, 1],
              color: ['#ffffff', '#ffd700', '#ffffff']
            } : {}}
            transition={{ duration: 0.5, repeat: isAnimating ? Infinity : 0 }}
          >
            {number}
          </motion.span>
        </motion.button>
      );
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-gold-400 mb-2">
          Select Your Lucky Numbers
        </h3>
        <p className="text-sm text-gray-400">
          Choose {maxNumbers} numbers from {numberRange.min} to {numberRange.max}
        </p>
        <div className="mt-2 text-sm">
          <span className="text-gold-400">{selected.length}</span>
          <span className="text-gray-400"> / {maxNumbers} selected</span>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 max-h-64 overflow-y-auto p-2">
        {renderNumbers()}
      </div>

      <div className="flex gap-3 justify-center">
        <AnimatedButton
          variant="lottery"
          onClick={generateRandomNumbers}
          disabled={isAnimating}
          glowEffect
          sparkleEffect
          soundType="lottery"
          className="flex-1"
          data-testid="button-quick-pick"
        >
          <Shuffle className={`w-4 h-4 mr-2 ${isAnimating ? 'animate-spin' : ''}`} />
          {isAnimating ? 'Picking...' : 'Quick Pick'}
        </AnimatedButton>
        
        <AnimatedButton
          variant="secondary"
          onClick={clearSelection}
          disabled={isAnimating || selected.length === 0}
          soundType="click"
          data-testid="button-clear-selection"
        >
          Clear
        </AnimatedButton>
      </div>

      <AnimatePresence>
        {selected.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-r from-gold-900/30 to-gold-800/30 border border-gold-500/30 rounded-lg p-4"
          >
            <h4 className="text-sm font-semibold text-gold-400 mb-2">Your Selection:</h4>
            <div className="flex flex-wrap gap-2">
              {selected.map((number, index) => (
                <motion.div
                  key={number}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="w-8 h-8 bg-gradient-to-r from-gold-400 to-gold-600 rounded-full flex items-center justify-center text-black font-bold text-sm shadow-lg"
                >
                  {number}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}