import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../contexts/AuthContext';
import { FaSpinner, FaCoins, FaWallet, FaTimes } from 'react-icons/fa';

const EmotionScanner = () => {
  const [status, setStatus] = useState('loading');
  const [detectedEmotion, setDetectedEmotion] = useState({ emotion: '...', confidence: 0 });
  const [message, setMessage] = useState("Looking for emotions...");

  const [totalCoins, setTotalCoins] = useState(0);
  const [showRewardPopup, setShowRewardPopup] = useState(false);

  const [showClaimModal, setShowClaimModal] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [claimStatus, setClaimStatus] = useState("idle");
  const [txHash, setTxHash] = useState("");

  const videoRef = useRef(null);
  const intervalRef = useRef(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await api.get('/api/auth/login');
        if (res.data && res.data.user) {
          setTotalCoins(res.data.user.pending_coins || 0);
        }
      } catch (err) { }
    };
    fetchBalance();
  }, []);

  const generateMessage = (emotion) => {
    switch (emotion?.toLowerCase()) {
      case 'happy': return "Great smile! Keep it up!";
      default: return "Show me a happy face to earn coins!";
    }
  };

  useEffect(() => {
    setMessage(generateMessage(detectedEmotion.emotion));
  }, [detectedEmotion.emotion]);

  const handleClaimRewards = async () => {
    if (!walletAddress) return;
    setClaimStatus("processing");
    try {
      const res = await api.post('/api/claim-rewards', { wallet_address: walletAddress });
      setClaimStatus("success");
      setTxHash(res.data.tx_hash);
      setTotalCoins(0);
    } catch (err) {
      console.error(err);
      setClaimStatus("error");
    }
  };

  const analyzeFrame = async () => {
    if (isAnalyzing || !videoRef.current || !videoRef.current.videoWidth) return;
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
      const response = await api.post('/api/analyze-emotion', { image: imageBase64 });
      const data = response.data;

      setDetectedEmotion(data);
      if (data.total_coins !== undefined) setTotalCoins(data.total_coins);

      if (data.reward_status === 'collected') {
        setShowRewardPopup(true);
        setTimeout(() => setShowRewardPopup(false), 3000);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useEffect(() => {
    let stream = null;
    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            setStatus('ready');
            intervalRef.current = setInterval(() => analyzeFrame(), 1500);
          };
        }
      } catch (err) {
        setStatus('error');
      }
    };
    startCamera();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full relative bg-surface border border-border rounded-[24px] shadow-[0_2px_16px_rgba(91,155,213,0.07)] p-6">
      <div className="flex flex-wrap justify-between items-center mb-5 gap-4">
        <h3 className="text-[18px] font-bold text-text-main">Real-time Emotion Detector</h3>

        <div className="flex items-center gap-2">
          <div className="bg-[#FEF5D9] border-[1.5px] border-[#F5D88A] text-[#A07830] px-3.5 py-1.5 rounded-full flex items-center gap-2 text-[13px] font-bold">
            <FaCoins /> <span>{totalCoins}</span>
          </div>

          {totalCoins > 0 && (
            <button
              onClick={() => { setShowClaimModal(true); setClaimStatus("idle"); }}
              className="bg-[#72C5A8] hover:bg-[#5DAED2] text-white px-4 py-1.5 rounded-full text-[12px] font-bold flex items-center gap-1.5 shadow-[0_2px_8px_rgba(114,197,168,0.3)] transition-all"
            >
              <FaWallet /> Claim Rewards
            </button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showClaimModal && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-background/85 backdrop-blur-sm p-4"
          >
            <div className="bg-surface p-8 rounded-[20px] w-full max-w-[380px] border border-border shadow-[0_8px_40px_rgba(91,155,213,0.15)] relative">
              <button onClick={() => setShowClaimModal(false)} className="absolute top-4 right-4 text-text-muted hover:text-text-main text-xl leading-none">&times;</button>

              <h2 className="text-[18px] font-bold text-text-main mb-1.5">Claim Your Rewards 🪙</h2>

              {claimStatus === "idle" && (
                <>
                  <p className="text-[12px] text-text-muted mb-5 leading-[1.5]">You have <strong className="text-text-main">{totalCoins} HAPY coins</strong>. Enter your wallet address to withdraw them.</p>
                  <input
                    type="text"
                    placeholder="0x... wallet address"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="w-full p-3 bg-surface border-[1.5px] border-border rounded-[12px] text-[13px] text-text-main mb-3 focus:border-[#72C5A8] outline-none transition-all placeholder:text-text-muted"
                  />
                  <button
                    onClick={handleClaimRewards}
                    disabled={!walletAddress}
                    className="w-full bg-[#72C5A8] hover:bg-[#5DAED2] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-[12px] text-[13px] shadow-[0_3px_12px_rgba(114,197,168,0.3)] transition-all"
                  >
                    Withdraw to Wallet
                  </button>
                </>
              )}

              {claimStatus === "processing" && (
                <div className="flex flex-col items-center py-6">
                  <FaSpinner className="animate-spin text-3xl text-[#5B9BD5] mb-4" />
                  <p className="text-text-main font-bold text-[14px]">Processing Transaction...</p>
                  <p className="text-[11px] text-text-muted mt-2">This may take 10-20 seconds.</p>
                </div>
              )}

              {claimStatus === "success" && (
                <div className="flex flex-col items-center py-6 text-center">
                  <FaCoins className="text-[40px] text-[#F5D88A] mb-4 animate-bounce" />
                  <h3 className="text-[18px] font-bold text-[#72C5A8] mb-1.5">Success!</h3>
                  <p className="text-text-muted text-[12px] mb-4">Your coins are on their way.</p>
                  <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noreferrer" className="text-[#5B9BD5] underline text-[11px] mb-4">View on Etherscan</a>
                  <button onClick={() => setShowClaimModal(false)} className="bg-surface-light border border-border hover:bg-surface-light text-text-main text-[12px] font-bold px-6 py-2 rounded-[10px]">Close</button>
                </div>
              )}

              {claimStatus === "error" && (
                <div className="text-center py-4">
                  <p className="text-error font-bold text-[15px] mb-1.5">Transaction Failed</p>
                  <p className="text-[12px] text-text-muted mb-4">Please check your internet or try again later.</p>
                  <button onClick={() => setClaimStatus("idle")} className="bg-surface-light border border-border text-text-main text-[12px] font-bold px-4 py-2 rounded-[10px]">Try Again</button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative w-full max-w-4xl mx-auto aspect-[4/5] md:aspect-video bg-[#1A2535] rounded-[20px] overflow-hidden border-2 border-border flex items-center justify-center">

        <AnimatePresence>
          {showRewardPopup && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none"
            >
              <div className="bg-[#FEF5D9] border-[2px] border-[#F5D88A] p-6 rounded-[20px] shadow-2xl flex flex-col items-center transform rotate-3">
                <FaCoins className="text-[48px] text-[#F5D88A] mb-2 animate-bounce drop-shadow-sm" />
                <h2 className="text-[20px] font-black text-[#A07830] uppercase tracking-wider">Happy Coin!</h2>
                <p className="text-[#A07830] font-bold text-[13px]">+1 Added</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {status === 'loading' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <FaSpinner className="animate-spin text-white opacity-50 text-3xl" />
            <p className="text-[13px] text-white/50">Starting camera...</p>
          </div>
        )}

        <video
          ref={videoRef}
          className="w-full h-full object-cover transform scaleX(-1)"
          autoPlay
          playsInline
        ></video>

        <div className="absolute top-3 left-3 bg-surface/10 backdrop-blur-md border border-white/20 rounded-[10px] px-3 py-2 text-white">
          <p className="text-[11px] font-semibold text-white/60 mb-0.5">DETECTED</p>
          <p className="text-[14px] font-bold text-[#A8D9C2]">{detectedEmotion.emotion}</p>
          <p className="text-[10px] text-white/50 mt-0.5">Confidence: {detectedEmotion.confidence}%</p>
        </div>

        <div className="absolute bottom-3 left-3 right-3 bg-surface/10 backdrop-blur-md border border-white/15 text-white/90 px-3 py-2.5 rounded-[10px] text-center text-[13px] font-medium">
          {message}
        </div>
      </div>
    </motion.div>
  );
};

export default EmotionScanner;