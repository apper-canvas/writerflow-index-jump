import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import FormField from '@/components/molecules/FormField';
import Button from '@/components/atoms/Button';
import { taskService, templateService } from '@/services';
import { toast } from 'react-toastify';

const TaskFormModal = ({ isOpen, onClose, onSubmit, initialData, projects, templates = [] }) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    deadline: initialData?.deadline?.split('T')[0] || '', // format for date input
    wordCountTarget: initialData?.wordCountTarget || 0,
    wordCountComplete: initialData?.wordCountComplete || 0,
    projectId: initialData?.projectId || '',
    status: initialData?.status || 'drafting',
    notes: initialData?.notes || ''
});
  
  const [selectedTemplate, setSelectedTemplate] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        deadline: initialData.deadline?.split('T')[0] || '',
        wordCountTarget: initialData.wordCountTarget || 0,
        wordCountComplete: initialData.wordCountComplete || 0,
        projectId: initialData.projectId || '',
        status: initialData.status || 'drafting',
        notes: initialData.notes || ''
      });
    } else {
      setFormData({
        title: '',
        description: '',
        deadline: '',
        wordCountTarget: 0,
        wordCountComplete: 0,
        projectId: '',
        status: 'drafting',
        notes: ''
      });
    }
}, [initialData, isOpen]);
  
  const handleApplyTemplate = async (templateId) => {
    if (!templateId) return;
    
    try {
      const template = await templateService.getById(templateId);
      if (template) {
        const deadlineDate = new Date();
        deadlineDate.setDate(deadlineDate.getDate() + template.deadline);
        
        setFormData(prev => ({
          ...prev,
          title: template.title,
          description: template.description,
          wordCountTarget: template.wordCountTarget,
          deadline: deadlineDate.toISOString().split('T')[0]
        }));
        
        toast.success('Template applied successfully');
      }
    } catch (err) {
      toast.error('Failed to apply template');
      console.error('Error applying template:', err);
    }
  };

const handleTemplateChange = (e) => {
    const templateId = e.target.value;
    setSelectedTemplate(templateId);
    if (templateId) {
      handleApplyTemplate(templateId);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.deadline) {
      toast.error('Title and Deadline are required.');
      return;
    }

    try {
      if (initialData) {
        await onSubmit(initialData.id, formData);
        toast.success('Task updated successfully');
      } else {
        await onSubmit(formData);
        toast.success('Task created successfully');
      }
      onClose();
    } catch (err) {
      toast.error(`Failed to ${initialData ? 'update' : 'create'} task`);
      console.error(err);
    }
  };

  if (!isOpen) return null;

  const projectOptions = projects.map(p => ({ value: p.id, label: p.name }));

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 my-8"
      >
        <h3 className="text-lg font-medium text-surface-900 mb-4">
          {initialData ? 'Edit Task' : 'Create New Task'}
        </h3>
{templates.length > 0 && (
          <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-indigo-900">Quick Start with Template</h3>
            </div>
            <select
              value={selectedTemplate}
              onChange={handleTemplateChange}
              className="w-full px-3 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white text-sm"
            >
              <option value="">Select a template...</option>
              {templates.map((template) => (
                <option key={template.id} value={template.id}>
                  {template.name} ({template.wordCountTarget} words, {template.deadline} day{template.deadline !== 1 ? 's' : ''})
                </option>
              ))}
            </select>
            <p className="text-xs text-indigo-600 mt-2">
              Selecting a template will auto-fill the form fields below
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Task Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., Blog post about AI"
            required
          />
          
          <FormField
            label="Description"
            name="description"
            type="textarea"
            value={formData.description}
            onChange={handleChange}
            placeholder="Brief description of the task"
            rows="2"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Deadline"
              name="deadline"
              type="date"
              value={formData.deadline}
              onChange={handleChange}
              required
            />
            <FormField
              label="Target Word Count"
              name="wordCountTarget"
              type="number"
              value={formData.wordCountTarget}
              onChange={handleChange}
              placeholder="e.g., 1000"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Project"
              name="projectId"
              type="select"
              value={formData.projectId}
              onChange={handleChange}
              options={[{ value: '', label: 'Select Project' }, ...projectOptions]}
            />
            <FormField
              label="Status"
              name="status"
              type="select"
              value={formData.status}
              onChange={handleChange}
              options={[
                { value: 'ideas', label: 'Ideas' },
                { value: 'drafting', label: 'Drafting' },
                { value: 'editing', label: 'Editing' },
                { value: 'submitted', label: 'Submitted' },
                { value: 'published', label: 'Published' },
              ]}
            />
          </div>

          <FormField
            label="Current Word Count"
            name="wordCountComplete"
            type="number"
            value={formData.wordCountComplete}
            onChange={handleChange}
            placeholder="e.g., 500"
          />
          
          <FormField
            label="Notes"
            name="notes"
            type="textarea"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Any additional notes about this task"
            rows="3"
          />
          
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-surface-700 border border-surface-300 rounded-lg hover:bg-surface-50 transition-colors bg-transparent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
            >
              {initialData ? 'Update' : 'Create'} Task
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default TaskFormModal;