import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { GoogleLogin } from '@react-oauth/google';
import { FaUser, FaEnvelope, FaLock, FaHeartbeat, FaUserMd } from 'react-icons/fa';

/* ─── Role Selection Modal ─── */
const RoleSelectionModal = ({ onSelect, isSubmitting }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-[#2D3E50]/50 backdrop-blur-sm p-4"
  >
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      transition={{ type: 'spring', duration: 0.5 }}
      className="w-full max-w-[420px] bg-surface border border-border rounded-[24px] p-8 shadow-[0_16px_60px_rgba(91,155,213,0.18)]"
    >
      <div className="text-center mb-6">
        <h2 className="text-[20px] font-bold text-text-main">Welcome to EmoCare+</h2>
        <p className="text-[12px] text-text-muted mt-1.5 leading-[1.6]">
          Help us personalize your experience. How will you be using the platform?
        </p>
      </div>

      <div className="space-y-3">
        <button
          onClick={() => onSelect('user')}
          disabled={isSubmitting}
          className="w-full flex items-center gap-4 p-5 rounded-[16px] border-2 border-border bg-surface-light
                     hover:border-[#5B9BD5] hover:bg-[#EEF6FC] transition-all group disabled:opacity-50"
        >
          <div className="w-12 h-12 rounded-full bg-[#D6EAFC] flex items-center justify-center flex-shrink-0
                          group-hover:bg-[#5B9BD5] transition-colors">
            <FaHeartbeat className="text-[#5B9BD5] group-hover:text-white transition-colors" size={20} />
          </div>
          <div className="text-left">
            <h3 className="text-[14px] font-bold text-text-main">Personal Wellness</h3>
            <p className="text-[11px] text-text-muted mt-0.5">Track mood, manage stress, and access self-care tools.</p>
          </div>
        </button>

        <button
          onClick={() => onSelect('therapist')}
          disabled={isSubmitting}
          className="w-full flex items-center gap-4 p-5 rounded-[16px] border-2 border-border bg-surface-light
                     hover:border-[#72C5A8] hover:bg-[#E8F8F2] transition-all group disabled:opacity-50"
        >
          <div className="w-12 h-12 rounded-full bg-[#D4F2E8] flex items-center justify-center flex-shrink-0
                          group-hover:bg-[#72C5A8] transition-colors">
            <FaUserMd className="text-[#72C5A8] group-hover:text-white transition-colors" size={20} />
          </div>
          <div className="text-left">
            <h3 className="text-[14px] font-bold text-text-main">Healthcare Professional</h3>
            <p className="text-[11px] text-text-muted mt-0.5">Access the clinical portal, patient queue, and tele-therapy.</p>
          </div>
        </button>
      </div>
    </motion.div>
  </motion.div>
);

const LoginScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showRoleModal, setShowRoleModal] = useState(false);

  const { login, register, loginWithGoogle, needsRoleSelection, confirmRole } = useAuth();
  const navigate = useNavigate();

  /** Redirect based on resolved role */
  const redirectByRole = (userRole) => {
    localStorage.setItem('hasSeenGetStarted', 'true');
    if (userRole === 'therapist') {
      navigate('/therapist-portal', { replace: true });
    } else {
      navigate('/dashboard', { replace: true });
    }
  };

  /** Handle role chosen from the modal */
  const handleRoleSelect = async (selectedRole) => {
    setIsLoading(true);
    try {
      await confirmRole(selectedRole);
      setShowRoleModal(false);
      redirectByRole(selectedRole);
    } catch (err) {
      setError('Failed to set role. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
        const result = await login(email, password);
        if (result?.needsRole) {
          setShowRoleModal(true);
          setIsLoading(false);
          return;
        }
        redirectByRole(result?.role || 'user');
      } else {
        const result = await register(name, email, password);
        if (result?.needsRole) {
          setShowRoleModal(true);
          setIsLoading(false);
          return;
        }
        redirectByRole('user');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'An error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  // Show modal when AuthContext triggers needsRoleSelection
  React.useEffect(() => {
    if (needsRoleSelection) setShowRoleModal(true);
  }, [needsRoleSelection]);

  const inputVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i) => ({ opacity: 1, x: 0, transition: { delay: i * 0.1 } }),
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#EAF2FB] to-[#F0F4F8] p-4 font-['DM_Sans']">

      {/* Role Selection Modal */}
      <AnimatePresence>
        {showRoleModal && <RoleSelectionModal onSelect={handleRoleSelect} isSubmitting={isLoading} />}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[380px] bg-surface border border-border rounded-[24px] p-8 shadow-[0_8px_40px_rgba(91,155,213,0.1)] relative z-10"
      >
        <div className="text-center mb-6">
          <motion.h2
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[22px] font-bold text-text-main"
          >
            {isLogin ? 'Welcome back 👋' : 'Join Us 🌱'}
          </motion.h2>
          <p className="text-[12px] text-text-muted mt-1">
            {isLogin ? 'Sign in to continue your wellness journey.' : 'Create an account to begin.'}
          </p>
        </div>

        {/* Google Auth */}
        <div className="flex justify-center mb-6 w-full">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              setIsLoading(true);
              setError('');
              try {
                const result = await loginWithGoogle(credentialResponse.credential);
                if (result?.needsRole) {
                  setShowRoleModal(true);
                  setIsLoading(false);
                  return;
                }
                redirectByRole(result?.role || 'user');
              } catch (err) {
                console.error('Google login error:', err);
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
            text={isLogin ? 'signin_with' : 'signup_with'}
          />
        </div>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex-1 h-px bg-[#D9E6F2]"></div>
          <span className="text-[11px] font-semibold text-text-muted uppercase tracking-wider">or</span>
          <div className="flex-1 h-px bg-[#D9E6F2]"></div>
        </div>

        {/* Standard Form */}
        <form onSubmit={submitForm} className="space-y-4">
          {!isLogin && (
            <motion.div custom={0} variants={inputVariants} initial="hidden" animate="visible" className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"><FaUser size={14} /></span>
              <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required
                className="w-full border-[1.5px] border-border rounded-[14px] bg-surface-light py-3 pl-10 pr-4 text-[13px] text-text-main outline-none focus:border-[#5B9BD5] focus:ring-[3px] focus:ring-[#5B9BD5]/15 transition-all placeholder:text-text-muted" />
            </motion.div>
          )}

          <motion.div custom={!isLogin ? 1 : 0} variants={inputVariants} initial="hidden" animate="visible" className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"><FaEnvelope size={14} /></span>
            <input type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full border-[1.5px] border-border rounded-[14px] bg-surface-light py-3 pl-10 pr-4 text-[13px] text-text-main outline-none focus:border-[#5B9BD5] focus:ring-[3px] focus:ring-[#5B9BD5]/15 transition-all placeholder:text-text-muted" />
          </motion.div>

          <motion.div custom={!isLogin ? 2 : 1} variants={inputVariants} initial="hidden" animate="visible" className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"><FaLock size={14} /></span>
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required
              className="w-full border-[1.5px] border-border rounded-[14px] bg-surface-light py-3 pl-10 pr-4 text-[13px] text-text-main outline-none focus:border-[#5B9BD5] focus:ring-[3px] focus:ring-[#5B9BD5]/15 transition-all placeholder:text-text-muted" />
          </motion.div>

          {error && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-[12px] font-semibold text-error">
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
          className="mt-6 text-center text-[12px] text-text-muted font-medium cursor-pointer hover:text-[#5B9BD5] transition-colors"
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