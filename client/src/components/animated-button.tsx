import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, ButtonProps } from '@/components/ui/button';
import { useSound } from './sound-manager';
import { Sparkles, Zap } from 'lucide-react';

interface AnimatedButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'lottery';
  glowEffect?: boolean;
  sparkleEffect?: boolean;
  soundType?: 'click' | 'success' | 'lottery' | 'coin';
}

export function AnimatedButton({
  children,
  variant = 'primary',
  glowEffect = false,
  sparkleEffect = false,
  soundType = 'click',
  onClick,
  className = '',
  disabled,
  ...props
}: AnimatedButtonProps) {
  const { playSound } = useSound();
  const [isPressed, setIsPressed] = useState(false);
  const [showSparkles, setShowSparkles] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    
    playSound(soundType);
    setIsPressed(true);
    
    if (sparkleEffect) {
      setShowSparkles(true);
      setTimeout(() => setShowSparkles(false), 1000);
    }
    
    setTimeout(() => setIsPressed(false), 150);
    
    if (onClick) {
      onClick(e);
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white';
      case 'secondary':
        return 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white';
      case 'success':
        return 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white';
      case 'danger':
        return 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white';
      case 'lottery':
        return 'bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-black font-bold';
      default:
        return 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white';
    }
  };

  return (
    <motion.div className="relative inline-block">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={isPressed ? { scale: 0.95 } : { scale: 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <Button
          onClick={handleClick}
          disabled={disabled}
          className={`
            relative overflow-hidden transition-all duration-300
            ${getVariantClasses()}
            ${glowEffect && !disabled ? 'shadow-lg hover:shadow-xl hover:shadow-current/25' : ''}
            ${className}
          `}

          {...props}
        >
          <motion.div
            className="relative z-10 flex items-center justify-center gap-2"
            animate={isPressed ? { y: 1 } : { y: 0 }}
          >
            {children}
          </motion.div>
          
          {glowEffect && !disabled && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-white/20"
              initial={{ x: '-100%' }}
              animate={{ x: '100%' }}
              transition={{ 
                repeat: Infinity, 
                duration: 2, 
                ease: "easeInOut",
                repeatDelay: 3 
              }}
            />
          )}
        </Button>
      </motion.div>
      
      <AnimatePresence>
        {showSparkles && (
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${20 + (i * 10)}%`,
                  top: `${20 + (i * 10)}%`,
                }}
                initial={{ scale: 0, rotate: 0 }}
                animate={{ 
                  scale: [0, 1, 0],
                  rotate: [0, 180, 360],
                  y: [0, -20, -40],
                  x: [0, Math.random() * 20 - 10, Math.random() * 40 - 20]
                }}
                transition={{ duration: 1, delay: i * 0.1 }}
              >
                <Sparkles className="w-3 h-3 text-gold-400" />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function PulseButton({ children, className = '', ...props }: Omit<ButtonProps, 'variant'>) {
  return (
    <motion.div
      animate={{
        scale: [1, 1.05, 1],
        opacity: [0.8, 1, 0.8],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <AnimatedButton
        variant="lottery"
        glowEffect
        sparkleEffect
        soundType="lottery"
        className={`shadow-lg shadow-gold-500/25 ${className}`}
        {...props}
      >
        <Zap className="w-4 h-4 mr-2" />
        {children}
      </AnimatedButton>
    </motion.div>
  );
}