import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { taskService, projectService } from '@/services';
import { format, parseISO } from 'date-fns';
import Spinner from '@/components/atoms/Spinner';
import ErrorMessage from '@/components/atoms/ErrorMessage';
import FilterButtonGroup from '@/components/molecules/FilterButtonGroup';
import SearchInput from '@/components/molecules/SearchInput';
import TaskListDisplay from '@/components/organisms/TaskListDisplay';
import EmptyState from '@/components/atoms/EmptyState';

const ArchivePage = () => {
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

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesSearch = searchQuery === '' || 
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

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
    return <Spinner wrapperClassName="space-y-6" itemClassName="bg-white" />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadData} />;
  }

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-surface-900 mb-2">Archive</h1>
        <p className="text-surface-600">View your completed and published writing work</p>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <FilterButtonGroup
            filters={[
              { key: 'all', label: 'All Completed' },
              { key: 'submitted', label: 'Submitted' },
              { key: 'published', label: 'Published' }
            ]}
            selectedFilter={filterStatus}
            onSelectFilter={setFilterStatus}
          />
          <SearchInput
            placeholder="Search archived tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {tasks.length === 0 ? (
        <EmptyState
          icon="Archive"
          title="No completed tasks yet"
          message="Tasks you submit or publish will appear here"
          animateIcon
        />
      ) : (
        <TaskListDisplay
          type="archive"
          tasks={filteredTasks}
          projects={projects}
          onTaskRestore={handleRestoreTask}
          groupedTasks={groupedTasks}
          sortedGroups={sortedGroups}
        />
      )}
    </div>
  );
};

export default ArchivePage;