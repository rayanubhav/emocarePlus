import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const bgImageUrl = '/get_started_bg.jpg';

const GetStartedScreen = () => {
  const navigate = useNavigate();

  const onGetStarted = () => {
    localStorage.setItem('hasSeenGetStarted', 'true');
    navigate('/login');
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImageUrl})` }}
    >
      {/* Light, fresh overlay instead of dark neon */}
      <div className="absolute inset-0 bg-[#F0F4F8]/80 backdrop-blur-sm" />

      {/* Subtle background orbs matching the new palette */}
      <motion.div
        className="absolute top-10 right-10 h-64 w-64 rounded-full bg-[#D6EAFC] blur-3xl opacity-60"
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-10 left-10 h-64 w-64 rounded-full bg-[#D4F2E8] blur-3xl opacity-60"
        animate={{ x: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center p-8 text-center max-w-md bg-white border border-[#D9E6F2] rounded-[24px] shadow-[0_8px_40px_rgba(91,155,213,0.1)] m-4"
      >
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          className="text-[60px] mb-2"
        >
          🌿
        </motion.div>

        <h1 className="mt-4 text-[28px] font-bold text-[#2D3E50]">
          Welcome to EmoCare+
        </h1>

        <p className="mt-3 text-[14px] text-[#7A90A4] leading-relaxed">
          Your intelligent companion for proactive mental wellness and emotional fitness.
        </p>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onGetStarted}
          className="w-full mt-8 flex justify-center items-center gap-2 rounded-[14px] bg-[#5B9BD5] py-3 px-5 text-[14px] font-semibold text-white shadow-[0_4px_16px_rgba(91,155,213,0.28)] hover:bg-[#4A88C0] transition-all"
        >
          Get Started
        </motion.button>

        <p className="mt-5 text-[11px] font-semibold uppercase tracking-widest text-[#7A90A4]/70">
          Taking care of you, one step at a time
        </p>
      </motion.div>
    </div>
  );
};

export default GetStartedScreen;