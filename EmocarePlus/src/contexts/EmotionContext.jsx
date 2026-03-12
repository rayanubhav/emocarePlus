import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const EmotionContext = createContext();

/* ─────────────────────────────────────────────
   Emotion → Visual Config Mapping
   Maps detected emotions to mesh-gradient palettes,
   animation speeds, and ambient descriptions.
   ───────────────────────────────────────────── */
const EMOTION_CONFIGS = {
  angry: {
    key: 'angry',
    label: 'Intense',
    gradient: {
      // Deep reds, warm purples – fast grain  
      colors: ['#C0504D', '#8B3A62', '#4A1942', '#D4726A'],
      speed: 4,           // seconds per cycle (faster = more intense)
      blur: 24,
      grain: 0.15,        // noise overlay opacity
    },
    accent: '#C0504D',
    ambientText: 'Taking a moment to breathe…',
  },
  stressed: {
    key: 'stressed',
    label: 'Tense',
    gradient: {
      colors: ['#E07B7B', '#D4726A', '#C0504D', '#B8860B'],
      speed: 5,
      blur: 28,
      grain: 0.1,
    },
    accent: '#E07B7B',
    ambientText: 'Let\'s slow things down together.',
  },
  sad: {
    key: 'sad',
    label: 'Reflective',
    gradient: {
      // Pale blues, soft indigos – slow water movement
      colors: ['#7BA7CC', '#5B7FA5', '#8EAFC6', '#A4C3D2'],
      speed: 10,
      blur: 44,
      grain: 0.04,
    },
    accent: '#7BA7CC',
    ambientText: 'It\'s okay to feel this way.',
  },
  fear: {
    key: 'fear',
    label: 'Cautious',
    gradient: {
      colors: ['#8B7EC8', '#6B5FA0', '#9B8FD0', '#7BA7CC'],
      speed: 7,
      blur: 36,
      grain: 0.08,
    },
    accent: '#8B7EC8',
    ambientText: 'You are safe here.',
  },
  happy: {
    key: 'happy',
    label: 'Radiant',
    gradient: {
      // Warm peaches, soft greens – gentle shimmer
      colors: ['#FFD4A8', '#72C5A8', '#FFE0C0', '#A8E6CF'],
      speed: 8,
      blur: 40,
      grain: 0.02,
    },
    accent: '#72C5A8',
    ambientText: 'Your energy is wonderful today!',
  },
  surprise: {
    key: 'surprise',
    label: 'Alert',
    gradient: {
      colors: ['#FFD166', '#EF8354', '#FFE0A8', '#F4A261'],
      speed: 6,
      blur: 32,
      grain: 0.05,
    },
    accent: '#FFD166',
    ambientText: 'Something caught your attention!',
  },
  neutral: {
    key: 'neutral',
    label: 'Balanced',
    gradient: {
      // Current theme tones – barely moving
      colors: ['#5B9BD5', '#72C5A8', '#D6EAFC', '#D4F2E8'],
      speed: 14,
      blur: 48,
      grain: 0,
    },
    accent: '#5B9BD5',
    ambientText: 'Feeling steady today.',
  },
};

const DARK_OVERRIDES = {
  angry:    { colors: ['#7A2D3A', '#5C1E3E', '#3A0F2E', '#8B4456'] },
  stressed: { colors: ['#8B4456', '#7A3B48', '#6B2D3A', '#7A6620'] },
  sad:      { colors: ['#3B5670', '#2D4558', '#4A6880', '#5A7A90'] },
  fear:     { colors: ['#5A4D8A', '#4A3F72', '#6A5D9A', '#3B5670'] },
  happy:    { colors: ['#8A6B40', '#3A7A5A', '#9A7B50', '#5A8A6A'] },
  surprise: { colors: ['#8A6820', '#7A4A2A', '#9A7830', '#8A5A30'] },
  neutral:  { colors: ['#2A5A7A', '#3A6A5A', '#1A3A47', '#1E4454'] },
};

/** Normalise various emotion strings to our config keys */
const normalizeEmotion = (raw) => {
  if (!raw) return 'neutral';
  const lower = raw.toLowerCase().trim();
  
  const aliases = {
    angry: ['angry', 'anger', 'furious', 'irritated', 'frustrated'],
    stressed: ['stressed', 'anxious', 'anxiety', 'overwhelmed', 'tense'],
    sad: ['sad', 'sadness', 'depressed', 'down', 'melancholy', 'grief'],
    fear: ['fear', 'afraid', 'scared', 'fearful', 'nervous', 'worried'],
    happy: ['happy', 'joy', 'joyful', 'excited', 'content', 'calm', 'peaceful'],
    surprise: ['surprise', 'surprised', 'shocked', 'amazed'],
    neutral: ['neutral', 'normal', 'fine', 'okay', 'ok'],
  };
  
  for (const [key, words] of Object.entries(aliases)) {
    if (words.includes(lower)) return key;
  }
  return 'neutral';
};

export const EmotionProvider = ({ children }) => {
  const [rawEmotion, setRawEmotion] = useState(() => {
    return localStorage.getItem('last_emotion') || 'neutral';
  });
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Detect dark mode
  const [isDark, setIsDark] = useState(() =>
    document.documentElement.classList.contains('dark')
  );

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  // Sync from localStorage changes (cross-tab or other components writing)
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'last_emotion' && e.newValue) {
        setRawEmotion(e.newValue);
      }
    };
    window.addEventListener('storage', handleStorage);

    // Also poll every 3s for same-tab writes
    const interval = setInterval(() => {
      const stored = localStorage.getItem('last_emotion');
      if (stored && stored !== rawEmotion) {
        setRawEmotion(stored);
      }
    }, 3000);

    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, [rawEmotion]);

  const setEmotion = useCallback((emotion) => {
    const normalised = normalizeEmotion(emotion);
    localStorage.setItem('last_emotion', emotion);
    setRawEmotion(emotion);
  }, []);

  const emotionKey = useMemo(() => normalizeEmotion(rawEmotion), [rawEmotion]);

  const emotionConfig = useMemo(() => {
    const base = EMOTION_CONFIGS[emotionKey] || EMOTION_CONFIGS.neutral;
    if (isDark && DARK_OVERRIDES[emotionKey]) {
      return {
        ...base,
        gradient: { ...base.gradient, ...DARK_OVERRIDES[emotionKey] },
      };
    }
    return base;
  }, [emotionKey, isDark]);

  const value = useMemo(() => ({
    currentEmotion: rawEmotion,
    emotionKey,
    emotionConfig,
    setEmotion,
    isAiThinking,
    setIsAiThinking,
    EMOTION_CONFIGS,
  }), [rawEmotion, emotionKey, emotionConfig, setEmotion, isAiThinking]);

  return (
    <EmotionContext.Provider value={value}>
      {children}
    </EmotionContext.Provider>
  );
};

export const useEmotion = () => {
  const context = useContext(EmotionContext);
  if (!context) {
    throw new Error('useEmotion must be used within an EmotionProvider');
  }
  return context;
};

export default EmotionContext;
