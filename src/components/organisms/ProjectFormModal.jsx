import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import FormField from '@/components/molecules/FormField';
import ProjectColorSelector from '@/components/molecules/ProjectColorSelector';
import Button from '@/components/atoms/Button';

const ProjectFormModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    color: initialData?.color || '#3498DB'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        color: initialData.color || '#3498DB'
      });
    } else {
      setFormData({ name: '', description: '', color: '#3498DB' });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleColorSelect = (color) => {
    setFormData(prev => ({ ...prev, color }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onSubmit(formData);
      onClose(); // Close modal after submission
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
      >
        <h3 className="text-lg font-medium text-surface-900 mb-4">
          {initialData ? 'Edit Project' : 'Create New Project'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Project Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., TechCorp Blog"
            required
          />
          
          <FormField
            label="Description"
            name="description"
            type="textarea"
            value={formData.description}
            onChange={handleChange}
            placeholder="Brief description of this project"
            rows="3"
          />
          
          <ProjectColorSelector 
            selectedColor={formData.color} 
            onSelectColor={handleColorSelect} 
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
              {initialData ? 'Update' : 'Create'} Project
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default ProjectFormModal;