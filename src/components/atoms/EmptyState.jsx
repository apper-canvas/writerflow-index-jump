import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const EmptyState = ({ icon, title, message, buttonText, onButtonClick, animateIcon = false, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg p-12 text-center shadow-sm ${className}`}>
      {animateIcon ? (
        <motion.div
          animate={{ rotate: [0, 5, -5, 0] }} // Example animation for a folder icon
          transition={{ repeat: Infinity, duration: 4 }}
        >
          <ApperIcon name={icon} className="w-16 h-16 text-surface-300 mx-auto" />
        </motion.div>
      ) : (
        <ApperIcon name={icon} className="w-16 h-16 text-surface-300 mx-auto" />
      )}
      <h3 className="mt-4 text-lg font-medium text-surface-900">{title}</h3>
      <p className="mt-2 text-surface-600">{message}</p>
      {buttonText && onButtonClick && (
        <Button onClick={onButtonClick} className="mt-6">
          {buttonText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;