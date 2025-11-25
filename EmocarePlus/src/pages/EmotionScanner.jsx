import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // Added AnimatePresence for popup
import api from '../contexts/AuthContext';
import { FaSpinner, FaCoins } from 'react-icons/fa'; // Added FaCoins icon

const EmotionScanner = () => {
  const [status, setStatus] = useState('loading');
  const [detectedEmotion, setDetectedEmotion] = useState({ emotion: '...', confidence: 0 });
  const [message, setMessage] = useState("Looking for emotions...");
  
  // --- NEW STATE FOR REWARDS ---
  const [sessionCoins, setSessionCoins] = useState(0); // Tracks coins earned in this session
  const [showRewardPopup, setShowRewardPopup] = useState(false); // Triggers the animation
  // -----------------------------

  const videoRef = useRef(null);
  const intervalRef = useRef(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const generateMessage = (emotion) => {
    switch (emotion.toLowerCase()) {
      case 'happy': return "Good to see you smiling! Keep it up for a reward!"; // Updated text
      case 'sad': return "Why the long face? Hope things get better!";
      case 'angry': return "Take a deep breath. Stay calm!";
      case 'neutral': return "Feeling calm and collected.";
      case 'surprise': return "Whoa! Something exciting happening?";
      case 'fear': return "Don't worry, everything's alright.";
      case 'disgust': return "Something not quite right?";
      case 'error': return "Couldn't detect emotion. Try again!";
      default: return "Analyzing your mood...";
    }
  };

  useEffect(() => {
    setMessage(generateMessage(detectedEmotion.emotion));
  }, [detectedEmotion.emotion]);

  const analyzeFrame = async () => {
    if (isAnalyzing || !videoRef.current || !videoRef.current.videoWidth) {
      return;
    }
    setIsAnalyzing(true);

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = videoRef.current.videoWidth;
    tempCanvas.height = videoRef.current.videoHeight;
    const ctx = tempCanvas.getContext('2d');
    
    ctx.save();
    ctx.scale(-1, 1);
    ctx.drawImage(videoRef.current, -tempCanvas.width, 0, tempCanvas.width, tempCanvas.height);
    ctx.restore();

    const imageBase64 = tempCanvas.toDataURL('image/jpeg', 0.7);

    try {
      // We don't send 'wallet_address' here, so Backend defaults to "Collection Mode"
      const response = await api.post('/api/analyze-emotion', { image: imageBase64 });
      const data = response.data;
      
      setDetectedEmotion(data);

      // --- NEW REWARD LOGIC ---
      // If the backend says we earned a coin (either sent or collected)
      if (data.reward_status === 'collected' || data.reward_status === 'sent') {
        setSessionCoins(prev => prev + 1); // Increment counter
        setShowRewardPopup(true); // Trigger animation
        
        // Hide popup after 3 seconds
        setTimeout(() => setShowRewardPopup(false), 3000);
      }
      // ------------------------

    } catch (error) {
      console.error("Error analyzing emotion:", error);
      setDetectedEmotion({ emotion: 'Error', confidence: 0 });
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    let stream = null; 
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { width: 640, height: 480 } 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            setStatus('ready'); 
            intervalRef.current = setInterval(() => {
              analyzeFrame();
            }, 1500); 
          };
        }
      } catch (err) {
        console.error("Could not access camera:", err);
        setStatus('error'); 
      }
    };

    startCamera();

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []); 

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-white">Real-time Emotion Detector</h3>
        
        {/* --- NEW: SESSION SCORE COUNTER --- */}
        <div className="bg-yellow-500/20 border border-yellow-500 text-yellow-400 px-4 py-2 rounded-full flex items-center gap-2 font-bold">
            <FaCoins />
            <span>{sessionCoins} Earned</span>
        </div>
        {/* ---------------------------------- */}
      </div>

      <div className="relative w-full max-w-4xl mx-auto aspect-[4/5] md:aspect-video bg-[var(--color-surface)] rounded-xl shadow-md overflow-hidden border-2 border-gray-400">
        
        {/* --- NEW: REWARD POPUP ANIMATION --- */}
        <AnimatePresence>
          {showRewardPopup && (
            <motion.div 
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none"
            >
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 rounded-2xl shadow-2xl flex flex-col items-center transform rotate-3">
                <FaCoins className="text-6xl text-white mb-2 drop-shadow-md animate-bounce" />
                <h2 className="text-2xl font-black text-white uppercase tracking-wider">Happy Coin!</h2>
                <p className="text-white font-medium">+1 Added to Wallet</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* ----------------------------------- */}

        {/* Status Indicators */}
        {status === 'loading' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <FaSpinner className="animate-spin text-white" />
            <p className="mt-2 text-[var(--color-text-muted)]">Starting camera...</p>
          </div>
        )}
        {status === 'error' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="mt-2 text-[var(--color-error)]">Could not access camera.</p>
          </div>
        )}
        
        <video 
          ref={videoRef} 
          className="w-full h-full object-cover transform scaleX(-1)" 
          autoPlay 
          playsInline
        ></video>
        
        {/* Emotion Display */}
        <div className="absolute top-4 left-4 bg-black/50 text-white px-4 py-2 rounded-lg backdrop-blur-sm">
          <p className="font-bold text-base md:text-lg">
            Detected Emotion: <span className="text-green-300">{detectedEmotion.emotion}</span>
          </p>
          <p className="text-sm">
            Confidence: <span className="text-green-300">{detectedEmotion.confidence}%</span>
          </p>
        </div>
        
        {/* Message Display */}
        <div className="absolute bottom-4 left-4 right-4 bg-black/60 text-white px-4 py-2 rounded-lg text-center backdrop-blur-sm">
          <p className="font-semibold text-base md:text-lg">{message}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default EmotionScanner;