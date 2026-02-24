import React, { useState, useEffect } from 'react';
import api from '../contexts/AuthContext';
import { FaSpinner } from 'react-icons/fa';
import { RiExternalLinkLine, RiArrowDownSLine } from 'react-icons/ri';
import { motion, AnimatePresence } from 'framer-motion';

const ResourcesScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const response = await api.get('/api/resources');
        setCategories(response.data);
      } catch (err) {
        setError('Could not fetch resources. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchResources();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-background">
        <FaSpinner className="h-10 w-10 animate-spin text-[#5B9BD5]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-background p-4">
        <p className="rounded-[14px] bg-error-bg px-6 py-4 text-[13px] font-bold text-error border-[1.5px] border-error shadow-[0_2px_8px_rgba(192,80,77,0.1)]">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full bg-background p-4 md:p-8">

      {/* Header Section */}
      <div className="mb-6 border-b border-border pb-4">
        <h2 className="text-[20px] font-bold text-text-main">Helpful Resources</h2>
        <p className="text-[12px] text-text-muted mt-1">Curated materials to support your wellness journey.</p>
      </div>

      {/* Accordion List */}
      <div className="space-y-4">
        {categories.map((category) => (
          <CategoryItem key={category.category} category={category} />
        ))}
      </div>
    </div>
  );
};

const CategoryItem = ({ category }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-[20px] bg-surface border border-border shadow-[0_2px_16px_rgba(91,155,213,0.07)] transition-all">

      {/* Category Header Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-surface-light"
      >
        <h3 className="text-[15px] font-bold text-text-main">{category.category}</h3>

        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="w-8 h-8 rounded-full bg-surface-light border border-border flex items-center justify-center text-[#5B9BD5]"
        >
          <RiArrowDownSLine size={20} />
        </motion.div>
      </button>

      {/* Expandable Content */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <ul className="border-t border-border px-6 pb-2 bg-surface-light">
              {category.items.map((item) => (
                <li
                  key={item.title}
                  className="border-b border-border py-4 last:border-b-0"
                >
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start justify-between gap-4"
                  >
                    <div>
                      <h4 className="text-[14px] font-semibold text-text-main transition-colors group-hover:text-[#5B9BD5]">
                        {item.title}
                      </h4>
                      <p className="mt-1.5 text-[12px] leading-[1.6] text-text-muted">
                        {item.description}
                      </p>
                    </div>

                    {/* External Link Icon Treatment */}
                    <div className="mt-1 w-8 h-8 rounded-full flex-shrink-0 bg-surface border border-border flex items-center justify-center text-text-muted transition-all group-hover:border-[#5B9BD5] group-hover:text-[#5B9BD5] group-hover:shadow-[0_2px_8px_rgba(91,155,213,0.15)]">
                      <RiExternalLinkLine size={16} />
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ResourcesScreen;