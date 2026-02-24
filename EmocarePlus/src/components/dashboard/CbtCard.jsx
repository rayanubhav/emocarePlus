import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const CbtCard = ({ latestRecord }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ translateY: -4 }}
      className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#D6EAFC] to-[#EBF3FD] p-6 shadow-[0_2px_16px_rgba(91,155,213,0.07)] border border-[#B8D4EE] transition-all duration-300"
    >
      <div className="absolute -bottom-5 -left-5 h-[100px] w-[100px] rounded-full bg-[#5B9BD5]/15 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col items-start h-full">
        <div className="inline-block rounded-full bg-[#5B9BD5]/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#3A6FA8] mb-3">
          CBT Exercise
        </div>
        <h3 className="text-[16px] font-bold text-[#2D3E50] mb-2">Challenge a Negative Thought</h3>
        <p className="text-[13px] text-[#5A6A7A] leading-[1.6] mb-4 flex-grow line-clamp-2">
          {latestRecord
            ? `Your last reframed thought: "${latestRecord.alternative_thought}"`
            : 'A simple exercise to reframe unhelpful thinking patterns and build resilience.'}
        </p>
        <button
          onClick={() => navigate('/cbt')}
          className="mt-auto flex w-full items-center justify-center gap-2 rounded-[14px] bg-white py-3 px-5 text-[13px] font-semibold text-[#3A6FA8] shadow-[0_4px_16px_rgba(91,155,213,0.22)] hover:shadow-[0_6px_20px_rgba(91,155,213,0.32)] hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          🧠 Start a Thought Record
        </button>
      </div>
    </motion.div>
  );
};

export default CbtCard;