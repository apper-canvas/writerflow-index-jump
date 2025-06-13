import taskData from '../mockData/tasks.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TaskService {
  constructor() {
    this.tasks = [...taskData];
  }

  async getAll() {
    await delay(300);
    return [...this.tasks];
  }

  async getById(id) {
    await delay(200);
    const task = this.tasks.find(task => task.id === id);
    return task ? { ...task } : null;
  }

  async getByProject(projectId) {
    await delay(250);
    return this.tasks.filter(task => task.projectId === projectId).map(task => ({ ...task }));
  }

  async getByStatus(status) {
    await delay(250);
    return this.tasks.filter(task => task.status === status).map(task => ({ ...task }));
  }

  async create(taskData) {
    await delay(400);
    const newTask = {
      id: Date.now().toString(),
      ...taskData,
      wordCountComplete: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.tasks.unshift(newTask);
    return { ...newTask };
  }

  async update(id, data) {
    await delay(350);
    const index = this.tasks.findIndex(task => task.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    this.tasks[index] = {
      ...this.tasks[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.tasks[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.tasks.findIndex(task => task.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    const deletedTask = this.tasks.splice(index, 1)[0];
    return { ...deletedTask };
  }

  async search(query) {
    await delay(200);
    const lowerQuery = query.toLowerCase();
    return this.tasks
      .filter(task => 
        task.title.toLowerCase().includes(lowerQuery) ||
        task.description.toLowerCase().includes(lowerQuery) ||
        task.notes.toLowerCase().includes(lowerQuery)
      )
      .map(task => ({ ...task }));
  }

  async getStats() {
    await delay(150);
    const stats = {
      total: this.tasks.length,
      ideas: this.tasks.filter(t => t.status === 'ideas').length,
      drafting: this.tasks.filter(t => t.status === 'drafting').length,
      editing: this.tasks.filter(t => t.status === 'editing').length,
      submitted: this.tasks.filter(t => t.status === 'submitted').length,
      published: this.tasks.filter(t => t.status === 'published').length,
      totalWords: this.tasks.reduce((sum, task) => sum + task.wordCountComplete, 0),
      targetWords: this.tasks.reduce((sum, task) => sum + task.wordCountTarget, 0)
    };
    return stats;
  }
}

export default new TaskService();