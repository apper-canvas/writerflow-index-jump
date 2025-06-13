import React from 'react';

const DashboardStats = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="text-2xl font-bold text-primary">{stats.total}</div>
        <div className="text-sm text-surface-600">Total Tasks</div>
      </div>
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="text-2xl font-bold text-warning">{stats.drafting}</div>
        <div className="text-sm text-surface-600">In Progress</div>
      </div>
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="text-2xl font-bold text-success">{stats.published}</div>
        <div className="text-sm text-surface-600">Published</div>
      </div>
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="text-2xl font-bold text-accent">
          {Math.round((stats.totalWords / stats.targetWords) * 100) || 0}%
        </div>
        <div className="text-sm text-surface-600">Words Complete</div>
      </div>
    </div>
  );
};

export default DashboardStats;