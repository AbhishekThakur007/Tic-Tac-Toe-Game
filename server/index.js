import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

const games = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('joinGame', (gameId) => {
    let game = games.get(gameId);
    
    if (!game) {
      game = {
        id: gameId,
        players: [],
        currentPlayer: null,
        board: Array(9).fill(null)
      };
      games.set(gameId, game);
    }

    if (game.players.length >= 2) {
      socket.emit('gameFull');
      return;
    }

    const playerNumber = game.players.length + 1;
    const symbol = playerNumber === 1 ? 'O' : 'X';
    
    game.players.push({
      id: socket.id,
      symbol,
      number: playerNumber
    });

    socket.join(gameId);
    socket.emit('playerAssigned', { playerNumber, symbol });

    if (game.players.length === 2) {
      game.currentPlayer = game.players[0].id;
      io.to(gameId).emit('gameStart', {
        currentPlayer: game.currentPlayer,
        board: game.board
      });
    }
  });

  socket.on('makeMove', ({ gameId, index }) => {
    const game = games.get(gameId);
    
    if (!game || game.board[index] !== null) return;
    
    const player = game.players.find(p => p.id === socket.id);
    if (!player || game.currentPlayer !== socket.id) return;

    game.board[index] = player.symbol;
    
    const nextPlayer = game.players.find(p => p.id !== socket.id);
    game.currentPlayer = nextPlayer.id;

    io.to(gameId).emit('gameUpdate', {
      board: game.board,
      currentPlayer: game.currentPlayer
    });

    const winner = calculateWinner(game.board);
    if (winner || game.board.every(cell => cell !== null)) {
      io.to(gameId).emit('gameOver', { winner });
      games.delete(gameId);
    }
  });

  socket.on('disconnect', () => {
    games.forEach((game, gameId) => {
      if (game.players.some(p => p.id === socket.id)) {
        io.to(gameId).emit('playerDisconnected');
        games.delete(gameId);
      }
    });
  });
});

function calculateWinner(board) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6] // diagonals
  ];

  for (const [a, b, c] of lines) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
}

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});