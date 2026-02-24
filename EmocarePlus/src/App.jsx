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

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
};

const pageInfo = {
  stress: '• Enter your daily health metrics.\n• Receive an AI-powered stress score from 0-10.\n• Get personalized exercises to help you relax.',
  chatbot: '• Chat with your supportive AI.\n• It knows your recent stress and emotion data to give you better advice.\n• A safe space to talk, 24/7.',
  emotion: '• Uses your camera to analyze your facial expression.\n• Provides continuous, real-time emotion feedback.',
  therapists: '• Grant location permission to find professionals near you.\n• Tap a pin on the map or an item in the list for details.\n• Get directions or call their office with one tap.',
  meditations: '• Browse guided audio sessions.\n• Choose between Beginner, Intermediate, and Advanced.\n• Tap any session to open the player.',
  resources: '• Access helpful mental health articles.\n• Find immediate crisis helplines.\n• Learn more about anxiety and stress.'
};

function App() {
  const { isLoading, token } = useAuth();

  if (isLoading) {
    return <SplashScreen />;
  }

  const hasSeenGetStarted = localStorage.getItem('hasSeenGetStarted');

  return (
    <>
      <InfoDialog />

      <Routes>
        <Route
          path="/get-started"
          element={token ? <Navigate to="/dashboard" replace /> : <GetStartedScreen />}
        />
        <Route
          path="/login"
          element={token ? <Navigate to="/dashboard" replace /> : <LoginScreen />}
        />

        <Route
          path="/"
          element={
            !token ? (
              hasSeenGetStarted ? (
                <Navigate to="/login" replace />
              ) : (
                <Navigate to="/get-started" replace />
              )
            ) : (
              <Navigate to="/dashboard" replace />
            )
          }
        />

        <Route
          element={
            <ProtectedRoute>
              <Outlet />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Layout pageTitle="My Dashboard"><Dashboard /></Layout>} />
          <Route path="/stress" element={<Layout pageTitle="Stress Prediction" infoContent={pageInfo.stress}><Stress /></Layout>} />
          <Route path="/emotion" element={<Layout pageTitle="Emotion Scanner" infoContent={pageInfo.emotion}><EmotionScanner /></Layout>} />
          <Route path="/chatbot" element={<Layout pageTitle="AI Companion" infoContent={pageInfo.chatbot}><Chatbot /></Layout>} />
          <Route path="/therapists" element={<Layout pageTitle="Therapist Finder" infoContent={pageInfo.therapists}><Therapists /></Layout>} />
          <Route path="/therapist-portal" element={<TherapistDashboard />} />
          <Route path="/cbt" element={<Layout pageTitle="Thought Record"><CbtScreen /></Layout>} />
          <Route path="/breathing" element={<Layout pageTitle="Guided Breathing"><BreathingScreen /></Layout>} />
          <Route path="/meditations" element={<Layout pageTitle="Meditations Library" infoContent={pageInfo.meditations}><MeditationsScreen /></Layout>} />
          <Route path="/meditations/:id" element={<Layout pageTitle="Meditation Player"><MeditationPlayer /></Layout>} />
          <Route path="/resources" element={<Layout pageTitle="Helpful Resources" infoContent={pageInfo.resources}><ResourcesScreen /></Layout>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;