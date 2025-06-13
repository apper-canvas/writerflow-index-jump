import React from 'react';

const FilterButtonGroup = ({ filters, selectedFilter, onSelectFilter }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map(filter => (
        <button
          key={filter.key}
          onClick={() => onSelectFilter(filter.key)}
          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
            selectedFilter === filter.key
              ? 'bg-accent text-white'
              : 'bg-surface-100 text-surface-700 hover:bg-surface-200'
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default FilterButtonGroup;