import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../contexts/AuthContext';
import { FaSpinner } from 'react-icons/fa';
import { RiPlayFill, RiSeedlingLine } from 'react-icons/ri';
import { motion, AnimatePresence } from 'framer-motion';

const tabs = ['Beginner', 'Intermediate', 'Advanced'];

/*
 * WHY for each change:
 * - Container: dark surface → white rounded-2xl card with border
 * - Tabs: border-white/10 → border-[#D9E6F2], active underline keeps primary color
 * - List items: bg-black/20 → #F7FAFC with soft border that reveals primary blue on hover
 * - Icons: primary neon → secondary sage green (feels natural, not clinical)
 * - Play icon: muted text, turns primary on hover — subtle progressive disclosure
 * - Empty state: bare text → centered friendly message with icon
 */

const MeditationsScreen = () => {
  const [isLoading, setIsLoading]   = useState(true);
  const [meditations, setMeditations] = useState({ Beginner: [], Intermediate: [], Advanced: [] });
  const [activeTab, setActiveTab]   = useState(tabs[0]);
  const [error, setError]           = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeditations = async () => {
      try {
        const response = await api.get('/api/meditations');
        const sorted = { Beginner: [], Intermediate: [], Advanced: [] };
        response.data.forEach((med) => {
          if (sorted[med.category]) sorted[med.category].push(med);
        });
        setMeditations(sorted);
      } catch (err) {
        setError('Could not fetch meditations.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMeditations();
  }, []);

  const renderList = (list) => {
    if (list.length === 0) {
      return (
        /* WHY: Friendly empty state — not just muted text, a centered message with an icon */
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <span className="mb-3 text-4xl opacity-30">🧘</span>
          <p className="text-sm font-medium text-[#7A90A4]">No meditations here yet.</p>
          <p className="mt-1 text-xs text-[#7A90A4]">Check back soon!</p>
        </div>
      );
    }

    return (
      <ul className="space-y-2">
        {list.map((med) => (
          <motion.li
            key={med._id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => navigate(`/meditations/${med._id}`)}
            /*
             * WHY: bg-black/20 hover:bg-black/40 → #F7FAFC with a 1.5px border that
             * transitions to primary blue on hover. Invisible borders that reveal
             * on interaction create depth without visual clutter.
             */
            className="group flex cursor-pointer items-center justify-between
                       rounded-2xl bg-[#F7FAFC] border border-[#D9E6F2] px-4 py-4
                       transition-all hover:border-[#5B9BD5] hover:bg-[#EEF6FC]
                       hover:shadow-sm hover:shadow-[#5B9BD5]/08"
          >
            <div className="flex items-center gap-4">
              {/* WHY: Icon was primary neon color on dark bg — now sage green (calming, natural) */}
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center
                              rounded-xl bg-[#D4F2E8] border border-[#A8D9C2]">
                <RiSeedlingLine size={20} className="text-[#3A9A7A]" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-[#2D3E50]">{med.title}</h3>
                <p className="mt-0.5 text-xs text-[#7A90A4] leading-relaxed">
                  {med.description}
                </p>
              </div>
            </div>

            {/* WHY: Play icon is muted by default, turns primary on hover —
                progressive disclosure, doesn't compete with the title */}
            <RiPlayFill
              size={22}
              className="flex-shrink-0 text-[#B0C4D8] transition-colors
                         group-hover:text-[#5B9BD5]"
            />
          </motion.li>
        ))}
      </ul>
    );
  };

  return (
    /*
     * WHY: Removed dark bg-[var(--color-surface)]. White card with border.
     * Consistent with every other screen in the calming palette.
     */
    <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl
                    bg-white border border-[#D9E6F2]"
         style={{ boxShadow: '0 2px 16px rgba(91,155,213,0.07)' }}>

      {/* Header */}
      <div className="px-6 pt-6 pb-2">
        <h2 className="text-xl font-bold text-[#2D3E50]">Meditations Library</h2>
        <p className="mt-1 text-xs text-[#7A90A4]">Guided sessions for every experience level</p>
      </div>

      {/* Tab bar
          WHY: border-white/10 → border-[#D9E6F2]. Active underline stays primary blue
          but now reads cleanly on white bg. Inactive tabs use muted slate. */}
      <div className="flex border-b border-[#D9E6F2] px-6 overflow-x-auto whitespace-nowrap">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`-mb-px border-b-2 px-5 py-3 text-xs font-700 tracking-wide uppercase
                        transition-colors duration-150
                        ${activeTab === tab
                          ? 'border-[#5B9BD5] text-[#5B9BD5]'
                          : 'border-transparent text-[#7A90A4] hover:text-[#2D3E50]'
                        }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-grow overflow-y-auto p-5">
        {isLoading && (
          <div className="flex h-full items-center justify-center">
            <FaSpinner className="h-8 w-8 animate-spin text-[#5B9BD5]" />
          </div>
        )}
        {error && (
          <div className="flex h-full items-center justify-center">
            <p className="rounded-xl bg-[#FDE8E8] px-5 py-3 text-sm text-[#C0504D] border border-[#F0A8A8]">
              {error}
            </p>
          </div>
        )}
        {!isLoading && !error && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.2 }}
            >
              {renderList(meditations[activeTab])}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default MeditationsScreen;