import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../contexts/AuthContext';
import { FaSpinner } from 'react-icons/fa';
import ReactPlayer from 'react-player/youtube';
import { RiPlayFill, RiCloseFill, RiVideoLine } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';

const Spinner = () => <FaSpinner className="h-8 w-8 animate-spin text-[#5B9BD5]" />;
const ButtonSpinner = () => <FaSpinner className="h-4 w-4 animate-spin text-white" />;

const Stress = () => {
  const [inputs, setInputs] = useState({ heart_rate: '', steps: '', sleep: '', age: '' });
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const [showVideo, setShowVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const navigate = useNavigate();
  const resultsRef = useRef(null);

  const handleInputChange = (e) => setInputs({ ...inputs, [e.target.name]: e.target.value });

  const validateInputs = () => {
    const hr = parseFloat(inputs.heart_rate);
    const st = parseFloat(inputs.steps);
    const sl = parseFloat(inputs.sleep);
    const ag = parseFloat(inputs.age);

    if (hr < 30 || hr > 200) return "Heart rate must be between 30 and 200 bpm.";
    if (st < 0 || st > 50000) return "Steps must be between 0 and 50,000.";
    if (sl < 0 || sl > 24) return "Sleep must be between 0 and 24 hours.";
    if (ag < 5 || ag > 100) return "Age must be between 5 and 100.";

    return null; // Passes validation
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(null);
    setError('');

    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.post('/api/predict-stress', {
        heart_rate: parseFloat(inputs.heart_rate),
        steps: parseFloat(inputs.steps),
        sleep: parseFloat(inputs.sleep),
        age: parseFloat(inputs.age),
      });

      setResult({
        score: response.data.stress_level,
        suggestions: response.data.suggestions,
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Could not get prediction. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (result && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [result]);

  const playVideo = (url) => {
    setVideoUrl(url);
    setShowVideo(true);
  };
  const closeVideo = () => {
    setShowVideo(false);
    setVideoUrl('');
  };

  const getBadgeStyle = (level) => {
    if (level <= 3) return { bg: '#D4F2E8', border: '#A8D9C2', text: '#5AAE8A', sub: "You're in a calm state. Keep up the good habits! 🌿" };
    if (level <= 6) return { bg: '#FEF5D9', border: '#F5DFA0', text: '#D4A43A', sub: "Moderate stress detected. A quick break might help. ☕" };
    return { bg: '#FDE8E8', border: '#F0A8A8', text: '#C0504D', sub: "High stress detected. Try a guided exercise below. 🤍" };
  };

  return (
    <>
      <AnimatePresence>
        {showVideo && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#2D3E50]/80 backdrop-blur-sm"
            onClick={closeVideo}
          >
            <button onClick={closeVideo} className="absolute top-4 right-4 z-50 text-white hover:text-[#F0A8A8]">
              <RiCloseFill size={40} />
            </button>
            <motion.div
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="relative w-full max-w-3xl rounded-[20px] overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <ReactPlayer url={videoUrl} playing controls width="100%" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full overflow-y-auto pb-10 bg-background p-4 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="rounded-[20px] bg-surface border border-border p-6 shadow-[0_2px_16px_rgba(91,155,213,0.07)]">
            <h4 className="text-[15px] font-bold text-text-main mb-1">Enter Daily Metrics</h4>
            <p className="text-[11px] text-text-muted mb-5">We'll estimate your stress level from these readings.</p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[14px]">❤️</span>
                <input type="number" name="heart_rate" min="30" max="200" placeholder="Avg. Heart Rate (30 - 200 bpm)" value={inputs.heart_rate} onChange={handleInputChange} required
                  className="w-full border-[1.5px] border-border rounded-[14px] bg-surface-light py-3 pl-10 pr-4 text-[13px] text-text-main outline-none focus:border-[#5B9BD5] focus:ring-[3px] focus:ring-[#5B9BD5]/15 transition-all" />
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[14px]">🦶</span>
                <input type="number" name="steps" min="0" max="50000" placeholder="Daily Steps (0 - 50,000)" value={inputs.steps} onChange={handleInputChange} required
                  className="w-full border-[1.5px] border-border rounded-[14px] bg-surface-light py-3 pl-10 pr-4 text-[13px] text-text-main outline-none focus:border-[#5B9BD5] focus:ring-[3px] focus:ring-[#5B9BD5]/15 transition-all" />
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[14px]">🌙</span>
                <input type="number" name="sleep" min="0" max="24" step="0.5" placeholder="Sleep Hours (0 - 24)" value={inputs.sleep} onChange={handleInputChange} required
                  className="w-full border-[1.5px] border-border rounded-[14px] bg-surface-light py-3 pl-10 pr-4 text-[13px] text-text-main outline-none focus:border-[#5B9BD5] focus:ring-[3px] focus:ring-[#5B9BD5]/15 transition-all" />
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[14px]">🎂</span>
                <input type="number" name="age" min="5" max="100" placeholder="Age (5 - 100)" value={inputs.age} onChange={handleInputChange} required
                  className="w-full border-[1.5px] border-border rounded-[14px] bg-surface-light py-3 pl-10 pr-4 text-[13px] text-text-main outline-none focus:border-[#5B9BD5] focus:ring-[3px] focus:ring-[#5B9BD5]/15 transition-all" />
              </div>

              <button
                type="submit" disabled={isLoading}
                className="w-full mt-2 flex justify-center items-center gap-2 rounded-[14px] bg-[#5B9BD5] py-3 px-5 text-[13px] font-semibold text-white border-none shadow-[0_4px_16px_rgba(91,155,213,0.28)] hover:bg-[#4A88C0] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
              >
                {isLoading ? <ButtonSpinner /> : 'Predict My Stress Level'}
              </button>
            </form>
          </div>

          <div ref={resultsRef} className="rounded-[20px] bg-surface border border-border p-6 shadow-[0_2px_16px_rgba(91,155,213,0.07)] flex flex-col items-center text-center justify-center min-h-[300px]">
            {isLoading && <Spinner />}
            {!isLoading && !result && !error && <p className="text-[13px] text-text-muted">Your results will appear here.</p>}
            {error && (
              <div className="bg-error-bg border border-error text-error px-4 py-3 rounded-[12px] text-[13px] font-medium w-full">
                {error}
              </div>
            )}

            {result && !error && (() => {
              const style = getBadgeStyle(result.score);
              return (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full">
                  <div
                    className="inline-block rounded-[20px] py-5 px-8 text-center border"
                    style={{ backgroundColor: style.bg, borderColor: style.border }}
                  >
                    <div className="text-[56px] font-bold leading-none" style={{ color: style.text }}>
                      {result.score}<span className="text-[24px] text-text-muted">/10</span>
                    </div>
                    <div className="text-[11px] uppercase tracking-[0.1em] font-semibold text-text-muted mt-1">Stress Level</div>
                  </div>

                  <div className="text-[13px] mt-4 leading-[1.5]" style={{ color: style.text }}>
                    {style.sub}
                  </div>

                  {result.suggestions?.length > 0 && (
                    <div className="mt-6 space-y-2 text-left w-full">
                      {result.suggestions.map((item) => (
                        <SuggestionCard key={item.title} item={item} onPlayVideo={playVideo} onPlayMeditation={(id) => navigate(`/meditations/${id}`)} />
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })()}
          </div>
        </div>
      </motion.div>
    </>
  );
};

const SuggestionCard = ({ item, onPlayVideo, onPlayMeditation }) => {
  const isYouTube = item.type === 'youtube';
  const handleClick = () => isYouTube ? onPlayVideo(item.link) : onPlayMeditation(item.id);

  return (
    <div
      onClick={handleClick}
      className="flex items-center justify-between bg-surface-light border border-border rounded-[14px] p-3 cursor-pointer hover:bg-surface-light hover:border-[#5B9BD5] transition-all"
    >
      <div className="flex items-center gap-3">
        <span className="text-[20px]">{isYouTube ? '🎧' : '🧘'}</span>
        <div>
          <h3 className="text-[13px] font-semibold text-text-main">{item.title}</h3>
          <p className="text-[11px] text-text-muted mt-[1px]">{item.description}</p>
        </div>
      </div>
      <span className="text-text-muted text-[16px] font-bold">›</span>
    </div>
  );
};

export default Stress;