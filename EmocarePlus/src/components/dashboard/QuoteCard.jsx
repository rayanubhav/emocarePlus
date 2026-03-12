import React from 'react';
import { motion } from 'framer-motion';

const QuoteCard = ({ quote }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative rounded-[20px] glass p-8 overflow-hidden"
    >
      <div className="absolute top-0 left-4 text-[80px] leading-none font-serif text-primary opacity-10 pointer-events-none select-none">
        "
      </div>
      <div className="relative z-10 pl-2">
        <p className="text-[17px] font-serif text-text-main leading-[1.7] tracking-[0.01em]">
          {quote}
        </p>
        <p className="mt-4 text-[10px] font-sans font-bold uppercase tracking-[0.15em] text-text-muted">
          — Daily Inspiration
        </p>
      </div>
    </motion.div>
  );
};

export default QuoteCard;