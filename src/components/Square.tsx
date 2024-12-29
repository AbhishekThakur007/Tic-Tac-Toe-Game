import React from 'react';

interface SquareProps {
  value: string | null;
  onClick: () => void;
  disabled: boolean;
}

const Square: React.FC<SquareProps> = ({ value, onClick, disabled }) => {
  return (
    <button
      className={`w-24 h-24 bg-white border-2 border-gray-300 rounded-lg text-4xl font-bold
        ${!disabled && 'hover:bg-gray-100'} ${disabled && 'cursor-not-allowed'}`}
      onClick={onClick}
      disabled={disabled}
    >
      {value}
    </button>
  );
};

export default Square;