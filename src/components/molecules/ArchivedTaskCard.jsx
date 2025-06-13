import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import StatusBadge from '@/components/atoms/StatusBadge';
import { format, parseISO } from 'date-fns';

const ArchivedTaskCard = ({ task, project, groupIndex, taskIndex, onRestore }) => {
  const completionPercentage = (task.wordCountComplete / task.wordCountTarget) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (groupIndex * 0.1) + (taskIndex * 0.05) }}
      className="bg-white rounded-lg p-6 shadow-sm card-hover"
    >
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-medium text-surface-900 mb-1 break-words">
                {task.title}
              </h3>
              <p className="text-surface-600 break-words">{task.description}</p>
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              <StatusBadge status={task.status} />
              <button
                onClick={() => onRestore(task.id)}
                className="p-1 rounded hover:bg-surface-100 transition-colors"
                title="Restore to drafting"
              >
                <ApperIcon name="RotateCcw" size={16} className="text-surface-600" />
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-surface-600">
            {project && (
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: project.color }}
                ></div>
                <span>{project.name}</span>
              </div>
            )}
            
            <div className="flex items-center">
              <ApperIcon name="Calendar" size={14} className="mr-1" />
              <span>Completed {format(parseISO(task.updatedAt), 'MMM d, yyyy')}</span>
            </div>
            
            <div className="flex items-center">
              <ApperIcon name="FileText" size={14} className="mr-1" />
              <span>{task.wordCountComplete.toLocaleString()} words</span>
            </div>
          </div>
          
          {task.notes && (
            <div className="mt-3 p-3 bg-surface-50 rounded-lg">
              <h4 className="text-sm font-medium text-surface-700 mb-1">Notes</h4>
              <p className="text-sm text-surface-600 break-words">{task.notes}</p>
            </div>
          )}
        </div>
        
        <div className="flex-shrink-0 lg:ml-6 lg:w-48">
          <div className="text-center">
            <div className="text-2xl font-bold text-success mb-1">
              {Math.round(completionPercentage)}%
            </div>
            <div className="text-sm text-surface-600 mb-2">Complete</div>
            
            <div className="w-full bg-surface-200 rounded-full h-2">
              <div
                className="progress-gradient h-2 rounded-full transition-all"
                style={{ width: `${Math.min(completionPercentage, 100)}%` }}
              ></div>
            </div>
            
            <div className="mt-2 text-xs text-surface-600">
              {task.wordCountComplete.toLocaleString()} / {task.wordCountTarget.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ArchivedTaskCard;