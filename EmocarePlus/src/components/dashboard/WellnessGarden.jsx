import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

/* ─── Score → garden state mapping ─── */
const getGardenState = (score) => {
  // Backend returns 0-10, normalize to 0-100
  const s = Math.max(0, Math.min((score ?? 0) * 10, 100));

  if (s <= 30) {
    return {
      label: 'Flourishing',
      sky: ['#87CEEB', '#E0F4FF'],         // bright blue sky
      sun: '#FFD93D',
      sunGlow: 'rgba(255,217,61,0.3)',
      ground: ['#5AAE8A', '#3D8B5E'],      // vibrant greens
      trunk: '#7B5B3A',
      canopy: '#3CB371',
      canopyAlt: '#2E8B57',
      flowerScale: 1,
      flowerRotate: 0,
      flowerColors: ['#FF6B8A', '#FFB347', '#FF85C0', '#FFA07A', '#DDA0DD'],
      windSpeed: 6,
      fogOpacity: 0,
      saturation: 1,
      grassColor: '#4CAF50',
      breezeAmp: 3,
    };
  }
  if (s <= 70) {
    return {
      label: 'Holding Steady',
      sky: ['#B8C9D4', '#DDE6ED'],         // overcast
      sun: '#E8C547',
      sunGlow: 'rgba(232,197,71,0.15)',
      ground: ['#8DB98A', '#6E9B6A'],
      trunk: '#8B7355',
      canopy: '#7BAF6A',
      canopyAlt: '#6B9F5A',
      flowerScale: 0.7,
      flowerRotate: -8,
      flowerColors: ['#CC7A8A', '#CCA066', '#CC8AAA', '#CC8A6A', '#BB90BB'],
      windSpeed: 3.5,
      fogOpacity: 0.12,
      saturation: 0.7,
      grassColor: '#8AAE7A',
      breezeAmp: 6,
    };
  }
  return {
    label: 'Needs Care',
    sky: ['#6B7B8D', '#8E99A4'],           // stormy grey
    sun: '#A8A8A8',
    sunGlow: 'rgba(168,168,168,0.08)',
    ground: ['#7A8A6A', '#5A6A4A'],
    trunk: '#6B5B4B',
    canopy: '#5A6B4A',
    canopyAlt: '#4A5B3A',
    flowerScale: 0.4,
    flowerRotate: -25,
    flowerColors: ['#8A6A7A', '#8A7A5A', '#7A6A6A', '#7A6A5A', '#6A5A6A'],
    windSpeed: 1.8,
    fogOpacity: 0.35,
    saturation: 0.3,
    grassColor: '#6A7A5A',
    breezeAmp: 10,
  };
};

/* ─── Individual SVG sub-components ─── */

const Sky = ({ colors, sunColor, sunGlow }) => (
  <g>
    <defs>
      <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
        <motion.stop offset="0%" animate={{ stopColor: colors[0] }} transition={{ duration: 2 }} />
        <motion.stop offset="100%" animate={{ stopColor: colors[1] }} transition={{ duration: 2 }} />
      </linearGradient>
    </defs>
    <rect width="400" height="260" fill="url(#skyGrad)" />
    {/* Sun */}
    <motion.circle
      cx="320" cy="55"
      animate={{ r: 28, fill: sunColor }}
      transition={{ duration: 2 }}
    />
    <motion.circle
      cx="320" cy="55" r="42"
      animate={{ fill: sunGlow }}
      transition={{ duration: 2 }}
    />
  </g>
);

const Cloud = ({ x, y, speed, scale = 1 }) => (
  <motion.g
    animate={{ x: [x, x + 50, x] }}
    transition={{ duration: speed, repeat: Infinity, ease: 'easeInOut' }}
  >
    <g transform={`translate(0,${y}) scale(${scale})`}>
      <ellipse cx="0" cy="0" rx="28" ry="10" fill="white" opacity="0.4" />
      <ellipse cx="14" cy="-4" rx="18" ry="8" fill="white" opacity="0.35" />
      <ellipse cx="-10" cy="-3" rx="16" ry="7" fill="white" opacity="0.3" />
    </g>
  </motion.g>
);

const Tree = ({ state }) => {
  const { trunk, canopy, canopyAlt, breezeAmp, windSpeed } = state;
  return (
    <g transform="translate(200, 155)">
      {/* Trunk */}
      <motion.rect
        x="-8" y="0" width="16" rx="3"
        animate={{ height: 75, fill: trunk }}
        transition={{ duration: 2 }}
      />
      {/* Main canopy */}
      <motion.ellipse
        cx="0"
        animate={{ cy: -30, rx: 48, ry: 42, fill: canopy }}
        transition={{ duration: 2 }}
      />
      {/* Canopy detail */}
      <motion.ellipse
        cx="-18"
        animate={{ cy: -22, rx: 28, ry: 24, fill: canopyAlt }}
        transition={{ duration: 2 }}
      />
      <motion.ellipse
        cx="16"
        animate={{ cy: -34, rx: 30, ry: 26, fill: canopyAlt }}
        transition={{ duration: 2 }}
      />
      {/* Breeze sway on top of canopy */}
      <motion.ellipse
        cx="0"
        animate={{
          cy: -50,
          rx: [32, 32 + breezeAmp, 32],
          ry: [22, 22 - breezeAmp / 2, 22],
          fill: canopy,
        }}
        transition={{ duration: windSpeed, repeat: Infinity, ease: 'easeInOut' }}
      />
    </g>
  );
};

