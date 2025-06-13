import React from 'react';

const Input = React.forwardRef(({ type = 'text', className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={`w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent ${className || ''}`}
      {...props}
    />
  );
});

Input.displayName = 'Input';

const Textarea = React.forwardRef(({ className, rows = 3, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={`w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent ${className || ''}`}
      rows={rows}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';

const Select = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={`text-sm border border-surface-300 rounded focus:ring-2 focus:ring-accent focus:border-transparent ${className || ''}`}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = 'Select';

export { Input, Textarea, Select };