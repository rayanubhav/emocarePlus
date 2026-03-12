import React, { useMemo, useRef, useEffect } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useEmotion } from '../../contexts/EmotionContext';

/* ─────────────────────────────────────────────
   EmotionBackdrop — Animated mesh-gradient layer
   Lives behind all page content in the Layout.
   Transforms color, speed, and grain based on
   the current detected emotion.
   ───────────────────────────────────────────── */

/** Build a CSS mesh-gradient string from 4 colours at varying positions */
const buildMeshGradient = (colors, phase = 0) => {
  const positions = [
    { x: 20 + Math.sin(phase) * 15, y: 20 + Math.cos(phase) * 10 },
    { x: 80 + Math.cos(phase * 0.7) * 12, y: 25 + Math.sin(phase * 0.8) * 15 },
    { x: 35 + Math.sin(phase * 1.2) * 18, y: 75 + Math.cos(phase * 0.6) * 12 },
    { x: 75 + Math.cos(phase * 0.9) * 14, y: 80 + Math.sin(phase * 1.1) * 10 },
  ];

  return colors.map((color, i) => {
    const p = positions[i % positions.length];
    return `radial-gradient(ellipse at ${p.x}% ${p.y}%, ${color}44 0%, transparent 60%)`;
  }).join(', ');
};

const EmotionBackdrop = () => {
  const { emotionConfig, emotionKey } = useEmotion();
  const { gradient } = emotionConfig;
  const canvasRef = useRef(null);
  const animRef = useRef(null);
  const phaseRef = useRef(0);

  // Grain noise overlay (once)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || gradient.grain <= 0) return;
    const ctx = canvas.getContext('2d');
    canvas.width = 200;
    canvas.height = 200;
    const imageData = ctx.createImageData(200, 200);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const v = Math.random() * 255;
      imageData.data[i] = v;
      imageData.data[i + 1] = v;
      imageData.data[i + 2] = v;
      imageData.data[i + 3] = 25; // subtle
    }
    ctx.putImageData(imageData, 0, 0);
  }, [gradient.grain]);

  // Animated gradient via requestAnimationFrame
  const backdropRef = useRef(null);

  useEffect(() => {
    let running = true;
    const speed = gradient.speed || 10;

    const animate = () => {
      if (!running || !backdropRef.current) return;
      phaseRef.current += (1 / (60 * speed)) * Math.PI * 2;
      backdropRef.current.style.backgroundImage = buildMeshGradient(gradient.colors, phaseRef.current);
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => {
      running = false;
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [gradient.colors, gradient.speed]);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={emotionKey}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 1.8, ease: 'easeInOut' }}
        className="pointer-events-none fixed inset-0 z-0"
        aria-hidden="true"
      >
        {/* Main mesh gradient layer */}
        <div
          ref={backdropRef}
          className="absolute inset-0"
          style={{
            filter: `blur(${gradient.blur}px)`,
            opacity: 0.35,
            backgroundImage: buildMeshGradient(gradient.colors, 0),
            transition: 'filter 2s ease',
          }}
        />

        {/* Noise grain overlay */}
        {gradient.grain > 0 && (
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full"
            style={{
              opacity: gradient.grain,
              mixBlendMode: 'overlay',
              imageRendering: 'pixelated',
            }}
          />
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default EmotionBackdrop;
