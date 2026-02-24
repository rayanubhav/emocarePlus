import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiPsychotherapyLine } from 'react-icons/ri';

const CbtCard = ({ latestRecord }) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-primary-light to-surface p-6 shadow-sm border border-primary/30 transition-all"
    >
      <motion.div
        className="absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-primary-light blur-2xl"
        animate={{ y: [0, 10, 0], x: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
      />
      <div className="relative z-10 flex flex-col h-full">
        <h3 className="text-[16px] font-bold text-text-main mb-2">Challenge a Negative Thought</h3>
        <p className="text-[13px] text-text-muted leading-relaxed mb-4 flex-grow line-clamp-2">
          {latestRecord
            ? `Your last reframed thought: "${latestRecord.alternative_thought}"`
            : 'A simple exercise to reframe unhelpful thinking patterns.'}
        </p>
        <button
          onClick={() => navigate('/cbt')}
          className="mt-auto flex w-full items-center justify-center gap-2 rounded-[14px] bg-surface py-3 px-5 text-[13px] font-bold text-primary shadow-sm hover:shadow-md transition-all border border-border"
        >
          <RiPsychotherapyLine size={18} />
          Thought Record
        </button>
      </div>
    </motion.div>
  );
};

export default CbtCard;