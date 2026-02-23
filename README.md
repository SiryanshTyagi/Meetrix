# 🖥️ Meetrix – Real-Time Multi-User Video Conferencing Platform

Meetrix is a full-stack, real-time video conferencing application built using **WebRTC** and **Socket.io**.  
It enables secure multi-user video communication using a **peer-to-peer mesh architecture**.

This project demonstrates advanced real-time system design, WebRTC signaling implementation, authentication security, and scalable room-based communication.

---

## 🌐 Live Deployment

**Frontend (Vercel):**  
https://meetrix-five.vercel.app/

**Backend (Render):**  
https://meetrix-5bop.onrender.com/

---

# ✨ Core Features

## 🎥 Real-Time Video Calling
- Peer-to-peer video & audio streaming
- WebRTC media negotiation
- ICE candidate exchange
- Dynamic stream handling

## 👥 Multi-User Mesh Architecture
- Fully connected peer mesh topology
- Each participant establishes direct connections with all others
- Real-time join/leave synchronization
- Automatic peer cleanup on disconnect

## 🔐 Secure Authentication
- JWT-based authentication
- bcrypt password hashing
- Protected frontend routes
- Backend token verification middleware

## 📡 Socket-Based Signaling Server
- WebRTC offer/answer exchange via Socket.io
- ICE candidate propagation
- Room-based signaling isolation
- Real-time user presence updates

## 🏠 Room Management System
- Create or join unique rooms
- Room-based socket isolation
- Dynamic participant handling
- Real-time peer updates

---

# 🏗 System Architecture

```
User Browser
      ↓
React + Vite (Frontend - Vercel)
      ↓ WebSocket (Socket.io)
Express.js Signaling Server (Render)
      ↓
WebRTC Peer Connections (Mesh Network)
      ↓
Direct Peer-to-Peer Media Streams
```

---

# 🧠 Deep Technical Architecture

## 1️⃣ Authentication Layer

- User registers → Password hashed using bcrypt
- JWT generated upon login
- JWT stored client-side
- Protected routes verify token before allowing room access

This ensures:
- Stateless authentication
- Secure user isolation
- Controlled room entry

---

## 2️⃣ WebRTC Signaling Flow

WebRTC requires a signaling mechanism to exchange connection metadata.

Meetrix implements custom signaling using Socket.io.

### Connection Flow:

1. User joins a room
2. Socket connects to room
3. Existing users are notified
4. New RTCPeerConnection created
5. Offer generated
6. Offer sent via socket
7. Answer returned
8. ICE candidates exchanged
9. Peer connection established
10. Media streams flow directly peer-to-peer

---

## 3️⃣ Multi-User Mesh Topology

Meetrix uses a Mesh Architecture.


If there are **N users**:

Each user connects to **N - 1 peers**

Total connections:

```
N * (N - 1) / 2
```

### Example:
- 4 users → 6 total peer connections  
- 5 users → 10 connections  

### Why Mesh?
- No media server required
- Pure peer-to-peer communication
- Ideal for small group conferencing
- Demonstrates deep WebRTC understanding

---

# 🧠 Tech Stack

## Frontend
- React
- Vite
- Socket.io Client
- WebRTC API
- JWT handling
- Protected Routes
- Custom Hooks (Room Call Management)

## Backend
- Node.js
- Express.js
- Socket.io
- JWT
- bcrypt
- MongoDB 
- CORS
- Environment configuration with dotenv

---

# 📂 Project Structure

```
backend/
├── middlewares/
├── models/
├── routes/
├── index.js
├── .env
└── package.json

frontend/
├── src/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   ├── socket.js
│   ├── App.jsx
│   └── main.jsx
└── package.json
```

---

# 🔄 Complete Call Flow Summary

1. User logs in
2. JWT is validated
3. User joins a room
4. Socket connection established
5. Signaling events exchanged
6. Peer connections created
7. Media streams exchanged directly between users
8. Users can join/leave dynamically without breaking room state

---

# ⚙ Environment Variables

## Backend (.env)

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

## Frontend (.env)

```
VITE_BACKEND_URL=https://meetrix-5bop.onrender.com
```

---

# 🚀 Local Development

## Clone Repository

```
git clone https://github.com/SiryanshTyagi/Meetrix.git
cd Meetrix
```

## Backend Setup

```
cd backend
npm install
npm run dev
```

## Frontend Setup

```
cd frontend
npm install
npm run dev
```

---

# 📈 Scalability Discussion

### Current Architecture: Mesh Network

### Pros:
- Simple implementation
- No SFU/MCU server required
- Efficient for small groups (≤ 5–6 users)

### Cons:
- Bandwidth grows quadratically
- CPU usage increases per participant
- Not suitable for large-scale conferencing

### Future Upgrade Path:
- Integrate SFU (Selective Forwarding Unit)
- Use mediasoup or Janus
- Implement server-side stream forwarding

This shows understanding of real-time scalability tradeoffs.

---

# 🔐 Security Considerations

- Password hashing using bcrypt
- JWT validation middleware
- Protected API endpoints
- Secure socket event handling
- Room isolation logic
- Environment variable protection

---

# 🎯 What This Project Demonstrates

- Deep WebRTC knowledge
- Real-time distributed systems engineering
- Custom signaling server implementation
- Multi-user peer management
- Secure authentication architecture
- Mesh topology networking
- Full-stack production deployment
- System scalability awareness

---

# 👨‍💻 Author

Siryansh Tyagi  
Full Stack Developer | Real-Time Systems Enthusiast  

GitHub: https://github.com/SiryanshTyagi  
LinkedIn: https://www.linkedin.com/in/siryansh-tyagi-157b282ab/

---
