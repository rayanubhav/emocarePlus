import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../contexts/AuthContext';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeProvider';
import { FaVideo, FaUserMd } from 'react-icons/fa';

const TeleTherapy = ({ onBack }) => {
  const { user, socket } = useAuth();
  const { isDarkMode } = useTheme();
  const [status, setStatus] = useState('idle');
  const [roomID, setRoomID] = useState(null);
  const [reqID, setReqID] = useState(null);
  const [waitSeconds, setWaitSeconds] = useState(0);
  const waitTimer = useRef(null);

  // Fetch the user's latest stress/emotion from localStorage or context
  const getLatestMetrics = () => {
    try {
      const stressData = JSON.parse(localStorage.getItem('latest_stress') || '{}');
      const emotionData = JSON.parse(localStorage.getItem('latest_emotion') || '{}');
      return {
        stress_score: stressData.score ?? null,
        emotion: emotionData.label ?? null,
      };
    } catch {
      return { stress_score: null, emotion: null };
    }
  };

  const requestHelp = async () => {
    setStatus('waiting');
    setWaitSeconds(0);
    try {
      const metrics = getLatestMetrics();
      const res = await api.post('/api/consultation/request', {
        stress_score: metrics.stress_score,
        emotion: metrics.emotion,
      });
      const data = res.data;
      setRoomID(data.room_id);
      setReqID(data.request_id);

      // Emit real-time alert for therapists via WebSocket
      if (socket) {
        socket.emit('request_help', {
          user_id: user.id,
          user_name: user.name,
          room_id: data.room_id,
          stress_score: metrics.stress_score,
          emotion: metrics.emotion,
        });
      }
    } catch (err) {
      console.error(err);
      setStatus('idle');
    }
  };

  // Listen for real-time acceptance via WebSocket instead of polling
  useEffect(() => {
    if (status === 'waiting' && socket) {
      const handleAccepted = (data) => {
        if (data.request_id === reqID || data.room_id === roomID) {
          setStatus('connected');
        }
      };
      socket.on('consultation_accepted', handleAccepted);
      return () => socket.off('consultation_accepted', handleAccepted);
    }
  }, [status, socket, reqID, roomID]);

  // Fallback polling in case WebSocket event is missed
  useEffect(() => {
    let interval = null;
    if (status === 'waiting' && reqID) {
      interval = setInterval(async () => {
        try {
          const res = await api.get(`/api/consultation/status/${reqID}`);
          if (res.data.status === 'accepted') {
            setStatus('connected');
            clearInterval(interval);
          }
        } catch (e) {
          console.log('Polling error', e);
        }
      }, 5000); // Reduced frequency since WebSocket is primary
    }
    return () => clearInterval(interval);
  }, [status, reqID]);

  // Wait timer for UI feedback
  useEffect(() => {
    if (status === 'waiting') {
      waitTimer.current = setInterval(() => setWaitSeconds((s) => s + 1), 1000);
    } else {
      clearInterval(waitTimer.current);
    }
    return () => clearInterval(waitTimer.current);
  }, [status]);

  const formatWait = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return m > 0 ? `${m}m ${sec}s` : `${sec}s`;
  };

  // Compute a gentle progress bar (caps at ~5 minutes)
  const progressPct = Math.min((waitSeconds / 300) * 100, 95);

  const bgClass = isDarkMode ? 'bg-[#0F172A]' : 'bg-surface';
  const borderClass = isDarkMode ? 'border-slate-700' : 'border-border';
  const headerBg = isDarkMode ? 'bg-[#1E293B]' : 'bg-surface-light';
  const textMain = isDarkMode ? 'text-slate-100' : 'text-text-main';
  const textMuted = isDarkMode ? 'text-slate-400' : 'text-text-muted';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`h-full flex flex-col ${bgClass} rounded-[24px] overflow-hidden border ${borderClass}`}
    >
      {/* Header */}
      <div className={`${headerBg} p-4 flex justify-between items-center border-b ${borderClass}`}>
        <h3 className={`text-[16px] font-bold ${textMain} flex items-center gap-2`}>
          <div
            className={`w-2 h-2 rounded-full ${
              status === 'connected'
                ? 'bg-[#72C5A8]'
                : status === 'waiting'
                ? 'bg-[#F5D88A] animate-pulse'
                : isDarkMode
                ? 'bg-slate-600'
                : 'bg-[#D9E6F2]'
            }`}
          />
          {status === 'connected' ? 'Connected' : status === 'waiting' ? 'Finding Therapist...' : 'Tele-Therapy'}
        </h3>
        <button
          onClick={onBack}
          className={`text-[12px] font-medium ${textMuted} hover:text-[#5B9BD5] transition-colors`}
        >
          {status === 'connected' ? 'End Session' : '\u2190 Back to Map'}
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center max-w-sm flex flex-col items-center"
            >
              <div
                className={`w-24 h-24 rounded-full ${
                  isDarkMode ? 'bg-[#1E3A5F] border-[#5B9BD5]' : 'bg-[#D6EAFC] border-[#5B9BD5]'
                } border-2 flex items-center justify-center mb-6`}
              >
                <FaUserMd className="text-[40px] text-[#5B9BD5]" />
              </div>
              <h2 className={`text-[20px] font-bold ${textMain} mb-2`}>Connect with a Specialist</h2>
              <p className={`text-[13px] ${textMuted} mb-8 leading-[1.6]`}>
                Instant secure video consultation with an available professional.
              </p>
              <button
                onClick={requestHelp}
                className="bg-[#5B9BD5] hover:bg-[#4A88C0] text-white px-8 py-3.5 rounded-full text-[15px]
                           font-bold transition-all shadow-[0_4px_16px_rgba(91,155,213,0.3)] flex items-center gap-2 mx-auto"
              >
                <FaVideo /> Start Video Session
              </button>
            </motion.div>
          )}

          {status === 'waiting' && (
            <motion.div
              key="waiting"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center flex flex-col items-center w-full max-w-sm"
            >
              <div
                className={`w-20 h-20 rounded-full border-[3px] ${
                  isDarkMode ? 'border-[#1E3A5F]' : 'border-[#D6EAFC]'
                } border-t-[#5B9BD5] animate-spin mb-6`}
              />
              <h2 className={`text-[20px] font-bold ${textMain} mb-2`}>Finding a Match</h2>
              <p className={`text-[13px] ${textMuted} mb-4`}>Specialists have been notified of your request.</p>

              {/* Progress bar */}
              <div className={`w-full rounded-full h-2 ${isDarkMode ? 'bg-slate-700' : 'bg-[#E8F0F8]'} overflow-hidden mb-3`}>
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#5B9BD5] to-[#72C5A8]"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progressPct}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              <p className={`text-[11px] font-medium ${textMuted}`}>
                Waiting time: <span className={textMain}>{formatWait(waitSeconds)}</span>
              </p>
              <p className={`text-[10px] ${textMuted} mt-1`}>Average connection time: ~2 minutes</p>
            </motion.div>
          )}

          {status === 'connected' && (
            <motion.div
              key="connected"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`absolute inset-0 ${isDarkMode ? 'bg-[#0B1120]' : 'bg-[#1A2535]'}`}
            >
              <iframe
                src={`https://meet.jit.si/${roomID}#config.prejoinPageEnabled=false`}
                className="w-full h-full border-0"
                allow="camera; microphone; fullscreen; display-capture; autoplay"
                title="Therapy Session"
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default TeleTherapy;