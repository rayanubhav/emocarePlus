import React from 'react';
import { motion } from 'framer-motion';

const VitalsItem = ({ icon, value, label, gradientFrom, gradientTo, borderColor }) => (
  <motion.div
    whileHover={{ translateY: -4, boxShadow: '0 8px 24px rgba(91,155,213,0.12)' }}
    className={`flex flex-col items-center rounded-[18px] bg-gradient-to-br ${gradientFrom} ${gradientTo} border border-[${borderColor}] p-5 text-center transition-all duration-300`}
    style={{ borderColor: borderColor }}
  >
    <div className="text-[28px]">{icon}</div>
    <p className="mt-2 text-[20px] font-bold text-[#2D3E50]">{value}</p>
    <p className="mt-1 text-[10px] font-semibold tracking-[0.1em] uppercase text-[#7A90A4]">
      {label}
    </p>
  </motion.div>
);

const getEmotionEmoji = (emotion) => {
  switch (emotion?.toLowerCase()) {
    case 'happy': return '😊';
    case 'sad': return '😔';
    case 'angry': return '😠';
    default: return '😐';
  }
};

const DailyVitalsCard = ({ vitals }) => {
  const vitalsData = [
    {
      icon: "❤️",
      value: vitals.heartRate,
      label: "BPM",
      gradientFrom: "from-[#FDE8E8]",
      gradientTo: "to-[#FDF2F0]",
      borderColor: "#F5C4C4",
    },
    {
      icon: "🔥",
      value: vitals.steps,
      label: "Steps",
      gradientFrom: "from-[#FEF5D9]",
      gradientTo: "to-[#FEFAE8]",
      borderColor: "#F5DFA0",
    },
    {
      icon: "🌙",
      value: vitals.sleep,
      label: "Hours",
      gradientFrom: "from-[#EAE8FD]",
      gradientTo: "to-[#F3F0FE]",
      borderColor: "#C4BCE8",
    },
    {
      icon: getEmotionEmoji(vitals.emotion),
      value: vitals.emotion || 'N/A',
      label: "Emotion",
      gradientFrom: "from-[#D4F2E8]",
      gradientTo: "to-[#EAF7F2]",
      borderColor: "#A8D9C2",
    },
  ];

  return (
    <div className="rounded-[20px] bg-white border border-[#D9E6F2] p-6 shadow-[0_2px_16px_rgba(91,155,213,0.07)]">
      <h3 className="text-[16px] font-bold text-[#2D3E50] mb-4">Your Daily Vitals</h3>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {vitalsData.map((item, idx) => (
          <VitalsItem key={idx} {...item} />
        ))}
      </div>
    </div>
  );
};

export default DailyVitalsCard;