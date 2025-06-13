import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { taskService, projectService } from '../services';
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
  isAfter,
  differenceInDays
} from 'date-fns';

const Calendar = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksData, projectsData] = await Promise.all([
        taskService.getAll(),
        projectService.getAll()
      ]);
      setTasks(tasksData);
      setProjects(projectsData);
    } catch (err) {
      setError(err.message || 'Failed to load calendar data');
      toast.error('Failed to load calendar');
    } finally {
      setLoading(false);
    }
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get tasks for a specific date
  const getTasksForDate = (date) => {
    return tasks.filter(task => {
      const taskDate = parseISO(task.deadline);
      return isSameDay(taskDate, date);
    });
  };

  // Get deadline urgency
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

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 border-b border-surface-200">
            <div className="h-8 bg-surface-200 rounded w-48"></div>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-7 gap-4 mb-4">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="h-6 bg-surface-200 rounded"></div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-4">
              {[...Array(35)].map((_, i) => (
                <div key={i} className="h-24 bg-surface-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg p-8 text-center shadow-sm">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto mb-4" />
          <h3 className="text-lg font-medium text-surface-900 mb-2">Failed to load calendar</h3>
          <p className="text-surface-600 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Calendar */}
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

        {/* Sidebar */}
        <div className="lg:w-80">
          {/* Selected Date Tasks */}
          {selectedDate && (
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
          )}

          {/* Upcoming Deadlines */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 border-b border-surface-200">
              <h3 className="font-medium text-surface-900">Upcoming Deadlines</h3>
            </div>
            
            <div className="p-4">
              {tasks
                .filter(task => isAfter(parseISO(task.deadline), new Date()))
                .sort((a, b) => parseISO(a.deadline) - parseISO(b.deadline))
                .slice(0, 5)
                .map(task => {
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
                        {daysUntil === 1 ? '1 day' : `${daysUntil} days`}
                      </div>
                    </div>
                  );
                })}
              
              {tasks.filter(task => isAfter(parseISO(task.deadline), new Date())).length === 0 && (
                <div className="text-center py-4">
                  <ApperIcon name="CheckCircle" className="w-8 h-8 text-success mx-auto mb-2" />
                  <p className="text-surface-500 text-sm">All caught up!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calendar;