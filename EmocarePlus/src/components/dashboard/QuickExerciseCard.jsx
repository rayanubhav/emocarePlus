import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RiPlayFill } from 'react-icons/ri';

const QuickExerciseCard = () => {
  const navigate = useNavigate();

  return (
    <div className="rounded-xl bg-[var(--color-secondary)] p-6 shadow-lg">
      <h3 className="text-xl font-bold text-white">
        Feeling Overwhelmed?
      </h3>
      <p className="mt-2 text-white/90">
        Take a moment to reset and find your calm.
      </p>
      <button
        onClick={() => navigate('/breathing')}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-white px-4 py-3 font-semibold text-black/80 transition-transform hover:scale-105"
      >
        <RiPlayFill size={22} />
        Start Breathing Exercise
      </button>
    </div>
  );
};

export default QuickExerciseCard;