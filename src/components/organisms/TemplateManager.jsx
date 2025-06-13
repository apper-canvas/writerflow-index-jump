import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, FileText } from 'lucide-react';
import { templateService } from '@/services';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import FormField from '@/components/molecules/FormField';
import Spinner from '@/components/atoms/Spinner';
import ErrorMessage from '@/components/atoms/ErrorMessage';
import EmptyState from '@/components/atoms/EmptyState';

const TemplateManager = ({ isOpen, onClose }) => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    description: '',
    wordCountTarget: '',
    deadline: ''
  });

  useEffect(() => {
    if (isOpen) {
      loadTemplates();
    }
  }, [isOpen]);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await templateService.getAll();
      setTemplates(data);
    } catch (err) {
      setError('Failed to load templates');
      console.error('Error loading templates:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const templateData = {
        ...formData,
        wordCountTarget: parseInt(formData.wordCountTarget) || 0,
        deadline: parseInt(formData.deadline) || 1
      };

      if (editingTemplate) {
        await templateService.update(editingTemplate.id, templateData);
        toast.success('Template updated successfully');
      } else {
        await templateService.create(templateData);
        toast.success('Template created successfully');
      }

      resetForm();
      loadTemplates();
    } catch (err) {
      toast.error('Failed to save template');
      console.error('Error saving template:', err);
    }
  };

  const handleDelete = async (template) => {
    if (confirm(`Are you sure you want to delete "${template.name}"?`)) {
      try {
        await templateService.delete(template.id);
        toast.success('Template deleted successfully');
        loadTemplates();
      } catch (err) {
        toast.error('Failed to delete template');
        console.error('Error deleting template:', err);
      }
    }
  };

  const handleEdit = (template) => {
    setEditingTemplate(template);
    setFormData({
      name: template.name,
      title: template.title,
      description: template.description,
      wordCountTarget: template.wordCountTarget.toString(),
      deadline: template.deadline.toString()
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      title: '',
      description: '',
      wordCountTarget: '',
      deadline: ''
    });
    setEditingTemplate(null);
    setShowForm(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Template Manager</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-semibold"
          >
            ×
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {!showForm ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Your Templates</h3>
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  New Template
                </Button>
              </div>

              {loading && <Spinner />}
              {error && <ErrorMessage message={error} />}
              
              {!loading && !error && templates.length === 0 && (
                <EmptyState
                  icon={FileText}
                  title="No templates yet"
                  description="Create your first template to save time on recurring content types"
                  action={
                    <Button
                      onClick={() => setShowForm(true)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Create Template
                    </Button>
                  }
                />
              )}

              {!loading && !error && templates.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2">
                  {templates.map((template) => (
                    <div key={template.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex justify-between items-start mb-3">
                        <h4 className="font-semibold text-gray-900">{template.name}</h4>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(template)}
                            className="text-gray-400 hover:text-indigo-600 p-1"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(template)}
                            className="text-gray-400 hover:text-red-600 p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{template.title}</p>
                      <p className="text-gray-500 text-sm mb-3 line-clamp-2">{template.description}</p>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>{template.wordCountTarget} words</span>
                        <span>{template.deadline} day{template.deadline !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingTemplate ? 'Edit Template' : 'Create New Template'}
                </h3>
                <Button
                  onClick={resetForm}
                  variant="outline"
                  className="text-gray-600 border-gray-300 hover:bg-gray-50"
                >
                  Cancel
                </Button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <FormField
                  label="Template Name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Blog Post Template"
                />

                <FormField
                  label="Default Title"
                  name="title"
                  type="text"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="e.g., New Blog Post"
                />

                <FormField
                  label="Default Description"
                  name="description"
                  type="textarea"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Write an engaging blog post about [topic]"
                  rows={3}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    label="Word Count Target"
                    name="wordCountTarget"
                    type="number"
                    value={formData.wordCountTarget}
                    onChange={handleChange}
                    required
                    min="1"
                    placeholder="1000"
                  />

                  <FormField
                    label="Default Deadline (days)"
                    name="deadline"
                    type="number"
                    value={formData.deadline}
                    onChange={handleChange}
                    required
                    min="1"
                    placeholder="7"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    type="button"
                    onClick={resetForm}
                    variant="outline"
                    className="text-gray-600 border-gray-300 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    {editingTemplate ? 'Update Template' : 'Create Template'}
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default TemplateManager;