import React from 'react';
import { motion } from 'framer-motion';

const Spinner = ({ count = 4, itemClassName = '', wrapperClassName = '' }) => {
  return (
    <div className={`p-6 ${wrapperClassName}`}>
      <div className="mb-6">
        <div className="h-8 bg-surface-200 rounded w-48 mb-2"></div>
        <div className="h-4 bg-surface-200 rounded w-32"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(count)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`project-folder p-6 ${itemClassName}`}
          >
            <div className="animate-pulse space-y-3">
              <div className="h-6 bg-surface-200 rounded w-3/4"></div>
              <div className="h-4 bg-surface-200 rounded w-1/2"></div>
              <div className="h-20 bg-surface-200 rounded"></div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Spinner;