import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import { projectService, taskService } from '@/services';
import Spinner from '@/components/atoms/Spinner';
import ErrorMessage from '@/components/atoms/ErrorMessage';
import Button from '@/components/atoms/Button';
import ProjectGrid from '@/components/organisms/ProjectGrid';
import ProjectFormModal from '@/components/organisms/ProjectFormModal';

const ProjectsPage = () => {
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
      toast.success('Project created successfully');
    } catch (err) {
      toast.error('Failed to create project');
      console.error('Create project error:', err);
    }
  };

  const handleUpdateProject = async (projectId, updates) => {
    try {
      const updatedProject = await projectService.update(projectId, updates);
      setProjects(projects.map(p => p.id === projectId ? updatedProject : p));
      toast.success('Project updated successfully');
    } catch (err) {
      toast.error('Failed to update project');
      console.error('Update project error:', err);
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
      console.error('Delete project error:', err);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadData} />;
  }

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-surface-900 mb-2">Projects</h1>
          <p className="text-surface-600">Organize your writing work by client or publication</p>
        </div>
        
        <Button onClick={() => setShowModal(true)} className="mt-4 md:mt-0">
          <ApperIcon name="Plus" size={16} className="mr-2" />
          New Project
        </Button>
      </div>

      <ProjectGrid
        projects={projects}
        projectTasks={projectTasks}
        onEditProject={setEditingProject}
        onDeleteProject={handleDeleteProject}
        onCreateProject={() => setShowModal(true)}
      />

      {(showModal || editingProject) && (
        <ProjectFormModal
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

export default ProjectsPage;