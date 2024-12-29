import React, { useState, useEffect } from 'react';
import { io} from 'socket.io-client';
import Board from './components/Board';
import { Circle, CrossIcon} from 'lucide-react';

const socket = io('http://localhost:3001');

function App() {
  const [gameId, setGameId] = useState('');
  const [playerNumber, setPlayerNumber] = useState<number | null>(null);
  const [playerSymbol, setPlayerSymbol] = useState<string | null>(null);
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<string | null>(null);
  const [gameStatus, setGameStatus] = useState<string>('waiting');
  const [winner, setWinner] = useState<string | null>(null);

  useEffect(() => {
    socket.on('playerAssigned', ({ playerNumber, symbol }) => {
      setPlayerNumber(playerNumber);
      setPlayerSymbol(symbol);
      setGameStatus(playerNumber === 1 ? 'waiting' : 'ready');
    });

    socket.on('gameStart', ({ currentPlayer, board }) => {
      setGameStatus('playing');
      setCurrentPlayer(currentPlayer);
      setBoard(board);
    });

    socket.on('gameUpdate', ({ board, currentPlayer }) => {
      setBoard(board);
      setCurrentPlayer(currentPlayer);
    });

    socket.on('gameOver', ({ winner }) => {
      setWinner(winner);
      setGameStatus('over');
    });

    socket.on('gameFull', () => {
      setGameStatus('full');
    });

    socket.on('playerDisconnected', () => {
      setGameStatus('disconnected');
    });

    return () => {
      socket.off('playerAssigned');
      socket.off('gameStart');
      socket.off('gameUpdate');
      socket.off('gameOver');
      socket.off('gameFull');
      socket.off('playerDisconnected');
    };
  }, []);

  const handleJoinGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (gameId.trim()) {
      socket.emit('joinGame', gameId);
    }
  };

  const handleSquareClick = (index: number) => {
    if (gameStatus === 'playing' && socket.id === currentPlayer) {
      socket.emit('makeMove', { gameId, index });
    }
  };

  const renderGameStatus = () => {
    switch (gameStatus) {
      case 'waiting':
        return 'Waiting for another player to join...';
      case 'ready':
        return 'Game is ready to start!';
      case 'playing':
        return socket.id === currentPlayer ? 'Your turn!' : "Opponent's turn";
      case 'over':
        return winner ? `Game Over! ${winner} wins!` : 'Game Over! It\'s a draw!';
      case 'full':
        return 'Game is full!';
      case 'disconnected':
        return 'Opponent disconnected!';
      default:
        return 'Enter a game ID to start';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Tic Tac Toe</h1>
          <div className="flex justify-center gap-4 mb-4">
            <Circle className="w-8 h-8 text-blue-500" />
            <CrossIcon className="w-8 h-8 text-red-500" />
          </div>
        </div>

        {!playerNumber && (
          <form onSubmit={handleJoinGame} className="mb-6">
            <input
              type="text"
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
              placeholder="Enter Game ID"
              className="w-full p-2 border rounded mb-2"
            />
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              Join Game
            </button>
          </form>
        )}

        {playerNumber && (
          <div className="text-center mb-4">
            <p className="text-lg mb-2">
              You are Player {playerNumber} ({playerSymbol})
            </p>
            <p className="text-gray-600">{renderGameStatus()}</p>
          </div>
        )}

        {gameStatus !== 'full' && playerNumber && (
          <div className="flex justify-center">
            <Board
              squares={board}
              onClick={handleSquareClick}
              disabled={gameStatus !== 'playing' || socket.id !== currentPlayer}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;