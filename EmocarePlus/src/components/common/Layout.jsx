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

/*
 * CHANGES vs original:
 *
 * MobileBackdrop:
 *   bg-black/60 → bg-[#2D3E50]/40
 *   WHY: Softer navy tint matches the app's color story.
 *
 * Header (page title):
 *   bg-gradient neon text-transparent → plain text-[#2D3E50]
 *   WHY: Gradient text on dark bg looks electric. On light bg it reads as
 *   muddy or low-contrast. A clean dark navy heading is more readable and
 *   professional-looking.
 *
 *   Info button: bg-surface-light/60 hover neon → soft #F7FAFC hover with border
 *   WHY: Consistent with ghost button pattern across the app.
 *
 * NavItem:
 *   Active: gradient from primary-rgb → solid primary-lt bg, primary text
 *   WHY: On dark bg the gradient looked glowing. On light bg a solid
 *   primary-lt bg with primary-colored text is cleaner and more legible.
 *
 *   Active indicator dot: stays, but uses the same primary blue.
 *
 *   Inactive: text-muted hover:bg-surface-light/50 hover:text-white
 *   → text-muted hover:bg-[#EEF3F8] hover:text-[#2D3E50]
 *   WHY: hover:text-white flashes harshly on light bg.
 *
 * Sidebar:
 *   border-white/10 bg-surface/80 backdrop-blur → border-[#D9E6F2] bg-white
 *   WHY: On light theme, semi-transparent glass panels look washed out.
 *   A solid white sidebar is crisper with better contrast.
 *
 *   Logo gradient: kept — works on white bg too, just slightly toned down.
 *   Subtitle: text-muted → text-[#7A90A4] explicit.
 *
 *   Nav bottom border: border-white/10 → border-[#D9E6F2]
 *   Logout item: hover pattern updated to match inactive NavItem.
 *
 * Topbar:
 *   border-white/10 bg-surface/50 backdrop-blur → border-[#D9E6F2] bg-white
 *   WHY: Solid white topbar reads as a clean, distinct layer from page content.
 *   Added box-shadow on the topbar for depth without neon glow.
 *
 *   Hamburger button: hover:bg-surface-light → hover:bg-[#EEF3F8]
 *
 * Main layout bg:
 *   bg-[var(--color-background)] → bg-[#F0F4F8]
 *   WHY: Explicit value so it doesn't depend on the old dark CSS var.
 */

// ── Mobile backdrop ────────────────────────────────────────────
const MobileBackdrop = ({ onClick }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClick}
    // WHY: Soft navy tint instead of black — less jarring
    className="fixed inset-0 z-40 bg-[#2D3E50]/40 backdrop-blur-sm md:hidden"
  />
);

// ── Page header (title + info button) ─────────────────────────
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
        {/*
         * WHY: Replaced the neon gradient text-transparent heading with plain
         * dark navy. Gradient text on light bg looks muddy and loses contrast.
         * Simple bold text is more readable and professional.
         */}
        <h2 className="text-3xl font-bold text-[#2D3E50] tracking-tight">
          {title}
        </h2>
      </div>

      {infoContent && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => showInfo(title, infoContent)}
          // WHY: bg-surface-light/60 on dark → explicit light ghost button
          className="rounded-xl border border-[#D9E6F2] bg-[#F7FAFC] p-2.5
                     text-[#7A90A4] transition-all hover:border-[#5B9BD5]
                     hover:text-[#5B9BD5] hover:bg-[#EEF6FC]"
        >
          <RiInformationLine size={22} />
        </motion.button>
      )}
    </motion.div>
  );
};

// ── Sidebar nav item ───────────────────────────────────────────
const NavItem = ({ icon, label, isActive, onClick }) => (
  <motion.li
    whileHover={{ x: 3 }}
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    className={`relative my-0.5 flex cursor-pointer items-center rounded-xl
                px-3 py-2.5 transition-all duration-200
                ${isActive
                  // WHY: Active gradient → primary-lt bg with primary text.
                  // Solid fill reads cleanly on white sidebar; no glow needed.
                  ? "bg-[#D6EAFC] text-[#5B9BD5] font-semibold"
                  // WHY: hover:text-white → hover:text-[#2D3E50] — stays in palette
                  : "text-[#7A90A4] hover:bg-[#EEF3F8] hover:text-[#2D3E50]"
                }`}
  >
    {/* Active left-edge indicator dot */}
    {isActive && (
      <motion.div
        layoutId="activeIndicator"
        className="absolute -left-3 h-5 w-1 rounded-full bg-[#5B9BD5]"
        // WHY: Changed from dot to a taller pill — clearer vertical alignment cue
      />
    )}
    {/* Icon: inherit color from parent li */}
    <span className="flex-shrink-0">{icon}</span>
    <span className="ml-3 text-sm">{label}</span>
  </motion.li>
);

