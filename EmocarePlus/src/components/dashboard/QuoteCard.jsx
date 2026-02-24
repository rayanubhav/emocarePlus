import React from 'react';
import { motion } from 'framer-motion';

const QuoteCard = ({ quote }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative rounded-[20px] bg-surface-light border border-border p-7 overflow-hidden"
    >
      <div className="absolute top-2 left-5 text-[72px] leading-none font-bold text-primary opacity-10 pointer-events-none">
        "
      </div>
      <div className="relative z-10 pl-2">
        <p className="text-[15px] font-medium text-text-main leading-relaxed italic">
          {quote}
        </p>
        <p className="mt-3 text-[11px] font-bold uppercase tracking-wider text-text-muted">
          — Daily Inspiration
        </p>
      </div>
    </motion.div>
  );
};

export default QuoteCard;