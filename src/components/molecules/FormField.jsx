import React from 'react';
import { Input, Textarea, Select } from '@/components/atoms/Input';

const FormField = ({ label, name, type = 'text', value, onChange, placeholder, required = false, rows, options, className = '' }) => {
  const id = `form-field-${name}`;
  const Component = type === 'textarea' ? Textarea : type === 'select' ? Select : Input;

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-surface-700 mb-1">
        {label}
      </label>
      <Component
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
      >
        {options && options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Component>
    </div>
  );
};

export default FormField;