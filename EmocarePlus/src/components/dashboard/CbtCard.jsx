import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RiPsychotherapyLine } from 'react-icons/ri';

const CbtCard = ({ latestRecord }) => {
  const navigate = useNavigate();

  return (
    <div className="rounded-xl bg-[var(--color-surface)] p-6 shadow-lg">
      <h3 className="text-xl font-bold text-white">
        Challenge a Negative Thought
      </h3>
      <p className="mt-2 h-12 text-[var(--color-text-muted)] overflow-hidden">
        {latestRecord
          ? `Your last reframed thought: "${latestRecord.alternative_thought}"`
          : 'A simple exercise to reframe unhelpful thinking patterns.'}
      </p>
      <button
        onClick={() => navigate('/cbt')}
        className="btn btn-primary mt-6 flex w-full items-center justify-center gap-2"
      >
        <RiPsychotherapyLine size={20} />
        Start a Thought Record
      </button>
    </div>
  );
};

export default CbtCard;