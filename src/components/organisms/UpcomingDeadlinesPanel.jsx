import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import { format, parseISO, isAfter, differenceInDays } from 'date-fns';

const getDeadlineUrgency = (deadline) => {
  const now = new Date();
  const deadlineDate = parseISO(deadline);
  const daysUntil = differenceInDays(deadlineDate, now);
  
  if (daysUntil < 0) return 'overdue';
  if (daysUntil <= 1) return 'urgent';
  if (daysUntil <= 3) return 'warning';
  return 'safe';
};

const UpcomingDeadlinesPanel = ({ tasks, projects }) => {
  const upcomingTasks = tasks
    .filter(task => isAfter(parseISO(task.deadline), new Date()))
    .sort((a, b) => parseISO(a.deadline) - parseISO(b.deadline))
    .slice(0, 5);

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-surface-200">
        <h3 className="font-medium text-surface-900">Upcoming Deadlines</h3>
      </div>
      
      <div className="p-4">
        {upcomingTasks.length === 0 ? (
          <div className="text-center py-4">
            <ApperIcon name="CheckCircle" className="w-8 h-8 text-success mx-auto mb-2" />
            <p className="text-surface-500 text-sm">All caught up!</p>
          </div>
        ) : (
          upcomingTasks.map(task => {
            const project = projects.find(p => p.id === task.projectId);
            const urgency = getDeadlineUrgency(task.deadline);
            const daysUntil = differenceInDays(parseISO(task.deadline), new Date());
            
            return (
              <div key={task.id} className="flex items-center justify-between py-2 border-b border-surface-100 last:border-b-0">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-surface-900 truncate">
                    {task.title}
                  </h4>
                  <div className="flex items-center mt-1">
                    {project && (
                      <div 
                        className="w-2 h-2 rounded-full mr-2" 
                        style={{ backgroundColor: project.color }}
                      ></div>
                    )}
                    <span className="text-xs text-surface-600">
                      {format(parseISO(task.deadline), 'MMM d')}
                    </span>
                  </div>
                </div>
                
                <div className={`
                  text-xs px-2 py-1 rounded-full font-medium
                  ${urgency === 'urgent' ? 'bg-error/20 text-error' : ''}
                  ${urgency === 'warning' ? 'bg-warning/20 text-warning' : ''}
                  ${urgency === 'safe' ? 'bg-surface-100 text-surface-600' : ''}
                `}>
                  {daysUntil === 0 ? 'Due Today' : `${daysUntil} days`}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default UpcomingDeadlinesPanel;