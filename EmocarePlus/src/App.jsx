import React from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

import SplashScreen from './pages/SplashScreen';
import GetStartedScreen from './pages/GetStartedScreen';
import LoginScreen from './pages/LoginScreen';

import Layout from './components/common/Layout';
import InfoDialog from './components/common/InfoDialog';
import Dashboard from './pages/Dashboard';
import Stress from './pages/Stress';
import EmotionScanner from './pages/EmotionScanner';
import Chatbot from './pages/Chatbot';
import Therapists from './pages/Therapists';
import CbtScreen from './pages/CbtScreen';
import BreathingScreen from './pages/BreathingScreen';
import MeditationsScreen from './pages/MeditationsScreen';
import MeditationPlayer from './pages/MeditationPlayer';
import ResourcesScreen from './pages/ResourcesScreen';
import TherapistDashboard from './pages/TherapistDashboard';
import InsightsPage from './pages/InsightsPage';

// Basic Login Check
const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
};

// Advanced Role Check
const RoleRoute = ({ allowedRoles, children }) => {
  const { user, role } = useAuth();
  const currentRole = role || user?.role;
  if (!user) return null;

  if (!allowedRoles.includes(currentRole)) {
    return <Navigate to={currentRole === 'therapist' ? '/therapist-portal' : '/dashboard'} replace />;
  }
  return children ? children : <Outlet />;
};

/** Resolve where to send an authenticated user based on role */
const RoleBasedHome = () => {
  const { role, user } = useAuth();
  const currentRole = role || user?.role || 'user';
  return currentRole === 'therapist'
    ? <Navigate to="/therapist-portal" replace />
    : <Navigate to="/dashboard" replace />;
};

const pageInfo = {
  stress: '• Enter daily health metrics. • Get AI stress score. • Personalized exercises.',
  chatbot: '• 24/7 AI companion. • Context-aware support.',
  emotion: '• Real-time facial analysis. • Feedback on dominant moods.',
  therapists: '• Find local professionals. • Map and contact info.',
  meditations: '• Browse guided sessions. • Multiple difficulty levels.',
  resources: '• Crisis helplines. • Informative articles.',
  insights: '• AI-powered weekly analysis. • Emotional pattern detection. • Growth milestones.',
};

function App() {
  const { isLoading, token } = useAuth();

  if (isLoading) return <SplashScreen />;

  const hasSeenGetStarted = localStorage.getItem('hasSeenGetStarted');

  return (
    <>
      <InfoDialog />
      <Routes>
        <Route path="/get-started" element={token ? <RoleBasedHome /> : <GetStartedScreen />} />
        <Route path="/login" element={token ? <RoleBasedHome /> : <LoginScreen />} />

        <Route path="/" element={
          !token
            ? (hasSeenGetStarted ? <Navigate to="/login" replace /> : <Navigate to="/get-started" replace />)
            : <RoleBasedHome />
        } />

        <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>

          {/* PATIENT TOOLS */}
          <Route element={<RoleRoute allowedRoles={['user']} />}>
            <Route path="/dashboard" element={<Layout pageTitle="My Dashboard"><Dashboard /></Layout>} />
            <Route path="/stress" element={<Layout pageTitle="Stress Prediction" infoContent={pageInfo.stress}><Stress /></Layout>} />
            <Route path="/emotion" element={<Layout pageTitle="Emotion Scanner" infoContent={pageInfo.emotion}><EmotionScanner /></Layout>} />
            <Route path="/chatbot" element={<Layout pageTitle="AI Companion" infoContent={pageInfo.chatbot}><Chatbot /></Layout>} />
            <Route path="/cbt" element={<Layout pageTitle="Thought Record"><CbtScreen /></Layout>} />
            <Route path="/breathing" element={<Layout pageTitle="Guided Breathing"><BreathingScreen /></Layout>} />
            <Route path="/insights" element={<Layout pageTitle="Weekly Insights" infoContent={pageInfo.insights}><InsightsPage /></Layout>} />
            <Route path="/meditations" element={<Layout pageTitle="Meditations Library" infoContent={pageInfo.meditations}><MeditationsScreen /></Layout>} />
            <Route path="/meditations/:id" element={<Layout pageTitle="Meditation Player"><MeditationPlayer /></Layout>} />
          </Route>

          {/* SHARED TOOLS */}
          <Route path="/therapists" element={<Layout pageTitle="Therapist Finder" infoContent={pageInfo.therapists}><Therapists /></Layout>} />
          <Route path="/resources" element={<Layout pageTitle="Helpful Resources" infoContent={pageInfo.resources}><ResourcesScreen /></Layout>} />

          {/* SPECIALIST TOOLS */}
          <Route element={<RoleRoute allowedRoles={['therapist']} />}>
            <Route path="/therapist-portal" element={<TherapistDashboard />} />
          </Route>

        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;