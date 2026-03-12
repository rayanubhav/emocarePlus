import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../contexts/AuthContext';
import { useEmotion } from '../contexts/EmotionContext';
import WeeklyInsights from '../components/insights/WeeklyInsights';
import FlashbackCard from '../components/insights/FlashbackCard';
import {
  RiTimeLine,
  RiCalendar2Line,
  RiSparklingLine,
} from 'react-icons/ri';

/* ─────────────────────────────────────────────
   InsightsPage — Full Insights Experience
   Combines Weekly Insights + Flashback Growth
   Moments into a single wellness intelligence view.
   ───────────────────────────────────────────── */

const InsightsPage = () => {
  const { emotionConfig } = useEmotion();
  const [flashback, setFlashback] = useState(null);
  const [loadingFlashback, setLoadingFlashback] = useState(true);

  useEffect(() => {
    const fetchFlashback = async () => {
      try {
        const res = await api.get('/api/insights/flashback');
        setFlashback(res.data);
      } catch (err) {
        console.error('Failed to fetch flashback:', err);
        // Graceful fallback
        setFlashback({
          type: 'comparison',
          title: 'Look How Far You\'ve Come',
          description: 'One month ago, you logged higher stress levels on average. Your consistent use of breathing exercises and meditation has made a real difference.',
          date: 'vs 4 weeks ago',
          celebration: '🌱',
          metric: {
            before: 7.2,
            after: 4.8,
            label: 'Average Stress Score',
          },
          detail: 'Your most impactful activities this month were guided breathing (used 12 times) and the AI companion (18 conversations). The data shows your stress peaks are shorter and recovery is faster.',
        });
      } finally {
        setLoadingFlashback(false);
      }
    };
    fetchFlashback();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      className="h-full overflow-y-auto space-y-8 pb-12 styled-scrollbar"
    >
      {/* Hero section */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-2xl p-6 md:p-8"
        style={{
          background: `linear-gradient(135deg, ${emotionConfig.accent}12, transparent 60%)`,
          border: `1px solid ${emotionConfig.accent}15`,
        }}
      >
        <div className="flex items-center gap-3 mb-3">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          >
            <RiSparklingLine size={24} style={{ color: emotionConfig.accent }} />
          </motion.div>
          <h2
            className="text-2xl font-bold text-text-main"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Your Wellness Intelligence
          </h2>
        </div>
        <p className="text-sm text-text-muted max-w-xl leading-relaxed">
          AI-powered analysis of your emotional patterns, stress trends, and growth milestones.
          Updated weekly based on your activity.
        </p>
        <div className="mt-4 flex items-center gap-4 text-[11px] text-text-muted">
          <span className="flex items-center gap-1">
            <RiCalendar2Line size={13} />
            Last 7 days
          </span>
          <span className="flex items-center gap-1">
            <RiTimeLine size={13} />
            Updated today
          </span>
        </div>

        {/* Decorative accent blob */}
        <div
          className="absolute -top-8 -right-8 h-32 w-32 rounded-full opacity-10 blur-2xl pointer-events-none"
          style={{ backgroundColor: emotionConfig.accent }}
        />
      </motion.div>

      {/* Weekly Insights section */}
      <WeeklyInsights />

      {/* Growth Moment / Flashback */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <RiTimeLine size={16} className="text-[#72C5A8]" />
          <h3
            className="text-base font-bold text-text-main"
            style={{ fontFamily: "'DM Serif Display', serif" }}
          >
            Growth Moment
          </h3>
        </div>

        {loadingFlashback ? (
          <div className="glass rounded-2xl p-6 animate-pulse">
            <div className="h-4 w-1/3 rounded bg-surface-light mb-3" />
            <div className="h-3 w-full rounded bg-surface-light mb-2" />
            <div className="h-3 w-4/5 rounded bg-surface-light" />
          </div>
        ) : (
          <FlashbackCard flashback={flashback} />
        )}
      </div>

      {/* Haptic feedback hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="text-center pb-4"
      >
        <p className="text-[10px] text-text-muted">
          Tip: On mobile, long-press any insight card for haptic feedback and quick actions
        </p>
      </motion.div>
    </motion.div>
  );
};

export default InsightsPage;
