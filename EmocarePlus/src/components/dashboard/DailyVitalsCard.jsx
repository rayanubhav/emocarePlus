import React from 'react';
import { motion } from 'framer-motion';
import {
  RiHeartPulseFill, RiFireFill, RiMoonFill,
  RiEmotionHappyLine, RiEmotionSadLine, RiEmotionUnhappyLine, RiQuestionLine,
} from 'react-icons/ri';

const VitalsItem = ({ icon, value, label, delay, accentColor }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.4 }}
    whileHover={{ y: -4, scale: 1.02 }}
    className="bento-card flex flex-col items-center rounded-[18px] glass p-5 text-center"
  >
    <div className="text-[28px] mb-2 drop-shadow-sm">{icon}</div>
    <p className="text-[22px] font-bold text-text-main tracking-tight">{value}</p>
    <p className="text-[10px] font-semibold tracking-[0.12em] uppercase text-text-muted mt-1.5">{label}</p>
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

const DailyVitalsCard = ({ vitals, accentColor }) => {
  const vitalsData = [
    { icon: <RiHeartPulseFill className="text-red-400" />, value: vitals.heartRate, label: "bpm", delay: 0 },
    { icon: <RiFireFill className="text-orange-400" />, value: vitals.steps, label: "Steps", delay: 0.1 },
    { icon: <RiMoonFill className="text-indigo-400" />, value: vitals.sleep, label: "Hours", delay: 0.2 },
    { icon: getEmotionIcon(vitals.emotion), value: vitals.emotion || 'N/A', label: "Emotion", delay: 0.3 },
  ];

  return (
    <div className="rounded-[20px] bg-surface border border-border p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <div
          className="w-1 h-5 rounded-full"
          style={{ backgroundColor: accentColor || 'var(--primary)' }}
        />
        <h3 className="text-[16px] font-bold text-text-main">Your Daily Vitals</h3>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {vitalsData.map((item, idx) => (
          <VitalsItem key={idx} {...item} accentColor={accentColor} />
        ))}
      </div>
    </div>
  );
};

export default DailyVitalsCard;