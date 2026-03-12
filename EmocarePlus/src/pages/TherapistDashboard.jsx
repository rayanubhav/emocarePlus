import React, { useState, useEffect } from 'react';
import api from '../contexts/AuthContext';
import { useAuth } from '../contexts/AuthContext';
import {
  FaUserCircle, FaVideo, FaSpinner, FaChartLine, FaBell, FaBellSlash,
  FaSignOutAlt, FaExclamationTriangle,
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const TherapistDashboard = () => {
  const { socket, logout, user } = useAuth();
  const navigate = useNavigate();
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(
    typeof Notification !== 'undefined' && Notification.permission === 'granted'
  );

  // ── Priority logic based on stress score ──
  const getPriorityInfo = (score) => {
    if (score === 'N/A' || score == null) return { label: 'Unknown', color: 'bg-gray-100 text-gray-600', border: 'border-gray-200', dot: 'bg-gray-400' };
    const n = parseInt(score);
    if (n >= 7) return { label: 'High Priority', color: 'bg-red-100 text-red-700', border: 'border-red-300', dot: 'bg-red-500' };
    if (n >= 4) return { label: 'Moderate', color: 'bg-amber-100 text-amber-700', border: 'border-amber-300', dot: 'bg-amber-500' };
    return { label: 'Stable', color: 'bg-green-100 text-green-700', border: 'border-green-300', dot: 'bg-green-500' };
  };

  // ── Emotion badge styling ──
  const getEmotionStyle = (emotion) => {
    const map = {
      sadness: 'bg-blue-100 text-blue-700',
      anxiety: 'bg-purple-100 text-purple-700',
      anger: 'bg-red-100 text-red-700',
      happy: 'bg-emerald-100 text-emerald-700',
      fear: 'bg-orange-100 text-orange-700',
      neutral: 'bg-slate-100 text-slate-600',
    };
    return map[(emotion || '').toLowerCase()] || 'bg-slate-100 text-slate-600';
  };

  const refreshQueue = async () => {
    try {
      const res = await api.get('/api/therapist/queue');
      setQueue(res.data);
    } catch (err) {
      console.error('Queue fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // ── Notification toggle ──
  const toggleNotifications = async () => {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'granted') {
      // Can't revoke programmatically, but we track preference locally
      setNotificationsEnabled((prev) => !prev);
      return;
    }
    if (Notification.permission === 'default') {
      const perm = await Notification.requestPermission();
      setNotificationsEnabled(perm === 'granted');
    }
  };

  useEffect(() => {
    refreshQueue();

    // Request notification permission on mount
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then((p) => setNotificationsEnabled(p === 'granted'));
    }

    if (socket) {
      socket.on('new_patient_waiting', (data) => {
        refreshQueue();

        // Browser notification
        if (notificationsEnabled && Notification.permission === 'granted') {
          new Notification(`New Request: ${data.user_name}`, {
            body: `Stress Level: ${data.stress_score ?? 'N/A'} | Emotion: ${data.emotion ?? 'N/A'}`,
            icon: '/logo192.png',
          });
        }
      });
    }

    return () => {
      if (socket) socket.off('new_patient_waiting');
    };
  }, [socket, notificationsEnabled]);

  const acceptCall = async (reqId, roomId) => {
    try {
      await api.post('/api/therapist/accept', { request_id: reqId });
      window.open(`https://meet.jit.si/${roomId}#config.prejoinPageEnabled=false`, '_blank');
      refreshQueue();
    } catch (err) {
      console.error('Failed to accept call:', err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div
      className="flex h-screen flex-col overflow-hidden bg-slate-50"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      {/* ═══ Specialist Header ═══ */}
      <header className="flex items-center justify-between border-b border-slate-200 px-6 md:px-8 py-5 bg-white shadow-sm">
        <div>
          <h1 className="flex items-center gap-3 text-xl md:text-2xl font-bold text-slate-800">
            <FaUserCircle className="text-[#5B9BD5]" size={28} />
            Clinical Intake Portal
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Welcome back, <span className="font-semibold text-slate-700">{user?.name || 'Doctor'}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Notification Toggle */}
          <button
            onClick={toggleNotifications}
            title={notificationsEnabled ? 'Notifications ON' : 'Notifications OFF'}
            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all
              ${notificationsEnabled
                ? 'border-[#5B9BD5] bg-[#EEF6FC] text-[#5B9BD5] hover:bg-[#D6EAFC]'
                : 'border-slate-200 bg-white text-slate-400 hover:bg-slate-50'
              }`}
          >
            {notificationsEnabled ? <FaBell size={14} /> : <FaBellSlash size={14} />}
            <span className="hidden sm:inline">{notificationsEnabled ? 'Alerts ON' : 'Alerts OFF'}</span>
          </button>

          {/* Status pill */}
          <div className="flex items-center gap-2 rounded-full border border-[#72C5A8] bg-[#D4F2E8]/40 px-4 py-2 text-sm font-bold text-[#3A9A7A]">
            <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-[#3A9A7A]" />
            <span className="hidden sm:inline">Active</span>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm
                       font-semibold text-slate-500 hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all"
          >
            <FaSignOutAlt size={14} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* ═══ Queue Summary Bar ═══ */}
      {!loading && queue.length > 0 && (
        <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 md:px-8 py-3">
          <div className="flex items-center gap-4">
            <h2 className="text-base font-bold text-slate-700">Active Queue</h2>
            <span className="flex items-center gap-1.5 rounded-full bg-[#5B9BD5]/10 px-3 py-1 text-xs font-bold text-[#5B9BD5]">
              {queue.length} patient{queue.length !== 1 ? 's' : ''} waiting
            </span>
            {queue.some((i) => parseInt(i.stress_score) >= 7) && (
              <span className="flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                <FaExclamationTriangle size={10} /> High priority in queue
              </span>
            )}
          </div>
          <span className="text-xs text-slate-400">Oldest requests appear first</span>
        </div>
      )}

      {/* ═══ Main Content ═══ */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8">
        {loading ? (
          <div className="flex h-full flex-col items-center justify-center gap-4">
            <FaSpinner className="animate-spin text-5xl text-[#5B9BD5]" />
            <p className="text-slate-500 font-medium">Synchronizing clinic data...</p>
          </div>
        ) : queue.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md rounded-3xl border-2 border-dashed border-slate-200 bg-white p-12 text-center"
            >
              <div className="mb-4 text-6xl">{'\u2728'}</div>
              <h2 className="text-xl font-bold text-slate-800">No Pending Requests</h2>
              <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                The waiting room is currently empty. You will be notified immediately when a patient requests a consultation.
              </p>
            </motion.div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 max-w-4xl mx-auto">
            <AnimatePresence>
              {queue.map((item) => {
                const priority = getPriorityInfo(item.stress_score);
                const emotionClass = getEmotionStyle(item.emotion);
                const waitMins = Math.floor((new Date() - new Date(item.wait_time)) / 60000);

                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className={`flex flex-col md:flex-row md:items-center justify-between rounded-2xl bg-white border-2 ${priority.border}
                                p-5 md:p-6 transition-all hover:shadow-lg`}
                  >
                    <div className="flex items-center gap-4 md:gap-6">
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center text-[#5B9BD5] font-bold text-xl border border-slate-200">
                          {item.user_name?.charAt(0) || '?'}
                        </div>
                        <div className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-white ${priority.dot}`} />
                      </div>

                      {/* Patient info */}
                      <div className="space-y-1.5">
                        <h3 className="text-base md:text-lg font-bold text-slate-800 flex flex-wrap items-center gap-2">
                          {item.user_name}
                          <span
                            className={`text-[10px] uppercase tracking-widest px-2.5 py-0.5 rounded-md font-black ${priority.color}`}
                          >
                            {priority.label}
                          </span>
                        </h3>

                        {/* Metrics row */}
                        <div className="flex flex-wrap items-center gap-3 text-sm font-medium">
                          <span className="flex items-center gap-1.5 text-slate-500">
                            <FaChartLine size={12} /> Stress:
                            <span className="text-slate-900 font-bold">{item.stress_score ?? 'N/A'}/10</span>
                          </span>
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold ${emotionClass}`}>
                            {item.emotion || 'Unknown'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-row md:flex-col items-center md:items-end gap-3 mt-4 md:mt-0">
                      <p className="text-xs text-slate-400 font-medium">
                        Waiting {waitMins > 0 ? `${waitMins} min${waitMins !== 1 ? 's' : ''}` : 'just now'}
                      </p>
                      <button
                        onClick={() => acceptCall(item.id, item.room_id)}
                        className="flex items-center gap-2 rounded-xl bg-[#5B9BD5] px-5 md:px-6 py-2.5 md:py-3 text-sm font-bold
                                   text-white transition-all hover:bg-[#4A88C0] hover:scale-[1.02] active:scale-[0.98]
                                   shadow-md shadow-[#5B9BD5]/20"
                      >
                        <FaVideo size={16} /> Accept
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default TherapistDashboard;