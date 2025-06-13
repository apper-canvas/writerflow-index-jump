import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { taskService, projectService } from '../services';
import { format, parseISO } from 'date-fns';

const Archive = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('published');
  const [searchQuery, setSearchQuery] = useState('');

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
      
      // Filter completed tasks (submitted and published)
      const completedTasks = tasksData.filter(task => 
        ['submitted', 'published'].includes(task.status)
      );
      
      setTasks(completedTasks);
      setProjects(projectsData);
    } catch (err) {
      setError(err.message || 'Failed to load archive');
      toast.error('Failed to load archive');
    } finally {
      setLoading(false);
    }
  };

  // Filter tasks based on status and search
  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesSearch = searchQuery === '' || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Group tasks by month/year
  const groupedTasks = filteredTasks.reduce((groups, task) => {
    const date = parseISO(task.updatedAt);
    const key = format(date, 'MMMM yyyy');
    
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(task);
    return groups;
  }, {});

  const sortedGroups = Object.keys(groupedTasks).sort((a, b) => {
    return parseISO(`1 ${b}`) - parseISO(`1 ${a}`);
  });

  const handleRestoreTask = async (taskId) => {
    try {
      await taskService.update(taskId, { status: 'drafting' });
      toast.success('Task restored to drafting');
      loadData(); // Refresh the list
    } catch (err) {
      toast.error('Failed to restore task');
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="h-8 bg-surface-200 rounded w-48"></div>
        <div className="flex space-x-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-8 bg-surface-200 rounded w-20"></div>
          ))}
        </div>
        
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-lg p-6 shadow-sm"
            >
              <div className="animate-pulse space-y-3">
                <div className="h-6 bg-surface-200 rounded w-3/4"></div>
                <div className="h-4 bg-surface-200 rounded w-1/2"></div>
                <div className="h-4 bg-surface-200 rounded w-1/4"></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg p-8 text-center shadow-sm">
          <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto mb-4" />
          <h3 className="text-lg font-medium text-surface-900 mb-2">Failed to load archive</h3>
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
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-surface-900 mb-2">Archive</h1>
        <p className="text-surface-600">View your completed and published writing work</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All Completed' },
              { key: 'submitted', label: 'Submitted' },
              { key: 'published', label: 'Published' }
            ].map(filter => (
              <button
                key={filter.key}
                onClick={() => setFilterStatus(filter.key)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filterStatus === filter.key
                    ? 'bg-accent text-white'
                    : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
          
          <div className="relative">
            <ApperIcon 
              name="Search" 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-500" 
              size={16} 
            />
            <input
              type="text"
              placeholder="Search archived tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all w-64"
            />
          </div>
        </div>
      </div>

      {/* Task Groups */}
      {tasks.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center shadow-sm">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ApperIcon name="Archive" className="w-16 h-16 text-surface-300 mx-auto" />
          </motion.div>
          <h3 className="mt-4 text-lg font-medium text-surface-900">No completed tasks yet</h3>
          <p className="mt-2 text-surface-600">Tasks you submit or publish will appear here</p>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="bg-white rounded-lg p-8 text-center shadow-sm">
          <ApperIcon name="Search" className="w-12 h-12 text-surface-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-surface-900 mb-2">No tasks found</h3>
          <p className="text-surface-600">Try adjusting your filters or search terms</p>
        </div>
      ) : (
        <div className="space-y-8">
          {sortedGroups.map((monthYear, groupIndex) => (
            <div key={monthYear} className="space-y-4">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: groupIndex * 0.1 }}
                className="text-lg font-display font-bold text-surface-800 border-b border-surface-200 pb-2"
              >
                {monthYear}
              </motion.h2>
              
              <div className="space-y-4">
                {groupedTasks[monthYear].map((task, taskIndex) => {
                  const project = projects.find(p => p.id === task.projectId);
                  const completionPercentage = (task.wordCountComplete / task.wordCountTarget) * 100;
                  
                  return (
                    <motion.div
                      key={task.id}
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
                              <div className={`status-badge status-${task.status}`}>
                                {task.status}
                              </div>
                              <button
                                onClick={() => handleRestoreTask(task.id)}
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
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Archive;