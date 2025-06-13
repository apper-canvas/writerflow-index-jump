import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';

const ProjectCard = ({ project, index, stats, onEdit, onDelete, recentTasks = [] }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="project-folder p-6 card-hover"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div 
            className="w-4 h-4 rounded-full mr-3" 
            style={{ backgroundColor: project.color }}
          ></div>
          <h3 className="text-lg font-medium text-surface-900 break-words">{project.name}</h3>
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onEdit(project)}
            className="p-1 rounded hover:bg-surface-200 transition-colors"
          >
            <ApperIcon name="Edit" size={14} className="text-surface-600" />
          </button>
          <button
            onClick={() => onDelete(project.id)}
            className="p-1 rounded hover:bg-surface-200 transition-colors"
          >
            <ApperIcon name="Trash2" size={14} className="text-error" />
          </button>
        </div>
      </div>
      
      <p className="text-surface-600 text-sm mb-4 break-words">{project.description}</p>
      
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-lg font-bold text-primary">{stats.total}</div>
          <div className="text-surface-600">Total Tasks</div>
        </div>
        <div>
          <div className="text-lg font-bold text-success">{stats.completed}</div>
          <div className="text-surface-600">Published</div>
        </div>
        <div>
          <div className="text-lg font-bold text-warning">{stats.inProgress}</div>
          <div className="text-surface-600">In Progress</div>
        </div>
        <div>
          <div className="text-lg font-bold text-accent">{stats.totalWords.toLocaleString()}</div>
          <div className="text-surface-600">Words</div>
        </div>
      </div>
      
      {recentTasks.length > 0 && (
        <div className="mt-4 pt-4 border-t border-surface-200">
          <h4 className="text-sm font-medium text-surface-700 mb-2">Recent Tasks</h4>
          <div className="space-y-1">
            {recentTasks.slice(0, 3).map(task => (
              <div key={task.id} className="flex items-center justify-between text-xs">
                <span className="text-surface-600 truncate">{task.title}</span>
                <div className={`status-badge status-${task.status} text-xs px-2 py-1`}>
                  {task.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ProjectCard;