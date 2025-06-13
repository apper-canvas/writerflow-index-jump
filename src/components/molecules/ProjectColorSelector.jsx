import React from 'react';
import ColorPickerDot from '@/components/atoms/ColorPickerDot';

const ProjectColorSelector = ({ selectedColor, onSelectColor }) => {
  const colors = [
    '#3498DB', '#27AE60', '#E67E22', '#9B59B6', 
    '#E74C3C', '#F39C12', '#1ABC9C', '#34495E'
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-surface-700 mb-2">
        Color
      </label>
      <div className="flex space-x-2">
        {colors.map(color => (
          <ColorPickerDot
            key={color}
            color={color}
            isSelected={selectedColor === color}
            onClick={() => onSelectColor(color)}
          />
        ))}
      </div>
    </div>
  );
};

export default ProjectColorSelector;