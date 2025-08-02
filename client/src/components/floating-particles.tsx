import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  color: string;
  life: number;
  maxLife: number;
}

interface FloatingParticlesProps {
  count?: number;
  colors?: string[];
  speed?: number;
  size?: { min: number; max: number };
}

export function FloatingParticles({
  count = 50,
  colors = ['#FFD700', '#FFA500', '#FF69B4', '#9370DB', '#20B2AA'],
  speed = 0.5,
  size = { min: 1, max: 3 }
}: FloatingParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * speed,
      vy: (Math.random() - 0.5) * speed,
      size: Math.random() * (size.max - size.min) + size.min,
      opacity: Math.random() * 0.5 + 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 0,
      maxLife: Math.random() * 1000 + 500,
    });

    const initParticles = () => {
      particlesRef.current = Array.from({ length: count }, createParticle);
    };

    const updateParticle = (particle: Particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;
      particle.life++;

      // Fade in/out effect
      const lifeCycle = particle.life / particle.maxLife;
      if (lifeCycle < 0.1) {
        particle.opacity = (lifeCycle / 0.1) * 0.5;
      } else if (lifeCycle > 0.9) {
        particle.opacity = ((1 - lifeCycle) / 0.1) * 0.5;
      }

      // Wrap around screen
      if (particle.x < 0) particle.x = canvas.width;
      if (particle.x > canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = canvas.height;
      if (particle.y > canvas.height) particle.y = 0;

      // Respawn if life is over
      if (particle.life >= particle.maxLife) {
        Object.assign(particle, createParticle());
      }
    };

    const drawParticle = (particle: Particle) => {
      ctx.save();
      ctx.globalAlpha = particle.opacity;
      ctx.fillStyle = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      
      // Add glow effect
      ctx.shadowBlur = 10;
      ctx.shadowColor = particle.color;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particlesRef.current.forEach(particle => {
        updateParticle(particle);
        drawParticle(particle);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    initParticles();
    animate();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [count, colors, speed, size]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
}

export function GoldParticles() {
  return (
    <FloatingParticles
      count={30}
      colors={['#FFD700', '#FFA500', '#FFFF00']}
      speed={0.3}
      size={{ min: 1, max: 2 }}
    />
  );
}

export function LotteryParticles() {
  return (
    <FloatingParticles
      count={40}
      colors={['#FFD700', '#FF69B4', '#9370DB', '#20B2AA', '#FF6347']}
      speed={0.4}
      size={{ min: 2, max: 4 }}
    />
  );
}