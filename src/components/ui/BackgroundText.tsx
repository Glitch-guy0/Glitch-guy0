import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface BackgroundTextProps {
  text: string;
}

/**
 * Displays a large, faint background text that transitions smoothly.
 */
export const BackgroundText: React.FC<BackgroundTextProps> = ({ text }) => {
  return (
    <div className="fixed inset-0 pointer-events-none -z-20 flex items-center justify-center overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.h1
          key={text}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 1.1, y: -20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="text-[12vw] md:text-[15vw] font-black text-white/5 whitespace-nowrap select-none"
        >
          {text}
        </motion.h1>
      </AnimatePresence>
    </div>
  );
};
