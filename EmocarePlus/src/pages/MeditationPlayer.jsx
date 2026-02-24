import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../contexts/AuthContext';
import { FaSpinner } from 'react-icons/fa';
import {
  RiPlayFill,
  RiPauseFill,
  RiReplay10Line,
  RiForward10Line,
  RiArrowLeftLine,
  RiSeedlingLine,
} from 'react-icons/ri';

const formatDuration = (seconds) => {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const MeditationPlayer = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meditation, setMeditation] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioSrc, setAudioSrc] = useState('');

  useEffect(() => {
    const fetchMeditation = async () => {
      try {
        const response = await api.get('/api/meditations');
        const foundMeditation = response.data.find((med) => med._id === id);
        if (foundMeditation) {
          setMeditation(foundMeditation);
          const fileName = foundMeditation.asset_path.split('/').pop();
          setAudioSrc(`/audio/${fileName}`);
        } else {
          setError('Could not find this meditation.');
        }
      } catch (err) {
        setError('Could not load meditation.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchMeditation();
  }, [id]);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const seek = (time) => {
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const seekForward  = () => seek(Math.min(currentTime + 10, duration));
  const seekBackward = () => seek(Math.max(currentTime - 10, 0));
  const onLoadedMetadata = () => setDuration(audioRef.current.duration);
  const onTimeUpdate     = () => setCurrentTime(audioRef.current.currentTime);
  const onEnded          = () => setIsPlaying(false);

  /* ── Loading / error states ───────────────────────────── */
  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        {/* WHY: Spinner in primary blue — consistent with app, visible on light bg */}
        <FaSpinner className="h-10 w-10 animate-spin text-[#5B9BD5]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        {/* WHY: Error in dusty rose pill — calmer than neon red */}
        <p className="rounded-xl bg-[#FDE8E8] px-5 py-3 text-sm font-medium text-[#C0504D] border border-[#F0A8A8]">
          {error}
        </p>
      </div>
    );
  }

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    /*
     * WHY: Replaced dark bg-[var(--color-surface)] with a light blue-green gradient.
     * This feels airy and meditative — matching the purpose of the screen.
     * Two subtle blurred orbs add depth without being distracting.
     */
    <div className="relative flex h-full w-full flex-col items-center justify-center
                    overflow-hidden rounded-2xl p-8 text-center
                    bg-gradient-to-br from-[#EAF2FB] via-[#F0F4F8] to-[#EDF7F3]
                    border border-[#D9E6F2]">

      {/* Ambient orbs — very subtle */}
      <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48
                      rounded-full bg-[#5B9BD5]/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-12 -left-12 h-40 w-40
                      rounded-full bg-[#72C5A8]/10 blur-3xl" />

      {/* Back button
          WHY: text-white/50 on dark bg → muted slate link on light bg.
          Easier to read, consistent with app nav language. */}
      <button
        onClick={() => navigate('/meditations')}
        className="absolute left-6 top-6 flex items-center gap-1.5 text-sm font-semibold
                   text-[#7A90A4] transition-colors hover:text-[#5B9BD5]"
      >
        <RiArrowLeftLine size={18} /> Back
      </button>

      <audio
        ref={audioRef}
        src={audioSrc}
        onLoadedMetadata={onLoadedMetadata}
        onTimeUpdate={onTimeUpdate}
        onEnded={onEnded}
      />

      {/* Icon
          WHY: Same color token but now sits on a light bg — feels calm, not neon.
          Soft ring below gives it grounding weight. */}
      <div className="flex h-28 w-28 items-center justify-center rounded-full
                      bg-[#D4F2E8] border-2 border-[#72C5A8]
                      shadow-md shadow-[#72C5A8]/20 mb-6">
        <RiSeedlingLine size={52} className="text-[#3A9A7A]" />
      </div>

      {/* Title / description */}
      <h2 className="text-2xl font-bold text-[#2D3E50]"
          style={{ fontFamily: "'DM Serif Display', serif" }}>
        {meditation.title}
      </h2>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-[#7A90A4]">
        {meditation.description}
      </p>

      {/* Seek bar
          WHY: accent-[primary] → custom range with gradient fill + styled track.
          Much more polished than the browser default. */}
      <div className="mt-10 w-full max-w-sm">
        <div className="relative h-1.5 w-full rounded-full bg-[#D9E6F2] cursor-pointer"
             onClick={(e) => {
               const rect = e.currentTarget.getBoundingClientRect();
               const pct  = (e.clientX - rect.left) / rect.width;
               seek(pct * duration);
             }}>
          <div
            className="absolute left-0 top-0 h-full rounded-full"
            style={{
              width: `${progressPct}%`,
              background: 'linear-gradient(90deg, #5B9BD5, #72C5A8)',
            }}
          >
            {/* Dot handle */}
            <div className="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 translate-x-1.5
                            rounded-full bg-[#5B9BD5] shadow-md" />
          </div>
        </div>

        <div className="mt-2 flex justify-between text-xs font-semibold text-[#7A90A4]">
          <span>{formatDuration(currentTime)}</span>
          <span>{formatDuration(duration)}</span>
        </div>
      </div>

      {/* Controls
          WHY: Skip buttons muted slate → primary on hover. Play button gets
          a blue hue shadow matching its color — feels intentional. */}
      <div className="mt-6 flex items-center justify-center gap-8">
        <button
          onClick={seekBackward}
          className="text-[#7A90A4] transition-colors hover:text-[#2D3E50]"
        >
          <RiReplay10Line size={30} />
        </button>

        <button
          onClick={togglePlayPause}
          className="flex h-20 w-20 items-center justify-center rounded-full
                     bg-[#5B9BD5] text-white transition-all hover:bg-[#4A88C0] hover:scale-105"
          style={{ boxShadow: '0 6px 20px rgba(91,155,213,0.35)' }}
        >
          {isPlaying ? <RiPauseFill size={40} /> : <RiPlayFill size={40} />}
        </button>

        <button
          onClick={seekForward}
          className="text-[#7A90A4] transition-colors hover:text-[#2D3E50]"
        >
          <RiForward10Line size={30} />
        </button>
      </div>
    </div>
  );
};

export default MeditationPlayer;