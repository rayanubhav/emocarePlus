import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEmotion } from '../../contexts/EmotionContext';
import ThemeToggle from './ThemeToggle';
import {
  RiMenuFold3Line,
  RiMenuUnfold3Line,
  RiSparklingLine,
} from 'react-icons/ri';

/* ─────────────────────────────────────────────
   FloatingIsland — Dynamic Island-style topbar
   • Floats with rounded-pill shape
   • Glows with emotion accent colour
   • Expands when AI is thinking/listening
   • Shows ambient micro-copy per emotion
   ───────────────────────────────────────────── */

const FloatingIsland = ({
  isSidebarOpen,
  onToggleSidebar,
  microCopy,
}) => {
  const { emotionConfig, emotionKey, isAiThinking } = useEmotion();

  // Pulse glow when AI is active
  const glowColor = emotionConfig.accent || '#5B9BD5';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative mx-auto mt-3 mb-1 flex items-center justify-between
                 rounded-[22px] border border-border bg-surface/80 px-4 py-2.5
                 backdrop-blur-xl transition-all duration-500"
      style={{
        maxWidth: isAiThinking ? 520 : 460,
        boxShadow: isAiThinking
          ? `0 0 24px ${glowColor}40, 0 4px 20px ${glowColor}20, inset 0 0 12px ${glowColor}08`
          : `0 2px 16px rgba(91,155,213,0.08), 0 1px 4px rgba(0,0,0,0.04)`,
      }}
    >
      {/* AI thinking glow ring */}
      <AnimatePresence>
        {isAiThinking && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute inset-0 rounded-[22px] pointer-events-none"
            style={{
              background: `linear-gradient(135deg, ${glowColor}15, transparent 60%)`,
            }}
          />
        )}
      </AnimatePresence>

      {/* Left: sidebar toggle */}
      <motion.button
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.95 }}
        onClick={onToggleSidebar}
        className="relative z-10 rounded-xl p-2 text-[#5B9BD5] transition-colors hover:bg-[#EEF6FC]
                   dark:hover:bg-[rgba(91,155,213,0.12)]"
        aria-label="Toggle sidebar"
      >
        {isSidebarOpen
          ? <RiMenuFold3Line size={20} />
          : <RiMenuUnfold3Line size={20} />}
      </motion.button>

      {/* Centre: ambient micro-copy + thinking indicator */}
      <div className="relative z-10 flex items-center gap-2 overflow-hidden">
        <AnimatePresence mode="wait">
          {isAiThinking ? (
            <motion.div
              key="thinking"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2"
            >
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <RiSparklingLine size={16} style={{ color: glowColor }} />
              </motion.span>
              <span className="text-xs font-medium text-text-muted">
                Thinking…
              </span>
            </motion.div>
          ) : (
            <motion.p
              key={emotionKey + '-copy'}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="text-xs text-text-muted truncate max-w-[200px] sm:max-w-[260px]"
            >
              {microCopy || emotionConfig.ambientText}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Right: emotion badge + theme toggle */}
      <div className="relative z-10 flex items-center gap-2">
        {/* Emotion pill */}
        <motion.div
          key={emotionKey}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, type: 'spring', stiffness: 260, damping: 20 }}
          className="hidden sm:flex items-center gap-1.5 rounded-full px-2.5 py-1"
          style={{
            backgroundColor: `${glowColor}18`,
            border: `1px solid ${glowColor}30`,
          }}
        >
          <motion.span
            animate={isAiThinking ? { scale: [1, 1.3, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: glowColor }}
          />
          <span
            className="text-[10px] font-semibold uppercase tracking-wider"
            style={{ color: glowColor }}
          >
            {emotionConfig.label}
          </span>
        </motion.div>

        <ThemeToggle />
      </div>
    </motion.div>
  );
};

export default FloatingIsland;
