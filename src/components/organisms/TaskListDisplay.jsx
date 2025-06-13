import React from 'react';
import TaskCard from '@/components/molecules/TaskCard';
import ArchivedTaskCard from '@/components/molecules/ArchivedTaskCard';
import EmptyState from '@/components/atoms/EmptyState';

const TaskListDisplay = ({ 
  tasks, 
  projects, 
  onTaskUpdate, 
  onTaskDelete, 
  type = 'current', // 'current' or 'archive'
  onTaskRestore, // for archive type
  groupedTasks, // for archive type
  sortedGroups // for archive type
}) => {
  if (tasks.length === 0) {
    return (
      <EmptyState
        icon="Search"
        title="No tasks found"
        message="Try adjusting your filters or search terms"
        className="py-8"
      />
    );
  }

  if (type === 'archive') {
    return (
      <div className="space-y-8">
        {sortedGroups.map((monthYear, groupIndex) => (
          <div key={monthYear} className="space-y-4">
            <h2 className="text-lg font-display font-bold text-surface-800 border-b border-surface-200 pb-2">
              {monthYear}
            </h2>
            
            <div className="space-y-4">
              {groupedTasks[monthYear].map((task, taskIndex) => {
                const project = projects.find(p => p.id === task.projectId);
                return (
                  <ArchivedTaskCard
                    key={task.id}
                    task={task}
                    project={project}
                    groupIndex={groupIndex}
                    taskIndex={taskIndex}
                    onRestore={onTaskRestore}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task, index) => {
        const project = projects.find(p => p.id === task.projectId);
        return (
          <TaskCard
            key={task.id}
            task={task}
            project={project}
            index={index}
            onUpdate={onTaskUpdate}
            onDelete={onTaskDelete}
          />
        );
      })}
    </div>
  );
};

export default TaskListDisplay;