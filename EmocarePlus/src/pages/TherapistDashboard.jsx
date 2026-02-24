import React, { useState, useEffect } from 'react';
import api from '../contexts/AuthContext';
import { FaUserCircle, FaVideo, FaSpinner } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';


const TherapistDashboard = () => {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshQueue = async () => {
    try {
      const res = await api.get('/api/therapist/queue');
      setQueue(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshQueue();
    const interval = setInterval(refreshQueue, 5000);
    return () => clearInterval(interval);
  }, []);

  const acceptCall = async (reqId, roomId) => {
    await api.post('/api/therapist/accept', { request_id: reqId });
    window.open(`https://meet.jit.si/${roomId}#config.prejoinPageEnabled=false`, '_blank');
    refreshQueue();
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl bg-surface
                    border border-border"
      style={{ boxShadow: '0 2px 16px rgba(91,155,213,0.07)' }}>

      {/* Header */}
      <header className="flex items-center justify-between border-b border-border px-7 py-5
                         bg-gradient-to-r from-[#D6EAFC]/50 to-[#D4F2E8]/50">
        <div>
          <h1 className="flex items-center gap-3 text-xl font-bold text-text-main">
            <FaUserCircle className="text-[#5B9BD5]" size={24} />
            Therapist Portal
          </h1>
          <p className="mt-1 text-xs text-text-muted">Manage incoming consultation requests</p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-[#72C5A8]
                        bg-[#D4F2E8] px-4 py-1.5 text-xs font-bold text-[#3A9A7A]">
          <div className="h-2 w-2 animate-pulse rounded-full bg-[#72C5A8]" />
          Online & Receiving
        </div>
      </header>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-6">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <FaSpinner className="animate-spin text-4xl text-[#5B9BD5]" />
          </div>

        ) : queue.length === 0 ? (
          <div className="flex h-full items-center justify-center">
            <div className="rounded-2xl border border-dashed border-border bg-surface-light
                            px-12 py-16 text-center">
              <div className="mb-3 text-5xl opacity-30">🕊️</div>
              <p className="text-sm font-semibold text-text-main">No patients waiting</p>
              <p className="mt-2 text-xs text-text-muted">
                New requests will appear here automatically.
              </p>
            </div>
          </div>

        ) : (
          <div className="flex flex-col gap-3">
            <AnimatePresence>
              {queue.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center justify-between rounded-2xl
                             bg-surface-light border border-border px-5 py-4
                             transition-all hover:border-[#5B9BD5] hover:shadow-sm
                             hover:shadow-[#5B9BD5]/08"
                >
                  <div>
                    <h3 className="flex items-center gap-2 text-base font-bold text-text-main">
                      {item.user_name}
                      <span className="rounded-full bg-[#D6EAFC] px-2.5 py-0.5 text-[10px]
                                       font-bold uppercase tracking-wide text-[#5B9BD5]">
                        New
                      </span>
                    </h3>
                    <p className="mt-1 text-xs text-text-muted">
                      ⏳ Waiting since: {new Date(item.wait_time).toLocaleTimeString()}
                    </p>
                  </div>

                  <button
                    onClick={() => acceptCall(item.id, item.room_id)}
                    className="flex items-center gap-2 rounded-xl bg-[#72C5A8] px-5 py-2.5
                               text-sm font-bold text-white transition-all
                               hover:bg-[#5DAED2] hover:-translate-y-0.5"
                    style={{ boxShadow: '0 3px 10px rgba(114,197,168,0.30)' }}
                  >
                    <FaVideo size={14} /> Accept & Join
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default TherapistDashboard;