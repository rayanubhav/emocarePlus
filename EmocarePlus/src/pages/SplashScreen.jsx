import React from 'react';
import { motion } from 'framer-motion';
import { RiLeafFill } from 'react-icons/ri';

const SplashScreen = () => {
  // Container variants for staggering children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      }
    },
  };

  return (
    <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-background font-['DM_Sans']">

      {/* --- Ambient Background Orbs --- */}
      <motion.div
        className="absolute -top-32 -left-32 h-[40rem] w-[40rem] rounded-full bg-primary/20 blur-[120px]"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute -bottom-32 -right-32 h-[40rem] w-[40rem] rounded-full bg-secondary/20 blur-[120px]"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.5, 0.2],
          x: [0, -40, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-light/10 blur-[100px]"
        animate={{
          scale: [0.8, 1.5, 0.8],
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      {/* --- Main Content Container --- */}
      <motion.div
        className="relative z-10 flex flex-col items-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Breathing & Floating Leaf Icon Container */}
        <motion.div variants={itemVariants} className="relative mb-8">
          {/* Outer glow ring expanding */}
          <motion.div
            className="absolute inset-0 rounded-full bg-primary/20"
            animate={{
              scale: [1, 1.8, 1],
              opacity: [0.5, 0, 0.5],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.div
            animate={{
              y: [0, -10, 0], // Floating effect
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative flex h-28 w-28 items-center justify-center rounded-full bg-surface shadow-[0_12px_40px_rgba(91,155,213,0.15)] border border-white/40 backdrop-blur-md"
          >
            <motion.div
              animate={{
                scale: [1, 1.15, 1], // Inhale/Exhale
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <RiLeafFill className="text-6xl text-primary drop-shadow-md" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Text Reveal */}
        <motion.div variants={itemVariants} className="flex flex-col items-center">
          <h1
            className="text-5xl font-bold tracking-tight text-text-main drop-shadow-sm"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            EmoCare+
          </h1>
        </motion.div>

        <motion.div variants={itemVariants}>
          <p className="mt-4 text-base font-medium tracking-wide text-text-muted">
            Your wellness journey starts here
          </p>
        </motion.div>

        {/* Elegant Loading Indicator */}
        <motion.div variants={itemVariants} className="mt-12 flex items-center justify-center gap-2.5">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="h-2.5 w-2.5 rounded-full bg-primary/80"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3],
                y: [0, -8, 0]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: i * 0.2, // Staggered delay
              }}
            />
          ))}
        </motion.div>

      </motion.div>
    </div>
  );
};

export default SplashScreen;