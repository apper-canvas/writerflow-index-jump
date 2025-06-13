import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '../components/ApperIcon';
import { projectService, taskService } from '../services';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectTasks, setProjectTasks] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [projectsData, tasksData] = await Promise.all([
        projectService.getAll(),
        taskService.getAll()
      ]);
      
      setProjects(projectsData);
      
      // Group tasks by project
      const tasksByProject = {};
      tasksData.forEach(task => {
        if (!tasksByProject[task.projectId]) {
          tasksByProject[task.projectId] = [];
        }
        tasksByProject[task.projectId].push(task);
      });
      setProjectTasks(tasksByProject);
      
    } catch (err) {
      setError(err.message || 'Failed to load projects');
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (projectData) => {
    try {
      const newProject = await projectService.create(projectData);
      setProjects([newProject, ...projects]);
      setShowModal(false);
      toast.success('Project created successfully');
    } catch (err) {
      toast.error('Failed to create project');
    }
  };

  const handleUpdateProject = async (projectId, updates) => {
    try {
      const updatedProject = await projectService.update(projectId, updates);
      setProjects(projects.map(p => p.id === projectId ? updatedProject : p));
      setEditingProject(null);
      toast.success('Project updated successfully');
    } catch (err) {
      toast.error('Failed to update project');
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure? This will not delete associated tasks.')) return;
    
    try {
      await projectService.delete(projectId);
      setProjects(projects.filter(p => p.id !== projectId));
      toast.success('Project deleted successfully');
    } catch (err) {
      toast.error('Failed to delete project');
    }
  };

  const getProjectStats = (projectId) => {
    const tasks = projectTasks[projectId] || [];
    return {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'published').length,
      inProgress: tasks.filter(t => ['drafting', 'editing'].includes(t.status)).length,
      totalWords: tasks.reduce((sum, task) => sum + task.wordCountComplete, 0)
    };
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <div className="h-8 bg-surface-200 rounded w-48 mb-2"></div>
          <div className="h-4 bg-surface-200 rounded w-32"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="project-folder p-6"
            >
              <div className="animate-pulse space-y-3">
                <div className="h-6 bg-surface-200 rounded w-3/4"></div>
                <div className="h-4 bg-surface-200 rounded w-1/2"></div>
                <div className="h-20 bg-surface-200 rounded"></div>
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
          <h3 className="text-lg font-medium text-surface-900 mb-2">Failed to load projects</h3>
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-surface-900 mb-2">Projects</h1>
          <p className="text-surface-600">Organize your writing work by client or publication</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowModal(true)}
          className="mt-4 md:mt-0 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors inline-flex items-center"
        >
          <ApperIcon name="Plus" size={16} className="mr-2" />
          New Project
        </motion.button>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center shadow-sm">
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
          >
            <ApperIcon name="Folder" className="w-16 h-16 text-surface-300 mx-auto" />
          </motion.div>
          <h3 className="mt-4 text-lg font-medium text-surface-900">No projects yet</h3>
          <p className="mt-2 text-surface-600">Create your first project to organize your writing tasks</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowModal(true)}
            className="mt-6 px-6 py-3 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors inline-flex items-center"
          >
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Create First Project
          </motion.button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => {
            const stats = getProjectStats(project.id);
            
            return (
              <motion.div
                key={project.id}
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
                      onClick={() => setEditingProject(project)}
                      className="p-1 rounded hover:bg-surface-200 transition-colors"
                    >
                      <ApperIcon name="Edit" size={14} className="text-surface-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
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
                
                {projectTasks[project.id] && projectTasks[project.id].length > 0 && (
                  <div className="mt-4 pt-4 border-t border-surface-200">
                    <h4 className="text-sm font-medium text-surface-700 mb-2">Recent Tasks</h4>
                    <div className="space-y-1">
                      {projectTasks[project.id].slice(0, 3).map(task => (
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
          })}
        </div>
      )}

      {/* Project Modal */}
      {(showModal || editingProject) && (
        <ProjectModal
          isOpen={showModal || !!editingProject}
          onClose={() => {
            setShowModal(false);
            setEditingProject(null);
          }}
          onSubmit={editingProject ? 
            (data) => handleUpdateProject(editingProject.id, data) : 
            handleCreateProject
          }
          initialData={editingProject}
        />
      )}
    </div>
  );
};

const ProjectModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    color: initialData?.color || '#3498DB'
  });

  const colors = [
    '#3498DB', '#27AE60', '#E67E22', '#9B59B6', 
    '#E74C3C', '#F39C12', '#1ABC9C', '#34495E'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSubmit(formData);
      setFormData({ name: '', description: '', color: '#3498DB' });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
      >
        <h3 className="text-lg font-medium text-surface-900 mb-4">
          {initialData ? 'Edit Project' : 'Create New Project'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">
              Project Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="e.g., TechCorp Blog"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
              rows="3"
              placeholder="Brief description of this project"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-surface-700 mb-2">
              Color
            </label>
            <div className="flex space-x-2">
              {colors.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={`w-8 h-8 rounded-full transition-all ${
                    formData.color === color ? 'ring-2 ring-surface-400 ring-offset-2' : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
          
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-surface-700 border border-surface-300 rounded-lg hover:bg-surface-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90 transition-colors"
            >
              {initialData ? 'Update' : 'Create'} Project
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Projects;