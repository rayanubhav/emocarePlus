import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { RiPlayFill } from 'react-icons/ri';

const QuickExerciseCard = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-secondary-light to-surface p-6 shadow-[0_4px_24px_rgba(114,197,168,0.10)] border border-secondary/30 transition-all h-full"
    >
      <motion.div
        className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-secondary-light blur-2xl"
        animate={{ y: [0, -10, 0], x: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <div className="relative z-10 flex flex-col h-full">
        <h3 className="text-[16px] font-bold text-text-main mb-2 tracking-[-0.01em]">Feeling Overwhelmed?</h3>
        <p className="text-[13px] text-text-muted leading-[1.65] mb-4 flex-grow">
          Take a moment to reset and find your calm with a guided breathing exercise.
        </p>
        <button
          onClick={() => navigate('/breathing')}
          className="mt-auto flex w-full items-center justify-center gap-2 rounded-[14px] bg-surface py-3 px-5 text-[13px] font-bold text-secondary shadow-sm hover:shadow-md transition-all border border-border"
        >
          <RiPlayFill size={18} />
          Start Breathing
        </button>
      </div>
    </motion.div>
  );
};

export default QuickExerciseCard;