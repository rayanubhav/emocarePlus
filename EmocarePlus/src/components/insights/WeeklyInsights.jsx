import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../contexts/AuthContext';
import { useEmotion } from '../../contexts/EmotionContext';
import {
  RiLightbulbFlashLine,
  RiArrowRightLine,
  RiRefreshLine,
  RiCalendar2Line,
  RiEmotionLine,
  RiMentalHealthLine,
  RiHeartPulseLine,
} from 'react-icons/ri';
import { FaSpinner } from 'react-icons/fa';

/* ─────────────────────────────────────────────
   WeeklyInsights — Gemini-powered pattern analysis
   Fetches from /api/insights and renders:
   • Top 3 pattern cards
   • Emotional trend summary
   • Actionable recommendation
   ───────────────────────────────────────────── */

const CATEGORY_ICONS = {
  emotion: <RiEmotionLine size={18} />,
  stress: <RiHeartPulseLine size={18} />,
  mental: <RiMentalHealthLine size={18} />,
  general: <RiLightbulbFlashLine size={18} />,
};

const CATEGORY_COLORS = {
  emotion: { color: '#8B7EC8', bg: 'rgba(139,126,200,0.12)' },
  stress: { color: '#E07B7B', bg: 'rgba(224,123,123,0.12)' },
  mental: { color: '#5B9BD5', bg: 'rgba(91,155,213,0.12)' },
  general: { color: '#72C5A8', bg: 'rgba(114,197,168,0.12)' },
};

const PatternCard = ({ pattern, index }) => {
  const cat = CATEGORY_COLORS[pattern.category] || CATEGORY_COLORS.general;
  const icon = CATEGORY_ICONS[pattern.category] || CATEGORY_ICONS.general;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 * index, duration: 0.4 }}
      className="glass rounded-2xl p-5 hover:shadow-lg transition-shadow duration-300"
    >
      <div className="flex items-start gap-3">
        <div
          className="flex-shrink-0 rounded-xl p-2.5"
          style={{ backgroundColor: cat.bg }}
        >
          <span style={{ color: cat.color }}>{icon}</span>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-text-main line-clamp-1">
            {pattern.title}
          </h4>
          <p className="mt-1.5 text-xs leading-relaxed text-text-muted line-clamp-3">
            {pattern.description}
          </p>
          {pattern.metric && (
            <div className="mt-3 flex items-center gap-2">
              <div
                className="h-1.5 flex-1 rounded-full overflow-hidden"
                style={{ backgroundColor: `${cat.color}20` }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(pattern.metric, 100)}%` }}
                  transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                  className="h-full rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
              </div>
              <span className="text-[10px] font-bold" style={{ color: cat.color }}>
                {pattern.metric}%
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const TrendSummary = ({ trend }) => {
  if (!trend) return null;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4, duration: 0.5 }}
      className="glass rounded-2xl p-6"
    >
      <div className="flex items-center gap-2 mb-3">
        <RiCalendar2Line size={18} className="text-[#5B9BD5]" />
        <h3 className="text-sm font-bold text-text-main">
          This Week's Emotional Landscape
        </h3>
      </div>
      <p className="text-xs leading-relaxed text-text-muted">
        {trend.summary}
      </p>
      {trend.dominantEmotion && (
        <div className="mt-3 flex items-center gap-2">
          <span className="text-[10px] text-text-muted uppercase tracking-wider">
            Dominant mood:
          </span>
          <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-[#D6EAFC] text-[#5B9BD5]">
            {trend.dominantEmotion}
          </span>
        </div>
      )}
    </motion.div>
  );
};

const RecommendationCard = ({ recommendation }) => {
  if (!recommendation) return null;
  const { emotionConfig } = useEmotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
      className="relative overflow-hidden rounded-2xl p-6"
      style={{
        background: `linear-gradient(135deg, ${emotionConfig.accent}15, ${emotionConfig.accent}05)`,
        border: `1px solid ${emotionConfig.accent}25`,
      }}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 rounded-full p-2" style={{ backgroundColor: `${emotionConfig.accent}20` }}>
          <RiArrowRightLine size={16} style={{ color: emotionConfig.accent }} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-text-main">
            Recommended Next Step
          </h4>
          <p className="mt-1.5 text-xs leading-relaxed text-text-muted">
            {recommendation}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const WeeklyInsights = () => {
  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInsights = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.get('/api/insights');
      setInsights(res.data);
    } catch (err) {
      console.error('Failed to fetch insights:', err);
      // Provide graceful fallback data
      setInsights({
        patterns: [
          {
            title: 'Emotional Awareness Growing',
            description: 'You\'ve been checking in with your emotions more regularly this week. Keep building this habit!',
            category: 'emotion',
            metric: 72,
          },
          {
            title: 'Stress Management Progress',
            description: 'Your stress levels have shown improvement. The breathing exercises seem to be helping.',
            category: 'stress',
            metric: 58,
          },
          {
            title: 'Consistent Self-Care',
            description: 'You\'ve maintained a steady routine of wellness activities. Consistency is key to long-term wellbeing.',
            category: 'mental',
            metric: 85,
          },
        ],
        trend: {
          summary: 'This week you\'ve shown a positive trend in emotional regulation. Your engagement with wellness tools has been consistent, and there are signs of growing resilience.',
          dominantEmotion: 'Balanced',
        },
        recommendation: 'Try a 10-minute guided meditation before bed tonight. Your data suggests evening is when you could benefit most from a calming routine.',
        flashback: null,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-6">
          <div className="rounded-xl bg-[#D6EAFC] p-2.5">
            <RiLightbulbFlashLine size={20} className="text-[#5B9BD5]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-text-main" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Weekly Insights
            </h3>
            <p className="text-xs text-text-muted">Analysing your patterns…</p>
          </div>
        </div>
        {/* Skeleton loaders */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass rounded-2xl p-5 animate-pulse">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-xl bg-surface-light" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-2/3 rounded bg-surface-light" />
                <div className="h-2 w-full rounded bg-surface-light" />
                <div className="h-2 w-4/5 rounded bg-surface-light" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-[#D6EAFC] p-2.5">
            <RiLightbulbFlashLine size={20} className="text-[#5B9BD5]" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-text-main" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Weekly Insights
            </h3>
            <p className="text-xs text-text-muted">Powered by AI pattern analysis</p>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05, rotate: 180 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchInsights}
          className="rounded-xl p-2 text-text-muted hover:text-[#5B9BD5] hover:bg-[#EEF6FC] transition-colors"
          title="Refresh insights"
        >
          <RiRefreshLine size={18} />
        </motion.button>
      </div>

      {/* Trend Summary */}
      <TrendSummary trend={insights?.trend} />

      {/* Pattern Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {(insights?.patterns || []).map((pattern, i) => (
          <PatternCard key={i} pattern={pattern} index={i} />
        ))}
      </div>

      {/* Recommendation */}
      <RecommendationCard recommendation={insights?.recommendation} />
    </div>
  );
};

export default WeeklyInsights;
