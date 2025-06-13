import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import { format, parseISO, differenceInDays } from 'date-fns';

const getDeadlineUrgency = (deadline) => {
  const now = new Date();
  const deadlineDate = parseISO(deadline);
  const daysUntil = differenceInDays(deadlineDate, now);
  
  if (daysUntil < 0) return 'overdue';
  if (daysUntil <= 1) return 'urgent';
  if (daysUntil <= 3) return 'warning';
  return 'safe';
};

const SelectedDateTasksPanel = ({ selectedDate, selectedTasks, projects }) => {
  if (!selectedDate) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm mb-6">
      <div className="p-4 border-b border-surface-200">
        <h3 className="font-medium text-surface-900">
          {format(selectedDate, 'EEEE, MMMM d, yyyy')}
        </h3>
      </div>
      
      <div className="p-4">
        {selectedTasks.length === 0 ? (
          <div className="text-center py-8">
            <ApperIcon name="Calendar" className="w-8 h-8 text-surface-300 mx-auto mb-2" />
            <p className="text-surface-500 text-sm">No tasks due on this date</p>
          </div>
        ) : (
          <div className="space-y-3">
            {selectedTasks.map(task => {
              const project = projects.find(p => p.id === task.projectId);
              const urgency = getDeadlineUrgency(task.deadline);
              
              return (
                <div key={task.id} className="border border-surface-200 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-surface-900 text-sm break-words">
                      {task.title}
                    </h4>
                    <div className={`status-badge status-${task.status} text-xs`}>
                      {task.status}
                    </div>
                  </div>
                  
                  <p className="text-surface-600 text-xs mb-2 break-words">
                    {task.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-xs">
                    {project && (
                      <div className="flex items-center">
                        <div 
                          className="w-2 h-2 rounded-full mr-1" 
                          style={{ backgroundColor: project.color }}
                        ></div>
                        <span className="text-surface-600">{project.name}</span>
                      </div>
                    )}
                    
                    <div className={`
                      px-2 py-1 rounded text-xs font-medium
                      ${urgency === 'overdue' ? 'bg-error/20 text-error' : ''}
                      ${urgency === 'urgent' ? 'bg-warning/20 text-warning' : ''}
                      ${urgency === 'warning' ? 'bg-warning/10 text-warning' : ''}
                      ${urgency === 'safe' ? 'bg-success/10 text-success' : ''}
                    `}>
                      {urgency === 'overdue' ? 'Overdue' : 
                       urgency === 'urgent' ? 'Due Today' :
                       urgency === 'warning' ? 'Due Soon' : 'On Track'}
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-surface-600">Progress</span>
                      <span className="text-surface-700">
                        {Math.round((task.wordCountComplete / task.wordCountTarget) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-surface-200 rounded-full h-1">
                      <div
                        className="progress-gradient h-1 rounded-full transition-all"
                        style={{ 
                          width: `${Math.min((task.wordCountComplete / task.wordCountTarget) * 100, 100)}%` 
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectedDateTasksPanel;