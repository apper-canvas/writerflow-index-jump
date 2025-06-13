import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from './ApperIcon';
import { taskService, projectService } from '../services';
import { format, isAfter, differenceInDays, parseISO } from 'date-fns';

const MainFeature = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksData, projectsData, statsData] = await Promise.all([
        taskService.getAll(),
        projectService.getAll(),
        taskService.getStats()
      ]);
      setTasks(tasksData);
      setProjects(projectsData);
      setStats(statsData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  // Filter and search tasks
  const filteredTasks = tasks.filter(task => {
    const matchesFilter = selectedFilter === 'all' || task.status === selectedFilter;
    const matchesSearch = searchQuery === '' || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getDeadlineStatus = (deadline) => {
    const now = new Date();
    const deadlineDate = parseISO(deadline);
    const daysUntil = differenceInDays(deadlineDate, now);
    
    if (daysUntil < 0) return 'urgent';
    if (daysUntil <= 3) return 'warning';
    return 'safe';
  };

  const getProgressPercentage = (completed, target) => {
    if (target === 0) return 0;
    return Math.min((completed / target) * 100, 100);
  };

  const handleTaskUpdate = async (taskId, updates) => {
    try {
      const updatedTask = await taskService.update(taskId, updates);
      setTasks(tasks.map(task => task.id === taskId ? updatedTask : task));
      toast.success('Task updated successfully');
      
      // Refresh stats
      const newStats = await taskService.getStats();
      setStats(newStats);
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await taskService.delete(taskId);
      setTasks(tasks.filter(task => task.id !== taskId));
      toast.success('Task deleted successfully');
      
      // Refresh stats
      const newStats = await taskService.getStats();
      setStats(newStats);
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        {/* Stats skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-4 shadow-sm">
              <div className="animate-pulse space-y-2">
                <div className="h-8 bg-surface-200 rounded w-12"></div>
                <div className="h-4 bg-surface-200 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Task cards skeleton */}
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
                <div className="h-2 bg-surface-200 rounded w-full"></div>
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
          <h3 className="text-lg font-medium text-surface-900 mb-2">Something went wrong</h3>
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

  if (tasks.length === 0) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-lg p-12 text-center shadow-sm">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
          >
            <ApperIcon name="PenTool" className="w-16 h-16 text-surface-300 mx-auto" />
          </motion.div>
          <h3 className="mt-4 text-lg font-medium text-surface-900">No writing tasks yet</h3>
          <p className="mt-2 text-surface-600">Start organizing your writing projects by creating your first task</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowTaskModal(true)}
            className="mt-6 px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors inline-flex items-center"
          >
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Create Your First Task
          </motion.button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-full overflow-hidden">
      {/* Stats Dashboard */}
      {stats && (
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
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'All Tasks' },
              { key: 'ideas', label: 'Ideas' },
              { key: 'drafting', label: 'Drafting' },
              { key: 'editing', label: 'Editing' },
              { key: 'submitted', label: 'Submitted' },
              { key: 'published', label: 'Published' }
            ].map(filter => (
              <button
                key={filter.key}
                onClick={() => setSelectedFilter(filter.key)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedFilter === filter.key
                    ? 'bg-accent text-white'
                    : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <ApperIcon 
                name="Search" 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-500" 
                size={16} 
              />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all w-64"
              />
            </div>
            
            <button
              onClick={() => setShowTaskModal(true)}
              className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors inline-flex items-center"
            >
              <ApperIcon name="Plus" size={16} className="mr-2" />
              New Task
            </button>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.map((task, index) => {
          const project = projects.find(p => p.id === task.projectId);
          const deadlineStatus = getDeadlineStatus(task.deadline);
          const progressPercentage = getProgressPercentage(task.wordCountComplete, task.wordCountTarget);
          
          return (
            <motion.div
              key={task.id}
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
                        onClick={() => setEditingTask(task)}
                        className="p-1 rounded hover:bg-surface-100 transition-colors"
                      >
                        <ApperIcon name="Edit" size={16} className="text-surface-600" />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
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
                    
                    <div className={`status-badge status-${task.status}`}>
                      {task.status}
                    </div>
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
                    <input
                      type="number"
                      placeholder="Add words"
                      className="flex-1 px-3 py-1 text-sm border border-surface-300 rounded focus:ring-2 focus:ring-accent focus:border-transparent"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const newWords = parseInt(e.target.value);
                          if (newWords > 0) {
                            handleTaskUpdate(task.id, {
                              wordCountComplete: Math.min(task.wordCountComplete + newWords, task.wordCountTarget)
                            });
                            e.target.value = '';
                          }
                        }
                      }}
                    />
                    
                    <select
                      value={task.status}
                      onChange={(e) => handleTaskUpdate(task.id, { status: e.target.value })}
                      className="text-sm border border-surface-300 rounded focus:ring-2 focus:ring-accent focus:border-transparent"
                    >
                      <option value="ideas">Ideas</option>
                      <option value="drafting">Drafting</option>
                      <option value="editing">Editing</option>
                      <option value="submitted">Submitted</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filteredTasks.length === 0 && (
        <div className="bg-white rounded-lg p-8 text-center shadow-sm">
          <ApperIcon name="Search" className="w-12 h-12 text-surface-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-surface-900 mb-2">No tasks found</h3>
          <p className="text-surface-600">Try adjusting your filters or search terms</p>
        </div>
      )}
    </div>
  );
};

export default MainFeature;