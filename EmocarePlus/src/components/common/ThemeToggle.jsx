import React from 'react';
import { useTheme } from '../../contexts/ThemeProvider';
import { RiMoonFill, RiSunFill } from 'react-icons/ri';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-surface border border-border text-text-muted hover:text-primary transition-colors shadow-sm"
            aria-label="Toggle Dark Mode"
        >
            {isDarkMode ? <RiSunFill size={20} /> : <RiMoonFill size={20} />}
        </motion.button>
    );
};

export default ThemeToggle;