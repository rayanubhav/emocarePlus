import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeartPulse } from 'react-icons/fa6'; // Using a different icon

// --- ACTION REQUIRED ---
// Add your 'get_started_bg.jpg' to the 'public/' folder
// Or import it from 'src/assets/images/'
const bgImageUrl = '/get_started_bg.jpg'; 

const GetStartedScreen = () => {
  const navigate = useNavigate();

  const onGetStarted = () => {
    localStorage.setItem('hasSeenGetStarted', 'true');
    navigate('/login');
  };

  return (
    <div
      className="relative flex min-h-screen items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImageUrl})` }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/80" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center p-6 text-center text-white">
        <FaHeartPulse size={100} className="text-[var(--color-primary)]" />
        <h1 className="mt-6 text-4xl font-bold">Welcome to EmoCare+</h1>
        <p className="mt-4 max-w-md text-lg text-white/80">
          Your intelligent companion for proactive mental wellness and emotional fitness.
        </p>
        <button
          onClick={onGetStarted}
          className="btn btn-primary mt-12 w-full max-w-xs"
        >
          Get Started
        </button>
      </div>
    </div>
  );
};

export default GetStartedScreen;