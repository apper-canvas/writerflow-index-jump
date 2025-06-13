import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <div className="p-6">
      <div className="bg-white rounded-lg p-8 text-center shadow-sm">
        <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto mb-4" />
        <h3 className="text-lg font-medium text-surface-900 mb-2">Something went wrong</h3>
        <p className="text-surface-600 mb-4">{message || 'Failed to load data'}</p>
        <Button onClick={onRetry}>
          Try Again
        </Button>
      </div>
    </div>
  );
};

export default ErrorMessage;