import React from 'react';
import {
  RiHeartPulseFill,
  RiFireFill,
  RiMoonFill,
  RiEmotionHappyLine,
  RiEmotionSadLine,
  RiEmotionUnhappyLine,
  RiQuestionLine
} from 'react-icons/ri';

const VitalsItem = ({ icon, value, label, color }) => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className={`text-${color}-400`}>{icon}</div>
      <p className="mt-2 text-xl font-bold text-white">{value}</p>
      <p className="text-sm text-[var(--color-text-muted)]">{label}</p>
    </div>
  );
};

// Helper to get emotion icon
const getEmotionIcon = (emotion) => {
  switch (emotion?.toLowerCase()) {
    case 'happy': return <RiEmotionHappyLine size={30} />;
    case 'sad': return <RiEmotionSadLine size={30} />;
    case 'angry': return <RiEmotionUnhappyLine size={30} />;
    default: return <RiQuestionLine size={30} />;
  }
};

const DailyVitalsCard = ({ vitals }) => {
  return (
    <div className="rounded-xl bg-[var(--color-surface)] p-6 shadow-lg">
      <h3 className="text-xl font-bold text-white">Your Last Vitals</h3>
      <div className="mt-6 grid grid-cols-4 gap-4">
        <VitalsItem
          icon={<RiHeartPulseFill size={30} />}
          value={vitals.heartRate}
          label="bpm"
          color="red"
        />
        <VitalsItem
          icon={<RiFireFill size={30} />}
          value={vitals.steps}
          label="Steps"
          color="[var(--color-secondary)]" // Use Tailwind's arbitrary value syntax
        />
        <VitalsItem
          icon={<RiMoonFill size={30} />}
          value={vitals.sleep}
          label="Hours"
          color="[var(--color-primary)]"
        />
        <VitalsItem
          icon={getEmotionIcon(vitals.emotion)}
          value={vitals.emotion || 'N/A'}
          label="Emotion"
          color="yellow"
        />
      </div>
    </div>
  );
};

export default DailyVitalsCard;