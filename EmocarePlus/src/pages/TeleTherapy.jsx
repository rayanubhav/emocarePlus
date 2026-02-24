import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../contexts/AuthContext';
import { FaVideo, FaUserMd } from 'react-icons/fa';

const TeleTherapy = ({ onBack }) => {
  const [status, setStatus] = useState("idle"); 
  const [roomID, setRoomID] = useState(null);
  const [reqID, setReqID] = useState(null);

  const requestHelp = async () => {
    setStatus("waiting");
    try {
      const res = await api.post('/api/consultation/request');
      setRoomID(res.data.room_id);
      setReqID(res.data.request_id);
    } catch (err) {
      console.error(err);
      setStatus("idle");
    }
  };

  useEffect(() => {
    let interval = null;
    if (status === "waiting" && reqID) {
      interval = setInterval(async () => {
        try {
          const res = await api.get(`/api/consultation/status/${reqID}`);
          if (res.data.status === "accepted") {
            setStatus("connected");
            clearInterval(interval);
          }
        } catch (e) { console.log("Polling error", e); }
      }, 2000); 
    }
    return () => clearInterval(interval);
  }, [status, reqID]);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="h-full flex flex-col bg-white rounded-[24px] overflow-hidden border border-[#D9E6F2]">
      
      {/* Header */}
      <div className="bg-[#F7FAFC] p-4 flex justify-between items-center border-b border-[#D9E6F2]">
        <h3 className="text-[16px] font-bold text-[#2D3E50] flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${status === 'connected' ? 'bg-[#72C5A8]' : status === 'waiting' ? 'bg-[#F5D88A] animate-pulse' : 'bg-[#D9E6F2]'}`} /> 
            {status === 'connected' ? 'Connected' : status === 'waiting' ? 'Finding Therapist...' : 'Tele-Therapy'}
        </h3>
        <button onClick={onBack} className="text-[12px] font-medium text-[#7A90A4] hover:text-[#5B9BD5] transition-colors">
          {status === 'connected' ? 'End Session' : '← Back to Map'}
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-8 relative">
        
        {/* STATE 1: IDLE */}
        {status === "idle" && (
          <div className="text-center max-w-sm flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-[#D6EAFC] border-2 border-[#5B9BD5] flex items-center justify-center mb-6">
                <FaUserMd className="text-[40px] text-[#5B9BD5]" />
            </div>
            <h2 className="text-[20px] font-bold text-[#2D3E50] mb-2">Connect with a Specialist</h2>
            <p className="text-[13px] text-[#7A90A4] mb-8 leading-[1.6]">
                Skip the travel. Get matched with an available therapist for an instant secure video consultation.
            </p>
            <button 
              onClick={requestHelp}
              className="bg-[#5B9BD5] hover:bg-[#4A88C0] text-white px-8 py-3.5 rounded-full text-[15px] font-bold transition-all shadow-[0_4px_16px_rgba(91,155,213,0.3)] hover:shadow-[0_6px_20px_rgba(91,155,213,0.35)] hover:-translate-y-[2px] flex items-center gap-2 mx-auto"
            >
              <FaVideo /> Start Video Session
            </button>
          </div>
        )}

        {/* STATE 2: WAITING */}
        {status === "waiting" && (
          <div className="text-center flex flex-col items-center">
            <div className="w-20 h-20 rounded-full border-[3px] border-[#D6EAFC] border-t-[#5B9BD5] animate-spin mb-6" />
            <h2 className="text-[20px] font-bold text-[#2D3E50] mb-2">Finding a Match</h2>
            <p className="text-[13px] text-[#7A90A4] max-w-xs mb-8">Please wait while we connect you to the next available professional.</p>
            <div className="text-[11px] text-[#7A90A4] px-4 py-2 bg-[#F7FAFC] border border-[#D9E6F2] rounded-lg">
              Do not close this window
            </div>
          </div>
        )}

        {/* STATE 3: CONNECTED */}
        {status === "connected" && (
          <div className="absolute inset-0 bg-[#1A2535]">
            <iframe 
              src={`https://meet.jit.si/${roomID}#config.prejoinPageEnabled=false`} 
              className="w-full h-full border-0"
              allow="camera; microphone; fullscreen; display-capture; autoplay"
              title="Therapy Session"
            ></iframe>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TeleTherapy;