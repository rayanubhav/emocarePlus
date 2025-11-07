import React from 'react';
import { motion } from 'framer-motion';
import { IoLeafOutline } from 'react-icons/io5'; // Using react-icons

const SplashScreen = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--color-background)]">
      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0.7, scale: 0.95 }}
        animate={{ opacity: [0.7, 1, 0.7], scale: [0.95, 1.05, 0.95] }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <IoLeafOutline size={80} className="text-[var(--color-primary)]" />
        <h1 className="mt-5 text-3xl font-bold text-[var(--color-on-surface)]">
          EmoCare+
        </h1>
      </motion.div>
    </div>
  );
};

export default SplashScreen;