const Flower = ({ x, baseY, color, delay, state }) => {
  const { flowerScale, flowerRotate, windSpeed } = state;
  return (
    <motion.g
      animate={{
        scale: flowerScale,
        rotate: flowerRotate,
      }}
      transition={{ duration: 2, delay: delay * 0.1 }}
      style={{ originX: `${x}px`, originY: `${baseY}px` }}
    >
      {/* Stem */}
      <motion.line
        x1={x} x2={x}
        animate={{ y1: baseY, y2: baseY - 22 * flowerScale }}
        stroke="#5A8A4A"
        strokeWidth="1.8"
        strokeLinecap="round"
        transition={{ duration: 2 }}
      />
      {/* Petals */}
      {[0, 72, 144, 216, 288].map((angle) => (
        <motion.ellipse
          key={angle}
          cx={x}
          animate={{
            cy: baseY - 22 * flowerScale,
            rx: 4 * flowerScale,
            ry: 6 * flowerScale,
            fill: color,
          }}
          transform={`rotate(${angle} ${x} ${baseY - 22 * flowerScale})`}
          transition={{ duration: 2 }}
        />
      ))}
      {/* Center */}
      <motion.circle
        cx={x}
        animate={{
          cy: baseY - 22 * flowerScale,
          r: 2.5 * flowerScale,
          fill: '#FFD700',
        }}
        transition={{ duration: 2 }}
      />
    </motion.g>
  );
};

const GrassBlades = ({ state }) => {
  const { grassColor, windSpeed, breezeAmp } = state;
  const blades = useMemo(() =>
    Array.from({ length: 28 }, (_, i) => ({
      x: 12 + i * 14 + (i % 3) * 4,
      h: 10 + (i % 5) * 4,
      delay: i * 0.15,
    })),
    []
  );

  return (
    <g>
      {blades.map((b, i) => (
        <motion.line
          key={i}
          x1={b.x} y1={245}
          animate={{
            x2: [b.x - breezeAmp / 3, b.x + breezeAmp / 3, b.x - breezeAmp / 3],
            y2: 245 - b.h,
            stroke: grassColor,
          }}
          strokeWidth="2"
          strokeLinecap="round"
          transition={{
            x2: { duration: windSpeed * 0.7, repeat: Infinity, ease: 'easeInOut', delay: b.delay },
            y2: { duration: 2 },
            stroke: { duration: 2 },
          }}
        />
      ))}
    </g>
  );
};

const Ground = ({ colors }) => (
  <g>
    <defs>
      <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
        <motion.stop offset="0%" animate={{ stopColor: colors[0] }} transition={{ duration: 2 }} />
        <motion.stop offset="100%" animate={{ stopColor: colors[1] }} transition={{ duration: 2 }} />
      </linearGradient>
    </defs>
    {/* Rolling hill */}
    <motion.path
      d="M0 245 Q100 225 200 232 Q300 240 400 228 L400 300 L0 300 Z"
      fill="url(#groundGrad)"
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
    />
  </g>
);

const FogOverlay = ({ opacity }) => (
  <motion.rect
    x="0" y="0" width="400" height="300"
    fill="white"
    animate={{ opacity }}
    transition={{ duration: 2 }}
    style={{ mixBlendMode: 'overlay' }}
  />
);

/* ─── Main Component ─── */

const WellnessGarden = ({ stressScore, className = '' }) => {
  const state = useMemo(() => getGardenState(stressScore), [stressScore]);
  const normalizedScore = Math.max(0, Math.min((stressScore ?? 0) * 10, 100));

  const flowerPositions = useMemo(() => [
    { x: 55, y: 243 },
    { x: 90, y: 241 },
    { x: 130, y: 244 },
    { x: 270, y: 242 },
    { x: 310, y: 240 },
    { x: 345, y: 243 },
  ], []);

  return (
    <div className={`relative rounded-[20px] overflow-hidden bg-surface border border-border shadow-sm ${className}`}>
      {/* Accessible score tooltip — top-right corner */}
      <div
        className="absolute top-3 right-3 z-20 px-2.5 py-1 rounded-[10px] text-[11px] font-bold tabular-nums select-none"
        style={{
          backgroundColor: state.fogOpacity > 0.2 ? 'rgba(0,0,0,0.35)' : 'rgba(255,255,255,0.55)',
          color: state.fogOpacity > 0.2 ? '#fff' : 'var(--text-main)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.2)',
        }}
        title={`Stress score: ${stressScore ?? 'N/A'}/10 (${normalizedScore}%)`}
        role="status"
        aria-label={`Stress score: ${stressScore ?? 'N/A'} out of 10. Garden status: ${state.label}`}
      >
        {stressScore ?? '–'}/10 · {state.label}
      </div>

      <svg
        viewBox="0 0 400 300"
        className="w-full h-auto block"
        style={{ filter: `saturate(${state.saturation})` }}
        role="img"
        aria-label={`Wellness garden showing ${state.label} state`}
      >
        <Sky colors={state.sky} sunColor={state.sun} sunGlow={state.sunGlow} />

        {/* Clouds */}
        <Cloud x={40} y={35} speed={state.windSpeed * 3} scale={0.9} />
        <Cloud x={180} y={50} speed={state.windSpeed * 3.5} scale={0.7} />
        <Cloud x={280} y={28} speed={state.windSpeed * 2.8} scale={1} />

        <Ground colors={state.ground} />
        <GrassBlades state={state} />
        <Tree state={state} />

        {/* Flowers */}
        {flowerPositions.map((pos, i) => (
          <Flower
            key={i}
            x={pos.x}
            baseY={pos.y}
            color={state.flowerColors[i % state.flowerColors.length]}
            delay={i}
            state={state}
          />
        ))}

        <FogOverlay opacity={state.fogOpacity} />
      </svg>
    </div>
  );
};

export default WellnessGarden;
