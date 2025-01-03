# Tic Tac Toe Game

## Overview
This is a real-time, two-player Tic Tac Toe game built with React.js on the frontend and Express.js with Socket.IO on the backend. The game allows players to join a specific game session using a `gameId` and play turn-by-turn with live updates.

---

## Features
- Real-time gameplay using WebSockets.
- Players can join a game session using a unique `gameId`.
- Turn-based play mechanics.
- Displays game status, including whose turn it is and the winner.
- Handles player disconnection and game completion.

---

## Tech Stack
### Frontend
- **React.js**: For the user interface.
- **Socket.IO Client**: For real-time communication with the backend.
- **Tailwind CSS**: For responsive and modern UI styling.

### Backend
- **Express.js**: As the backend framework.
- **Socket.IO**: For WebSocket-based real-time communication.

---

## Installation

### Prerequisites
Ensure you have the following installed:
- Node.js (v14 or higher)
- npm or yarn

### Steps

#### 1. Clone the Repository
```bash
git clone https://github.com/your-username/tic-tac-toe-game.git
cd tic-tac-toe-game
```

#### 2. Install Backend Dependencies
```bash
cd game-backend
npm install
```

#### 3. Install Frontend Dependencies
```bash
cd ../game-frontend
npm install
```

---

## Usage

### 1. Start the Backend Server
```bash
cd game-backend
npm start
```
The backend will run on `http://localhost:3001`.

### 2. Start the Frontend
```bash
cd ../game-frontend
npm start
```
The frontend will run on `http://localhost:3000`.

### 3. Play the Game
1. Open the frontend in two separate browser tabs or windows.
2. Enter the same `gameId` in both tabs to join the same game session.
3. Player 1 uses `O` and Player 2 uses `X`. Take turns clicking on the board squares.

---

## File Structure
```
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── server/
│   └── index.js
├── src/
│   ├── App.tsx
│   ├── components/
│   │   ├── Board.tsx
│   │   └── Square.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## Dependencies
### Backend
- Express
- Socket.IO

### Frontend
- React
- Socket.IO Client
- Tailwind CSS
- Lucide React (or React Icons, if used)

---

## Future Improvements
- Add authentication for players.
- Enhance UI with animations.
- Add a leaderboard feature.
- Implement a rematch option.

---

## License
This project is licensed under the [MIT License](LICENSE).

---

