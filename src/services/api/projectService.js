import { toast } from 'react-toastify';

class ProjectService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getAll() {
    try {
      const params = {
        Fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'color', 'description', 'task_count']
      };
      
      const response = await this.apperClient.fetchRecords('project', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      // Map database fields to UI expected format
      const projects = response.data.map(project => ({
        id: project.Id,
        name: project.Name || '',
        color: project.color || '#3498DB',
        description: project.description || '',
        taskCount: project.task_count || 0,
        tags: project.Tags || '',
        owner: project.Owner || '',
        createdOn: project.CreatedOn,
        createdBy: project.CreatedBy,
        modifiedOn: project.ModifiedOn,
        modifiedBy: project.ModifiedBy
      }));
      
      return projects;
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects");
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 'color', 'description', 'task_count']
      };
      
      const response = await this.apperClient.getRecordById('project', parseInt(id), params);
      
      if (!response || !response.data) {
        return null;
      }
      
      // Map database fields to UI expected format
      const project = {
        id: response.data.Id,
        name: response.data.Name || '',
        color: response.data.color || '#3498DB',
        description: response.data.description || '',
        taskCount: response.data.task_count || 0,
        tags: response.data.Tags || '',
        owner: response.data.Owner || '',
        createdOn: response.data.CreatedOn,
        createdBy: response.data.CreatedBy,
        modifiedOn: response.data.ModifiedOn,
        modifiedBy: response.data.ModifiedBy
      };
      
      return project;
    } catch (error) {
      console.error(`Error fetching project with ID ${id}:`, error);
      return null;
    }
  }

  async create(projectData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Name: projectData.name || '',
          Tags: projectData.tags || '',
          Owner: projectData.owner || '',
          color: projectData.color || '#3498DB',
          description: projectData.description || '',
          task_count: projectData.taskCount || 0
        }]
      };
      
      const response = await this.apperClient.createRecord('project', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          // Map database response to UI expected format
          const newProject = {
            id: result.data.Id,
            name: result.data.Name || '',
            color: result.data.color || '#3498DB',
            description: result.data.description || '',
            taskCount: result.data.task_count || 0,
            tags: result.data.Tags || '',
            owner: result.data.Owner || ''
          };
          
          return newProject;
        } else {
          console.error(`Failed to create project:${JSON.stringify([result])}`);
          if (result.errors) {
            result.errors.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
          }
          if (result.message) toast.error(result.message);
          throw new Error(result.message || 'Failed to create project');
        }
      }
      
      throw new Error('No results returned from create operation');
    } catch (error) {
      console.error("Error creating project:", error);
      throw error;
    }
  }

  async update(id, data) {
    try {
      // Only include Updateable fields plus Id
      const params = {
        records: [{
          Id: parseInt(id),
          Name: data.name,
          Tags: data.tags,
          Owner: data.owner,
          color: data.color,
          description: data.description,
          task_count: data.taskCount
        }]
      };
      
      const response = await this.apperClient.updateRecord('project', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          // Map database response to UI expected format
          const updatedProject = {
            id: result.data.Id,
            name: result.data.Name || '',
            color: result.data.color || '#3498DB',
            description: result.data.description || '',
            taskCount: result.data.task_count || 0,
            tags: result.data.Tags || '',
            owner: result.data.Owner || ''
          };
          
          return updatedProject;
        } else {
          console.error(`Failed to update project:${JSON.stringify([result])}`);
          if (result.errors) {
            result.errors.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
          }
          if (result.message) toast.error(result.message);
          throw new Error(result.message || 'Failed to update project');
        }
      }
      
      throw new Error('No results returned from update operation');
    } catch (error) {
      console.error("Error updating project:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord('project', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          return true;
        } else {
          console.error(`Failed to delete project:${JSON.stringify([result])}`);
          if (result.message) toast.error(result.message);
          throw new Error(result.message || 'Failed to delete project');
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting project:", error);
      throw error;
    }
  }

  async updateTaskCount(projectId, increment = true) {
    try {
      // Get current project to update task count
      const project = await this.getById(projectId);
      if (project) {
        const newTaskCount = Math.max(0, project.taskCount + (increment ? 1 : -1));
        await this.update(projectId, { ...project, taskCount: newTaskCount });
      }
    } catch (error) {
      console.error("Error updating task count:", error);
    }
  }
}

export default new ProjectService();