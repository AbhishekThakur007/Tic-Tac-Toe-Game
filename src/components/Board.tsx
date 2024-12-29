import React from 'react';
import Square from './Square';

interface BoardProps {
  squares: (string | null)[];
  onClick: (i: number) => void;
  disabled: boolean;
}

const Board: React.FC<BoardProps> = ({ squares, onClick, disabled }) => {
  return (
    <div className="grid grid-cols-3 gap-2 w-[300px]">
      {squares.map((square, i) => (
        <Square
          key={i}
          value={square}
          onClick={() => onClick(i)}
          disabled={disabled || square !== null}
        />
      ))}
    </div>
  );
};

export default Board;