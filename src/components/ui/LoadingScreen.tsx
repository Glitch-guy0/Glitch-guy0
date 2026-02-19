import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ExpertiseFactory } from '@/core/ExpertiseFactory';

/**
 * Loading Screen component that displays a spinning Mahoraga wheel
 * and cycles through expertise background colors.
 */
export const LoadingScreen: React.FC = () => {
  const configs = ExpertiseFactory.getAllConfigs();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % configs.length);
    }, 2000); // Change color every 2 seconds

    return () => clearInterval(interval);
  }, [configs.length]);

  const currentConfig = configs[currentIndex];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden transition-colors duration-1000 ease-in-out"
      style={{ backgroundColor: currentConfig.color }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Background Faded Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <motion.h1
          key={currentConfig.title}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.2 }}
          transition={{ duration: 1 }}
          className="text-[15vw] font-black text-white whitespace-nowrap"
        >
          {currentConfig.title}
        </motion.h1>
      </div>

      {/* Spinning Wheel SVG */}
      <div className="relative z-10">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
          className="w-32 h-32 md:w-48 md:h-48 text-white drop-shadow-lg"
        >
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
            {/* Outer Ring */}
            <circle cx="50" cy="50" r="30" strokeWidth="4" />

            {/* Inner Hub */}
            <circle cx="50" cy="50" r="10" fill="currentColor" />

            {/* 8 Handles (Mahoraga Wheel usually has 8 handles) */}
            {[...Array(8)].map((_, i) => (
              <line
                key={i}
                x1="50"
                y1="50"
                x2="50"
                y2="10"
                transform={`rotate(${i * 45} 50 50)`}
                strokeWidth="4"
                strokeLinecap="round"
              />
            ))}

             {/* Decorative beads on handles */}
             {[...Array(8)].map((_, i) => (
              <circle
                key={`bead-${i}`}
                cx="50"
                cy="8"
                r="3"
                transform={`rotate(${i * 45} 50 50)`}
                fill="currentColor"
              />
            ))}
          </svg>
        </motion.div>
      </div>

      {/* Loading Text */}
      <div className="absolute bottom-10 right-10 text-white font-bold text-xl tracking-widest animate-pulse">
        LOADING...
      </div>
    </motion.div>
  );
};
