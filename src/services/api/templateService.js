const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Mock template data
const defaultTemplates = [
  {
    id: '1',
    name: 'Blog Post Template',
    title: 'New Blog Post',
    description: 'Write an engaging blog post about [topic]',
    wordCountTarget: 1000,
    deadline: 7, // days from now
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: '2',
    name: 'Article Template',
    title: 'Research Article',
    description: 'In-depth article covering [subject] with research and analysis',
    wordCountTarget: 2500,
    deadline: 14,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: '3',
    name: 'Social Media Post',
    title: 'Social Media Content',
    description: 'Engaging social media post for [platform]',
    wordCountTarget: 150,
    deadline: 1,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  }
];

class TemplateService {
  constructor() {
    this.templates = [...defaultTemplates];
  }

  async getAll() {
    await delay(300);
    return [...this.templates];
  }

  async getById(id) {
    await delay(200);
    const template = this.templates.find(template => template.id === id);
    return template ? { ...template } : null;
  }

  async create(templateData) {
    await delay(400);
    const newTemplate = {
      id: Date.now().toString(),
      ...templateData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.templates.unshift(newTemplate);
    return { ...newTemplate };
  }

  async update(id, data) {
    await delay(350);
    const index = this.templates.findIndex(template => template.id === id);
    if (index === -1) {
      throw new Error('Template not found');
    }
    
    this.templates[index] = {
      ...this.templates[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.templates[index] };
  }

  async delete(id) {
    await delay(300);
    const index = this.templates.findIndex(template => template.id === id);
    if (index === -1) {
      throw new Error('Template not found');
    }
    
    const deletedTemplate = this.templates.splice(index, 1)[0];
    return { ...deletedTemplate };
  }
}

export default new TemplateService();