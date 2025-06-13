import React from 'react';

const ColorPickerDot = ({ color, isSelected, onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-8 h-8 rounded-full transition-all ${
        isSelected ? 'ring-2 ring-surface-400 ring-offset-2' : ''
      }`}
      style={{ backgroundColor: color }}
    />
  );
};

export default ColorPickerDot;