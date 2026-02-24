import React from 'react';
import { motion } from 'framer-motion';
import {
  RiHeartPulseFill, RiFireFill, RiMoonFill,
  RiEmotionHappyLine, RiEmotionSadLine, RiEmotionUnhappyLine, RiQuestionLine,
} from 'react-icons/ri';

const VitalsItem = ({ icon, value, label, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    whileHover={{ y: -4 }}
    className="flex flex-col items-center rounded-[18px] bg-surface-light border border-border p-5 text-center transition-all"
  >
    <div className="text-[28px] mb-2">{icon}</div>
    <p className="text-[20px] font-bold text-text-main">{value}</p>
    <p className="text-[10px] font-semibold tracking-widest uppercase text-text-muted mt-1">{label}</p>
  </motion.div>
);

const getEmotionIcon = (emotion) => {
  switch (emotion?.toLowerCase()) {
    case 'happy': return <RiEmotionHappyLine className="text-yellow-500" />;
    case 'sad': return <RiEmotionSadLine className="text-blue-500" />;
    case 'angry': return <RiEmotionUnhappyLine className="text-red-500" />;
    default: return <RiQuestionLine className="text-gray-400" />;
  }
};

const DailyVitalsCard = ({ vitals }) => {
  const vitalsData = [
    { icon: <RiHeartPulseFill className="text-red-400" />, value: vitals.heartRate, label: "bpm", delay: 0 },
    { icon: <RiFireFill className="text-orange-400" />, value: vitals.steps, label: "Steps", delay: 0.1 },
    { icon: <RiMoonFill className="text-indigo-400" />, value: vitals.sleep, label: "Hours", delay: 0.2 },
    { icon: getEmotionIcon(vitals.emotion), value: vitals.emotion || 'N/A', label: "Emotion", delay: 0.3 },
  ];

  return (
    <div className="rounded-[20px] bg-surface border border-border p-6 shadow-sm">
      <h3 className="text-[16px] font-bold text-text-main mb-4">Your Daily Vitals</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {vitalsData.map((item, idx) => (
          <VitalsItem key={idx} {...item} />
        ))}
      </div>
    </div>
  );
};

export default DailyVitalsCard;