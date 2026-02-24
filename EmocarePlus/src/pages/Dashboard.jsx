import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { FaSpinner } from 'react-icons/fa';

import QuickExerciseCard from '../components/dashboard/QuickExerciseCard';
import QuoteCard from '../components/dashboard/QuoteCard';
import CbtCard from '../components/dashboard/CbtCard';
import DailyVitalsCard from '../components/dashboard/DailyVitalsCard';
import StressCharts from '../components/dashboard/StressCharts';

const quotes = [
  "The best way to predict the future is to create it.",
  "Believe you can and you're halfway there.",
  "Your limitation is only your imagination."
];

const Dashboard = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [lastEmotion, setLastEmotion] = useState(null);
  const [motivationalQuote, setMotivationalQuote] = useState('');
  const [latestCbtRecord, setLatestCbtRecord] = useState(null);
  const [vitals, setVitals] = useState({ heartRate: 'N/A', steps: 'N/A', sleep: 'N/A' });

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
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
      className="h-full overflow-y-auto space-y-8 pb-12 bg-background p-4 md:p-8"
    >
      <div className="mb-6 border-b border-border pb-4">
        <h2 className="text-[20px] font-bold text-text-main">
          Welcome back, {user?.name || 'Guest'}!
        </h2>
        <p className="text-[12px] text-text-muted mt-1">Here is your emotional wellness overview.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <QuickExerciseCard />
        <CbtCard latestRecord={latestCbtRecord} />
      </div>

      <DailyVitalsCard
        vitals={{ ...vitals, emotion: lastEmotion }}
      />

      {motivationalQuote && <QuoteCard quote={motivationalQuote} />}

      {dashboardData && (
        <StressCharts
          historyData={dashboardData.stress_history || []}
          summaryData={dashboardData.stress_summary_pie || []}
        />
      )}
    </motion.div>
  );
};

export default Dashboard;