import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
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
  RiCloseFill,
  RiLeafLine,
} from "react-icons/ri";
import { useInfoDialog } from "../../hooks/useInfoDialog";
import ThemeToggle from "./ThemeToggle"; // <-- NEW IMPORT

const MobileBackdrop = ({ onClick }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClick}
    className="fixed inset-0 z-40 bg-[#2D3E50]/40 backdrop-blur-sm md:hidden"
  />
);

const Header = ({ title, infoContent }) => {
  const { showInfo } = useInfoDialog();
  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mb-8 flex items-center justify-between"
    >
      <div>
        <h2 className="text-3xl font-bold text-text-main tracking-tight">
          {title}
        </h2>
      </div>

      {infoContent && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => showInfo(title, infoContent)}
          className="rounded-xl border border-border bg-surface-light p-2.5
                     text-text-muted transition-all hover:border-[#5B9BD5]
                     hover:text-[#5B9BD5] hover:bg-[#EEF6FC]"
        >
          <RiInformationLine size={22} />
        </motion.button>
      )}
    </motion.div>
  );
};

const NavItem = ({ icon, label, isActive, onClick }) => (
  <motion.li
    whileHover={{ x: 3 }}
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    className={`relative my-0.5 flex cursor-pointer items-center rounded-xl
                px-3 py-2.5 transition-all duration-200
                ${isActive
        ? "bg-[#D6EAFC] text-[#5B9BD5] font-semibold"
        : "text-text-muted hover:bg-surface-light hover:text-text-main"
      }`}
  >
    {isActive && (
      <motion.div
        layoutId="activeIndicator"
        className="absolute -left-3 h-5 w-1 rounded-full bg-[#5B9BD5]"
      />
    )}
    <span className="flex-shrink-0">{icon}</span>
    <span className="ml-3 text-sm">{label}</span>
  </motion.li>
);

const Layout = ({ pageTitle, infoContent, children }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isClient, setIsClient] = useState(false);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 768 : false
  );
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const check = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (mobileSidebarOpen) setMobileSidebarOpen(false);
  }, [location.pathname]);

  const isAppPage =
    location.pathname.startsWith("/chatbot") ||
    location.pathname.startsWith("/therapists");

  const navItems = [
    { label: "Dashboard", icon: <RiDashboardLine size={20} />, path: "/dashboard" },
    { label: "Stress", icon: <RiHeartPulseLine size={20} />, path: "/stress" },
    { label: "Emotion", icon: <RiEmotionLine size={20} />, path: "/emotion" },
    { label: "Chatbot", icon: <RiMessage2Line size={20} />, path: "/chatbot" },
    { label: "Therapists", icon: <RiMapPinLine size={20} />, path: "/therapists" },
    { label: "Meditations", icon: <RiLeafLine size={20} />, path: "/meditations" },
    { label: "Resources", icon: <RiBookReadLine size={20} />, path: "/resources" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleSidebar = () => {
    if (isDesktop) {
      setDesktopSidebarOpen(!desktopSidebarOpen);
    } else {
      setMobileSidebarOpen(!mobileSidebarOpen);
    }
  };

  const isSidebarVisible =
    isClient && (mobileSidebarOpen || (isDesktop && desktopSidebarOpen));

  return (
    <div className="flex h-screen bg-background">

      <AnimatePresence>
        {mobileSidebarOpen && (
          <MobileBackdrop onClick={() => setMobileSidebarOpen(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isSidebarVisible && (
          <motion.aside
            initial={{ x: -272 }}
            animate={{ x: 0 }}
            exit={{ x: -272 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            className="fixed inset-y-0 left-0 z-50 w-64 flex-shrink-0
                       border-r border-border bg-surface px-5 py-6"
            style={{ boxShadow: '4px 0 24px rgba(91,155,213,0.08)' }}
          >
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-text-muted
                         hover:bg-surface-light hover:text-text-main transition-colors md:hidden"
            >
              <RiCloseFill size={20} />
            </button>

            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 text-center"
            >
              <motion.h1
                whileHover={{ scale: 1.04 }}
                className="text-2xl font-bold bg-gradient-to-r from-[#5B9BD5]
                           to-[#72C5A8] bg-clip-text text-transparent"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                EmoCare+
              </motion.h1>
              <p className="mt-1.5 text-xs text-text-muted">Your wellness companion</p>
            </motion.div>

            <nav className="flex-1">
              <ul className="space-y-0.5">
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

            <div className="mt-auto border-t border-border pt-4">
              <NavItem
                icon={<RiLogoutBoxLine size={20} />}
                label="Logout"
                onClick={handleLogout}
              />
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      <main
        className="flex flex-1 flex-col overflow-hidden transition-all duration-300"
        style={{ paddingLeft: isDesktop && desktopSidebarOpen ? 256 : 0 }}
      >
        {/* Topbar */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between border-b border-border bg-surface px-5 py-3.5"
          style={{ boxShadow: '0 1px 8px rgba(91,155,213,0.07)' }}
        >
          <motion.button
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleSidebar}
            className="rounded-xl p-2 text-[#5B9BD5] transition-colors hover:bg-[#EEF6FC]"
          >
            {(isDesktop ? desktopSidebarOpen : mobileSidebarOpen)
              ? <RiMenuFold3Line size={22} />
              : <RiMenuUnfold3Line size={22} />
            }
          </motion.button>

          <ThemeToggle />
        </motion.div>

        {/* Page content */}
        <div className={`flex-1 ${isAppPage ? "overflow-hidden flex flex-col" : "overflow-y-auto"}`}>
          <div
            className={`w-full max-w-7xl mx-auto flex flex-col
              ${isAppPage ? "h-full py-4" : "py-6 md:py-10"}
              px-4 sm:px-6 lg:px-8`}
          >
            {/* Always show the header now so the Info button is accessible! */}
            <Header title={pageTitle} infoContent={infoContent} />

            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className={isAppPage ? "flex-1 overflow-hidden" : "min-h-[calc(100vh-200px)]"}
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