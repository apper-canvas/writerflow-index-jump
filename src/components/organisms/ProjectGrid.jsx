import React from 'react';
import ProjectCard from '@/components/molecules/ProjectCard';
import EmptyState from '@/components/atoms/EmptyState';

const ProjectGrid = ({ projects, projectTasks, onEditProject, onDeleteProject, onCreateProject }) => {
  const getProjectStats = (projectId) => {
    const tasks = projectTasks[projectId] || [];
    return {
      total: tasks.length,
      completed: tasks.filter(t => t.status === 'published').length,
      inProgress: tasks.filter(t => ['drafting', 'editing'].includes(t.status)).length,
      totalWords: tasks.reduce((sum, task) => sum + task.wordCountComplete, 0)
    };
  };

  if (projects.length === 0) {
    return (
      <EmptyState
        icon="Folder"
        title="No projects yet"
        message="Create your first project to organize your writing tasks"
        buttonText="Create First Project"
        onButtonClick={onCreateProject}
        animateIcon
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map((project, index) => {
        const stats = getProjectStats(project.id);
        return (
          <ProjectCard
            key={project.id}
            project={project}
            index={index}
            stats={stats}
            recentTasks={projectTasks[project.id]}
            onEdit={onEditProject}
            onDelete={onDeleteProject}
          />
        );
      })}
    </div>
  );
};

export default ProjectGrid;