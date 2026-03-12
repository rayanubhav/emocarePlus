import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RiSeedlingLine,
  RiTimeLine,
  RiStarSmileLine,
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiSparklingLine,
} from 'react-icons/ri';

/* ─────────────────────────────────────────────
   FlashbackCard — "Growth Moment" display
   Shows a positive reinforcement moment from the
   user's historical data. Highlights progress,
   streak accomplishments, or emotional milestones.
   
   Props:
     flashback: {
       type: 'streak' | 'milestone' | 'comparison',
       title: string,
       description: string,
       date?: string,        // when this was achieved
       metric?: { before: number, after: number, label: string },
       celebration?: string, // emoji or short praise
     }
   ───────────────────────────────────────────── */

const TYPE_CONFIG = {
  streak: {
    icon: <RiSeedlingLine size={20} />,
    gradient: 'from-[#72C5A8] to-[#5B9BD5]',
    badge: 'Streak',
    color: '#72C5A8',
  },
  milestone: {
    icon: <RiStarSmileLine size={20} />,
    gradient: 'from-[#FFD166] to-[#EF8354]',
    badge: 'Milestone',
    color: '#FFD166',
  },
  comparison: {
    icon: <RiTimeLine size={20} />,
    gradient: 'from-[#5B9BD5] to-[#8B7EC8]',
    badge: 'Then vs Now',
    color: '#5B9BD5',
  },
};

const FlashbackCard = ({ flashback }) => {
  const [expanded, setExpanded] = useState(false);

  if (!flashback) return null;

  const config = TYPE_CONFIG[flashback.type] || TYPE_CONFIG.milestone;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flashback-border"
    >
      <div className="glass rounded-2xl overflow-hidden">
        {/* Header strip */}
        <div
          className={`bg-gradient-to-r ${config.gradient} px-5 py-3 flex items-center justify-between`}
        >
          <div className="flex items-center gap-2">
            <span className="text-white">{config.icon}</span>
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              {config.badge}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {flashback.celebration && (
              <motion.span
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="text-lg"
              >
                {flashback.celebration}
              </motion.span>
            )}
            <RiSparklingLine size={14} className="text-white/60" />
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h4 className="text-base font-bold text-text-main" style={{ fontFamily: "'DM Serif Display', serif" }}>
            {flashback.title}
          </h4>

          {flashback.date && (
            <p className="mt-1 text-[10px] text-text-muted uppercase tracking-wider flex items-center gap-1">
              <RiTimeLine size={12} />
              {flashback.date}
            </p>
          )}

          <p className="mt-3 text-xs leading-relaxed text-text-muted">
            {flashback.description}
          </p>

          {/* Progress comparison */}
          {flashback.metric && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-4 rounded-xl bg-surface-light p-4"
            >
              <p className="text-[10px] text-text-muted uppercase tracking-wider mb-2">
                {flashback.metric.label}
              </p>
              <div className="flex items-center gap-4">
                {/* Before */}
                <div className="flex-1 text-center">
                  <p className="text-[10px] text-text-muted">Before</p>
                  <p className="text-xl font-bold text-text-main mt-1">
                    {flashback.metric.before}
                  </p>
                </div>

                {/* Arrow */}
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="flex items-center"
                >
                  <svg width="24" height="12" viewBox="0 0 24 12" fill="none">
                    <path d="M0 6h20M16 1l5 5-5 5" stroke={config.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.div>

                {/* After */}
                <div className="flex-1 text-center">
                  <p className="text-[10px] text-text-muted">Now</p>
                  <motion.p
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.7, type: 'spring', stiffness: 200 }}
                    className="text-xl font-bold mt-1"
                    style={{ color: config.color }}
                  >
                    {flashback.metric.after}
                  </motion.p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Expandable detail */}
          {flashback.detail && (
            <>
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={() => setExpanded(!expanded)}
                className="mt-3 flex items-center gap-1 text-[11px] font-medium text-[#5B9BD5] hover:underline"
              >
                {expanded ? 'Show less' : 'Read more about this'}
                {expanded ? <RiArrowUpSLine size={14} /> : <RiArrowDownSLine size={14} />}
              </motion.button>
              <AnimatePresence>
                {expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="mt-2 text-xs leading-relaxed text-text-muted">
                      {flashback.detail}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FlashbackCard;
