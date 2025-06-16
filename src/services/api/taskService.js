import { toast } from 'react-toastify';

// Utility function to ensure SDK is available
const ensureSDKAvailable = () => {
  if (!window.ApperSDK) {
    throw new Error('Apper SDK is not loaded yet');
  }
  return window.ApperSDK;
};

// Create ApperClient instance with proper error handling
const createApperClient = () => {
  const { ApperClient } = ensureSDKAvailable();
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// Utility function to add delay for realistic API simulation
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const taskService = {
  // Get all tasks with optional filtering
  async getAll(filters = {}) {
    try {
      await delay(300);
      
      const apperClient = createApperClient();
      
      // All fields from task table for complete data retrieval
      const fields = [
        'Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 
        'ModifiedOn', 'ModifiedBy', 'title', 'description', 
        'word_count_target', 'word_count_complete', 'deadline', 
        'status', 'notes', 'created_at', 'updated_at', 'project_id'
      ];
      
      const params = {
        fields: fields,
        orderBy: [
          {
            fieldName: 'CreatedOn',
            SortType: 'DESC'
          }
        ]
      };
      
      // Add filters if provided
      if (filters.status && filters.status.length > 0) {
        params.where = [
          {
            fieldName: 'status',
            operator: 'ExactMatch',
            values: filters.status
          }
        ];
      }
      
      if (filters.project_id) {
        const projectFilter = {
          fieldName: 'project_id',
          operator: 'ExactMatch',
          values: [filters.project_id]
        };
        
        if (params.where) {
          params.where.push(projectFilter);
        } else {
          params.where = [projectFilter];
        }
      }
      
      const response = await apperClient.fetchRecords('task', params);
      
      if (!response || !response.data) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Failed to load tasks');
      throw error;
    }
  },

  // Get task by ID
  async getById(taskId) {
    try {
      await delay(200);
      
      const apperClient = createApperClient();
      
      // All fields from task table
      const fields = [
        'Id', 'Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 
        'ModifiedOn', 'ModifiedBy', 'title', 'description', 
        'word_count_target', 'word_count_complete', 'deadline', 
        'status', 'notes', 'created_at', 'updated_at', 'project_id'
      ];
      
      const params = { fields };
      
      const response = await apperClient.getRecordById('task', taskId, params);
      
      if (!response || !response.data) {
        throw new Error('Task not found');
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching task ${taskId}:`, error);
      toast.error('Failed to load task');
      throw error;
    }
  },

  // Create new task
  async create(taskData) {
    try {
      await delay(400);
      
      const apperClient = createApperClient();
      
      // Only include updateable fields
      const updateableData = {
        Name: taskData.Name,
        Tags: taskData.Tags,
        Owner: taskData.Owner,
        title: taskData.title,
        description: taskData.description,
        word_count_target: taskData.word_count_target,
        word_count_complete: taskData.word_count_complete || 0,
        deadline: taskData.deadline,
        status: taskData.status || 'ideas',
        notes: taskData.notes,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        project_id: taskData.project_id
      };
      
      const params = {
        records: [updateableData]
      };
      
      const response = await apperClient.createRecord('task', params);
      
      if (response && response.success && response.results && response.results[0]?.success) {
        toast.success('Task created successfully');
        return response.results[0].data;
      } else {
        const errorMessage = response.results?.[0]?.message || 'Failed to create task';
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
      throw error;
    }
  },

  // Update existing task
  async update(taskId, taskData) {
    try {
      await delay(350);
      
      const apperClient = createApperClient();
      
      // Only include updateable fields plus Id
      const updateableData = {
        Id: taskId,
        Name: taskData.Name,
        Tags: taskData.Tags,
        Owner: taskData.Owner,
        title: taskData.title,
        description: taskData.description,
        word_count_target: taskData.word_count_target,
        word_count_complete: taskData.word_count_complete,
        deadline: taskData.deadline,
        status: taskData.status,
        notes: taskData.notes,
        updated_at: new Date().toISOString(),
        project_id: taskData.project_id
      };
      
      const params = {
        records: [updateableData]
      };
      
      const response = await apperClient.updateRecord('task', params);
      
      if (response && response.success && response.results && response.results[0]?.success) {
        toast.success('Task updated successfully');
        return response.results[0].data;
      } else {
        const errorMessage = response.results?.[0]?.message || 'Failed to update task';
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error('Failed to update task');
      throw error;
    }
  },

  // Delete task
  async delete(taskId) {
    try {
      await delay(250);
      
      const apperClient = createApperClient();
      
      const params = {
        RecordIds: [taskId]
      };
      
      const response = await apperClient.deleteRecord('task', params);
      
      if (response && response.success && response.results && response.results[0]?.success) {
        toast.success('Task deleted successfully');
        return true;
      } else {
        const errorMessage = response.results?.[0]?.message || 'Failed to delete task';
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
      throw error;
    }
  },

  // Get tasks by status
  async getByStatus(status) {
    return this.getAll({ status: [status] });
  },

  // Get tasks by project
  async getByProject(projectId) {
    return this.getAll({ project_id: projectId });
  },

  // Get upcoming deadlines
  async getUpcomingDeadlines(days = 7) {
    try {
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + days);
      
      const apperClient = createApperClient();
      
      const fields = [
        'Id', 'Name', 'title', 'deadline', 'status', 'project_id'
      ];
      
      const params = {
        fields: fields,
        where: [
          {
            fieldName: 'deadline',
            operator: 'LessThanOrEqualTo',
            values: [endDate.toISOString()]
          },
          {
            fieldName: 'status',
            operator: 'NotEqualTo',
            values: ['published']
          }
        ],
        orderBy: [
          {
            fieldName: 'deadline',
            SortType: 'ASC'
          }
        ]
      };
      
      const response = await apperClient.fetchRecords('task', params);
      
      if (!response || !response.data) {
        return [];
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching upcoming deadlines:', error);
      return [];
    }
  }
};

export default taskService;

class TaskService {
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
        Fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 
                'title', 'description', 'word_count_target', 'word_count_complete', 'deadline', 
                'status', 'notes', 'created_at', 'updated_at', 'project_id']
      };
      
      const response = await this.apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }
      
      // Map database fields to UI expected format
      const tasks = response.data.map(task => ({
        id: task.Id,
        title: task.title || task.Name || '',
        description: task.description || '',
        wordCountTarget: task.word_count_target || 0,
        wordCountComplete: task.word_count_complete || 0,
        deadline: task.deadline || '',
        status: task.status || 'ideas',
        projectId: task.project_id || '',
        notes: task.notes || '',
        createdAt: task.created_at || task.CreatedOn,
        updatedAt: task.updated_at || task.ModifiedOn,
        tags: task.Tags || '',
        owner: task.Owner || ''
      }));
      
      return tasks;
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("Failed to load tasks");
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: ['Name', 'Tags', 'Owner', 'CreatedOn', 'CreatedBy', 'ModifiedOn', 'ModifiedBy', 
                'title', 'description', 'word_count_target', 'word_count_complete', 'deadline', 
                'status', 'notes', 'created_at', 'updated_at', 'project_id']
      };
      
      const response = await this.apperClient.getRecordById('task', parseInt(id), params);
      
      if (!response || !response.data) {
        return null;
      }
      
      // Map database fields to UI expected format
      const task = {
        id: response.data.Id,
        title: response.data.title || response.data.Name || '',
        description: response.data.description || '',
        wordCountTarget: response.data.word_count_target || 0,
        wordCountComplete: response.data.word_count_complete || 0,
        deadline: response.data.deadline || '',
        status: response.data.status || 'ideas',
        projectId: response.data.project_id || '',
        notes: response.data.notes || '',
        createdAt: response.data.created_at || response.data.CreatedOn,
        updatedAt: response.data.updated_at || response.data.ModifiedOn,
        tags: response.data.Tags || '',
        owner: response.data.Owner || ''
      };
      
      return task;
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      return null;
    }
  }

  async getByProject(projectId) {
    try {
      const params = {
        Fields: ['Name', 'Tags', 'Owner', 'title', 'description', 'word_count_target', 
                'word_count_complete', 'deadline', 'status', 'notes', 'created_at', 'updated_at', 'project_id'],
        where: [{
          FieldName: "project_id",
          Operator: "EqualTo",
          Values: [parseInt(projectId)]
        }]
      };
      
      const response = await this.apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      // Map database fields to UI expected format
      const tasks = response.data.map(task => ({
        id: task.Id,
        title: task.title || task.Name || '',
        description: task.description || '',
        wordCountTarget: task.word_count_target || 0,
        wordCountComplete: task.word_count_complete || 0,
        deadline: task.deadline || '',
        status: task.status || 'ideas',
        projectId: task.project_id || '',
        notes: task.notes || '',
        createdAt: task.created_at,
        updatedAt: task.updated_at,
        tags: task.Tags || '',
        owner: task.Owner || ''
      }));
      
      return tasks;
    } catch (error) {
      console.error("Error fetching tasks by project:", error);
      return [];
    }
  }

  async getByStatus(status) {
    try {
      const params = {
        Fields: ['Name', 'Tags', 'Owner', 'title', 'description', 'word_count_target', 
                'word_count_complete', 'deadline', 'status', 'notes', 'created_at', 'updated_at', 'project_id'],
        where: [{
          FieldName: "status",
          Operator: "ExactMatch",
          Values: [status]
        }]
      };
      
      const response = await this.apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      // Map database fields to UI expected format
      const tasks = response.data.map(task => ({
        id: task.Id,
        title: task.title || task.Name || '',
        description: task.description || '',
        wordCountTarget: task.word_count_target || 0,
        wordCountComplete: task.word_count_complete || 0,
        deadline: task.deadline || '',
        status: task.status || 'ideas',
        projectId: task.project_id || '',
        notes: task.notes || '',
        createdAt: task.created_at,
        updatedAt: task.updated_at,
        tags: task.Tags || '',
        owner: task.Owner || ''
      }));
      
      return tasks;
    } catch (error) {
      console.error("Error fetching tasks by status:", error);
      return [];
    }
  }

  async create(taskData) {
    try {
      // Only include Updateable fields
      const params = {
        records: [{
          Name: taskData.title || '',
          Tags: taskData.tags || '',
          Owner: taskData.owner || '',
          title: taskData.title || '',
          description: taskData.description || '',
          word_count_target: taskData.wordCountTarget || 0,
          word_count_complete: taskData.wordCountComplete || 0,
          deadline: taskData.deadline || '',
          status: taskData.status || 'ideas',
          notes: taskData.notes || '',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          project_id: taskData.projectId ? parseInt(taskData.projectId) : null
        }]
      };
      
      const response = await this.apperClient.createRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          // Map database response to UI expected format
          const newTask = {
            id: result.data.Id,
            title: result.data.title || result.data.Name || '',
            description: result.data.description || '',
            wordCountTarget: result.data.word_count_target || 0,
            wordCountComplete: result.data.word_count_complete || 0,
            deadline: result.data.deadline || '',
            status: result.data.status || 'ideas',
            projectId: result.data.project_id || '',
            notes: result.data.notes || '',
            createdAt: result.data.created_at,
            updatedAt: result.data.updated_at,
            tags: result.data.Tags || '',
            owner: result.data.Owner || ''
          };
          
          return newTask;
        } else {
          console.error(`Failed to create task:${JSON.stringify([result])}`);
          if (result.errors) {
            result.errors.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
          }
          if (result.message) toast.error(result.message);
          throw new Error(result.message || 'Failed to create task');
        }
      }
      
      throw new Error('No results returned from create operation');
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  }

  async update(id, data) {
    try {
      // Only include Updateable fields plus Id
      const updateData = {
        Id: parseInt(id)
      };
      
      // Map UI field names to database field names for updateable fields only
      if (data.title !== undefined) {
        updateData.Name = data.title;
        updateData.title = data.title;
      }
      if (data.tags !== undefined) updateData.Tags = data.tags;
      if (data.owner !== undefined) updateData.Owner = data.owner;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.wordCountTarget !== undefined) updateData.word_count_target = data.wordCountTarget;
      if (data.wordCountComplete !== undefined) updateData.word_count_complete = data.wordCountComplete;
      if (data.deadline !== undefined) updateData.deadline = data.deadline;
      if (data.status !== undefined) updateData.status = data.status;
      if (data.notes !== undefined) updateData.notes = data.notes;
      if (data.projectId !== undefined) updateData.project_id = data.projectId ? parseInt(data.projectId) : null;
      
      // Always update the updated_at timestamp
      updateData.updated_at = new Date().toISOString();
      
      const params = {
        records: [updateData]
      };
      
      const response = await this.apperClient.updateRecord('task', params);
      
      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results && response.results.length > 0) {
        const result = response.results[0];
        if (result.success) {
          // Map database response to UI expected format
          const updatedTask = {
            id: result.data.Id,
            title: result.data.title || result.data.Name || '',
            description: result.data.description || '',
            wordCountTarget: result.data.word_count_target || 0,
            wordCountComplete: result.data.word_count_complete || 0,
            deadline: result.data.deadline || '',
            status: result.data.status || 'ideas',
            projectId: result.data.project_id || '',
            notes: result.data.notes || '',
            createdAt: result.data.created_at,
            updatedAt: result.data.updated_at,
            tags: result.data.Tags || '',
            owner: result.data.Owner || ''
          };
          
          return updatedTask;
        } else {
          console.error(`Failed to update task:${JSON.stringify([result])}`);
          if (result.errors) {
            result.errors.forEach(error => {
              toast.error(`${error.fieldLabel}: ${error.message}`);
            });
          }
          if (result.message) toast.error(result.message);
          throw new Error(result.message || 'Failed to update task');
        }
      }
      
      throw new Error('No results returned from update operation');
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord('task', params);
      
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
          console.error(`Failed to delete task:${JSON.stringify([result])}`);
          if (result.message) toast.error(result.message);
          throw new Error(result.message || 'Failed to delete task');
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  }

  async search(query) {
    try {
      const params = {
        Fields: ['Name', 'title', 'description', 'word_count_target', 'word_count_complete', 
                'deadline', 'status', 'notes', 'project_id', 'created_at', 'updated_at'],
        whereGroups: [{
          operator: "OR",
          SubGroups: [
            {
              conditions: [{
                FieldName: "title",
                Operator: "Contains",
                Values: [query]
              }],
              operator: ""
            },
            {
              conditions: [{
                FieldName: "description",
                Operator: "Contains",
                Values: [query]
              }],
              operator: ""
            },
            {
              conditions: [{
                FieldName: "notes",
                Operator: "Contains",
                Values: [query]
              }],
              operator: ""
            }
          ]
        }]
      };
      
      const response = await this.apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      // Map database fields to UI expected format
      const tasks = response.data.map(task => ({
        id: task.Id,
        title: task.title || task.Name || '',
        description: task.description || '',
        wordCountTarget: task.word_count_target || 0,
        wordCountComplete: task.word_count_complete || 0,
        deadline: task.deadline || '',
        status: task.status || 'ideas',
        projectId: task.project_id || '',
        notes: task.notes || '',
        createdAt: task.created_at,
        updatedAt: task.updated_at
      }));
      
      return tasks;
    } catch (error) {
      console.error("Error searching tasks:", error);
      return [];
    }
  }

  async getStats() {
    try {
      // Get all tasks to calculate stats
      const tasks = await this.getAll();
      
      const stats = {
        total: tasks.length,
        ideas: tasks.filter(t => t.status === 'ideas').length,
        drafting: tasks.filter(t => t.status === 'drafting').length,
        editing: tasks.filter(t => t.status === 'editing').length,
        submitted: tasks.filter(t => t.status === 'submitted').length,
        published: tasks.filter(t => t.status === 'published').length,
        totalWords: tasks.reduce((sum, task) => sum + task.wordCountComplete, 0),
        targetWords: tasks.reduce((sum, task) => sum + task.wordCountTarget, 0)
      };
      
      return stats;
    } catch (error) {
      console.error("Error getting task stats:", error);
      return {
        total: 0,
        ideas: 0,
        drafting: 0,
        editing: 0,
        submitted: 0,
        published: 0,
        totalWords: 0,
        targetWords: 0
      };
    }
  }
}

export default new TaskService();