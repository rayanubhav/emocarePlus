import React from 'react';
import { motion } from 'framer-motion';

const QuoteCard = ({ quote }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative rounded-[20px] bg-gradient-to-br from-[#EAF2FB] to-[#EAF7F4] border border-[#C8DFF5] p-7"
    >
      <div className="absolute top-2 left-5 text-[72px] leading-none font-bold text-[#5B9BD5] opacity-15 pointer-events-none">
        "
      </div>
      <div className="relative z-10 pl-2">
        <p className="font-bold text-[17px] text-[#2D3E50] leading-[1.6]">
          {quote}
        </p>
        <p className="mt-3 text-[11px] font-semibold text-[#7A90A4]">
          — Daily Inspiration
        </p>
      </div>
    </motion.div>
  );
};

export default QuoteCard;