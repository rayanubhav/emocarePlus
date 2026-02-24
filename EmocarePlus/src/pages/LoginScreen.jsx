import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
// Change import here:
import { GoogleLogin } from '@react-oauth/google';
import { FaUser, FaEnvelope, FaLock } from 'react-icons/fa';

const LoginScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login, register, loginWithGoogle } = useAuth();

  const submitForm = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      localStorage.setItem('hasSeenGetStarted', 'true');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const inputVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.1 } }),
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#EAF2FB] to-[#F0F4F8] p-4 font-['DM_Sans']">

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[380px] bg-white border border-[#D9E6F2] rounded-[24px] p-8 shadow-[0_8px_40px_rgba(91,155,213,0.1)] relative z-10"
      >
        <div className="text-center mb-6">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[22px] font-bold text-[#2D3E50]"
          >
            {isLogin ? 'Welcome back 👋' : 'Join Us 🌱'}
          </motion.h2>
          <p className="text-[12px] text-[#7A90A4] mt-1">
            {isLogin ? 'Sign in to continue your wellness journey.' : 'Create an account to begin.'}
          </p>
        </div>

        {/* --- FIX: USE OFFICIAL GOOGLE COMPONENT HERE --- */}
        <div className="flex justify-center mb-6 w-full">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              setIsLoading(true);
              setError('');
              try {
                // credentialResponse.credential is the exact id_token Flask needs!
                await loginWithGoogle(credentialResponse.credential);
                localStorage.setItem('hasSeenGetStarted', 'true');
              } catch (err) {
                console.error("Google login error:", err);
                setError('Google login failed. Please try again.');
              } finally {
                setIsLoading(false);
              }
            }}
            onError={() => {
              setError('Google login was cancelled or failed.');
            }}
            useOneTap
            width="100%"
            theme="outline"
            size="large"
            shape="rectangular"
            text={isLogin ? "signin_with" : "signup_with"}
          />
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-[#D9E6F2]"></div>
          <span className="text-[11px] font-semibold text-[#7A90A4] uppercase tracking-wider">or</span>
          <div className="flex-1 h-px bg-[#D9E6F2]"></div>
        </div>

        {/* --- STANDARD FORM (Unchanged) --- */}
        <form onSubmit={submitForm} className="space-y-4">
          {!isLogin && (
            <motion.div custom={0} variants={inputVariants} initial="hidden" animate="visible" className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A90A4]"><FaUser size={14} /></span>
              <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required
                className="w-full border-[1.5px] border-[#D9E6F2] rounded-[14px] bg-[#F7FAFC] py-3 pl-10 pr-4 text-[13px] text-[#2D3E50] outline-none focus:border-[#5B9BD5] focus:ring-[3px] focus:ring-[#5B9BD5]/15 transition-all placeholder:text-[#7A90A4]" />
            </motion.div>
          )}

          <motion.div custom={!isLogin ? 1 : 0} variants={inputVariants} initial="hidden" animate="visible" className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A90A4]"><FaEnvelope size={14} /></span>
            <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full border-[1.5px] border-[#D9E6F2] rounded-[14px] bg-[#F7FAFC] py-3 pl-10 pr-4 text-[13px] text-[#2D3E50] outline-none focus:border-[#5B9BD5] focus:ring-[3px] focus:ring-[#5B9BD5]/15 transition-all placeholder:text-[#7A90A4]" />
          </motion.div>

          <motion.div custom={!isLogin ? 2 : 1} variants={inputVariants} initial="hidden" animate="visible" className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#7A90A4]"><FaLock size={14} /></span>
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required
              className="w-full border-[1.5px] border-[#D9E6F2] rounded-[14px] bg-[#F7FAFC] py-3 pl-10 pr-4 text-[13px] text-[#2D3E50] outline-none focus:border-[#5B9BD5] focus:ring-[3px] focus:ring-[#5B9BD5]/15 transition-all placeholder:text-[#7A90A4]" />
          </motion.div>

          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-[12px] font-semibold text-[#C0504D]">
              {error}
            </motion.p>
          )}

          <motion.button
            custom={!isLogin ? 3 : 2} variants={inputVariants} initial="hidden" animate="visible"
            type="submit" disabled={isLoading}
            className="w-full mt-2 flex justify-center items-center gap-2 rounded-[14px] bg-[#5B9BD5] py-3 px-5 text-[13px] font-bold text-white shadow-[0_4px_16px_rgba(91,155,213,0.28)] hover:bg-[#4A88C0] hover:-translate-y-[1px] transition-all disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
          </motion.button>
        </form>

        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          onClick={() => { setIsLogin(!isLogin); setError(''); }}
          className="mt-6 text-center text-[12px] text-[#7A90A4] font-medium cursor-pointer hover:text-[#5B9BD5] transition-colors"
        >
          {isLogin ? (
            <span>Don't have an account? <span className="font-bold text-[#5B9BD5]">Sign up</span></span>
          ) : (
            <span>Already have an account? <span className="font-bold text-[#5B9BD5]">Sign in</span></span>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginScreen;