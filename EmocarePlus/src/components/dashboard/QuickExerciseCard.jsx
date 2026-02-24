import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const QuickExerciseCard = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      whileHover={{ translateY: -4 }}
      className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#D4F2E8] to-[#E8F7F2] p-6 shadow-[0_2px_16px_rgba(91,155,213,0.07)] border border-[#A8D9C2] transition-all duration-300"
    >
      <motion.div
        className="absolute -right-8 -top-8 h-[120px] w-[120px] rounded-full bg-[#72C5A8]/20 blur-3xl pointer-events-none"
        animate={{ opacity: [0.15, 0.25, 0.15] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative z-10 flex flex-col items-start h-full">
        <div className="inline-block rounded-full bg-[#72C5A8]/25 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[#3A9A7A] mb-3">
          Breathing Tool
        </div>
        <h3 className="text-[16px] font-bold text-[#2D3E50] mb-2">Feeling Overwhelmed?</h3>
        <p className="text-[13px] text-[#5A7A6A] leading-[1.6] mb-4 flex-grow">
          Take a moment to reset and find your calm with a guided breathing exercise.
        </p>
        <button
          onClick={() => navigate('/breathing')}
          className="mt-auto flex w-full items-center justify-center gap-2 rounded-[14px] bg-white py-3 px-5 text-[13px] font-semibold text-[#3A9A7A] shadow-[0_4px_16px_rgba(114,197,168,0.25)] hover:shadow-[0_6px_20px_rgba(114,197,168,0.35)] hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          ▶ Start Breathing Exercise
        </button>
      </div>
    </motion.div>
  );
};

export default QuickExerciseCard;