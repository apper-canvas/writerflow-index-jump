import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  parseISO,
  addMonths,
  subMonths,
  differenceInDays
} from 'date-fns';

const CalendarView = ({ tasks, projects, currentDate, setCurrentDate, selectedDate, setSelectedDate, setSelectedTasks }) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      const taskDate = parseISO(task.deadline);
      return isSameDay(taskDate, date);
    });
  };

  const getDeadlineUrgency = (deadline) => {
    const now = new Date();
    const deadlineDate = parseISO(deadline);
    const daysUntil = differenceInDays(deadlineDate, now);
    
    if (daysUntil < 0) return 'overdue';
    if (daysUntil <= 1) return 'urgent';
    if (daysUntil <= 3) return 'warning';
    return 'safe';
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setSelectedTasks(getTasksForDate(date));
  };

  const navigateMonth = (direction) => {
    setCurrentDate(direction === 'next' ? addMonths(currentDate, 1) : subMonths(currentDate, 1));
  };

  return (
    <div className="flex-1">
      <div className="bg-white rounded-lg shadow-sm">
        {/* Calendar Header */}
        <div className="p-4 border-b border-surface-200 flex items-center justify-between">
          <h1 className="text-xl font-display font-bold text-surface-900">
            {format(currentDate, 'MMMM yyyy')}
          </h1>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 rounded-lg hover:bg-surface-100 transition-colors"
            >
              <ApperIcon name="ChevronLeft" size={20} />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1 text-sm bg-surface-100 rounded-lg hover:bg-surface-200 transition-colors"
            >
              Today
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 rounded-lg hover:bg-surface-100 transition-colors"
            >
              <ApperIcon name="ChevronRight" size={20} />
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="p-6">
          {/* Day headers */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="text-center text-sm font-medium text-surface-600 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, index) => {
              const dayTasks = getTasksForDate(day);
              const isToday = isSameDay(day, new Date());
              const isSelected = selectedDate && isSameDay(day, selectedDate);
              
              return (
                <motion.div
                  key={day.toISOString()}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.01 }}
                  onClick={() => handleDateClick(day)}
                  className={`
                    min-h-24 p-2 border rounded-lg cursor-pointer transition-all hover:shadow-md
                    ${isSameMonth(day, currentDate) ? 'bg-white' : 'bg-surface-50 text-surface-400'}
                    ${isToday ? 'border-accent bg-accent/5' : 'border-surface-200'}
                    ${isSelected ? 'ring-2 ring-accent' : ''}
                  `}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-sm font-medium ${isToday ? 'text-accent' : ''}`}>
                      {format(day, 'd')}
                    </span>
                    {dayTasks.length > 0 && (
                      <div className="w-2 h-2 bg-secondary rounded-full"></div>
                    )}
                  </div>
                  
                  <div className="space-y-1">
                    {dayTasks.slice(0, 2).map(task => {
                      const project = projects.find(p => p.id === task.projectId);
                      const urgency = getDeadlineUrgency(task.deadline);
                      
                      return (
                        <div
                          key={task.id}
                          className={`
                            text-xs p-1 rounded truncate
                            ${urgency === 'overdue' ? 'bg-error/20 text-error' : ''}
                            ${urgency === 'urgent' ? 'bg-warning/20 text-warning' : ''}
                            ${urgency === 'warning' ? 'bg-warning/10 text-warning' : ''}
                            ${urgency === 'safe' ? 'bg-surface-100 text-surface-700' : ''}
                          `}
                          style={{
                            borderLeft: project ? `3px solid ${project.color}` : 'none'
                          }}
                        >
                          {task.title}
                        </div>
                      );
                    })}
                    {dayTasks.length > 2 && (
                      <div className="text-xs text-surface-500">
                        +{dayTasks.length - 2} more
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;