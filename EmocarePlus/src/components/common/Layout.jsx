import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RiDashboardLine,
  RiHeartPulseLine,
  RiEmotionLine,
  RiMessage2Line,
  RiMapPinLine,
  RiLogoutBoxLine,
  RiBookReadLine,
  RiInformationLine,
  RiMenuFold3Line,
  RiMenuUnfold3Line,
} from 'react-icons/ri';
import { useInfoDialog } from '../../hooks/useInfoDialog';

const Header = ({ title, infoContent }) => {
  const { showInfo } = useInfoDialog();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8 flex items-center justify-between"
    >
      <div>
        <h2 className="text-4xl font-bold bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-accent)] bg-clip-text text-transparent">
          {title}
        </h2>
      </div>
      {infoContent && (
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => showInfo(title, infoContent)}
          className="rounded-lg bg-[var(--color-surface-light)]/60 p-3 text-[var(--color-text-muted)] transition-all hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-light)]"
        >
          <RiInformationLine size={24} />
        </motion.button>
      )}
    </motion.div>
  );
};

const NavItem = ({ icon, label, isActive, onClick }) => (
  <motion.li
    whileHover={{ x: 4 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`relative my-2 flex cursor-pointer items-center rounded-xl p-3 transition-all duration-300 ${
      isActive
        ? 'bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-primary)]/70 text-[var(--color-on-primary)] shadow-lg shadow-[var(--color-primary)]/20'
        : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface-light)]/50 hover:text-white'
    }`}
  >
    {isActive && (
      <motion.div
        layoutId="activeIndicator"
        className="absolute -left-3 h-2 w-2 rounded-full bg-[var(--color-primary)]"
      />
    )}
    {icon}
    <span className="ml-4 font-medium">{label}</span>
  </motion.li>
);

const Layout = ({ pageTitle, infoContent, children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Check if we are on the chat page
  const isChatPage = location.pathname.startsWith('/chatbot');

  const navItems = [
    { label: 'Dashboard', icon: <RiDashboardLine size={24} />, path: '/dashboard' },
    { label: 'Stress', icon: <RiHeartPulseLine size={24} />, path: '/stress' },
    { label: 'Emotion', icon: <RiEmotionLine size={24} />, path: '/emotion' },
    { label: 'Chatbot', icon: <RiMessage2Line size={24} />, path: '/chatbot' },
    { label: 'Therapists', icon: <RiMapPinLine size={24} />, path: '/therapists' },
    { label: 'Meditations', icon: <RiBookReadLine size={24} />, path: '/meditations' },
    { label: 'Resources', icon: <RiBookReadLine size={24} />, path: '/resources' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    // This div now uses `h-screen` instead of `min-h-screen` to work with the locked body
    <div className="flex h-screen bg-[var(--color-background)]">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ duration: 0.3 }}
            // Added h-full to ensure sidebar stretches
            className="w-64 h-full flex-shrink-0 border-r border-white/10 bg-[var(--color-surface)]/80 backdrop-blur-sm p-6"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12 text-center"
            >
              <motion.h1
                whileHover={{ scale: 1.05 }}
                className="text-3xl font-bold bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] bg-clip-text text-transparent"
              >
                EmoCare+
              </motion.h1>
              <p className="mt-2 text-xs text-[var(--color-text-muted)]">Your wellness companion</p>
            </motion.div>
            <nav>
              <ul>
                {navItems.map((item) => (
                  <NavItem
                    key={item.label}
                    icon={item.icon}
                    label={item.label}
                    isActive={location.pathname.startsWith(item.path)}
                    onClick={() => navigate(item.path)}
                  />
                ))}
              </ul>
            </nav>
            <motion.div className="mt-auto pt-6 border-t border-white/10">
              <NavItem
                icon={<RiLogoutBoxLine size={24} />}
                label="Logout"
                onClick={handleLogout}
              />
            </motion.div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {/* Top Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="border-b border-white/10 bg-[var(--color-surface)]/50 backdrop-blur-md p-6"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="rounded-lg p-2 hover:bg-[var(--color-surface-light)] text-[var(--color-primary)]"
          >
            {sidebarOpen ? (
              <RiMenuFold3Line size={24} />
            ) : (
              <RiMenuUnfold3Line size={24} />
            )}
          </motion.button>
        </motion.div>

        {/* Scrollable Content Area */}
        <div className={`flex-1 ${isChatPage ? 'overflow-hidden' : 'overflow-y-auto'}`}>
          <div className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 ${isChatPage ? 'h-full flex flex-col' : ''}`}>
            
            {/* --- THIS IS THE FIX --- */}
            {/* Only show the Header if it's NOT the chat page */}
            {!isChatPage && <Header title={pageTitle} infoContent={infoContent} />}

            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              // This logic is correct and will now work as intended
              className={
                isChatPage
                  ? 'flex-1 flex flex-col min-h-0' // Use flex-1 behavior on chat page
                  : 'min-h-[calc(100vh-200px)]' // Use min-height on all other pages
              }
            >
              {children}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Layout;