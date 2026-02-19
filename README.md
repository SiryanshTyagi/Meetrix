# Video Conferencing App

A full-stack real-time video conferencing app built with React, Node.js, Express, MongoDB, Socket.IO, and WebRTC.

## Features

- JWT-based user authentication (register/login)
- Protected frontend routes
- Create and join meeting rooms by ID
- Real-time room events with Socket.IO
- Peer-to-peer audio/video calls with WebRTC signaling
- Screen sharing support
- In-room text chat
- Room participant cap (max 5 users)

## Tech Stack

### Frontend

- React 19 + Vite
- Material UI
- React Router
- Axios
- Socket.IO client

### Backend

- Node.js + Express
- MongoDB + Mongoose
- JWT + bcryptjs
- Socket.IO

## Project Structure

```text
socket/
  backend/
    index.js
    routes/
    middlewares/
    models/
  frontend/
    src/
      pages/
      components/
      hooks/
```

## Prerequisites

- Node.js 18+
- npm
- MongoDB instance (local or cloud)

## Environment Variables

### Backend (`backend/.env`)

Copy `backend/.env.example` and set values:

```env
MONGO_URL=your_mongodb_connection_string
PORT=3000
JWT_SECRET=your_strong_jwt_secret
FRONTEND_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)

Copy `frontend/.env.example` and set values:

```env
VITE_API_URL=http://localhost:3000
VITE_SOCKET_URL=http://localhost:3000
```

## Installation

Install dependencies in both apps:

```bash
cd backend
npm install

cd ../frontend
npm install
```

## Run Locally

Start backend:

```bash
cd backend
node index.js
```

Start frontend in a separate terminal:

```bash
cd frontend
npm run dev
```

Frontend default URL: `http://localhost:5173`

## API Endpoints

Base URL: `http://localhost:3000`

- `POST /api/user/register` - Register user and return JWT
- `POST /api/user/login` - Login user and return JWT
- `GET /api/protected` - Example protected route (requires `Authorization: Bearer <token>`)

## Socket Events (High Level)

- `join-room`
- `room-full`
- `participants`
- `user-joined`
- `chat`
- `offer`
- `answer`
- `ice-candidate`
- `leave-room`
- `user-left`

## Notes

- Socket connections are authenticated using JWT (`socket.handshake.auth.token`).
- CORS is enforced using `FRONTEND_URL`.
- Existing frontend README (`frontend/README.md`) is the default Vite template and can be updated separately if needed.
