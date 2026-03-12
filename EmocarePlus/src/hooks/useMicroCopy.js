import { useMemo } from 'react';
import { useEmotion } from '../contexts/EmotionContext';

/* ─────────────────────────────────────────────
   useMicroCopy — Emotion-Aware UI Text System
   Returns context-specific copy that adapts to
   the user's current emotional state.
   
   Usage:
     const mc = useMicroCopy();
     mc.greeting     → "Hey, take it easy…"
     mc.journalCta   → "Talk it out"
     mc.navLabel('Dashboard') → "Safe Space"
   ───────────────────────────────────────────── */

const COPY_MAP = {
  angry: {
    greeting: 'Let\'s take a breather first',
    journalCta: 'Release your thoughts',
    scanCta: 'Let me check in on you',
    stressCta: 'Understand what\'s behind this',
    chatCta: 'Talk it out safely',
    breathingCta: 'Cool down together',
    meditationCta: 'Find your calm',
    dashboardTitle: 'Grounding Space',
    encouragement: 'It takes strength to feel this deeply.',
    navOverrides: {
      Dashboard: 'Grounding Space',
      Chatbot: 'Talk It Out',
      Meditations: 'Find Calm',
    },
  },
  stressed: {
    greeting: 'Let\'s slow things down together',
    journalCta: 'Unload your mind',
    scanCta: 'Quick check-in',
    stressCta: 'See what\'s happening',
    chatCta: 'I\'m here to listen',
    breathingCta: 'Breathe with me',
    meditationCta: 'Decompress',
    dashboardTitle: 'Your Safe Zone',
    encouragement: 'One step at a time — you\'re doing great.',
    navOverrides: {
      Dashboard: 'Safe Zone',
      Chatbot: 'Vent Space',
      Stress: 'Decompress',
    },
  },
  sad: {
    greeting: 'It\'s okay to feel this way',
    journalCta: 'Tell me what\'s on your mind',
    scanCta: 'Let\'s see how you\'re doing',
    stressCta: 'Gently check in',
    chatCta: 'I\'m right here with you',
    breathingCta: 'Gentle breathing',
    meditationCta: 'Something soothing',
    dashboardTitle: 'Your Comfort Zone',
    encouragement: 'Even clouds move. This will too.',
    navOverrides: {
      Dashboard: 'Comfort Zone',
      Chatbot: 'Heart to Heart',
      Meditations: 'Soothing Sounds',
    },
  },
  fear: {
    greeting: 'You\'re safe here',
    journalCta: 'Write what scares you',
    scanCta: 'Gentle check-in',
    stressCta: 'Let\'s understand this',
    chatCta: 'Talk through it',
    breathingCta: 'Steady your breath',
    meditationCta: 'Calming space',
    dashboardTitle: 'Your Safe Space',
    encouragement: 'Courage is feeling scared and doing it anyway.',
    navOverrides: {
      Dashboard: 'Safe Space',
      Chatbot: 'Talk Through It',
    },
  },
  happy: {
    greeting: 'You\'re glowing today!',
    journalCta: 'Capture this moment',
    scanCta: 'Smile check! 📸',
    stressCta: 'Keep the balance',
    chatCta: 'Share your joy',
    breathingCta: 'Amplify the calm',
    meditationCta: 'Elevate your vibe',
    dashboardTitle: 'Sunshine Dashboard',
    encouragement: 'Your energy is contagious — keep shining!',
    navOverrides: {
      Dashboard: 'Sunshine Board',
      Chatbot: 'Share Joy',
      Meditations: 'Good Vibes',
    },
  },
  surprise: {
    greeting: 'Something caught your attention!',
    journalCta: 'Capture the moment',
    scanCta: 'What just happened?',
    stressCta: 'Process the unexpected',
    chatCta: 'Tell me about it',
    breathingCta: 'Centre yourself',
    meditationCta: 'Find your centre',
    dashboardTitle: 'Discovery Zone',
    encouragement: 'Surprise is the beginning of wonder.',
    navOverrides: {},
  },
  neutral: {
    greeting: 'Welcome back',
    journalCta: 'New Entry',
    scanCta: 'Scan Emotion',
    stressCta: 'Check Stress',
    chatCta: 'Start Chat',
    breathingCta: 'Guided Breathing',
    meditationCta: 'Browse Meditations',
    dashboardTitle: 'My Dashboard',
    encouragement: 'Consistency is its own superpower.',
    navOverrides: {},
  },
};

const useMicroCopy = () => {
  const { emotionKey, emotionConfig } = useEmotion();

  return useMemo(() => {
    const copy = COPY_MAP[emotionKey] || COPY_MAP.neutral;

    return {
      ...copy,
      /** Get emotion-aware nav label or fall back to original */
      navLabel: (originalLabel) =>
        copy.navOverrides[originalLabel] || originalLabel,

      /** The ambient text for the floating island */
      ambientText: emotionConfig.ambientText,

      /** Current emotion key for conditional rendering */
      emotionKey,
    };
  }, [emotionKey, emotionConfig]);
};

export default useMicroCopy;