// ── Main Layout ────────────────────────────────────────────────
const Layout = ({ pageTitle, infoContent, children }) => {
  const { logout } = useAuth();
  const navigate   = useNavigate();
  const location   = useLocation();

  const [isClient, setIsClient]           = useState(false);
  const [isDesktop, setIsDesktop]         = useState(
    typeof window !== "undefined" ? window.innerWidth >= 768 : false
  );
  const [mobileSidebarOpen, setMobileSidebarOpen]   = useState(false);
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
    { label: "Dashboard",   icon: <RiDashboardLine  size={20} />, path: "/dashboard"  },
    { label: "Stress",      icon: <RiHeartPulseLine size={20} />, path: "/stress"     },
    { label: "Emotion",     icon: <RiEmotionLine    size={20} />, path: "/emotion"    },
    { label: "Chatbot",     icon: <RiMessage2Line   size={20} />, path: "/chatbot"    },
    { label: "Therapists",  icon: <RiMapPinLine     size={20} />, path: "/therapists" },
    { label: "Meditations", icon: <RiLeafLine       size={20} />, path: "/meditations"},
    { label: "Resources",   icon: <RiBookReadLine   size={20} />, path: "/resources"  },
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
    // WHY: bg-[var(--color-background)] → explicit #F0F4F8 so the layout
    // renders correctly even before the CSS variable update is deployed.
    <div className="flex h-screen bg-[#F0F4F8]">

      {/* Mobile backdrop */}
      <AnimatePresence>
        {mobileSidebarOpen && (
          <MobileBackdrop onClick={() => setMobileSidebarOpen(false)} />
        )}
      </AnimatePresence>

      {/* ── Sidebar ───────────────────────────────────────────── */}
      <AnimatePresence>
        {isSidebarVisible && (
          <motion.aside
            initial={{ x: -272 }}
            animate={{ x: 0 }}
            exit={{ x: -272 }}
            transition={{ duration: 0.28, ease: "easeInOut" }}
            /*
             * WHY: bg-surface/80 backdrop-blur-sm → solid white.
             * Glassmorphism on a light bg looks washed out. Solid white with
             * a thin border creates a clean, distinct sidebar layer.
             */
            className="fixed inset-y-0 left-0 z-50 w-64 flex-shrink-0
                       border-r border-[#D9E6F2] bg-white px-5 py-6"
            style={{ boxShadow: '4px 0 24px rgba(91,155,213,0.08)' }}
          >
            {/* Mobile close button */}
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-[#7A90A4]
                         hover:bg-[#EEF3F8] hover:text-[#2D3E50] transition-colors md:hidden"
            >
              <RiCloseFill size={20} />
            </button>

            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 text-center"
            >
              {/*
               * WHY: Gradient text is kept — it works on white bg too,
               * just uses the calming blue-to-green tokens.
               */}
              <motion.h1
                whileHover={{ scale: 1.04 }}
                className="text-2xl font-bold bg-gradient-to-r from-[#5B9BD5]
                           to-[#72C5A8] bg-clip-text text-transparent"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                EmoCare+
              </motion.h1>
              <p className="mt-1.5 text-xs text-[#7A90A4]">Your wellness companion</p>
            </motion.div>

            {/* Nav */}
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

            {/* Logout */}
            {/* WHY: border-white/10 → border-[#D9E6F2] */}
            <div className="mt-auto border-t border-[#D9E6F2] pt-4">
              <NavItem
                icon={<RiLogoutBoxLine size={20} />}
                label="Logout"
                onClick={handleLogout}
              />
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── Main content ──────────────────────────────────────── */}
      <main
        className="flex flex-1 flex-col overflow-hidden transition-all duration-300"
        style={{ paddingLeft: isDesktop && desktopSidebarOpen ? 256 : 0 }}
      >
        {/* Topbar */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          /*
           * WHY: border-white/10 bg-surface/50 backdrop-blur → solid white + border.
           * A crisp topbar with a very light shadow creates depth without blur artifacts.
           */
          className="flex items-center border-b border-[#D9E6F2] bg-white px-5 py-3.5"
          style={{ boxShadow: '0 1px 8px rgba(91,155,213,0.07)' }}
        >
          <motion.button
            whileHover={{ scale: 1.07 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleSidebar}
            // WHY: hover:bg-surface-light (dark) → explicit light hover
            className="rounded-xl p-2 text-[#5B9BD5] transition-colors hover:bg-[#EEF6FC]"
          >
            {(isDesktop ? desktopSidebarOpen : mobileSidebarOpen)
              ? <RiMenuFold3Line   size={22} />
              : <RiMenuUnfold3Line size={22} />
            }
          </motion.button>
        </motion.div>

        {/* Page content */}
        <div className={`flex-1 ${isAppPage ? "overflow-hidden" : "overflow-y-auto"}`}>
          <div
            className={`w-full max-w-7xl mx-auto
              ${isAppPage ? "h-full" : "py-6 md:py-10"}
              px-4 sm:px-6 lg:px-8`}
          >
            {!isAppPage && (
              <Header title={pageTitle} infoContent={infoContent} />
            )}

            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.3 }}
              className={isAppPage ? "h-full" : "min-h-[calc(100vh-200px)]"}
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