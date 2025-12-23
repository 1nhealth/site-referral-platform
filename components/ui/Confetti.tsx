'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  rotation: number;
  scale: number;
}

interface ConfettiProps {
  isActive: boolean;
  duration?: number;
}

const colors = [
  '#2E9B73', // mint
  '#7B9FE0', // vista-blue
  '#A855F7', // purple
  '#F59E0B', // gold
  '#EC4899', // pink
  '#06B6D4', // cyan
];

export function Confetti({ isActive, duration = 3000 }: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (isActive) {
      // Generate confetti pieces
      const newPieces: ConfettiPiece[] = [];
      for (let i = 0; i < 50; i++) {
        newPieces.push({
          id: i,
          x: Math.random() * 100,
          color: colors[Math.floor(Math.random() * colors.length)],
          delay: Math.random() * 0.5,
          rotation: Math.random() * 360,
          scale: 0.5 + Math.random() * 0.5,
        });
      }
      setPieces(newPieces);

      // Clean up after duration
      const timer = setTimeout(() => {
        setPieces([]);
      }, duration);

      return () => clearTimeout(timer);
    } else {
      setPieces([]);
    }
  }, [isActive, duration]);

  return (
    <AnimatePresence>
      {pieces.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
          {pieces.map((piece) => (
            <motion.div
              key={piece.id}
              initial={{
                opacity: 1,
                x: `${piece.x}vw`,
                y: -20,
                rotate: piece.rotation,
                scale: piece.scale,
              }}
              animate={{
                y: '110vh',
                rotate: piece.rotation + 720,
                opacity: [1, 1, 0],
              }}
              exit={{ opacity: 0 }}
              transition={{
                duration: 2 + Math.random(),
                delay: piece.delay,
                ease: 'linear',
              }}
              className="absolute"
              style={{
                width: 10,
                height: 10,
              }}
            >
              {/* Confetti shape - mix of rectangles and circles */}
              {piece.id % 3 === 0 ? (
                <div
                  className="w-full h-full rounded-full"
                  style={{ backgroundColor: piece.color }}
                />
              ) : piece.id % 3 === 1 ? (
                <div
                  className="w-full h-full"
                  style={{ backgroundColor: piece.color }}
                />
              ) : (
                <div
                  className="w-full h-full rotate-45"
                  style={{ backgroundColor: piece.color }}
                />
              )}
            </motion.div>
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
