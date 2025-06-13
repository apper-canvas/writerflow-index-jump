import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { taskService, projectService } from '@/services';
import Spinner from '@/components/atoms/Spinner';
import ErrorMessage from '@/components/atoms/ErrorMessage';
import CalendarView from '@/components/organisms/CalendarView';
import SelectedDateTasksPanel from '@/components/organisms/SelectedDateTasksPanel';
import UpcomingDeadlinesPanel from '@/components/organisms/UpcomingDeadlinesPanel';

const CalendarPage = () => {
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

  if (loading) {
    return (
      <Spinner 
        count={1} 
        itemClassName="h-48" 
        wrapperClassName="p-6" 
      />
    );
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={loadData} />;
  }

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <div className="flex flex-col lg:flex-row gap-6">
        <CalendarView
          tasks={tasks}
          projects={projects}
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          setSelectedTasks={setSelectedTasks}
        />

        <div className="lg:w-80">
          <SelectedDateTasksPanel
            selectedDate={selectedDate}
            selectedTasks={selectedTasks}
            projects={projects}
          />
          <UpcomingDeadlinesPanel
            tasks={tasks}
            projects={projects}
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarPage;