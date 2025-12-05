'use client';

import { motion } from 'framer-motion';

interface AnimatedHeroSVGProps {
  className?: string;
}

export function AnimatedHeroSVG({ className = '' }: AnimatedHeroSVGProps) {
  return (
    <div className={`relative w-full h-full ${className}`}>
      {/* Central hub */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="w-16 h-16 rounded-2xl bg-mint/30 backdrop-blur-sm flex items-center justify-center">
          <div className="w-8 h-8 rounded-lg bg-mint" />
        </div>
      </motion.div>

      {/* Orbiting nodes */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i * 60) * (Math.PI / 180);
        const radius = 100;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const delay = i * 0.1;

        return (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
              x: x - 12,
              y: y - 12,
            }}
            transition={{
              delay: 0.3 + delay,
              duration: 0.5,
              ease: 'easeOut',
            }}
          >
            <motion.div
              className={`w-6 h-6 rounded-lg ${
                i % 2 === 0 ? 'bg-mint/40' : 'bg-vista-blue/40'
              }`}
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                delay: 1 + delay,
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.div>
        );
      })}

      {/* Connection lines (simplified) */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 300 300"
        fill="none"
      >
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const angle = (i * 60) * (Math.PI / 180);
          const radius = 100;
          const x = 150 + Math.cos(angle) * radius;
          const y = 150 + Math.sin(angle) * radius;

          return (
            <motion.line
              key={i}
              x1="150"
              y1="150"
              x2={x}
              y2={y}
              stroke="rgba(83, 202, 151, 0.2)"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                delay: 0.5 + i * 0.1,
                duration: 0.5,
                ease: 'easeOut',
              }}
            />
          );
        })}
      </svg>

      {/* Floating particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-2 h-2 rounded-full bg-mint/20"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
          }}
          animate={{
            y: [0, -10, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            delay: i * 0.2,
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
