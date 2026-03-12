import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { FaSpinner } from 'react-icons/fa';

import QuickExerciseCard from '../components/dashboard/QuickExerciseCard';
import QuoteCard from '../components/dashboard/QuoteCard';
import CbtCard from '../components/dashboard/CbtCard';
import DailyVitalsCard from '../components/dashboard/DailyVitalsCard';
import StressCharts from '../components/dashboard/StressCharts';
import WellnessGarden from '../components/dashboard/WellnessGarden';

const quotes = [
  "The best way to predict the future is to create it.",
  "Believe you can and you're halfway there.",
  "Your limitation is only your imagination.",
  "Breathe in courage, breathe out fear.",
  "Every day is a fresh start.",
];

const getSemanticAccent = (score) => {
  if (score === null || score === undefined) return { label: 'Neutral', color: 'var(--primary)', bg: 'var(--primary-light)' };
  if (score <= 3) return { label: 'Calm', color: 'var(--stress-low)', bg: 'var(--stress-low-bg)' };
  if (score <= 6) return { label: 'Moderate', color: 'var(--stress-mid)', bg: 'var(--stress-mid-bg)' };
  return { label: 'Elevated', color: 'var(--stress-high)', bg: 'var(--stress-high-bg)' };
};

const Dashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [lastEmotion, setLastEmotion] = useState(null);
  const [motivationalQuote, setMotivationalQuote] = useState('');
  const [latestCbtRecord, setLatestCbtRecord] = useState(null);
  const [vitals, setVitals] = useState({ heartRate: 'N/A', steps: 'N/A', sleep: 'N/A' });
  const [lastStressScore, setLastStressScore] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [apiDataRes, cbtRecordsRes] = await Promise.all([
          api.get('/api/history'),
          api.get('/api/cbt-records'),
        ]);

        const apiData = apiDataRes.data;
        const cbtRecords = cbtRecordsRes.data;
        const savedEmotion = localStorage.getItem('last_emotion');

        setDashboardData(apiData);
        setLastEmotion(savedEmotion);
        setMotivationalQuote(quotes[Math.floor(Math.random() * quotes.length)]);
        setLatestCbtRecord(cbtRecords.length > 0 ? cbtRecords[0] : null);

        if (apiData.last_stress_log) {
          setVitals({
            heartRate: apiData.last_stress_log.heart_rate?.toString() || 'N/A',
            steps: apiData.last_stress_log.steps?.toString() || 'N/A',
            sleep: apiData.last_stress_log.sleep?.toString() || 'N/A',
          });
          setLastStressScore(apiData.last_stress_log.stress_level ?? null);
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const accent = useMemo(() => getSemanticAccent(lastStressScore), [lastStressScore]);

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-background">
        <FaSpinner className="h-10 w-10 animate-spin text-[#5B9BD5]" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      className="h-full overflow-y-auto space-y-6 pb-12 bg-background p-4 md:p-8 styled-scrollbar"
    >
      {/* Header with semantic accent strip */}
      <div className="mb-2 pb-4 border-b border-border relative">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-[14px] flex items-center justify-center text-[18px] font-bold text-white shadow-sm"
            style={{ backgroundColor: accent.color }}
          >
            {(user?.name || 'G').charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-[20px] font-bold text-text-main tracking-[-0.02em]">
              Welcome back, <span className="font-serif">{user?.name || 'Guest'}</span>
            </h2>
            <p className="text-[12px] text-text-muted mt-0.5 flex items-center gap-2">
              Here is your emotional wellness overview
              <span
                className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider"
                style={{ backgroundColor: accent.bg, color: accent.color }}
              >
                {accent.label}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Bento Box Grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="bento-card">
          <QuickExerciseCard />
        </div>
        <div className="bento-card">
          <CbtCard latestRecord={latestCbtRecord} />
        </div>
      </div>

      <DailyVitalsCard
        vitals={{ ...vitals, emotion: lastEmotion }}
        accentColor={accent.color}
      />

      <WellnessGarden stressScore={lastStressScore} className="w-full" />

      {motivationalQuote && <QuoteCard quote={motivationalQuote} />}

      {dashboardData && (
        <StressCharts
          historyData={dashboardData.stress_history || []}
          summaryData={dashboardData.stress_summary_pie || []}
          accentColor={accent.color}
        />
      )}
    </motion.div>
  );
};

export default Dashboard;