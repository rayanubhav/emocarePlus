import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInfoDialog } from '../../hooks/useInfoDialog';
import { RiCloseFill, RiInformationLine } from 'react-icons/ri';

/*
 * CHANGES vs original:
 * - Overlay: bg-black/60 backdrop-blur-sm → bg-[#2D3E50]/40 backdrop-blur-md
 *   WHY: Dark navy overlay at 40% is softer and matches the app's color story
 *   rather than a generic black scrim.
 *
 * - Modal card: bg-[var(--color-surface)]/95 border-white/10 backdrop-blur-md
 *   → bg-white border-[#D9E6F2] no backdrop-blur
 *   WHY: On a light theme, glassmorphism reads as muddy. A clean white card
 *   with a soft border is crisper and more trustworthy-feeling.
 *
 * - Header border: border-white/10 → border-[#D9E6F2]
 *   WHY: Visible but not harsh divider — consistent with rest of app.
 *
 * - Info icon wobble animation: kept but slowed (6s vs 4s)
 *   WHY: The constant rotation on a 4s loop is subtly anxiety-inducing.
 *   6s feels more like a gentle reminder, less like an alert.
 *
 * - Title: text-white → text-[#2D3E50]
 *   WHY: Dark navy on white bg, WCAG AAA contrast.
 *
 * - Close button: text-muted hover:text-white → text-muted hover:text-[#2D3E50]
 *   WHY: Stays within the light palette — no sudden white flash.
 *   rotate(90deg) on hover kept — it's a nice micro-interaction.
 *
 * - Content: text-[var(--color-text-muted)] → text-[#7A90A4]
 *   WHY: Same muted slate, but now explicitly bound to the new token value.
 *
 * - Footer border: border-white/10 → border-[#D9E6F2]
 *
 * - "Got it" button: btn btn-primary → explicit primary blue button
 *   WHY: .btn-primary in the new index.css is already correct, but making it
 *   explicit ensures it renders right even before the CSS update is deployed.
 */

const InfoDialog = () => {
  const { isOpen, title, content, hideInfo } = useInfoDialog();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          // WHY: Softer navy overlay vs harsh black — feels calmer
          className="fixed inset-0 z-50 flex items-center justify-center
                     bg-[#2D3E50]/40 backdrop-blur-md px-4"
        >
          <motion.div
            initial={{ scale: 0.93, opacity: 0, y: -16 }}
            animate={{ scale: 1,    opacity: 1, y: 0    }}
            exit={{    scale: 0.93, opacity: 0, y: -16  }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            // WHY: White card + light border replaces glassmorphism.
            // Clean, readable, consistent with all other cards in the app.
            className="w-full max-w-md rounded-2xl bg-white border border-[#D9E6F2]"
            style={{ boxShadow: '0 8px 40px rgba(91,155,213,0.15)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#D9E6F2] px-6 py-5">
              <div className="flex items-center gap-3">
                {/* WHY: Slower wobble (6s) feels informative, not alarming */}
                <motion.div
                  animate={{ rotate: [0, 8, -8, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <RiInformationLine size={22} className="text-[#5B9BD5]" />
                </motion.div>
                {/* WHY: text-white → deep navy — readable on white bg */}
                <h3 className="text-base font-bold text-[#2D3E50]">{title}</h3>
              </div>

              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                onClick={hideInfo}
                // WHY: hover:text-white would flash harshly on light bg.
                // hover:text-[#2D3E50] gives dark feedback within the palette.
                className="rounded-lg p-1 text-[#7A90A4] transition-colors
                           hover:text-[#2D3E50] hover:bg-[#F7FAFC]"
              >
                <RiCloseFill size={22} />
              </motion.button>
            </div>

            {/* Content */}
            <div className="px-6 py-5">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#7A90A4]">
                {content}
              </p>
            </div>

            {/* Footer */}
            <div className="border-t border-[#D9E6F2] px-6 py-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={hideInfo}
                // WHY: Explicit primary blue — consistent "confirm/close" action.
                // Matches btn-primary in the updated index.css.
                className="w-full rounded-xl bg-[#5B9BD5] py-3 text-sm font-semibold
                           text-white transition-all hover:bg-[#4A88C0]"
                style={{ boxShadow: '0 3px 10px rgba(91,155,213,0.28)' }}
              >
                Got it
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InfoDialog;