import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import {
  RiDashboardLine,
  RiHeartPulseLine,
  RiEmotionLine,
  RiMessage2Line,
  RiMapPinLine,
  RiLogoutBoxLine,
  RiBookReadLine, 
  RiInformationLine 
} from 'react-icons/ri';
import { useInfoDialog } from '../../hooks/useInfoDialog';

// Header component
const Header = ({ title, infoContent }) => {
  const { showInfo } = useInfoDialog();

  return (
    <div className="mb-6 flex items-center justify-between">
      <h2 className="text-3xl font-bold text-white">{title}</h2>
      {infoContent && (
        <button
          onClick={() => showInfo(title, infoContent)}
          className="text-[var(--color-text-muted)] transition-all hover:text-[var(--color-primary)]"
        >
          <RiInformationLine size={28} />
        </button>
      )}
    </div>
  );
};


// Navigation Item Component
const NavItem = ({ icon, label, isActive, onClick }) => (
  <li
    onClick={onClick}
    className={`flex items-center p-3 my-2 cursor-pointer rounded-lg transition-all duration-300 ${
      isActive
        ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)] shadow-lg'
        : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-white'
    }`}
  >
    {icon}
    <span className="ml-4 font-medium">{label}</span>
  </li>
);

// The Layout Component
// --- FIX 1: Add "children" to the props list ---
const Layout = ({ pageTitle, infoContent, children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
    <div className="flex min-h-screen bg-[var(--color-background)]">
      <aside className="flex w-64 flex-col justify-between bg-[var(--color-surface)] p-6 shadow-md">
        <div>
          <div className="mb-10 text-center">
            <h1 className="text-2xl font-bold text-[var(--color-primary)]">
              EmoCare+
            </h1>
          </div>
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
        </div>
        <div>
          <NavItem
            icon={<RiLogoutBoxLine size={24} />}
            label="Logout"
            onClick={handleLogout}
          />
        </div>
      </aside>

      <main className="flex-1 p-10">
        <Header title={pageTitle} infoContent={infoContent} />

        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="h-[calc(100vh-130px)]" // Adjust height for new header
        >
          {/* --- FIX 2: Render "children" instead of <Outlet /> --- */}
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default Layout;