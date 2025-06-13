import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import { Input } from '@/components/atoms/Input';

const SearchInput = ({ value, onChange, placeholder = 'Search...', className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <ApperIcon 
        name="Search" 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-surface-500" 
        size={16} 
      />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="pl-10 pr-4 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent transition-all w-64"
      />
    </div>
  );
};

export default SearchInput;