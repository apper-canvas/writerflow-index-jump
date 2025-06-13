import projectData from '../mockData/projects.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ProjectService {
  constructor() {
    this.projects = [...projectData];
  }

  async getAll() {
    await delay(250);
    return [...this.projects];
  }

  async getById(id) {
    await delay(200);
    const project = this.projects.find(project => project.id === id);
    return project ? { ...project } : null;
  }

  async create(projectData) {
    await delay(350);
    const newProject = {
      id: Date.now().toString(),
      ...projectData,
      taskCount: 0
    };
    this.projects.unshift(newProject);
    return { ...newProject };
  }

  async update(id, data) {
    await delay(300);
    const index = this.projects.findIndex(project => project.id === id);
    if (index === -1) {
      throw new Error('Project not found');
    }
    
    this.projects[index] = {
      ...this.projects[index],
      ...data
    };
    
    return { ...this.projects[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.projects.findIndex(project => project.id === id);
    if (index === -1) {
      throw new Error('Project not found');
    }
    
    const deletedProject = this.projects.splice(index, 1)[0];
    return { ...deletedProject };
  }

  async updateTaskCount(projectId, increment = true) {
    await delay(100);
    const project = this.projects.find(p => p.id === projectId);
    if (project) {
      project.taskCount += increment ? 1 : -1;
      project.taskCount = Math.max(0, project.taskCount);
    }
  }
}

export default new ProjectService();