import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

const CYCLES = {
  simple: [
    { text: 'Breathe In', duration: 4, scale: 1, opacity: 0.9 },
    { text: 'Breathe Out', duration: 6, scale: 0.55, opacity: 0.5 },
  ],
  box: [
    { text: 'Breathe In', duration: 4, scale: 1, opacity: 0.9 },
    { text: 'Hold', duration: 4, scale: 1, opacity: 0.9 },
    { text: 'Breathe Out', duration: 4, scale: 0.55, opacity: 0.5 },
    { text: 'Hold', duration: 4, scale: 0.55, opacity: 0.5 },
  ],
  '4-7-8': [
    { text: 'Breathe In', duration: 4, scale: 1, opacity: 0.9 },
    { text: 'Hold', duration: 7, scale: 1, opacity: 0.9 },
    { text: 'Breathe Out', duration: 8, scale: 0.55, opacity: 0.5 },
  ],
};
const DURATIONS = { '30 sec': 30, '2 min': 120, '5 min': 300, 'Until Stopped': Infinity };
const PROGRESS_INTERVAL = 100;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return null;
  return new AudioContext();
}

const Breathing = () => {
  const [activeTechnique, setActiveTechnique] = useState('simple');
  const [activeDuration, setActiveDuration] = useState(30);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [instruction, setInstruction] = useState('Ready to begin');
  const [circleStyle, setCircleStyle] = useState({
    transform: 'scale(0.55)',
    opacity: 0.5,
    transitionDuration: '4s',
  });
  const [progress, setProgress] = useState(0);
  
  const cycleTimerRef = useRef(null);
  const durationTimerRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const audioCtxRef = useRef(getAudioContext());
  const isPlayingRef = useRef(false);

  useEffect(() => {
    return () => {
      clearAllTimers();
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const playSound = () => {
    if (!isSoundEnabled || !audioCtxRef.current) return;
    try {
      if (audioCtxRef.current.state === 'suspended') audioCtxRef.current.resume();
      const oscillator = audioCtxRef.current.createOscillator();
      const gainNode = audioCtxRef.current.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtxRef.current.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(523.25, audioCtxRef.current.currentTime);
      gainNode.gain.setValueAtTime(0.1, audioCtxRef.current.currentTime);
      oscillator.start(audioCtxRef.current.currentTime);
      oscillator.stop(audioCtxRef.current.currentTime + 0.1);
    } catch (e) { console.error(e); }
  };

  const clearAllTimers = () => {
    clearTimeout(cycleTimerRef.current);
    clearTimeout(durationTimerRef.current);
    clearInterval(progressIntervalRef.current);
  };

  const runCycle = (index) => {
    if (!isPlayingRef.current) return;
    const cycle = CYCLES[activeTechnique];
    const newIndex = index % cycle.length;
    const step = cycle[newIndex];
    setInstruction(step.text);
    playSound();
    
    setCircleStyle({
      transform: `scale(${step.scale})`,
      opacity: step.opacity,
      transitionDuration: `${step.duration}s`,
      boxShadow: step.scale === 1 
        ? '0 0 0 24px rgba(114,197,168,0.12), 0 0 0 48px rgba(114,197,168,0.06)' 
        : '0 0 0 16px rgba(114,197,168,0.1), 0 0 0 32px rgba(114,197,168,0.05)'
    });
    
    cycleTimerRef.current = setTimeout(() => {
      runCycle(newIndex + 1);
    }, step.duration * 1000);
  };

  const startExercise = () => {
    if (isPlayingRef.current) return;
    isPlayingRef.current = true;
    setIsPlaying(true);
    setProgress(0);
    runCycle(0);
    if (activeDuration !== Infinity) {
      const startTime = Date.now();
      durationTimerRef.current = setTimeout(() => stopExercise(), activeDuration * 1000);
      progressIntervalRef.current = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const newProgress = (elapsedTime / (activeDuration * 1000)) * 100;
        if (!isPlayingRef.current) {
          clearInterval(progressIntervalRef.current);
          return;
        }
        if (newProgress >= 100) {
          setProgress(100);
          clearInterval(progressIntervalRef.current);
        } else {
          setProgress(newProgress);
        }
      }, PROGRESS_INTERVAL);
    }
  };

  const stopExercise = () => {
    isPlayingRef.current = false;
    setIsPlaying(false);
    clearAllTimers();
    setInstruction('Ready to begin');
    setCircleStyle({
      transform: 'scale(0.55)', opacity: 0.5, transitionDuration: '4s',
      boxShadow: '0 0 0 16px rgba(114,197,168,0.1), 0 0 0 32px rgba(114,197,168,0.05)'
    });
    setProgress(0);
  };

  const renderButton = (key, value, state, setter) => {
    const isActive = state === value;
    return (
      <button
        key={key}
        onClick={() => setter(value)}
        disabled={isPlaying}
        className={`px-4 py-2 rounded-[10px] text-[12px] font-semibold transition-all border-[1.5px] ${
          isActive
            ? 'bg-[#5B9BD5] text-white border-[#5B9BD5] shadow-[0_2px_8px_rgba(91,155,213,0.3)]'
            : 'bg-[#F7FAFC] text-[#7A90A4] border-[#D9E6F2] hover:border-[#5B9BD5] hover:text-[#5B9BD5]'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {key}
      </button>
    );
  };

  return (
    <div className="bg-white border border-[#D9E6F2] rounded-[24px] overflow-hidden shadow-[0_2px_20px_rgba(91,155,213,0.08)]">
      <AnimatePresence mode="wait">
        {!isPlaying ? (
          <motion.div key="settings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col">
            <div className="p-6 border-b border-[#D9E6F2]">
              <h3 className="text-[12px] font-bold text-[#2D3E50] mb-2.5">Breathing Technique</h3>
              <div className="flex flex-wrap gap-2">
                {renderButton('Simple', 'simple', activeTechnique, setActiveTechnique)}
                {renderButton('Box Breathing', 'box', activeTechnique, setActiveTechnique)}
                {renderButton('4-7-8', '4-7-8', activeTechnique, setActiveTechnique)}
              </div>
              <p className="text-[11px] text-[#7A90A4] mt-2 italic">
                {activeTechnique === 'simple' && 'Simple 4-count inhale and 6-count exhale.'}
                {activeTechnique === 'box' && 'Equal 4-count inhale, hold, exhale, and hold.'}
                {activeTechnique === '4-7-8' && 'Inhale for 4, hold for 7, exhale for 8.'}
              </p>
              
              <h3 className="text-[12px] font-bold text-[#2D3E50] mt-4 mb-2.5">Duration</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(DURATIONS).map(([key, value]) =>
                  renderButton(key, String(value), String(activeDuration), setActiveDuration)
                )}
              </div>
              
              <div className="flex items-center justify-between mt-4">
                <span className="text-[13px] font-semibold text-[#2D3E50]">Sound Enabled</span>
                <button 
                  onClick={() => setIsSoundEnabled(!isSoundEnabled)}
                  className={`w-10 h-[22px] rounded-full relative transition-colors ${isSoundEnabled ? 'bg-[#72C5A8]' : 'bg-[#D9E6F2]'}`}
                >
                  <div className={`absolute top-[3px] w-4 h-4 rounded-full bg-white transition-all ${isSoundEnabled ? 'right-[3px]' : 'left-[3px]'}`} />
                </button>
              </div>
            </div>

            <div className="py-12 px-6 flex flex-col items-center justify-center gap-8">
              <div
                className="w-40 h-40 rounded-full bg-gradient-to-br from-[#D4F2E8] to-[#C8F0E0] border-2 border-[#72C5A8]"
                style={{ ...circleStyle, boxShadow: '0 0 0 16px rgba(114,197,168,0.1), 0 0 0 32px rgba(114,197,168,0.05)' }}
              />
              <h3 className="text-[22px] font-semibold text-[#7A90A4] tracking-tight">{instruction}</h3>
              <button onClick={startExercise} className="w-[60px] h-[60px] rounded-full bg-[#5B9BD5] text-white flex items-center justify-center shadow-[0_4px_16px_rgba(91,155,213,0.3)] hover:scale-105 transition-all">
                <Play className="ml-1" size={24} fill="currentColor" />
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div key="player" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col">
            <div className="px-6 py-4 border-b border-[#D9E6F2] bg-[#F7FAFC]">
               <div className="text-[11px] text-[#7A90A4] font-semibold uppercase tracking-[0.08em]">Now Playing — {activeTechnique}</div>
            </div>
            <div className="py-12 px-6 flex flex-col items-center justify-center gap-8 min-h-[300px]">
              <div
                className="w-40 h-40 rounded-full bg-gradient-to-br from-[#D4F2E8] to-[#C8F0E0] border-2 border-[#72C5A8] flex flex-col items-center justify-center"
                style={{ ...circleStyle, transitionProperty: 'transform, opacity, box-shadow', transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }}
              >
              </div>
              <AnimatePresence mode="wait">
                <motion.h3 key={instruction} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-[22px] font-semibold text-[#2D3E50] tracking-tight text-center h-8">
                  {instruction}
                </motion.h3>
              </AnimatePresence>
              <button onClick={stopExercise} className="w-[60px] h-[60px] rounded-full bg-[#FDE8E8] text-[#C0504D] border-[1.5px] border-[#F0A8A8] flex items-center justify-center shadow-[0_4px_12px_rgba(192,80,77,0.12)] hover:bg-[#F5D0D0] transition-colors">
                <Pause size={24} fill="currentColor" />
              </button>
            </div>
            
            <div className="px-6 pb-5">
              {activeDuration !== Infinity && (
                <div className="w-full h-1.5 bg-[#EEF3F8] rounded-full overflow-hidden">
                  <motion.div className="h-full bg-gradient-to-r from-[#5B9BD5] to-[#72C5A8]" initial={{ width: '0%' }} animate={{ width: `${progress}%` }} transition={{ duration: 0.1 }} />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Breathing;