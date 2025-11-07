import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInfoDialog } from '../../hooks/useInfoDialog';
import { RiCloseFill, RiInformationLine } from 'react-icons/ri';

const InfoDialog = () => {
  // Get state and actions from the global store
  const { isOpen, title, content, hideInfo } = useInfoDialog();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="w-full max-w-md rounded-xl bg-[var(--color-surface)] shadow-lg"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 p-4">
              <div className="flex items-center gap-3">
                <RiInformationLine size={22} className="text-[var(--color-primary)]" />
                <h3 className="text-lg font-semibold text-white">{title}</h3>
              </div>
              <button onClick={hideInfo} className="text-[var(--color-text-muted)] hover:text-white">
                <RiCloseFill size={24} />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <p className="whitespace-pre-wrap text-[var(--color-text-muted)]">
                {content}
              </p>
            </div>
            
            {/* Footer Button */}
            <div className="border-t border-white/10 p-4">
              <button
                onClick={hideInfo}
                className="btn btn-primary w-full"
              >
                Got it
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default InfoDialog;