import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import StatusBadge from '@/components/atoms/StatusBadge';
import { Input, Select } from '@/components/atoms/Input';
import { format, parseISO, differenceInDays } from 'date-fns';

const getDeadlineStatus = (deadline) => {
  const now = new Date();
  const deadlineDate = parseISO(deadline);
  const daysUntil = differenceInDays(deadlineDate, now);
  
  if (daysUntil < 0) return 'urgent'; // overdue
  if (daysUntil <= 3) return 'warning'; // due soon (within 3 days)
  return 'safe'; // on track
};

const getProgressPercentage = (completed, target) => {
  if (target === 0) return 0;
  return Math.min((completed / target) * 100, 100);
};

const TaskCard = ({ task, project, index, onUpdate, onDelete }) => {
  const deadlineStatus = getDeadlineStatus(task.deadline);
  const progressPercentage = getProgressPercentage(task.wordCountComplete, task.wordCountTarget);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white rounded-lg p-6 shadow-sm card-hover"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-medium text-surface-900 break-words">{task.title}</h3>
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={() => onUpdate(task)} // Pass the entire task for editing
                className="p-1 rounded hover:bg-surface-100 transition-colors"
              >
                <ApperIcon name="Edit" size={16} className="text-surface-600" />
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="p-1 rounded hover:bg-surface-100 transition-colors"
              >
                <ApperIcon name="Trash2" size={16} className="text-error" />
              </button>
            </div>
          </div>
          
          <p className="text-surface-600 mb-3 break-words">{task.description}</p>
          
          <div className="flex flex-wrap items-center gap-4 text-sm">
            {project && (
              <div className="flex items-center">
                <div 
                  className="w-3 h-3 rounded-full mr-2" 
                  style={{ backgroundColor: project.color }}
                ></div>
                <span className="text-surface-700">{project.name}</span>
              </div>
            )}
            
            <div className="flex items-center">
              <div className={`deadline-dot deadline-${deadlineStatus}`}></div>
              <span className="text-surface-700">
                Due {format(parseISO(task.deadline), 'MMM d, yyyy')}
              </span>
            </div>
            
            <StatusBadge status={task.status} />
          </div>
        </div>
        
        <div className="flex-shrink-0 lg:ml-6 lg:w-64">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-surface-600">
              {task.wordCountComplete.toLocaleString()} / {task.wordCountTarget.toLocaleString()} words
            </span>
            <span className="text-surface-700 font-medium">
              {Math.round(progressPercentage)}%
            </span>
          </div>
          
          <div className="w-full bg-surface-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="progress-gradient h-2 rounded-full"
            ></motion.div>
          </div>
          
          <div className="mt-3 flex items-center space-x-2">
            <Input
              type="number"
              placeholder="Add words"
              className="flex-1 px-3 py-1 text-sm"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const newWords = parseInt(e.target.value);
                  if (newWords > 0) {
                    onUpdate(task.id, {
                      wordCountComplete: Math.min(task.wordCountComplete + newWords, task.wordCountTarget)
                    });
                    e.target.value = '';
                  }
                }
              }}
            />
            
            <Select
              value={task.status}
              onChange={(e) => onUpdate(task.id, { status: e.target.value })}
            >
              <option value="ideas">Ideas</option>
              <option value="drafting">Drafting</option>
              <option value="editing">Editing</option>
              <option value="submitted">Submitted</option>
              <option value="published">Published</option>
            </Select>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;