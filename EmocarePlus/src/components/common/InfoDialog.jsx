import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInfoDialog } from '../../hooks/useInfoDialog';
import { RiCloseFill, RiInformationLine } from 'react-icons/ri';


const InfoDialog = () => {
  const { isOpen, title, content, hideInfo } = useInfoDialog();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center
                     bg-[#2D3E50]/40 backdrop-blur-md px-4"
        >
          <motion.div
            initial={{ scale: 0.93, opacity: 0, y: -16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.93, opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-full max-w-md rounded-2xl bg-surface border border-border"
            style={{ boxShadow: '0 8px 40px rgba(91,155,213,0.15)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-border px-6 py-5">
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ rotate: [0, 8, -8, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <RiInformationLine size={22} className="text-[#5B9BD5]" />
                </motion.div>
                <h3 className="text-base font-bold text-text-main">{title}</h3>
              </div>

              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                onClick={hideInfo}
                className="rounded-lg p-1 text-text-muted transition-colors
                           hover:text-text-main hover:bg-surface-light"
              >
                <RiCloseFill size={22} />
              </motion.button>
            </div>

            {/* Content */}
            <div className="px-6 py-5">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-text-muted">
                {content}
              </p>
            </div>

            {/* Footer */}
            <div className="border-t border-border px-6 py-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={hideInfo}
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