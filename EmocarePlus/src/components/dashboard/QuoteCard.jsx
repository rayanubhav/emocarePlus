import React from 'react';
import { RiDoubleQuotesL } from 'react-icons/ri';

const QuoteCard = ({ quote }) => {
  return (
    <div className="rounded-xl bg-[var(--color-surface)] p-6 shadow-lg">
      <div className="flex flex-col items-center">
        <RiDoubleQuotesL size={30} className="text-[var(--color-secondary)]" />
        <p className="mt-2 text-center text-lg italic text-white/90">
          "{quote}"
        </p>
      </div>
    </div>
  );
};

export default QuoteCard;