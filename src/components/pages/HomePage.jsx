import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { projectService, taskService, templateService } from "@/services";
import Spinner from "@/components/atoms/Spinner";
import ErrorMessage from "@/components/atoms/ErrorMessage";
import EmptyState from "@/components/atoms/EmptyState";
import DashboardStats from "@/components/organisms/DashboardStats";
import FilterButtonGroup from "@/components/molecules/FilterButtonGroup";
import SearchInput from "@/components/molecules/SearchInput";
import TaskListDisplay from "@/components/organisms/TaskListDisplay";
import TaskFormModal from "@/components/organisms/TaskFormModal";
import ApperIcon from "@/components/ApperIcon";
const HomePage = () => {
  const [tasks, setTasks] = useState([]);
const [projects, setProjects] = useState([]);
  const [templates, setTemplates] = useState([]);
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
      const [tasksData, projectsData, templatesData, statsData] = await Promise.all([
        taskService.getAll(),
        projectService.getAll(),
        templateService.getAll(),
        taskService.getStats()
      ]);
      
      setTasks(tasksData);
      setProjects(projectsData);
      setTemplates(templatesData);
      setStats(statsData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = selectedFilter === 'all' || task.status === selectedFilter;
    const matchesSearch = searchQuery === '' || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleTaskCreate = async (taskData) => {
    try {
      await taskService.create(taskData);
      loadData(); // Reload all data to ensure latest state
    } catch (err) {
      toast.error('Failed to create task');
      console.error('Create task error:', err);
    }
  };

  const handleTaskUpdate = async (taskId, updates) => {
    try {
      await taskService.update(taskId, updates);
      loadData(); // Reload all data to ensure latest state
    } catch (err) {
      toast.error('Failed to update task');
      console.error('Update task error:', err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await taskService.delete(taskId);
      loadData(); // Reload all data to ensure latest state
      toast.success('Task deleted successfully');
    } catch (err) {
      toast.error('Failed to delete task');
      console.error('Delete task error:', err);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadData} />;
  }

  if (tasks.length === 0) {
    return (
      <div className="p-6">
        <EmptyState
          icon="PenTool"
          title="No writing tasks yet"
          message="Start organizing your writing projects by creating your first task"
          buttonText="Create Your First Task"
          onButtonClick={() => setShowTaskModal(true)}
          animateIcon
        />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-full overflow-hidden">
      <DashboardStats stats={stats} />

      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <FilterButtonGroup
            filters={[
              { key: 'all', label: 'All Tasks' },
              { key: 'ideas', label: 'Ideas' },
              { key: 'drafting', label: 'Drafting' },
              { key: 'editing', label: 'Editing' },
              { key: 'submitted', label: 'Submitted' },
              { key: 'published', label: 'Published' }
            ]}
            selectedFilter={selectedFilter}
            onSelectFilter={setSelectedFilter}
          />
          
          <div className="flex items-center space-x-3">
            <SearchInput
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64"
            />
            
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

      <TaskListDisplay 
        tasks={filteredTasks} 
        projects={projects} 
        onTaskUpdate={(id, updates) => handleTaskUpdate(id, updates)}
        onTaskDelete={handleDeleteTask}
      />

      {(showTaskModal || editingTask) && (
        <TaskFormModal
          isOpen={showTaskModal || !!editingTask}
          onClose={() => {
            setShowTaskModal(false);
            setEditingTask(null);
          }}
          onSubmit={editingTask ? handleTaskUpdate : handleTaskCreate}
          initialData={editingTask}
projects={projects}
          templates={templates}
        />
      )}
    </div>
  );
};

export default HomePage;