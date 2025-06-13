import React from 'react';

const StatusBadge = ({ status, className = '' }) => {
  return (
    <div className={`status-badge status-${status} text-xs px-2 py-1 ${className}`}>
      {status}
    </div>
  );
};

export default StatusBadge;