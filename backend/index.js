// =====================
// IMPORTS
// =====================

import express from "express";
import router from "./routes/userRoute.js";
import protect from "./middlewares/authmiddleware.js";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
// HTTP server (Socket.IO needs a server to attach to)
import http from "http";
// Socket.IO server class
import { Server } from "socket.io";

///////////////////////////////////////

dotenv.config(); /// to read .env variables
const app = express();
const allowedOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const isOriginAllowed = (origin) =>
  allowedOrigins.length === 0 || allowedOrigins.includes(origin);

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || isOriginAllowed(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Origin not allowed by CORS"));
  },
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

// =====================
// SERVER SETUP
// =====================

// Create raw HTTP server
const server = http.createServer(app);

// Attach Socket.IO to HTTP server
// CORS allows frontend to connect
const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || isOriginAllowed(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Origin not allowed by CORS"));
    },
    credentials: true,
  },
});

// =====================
// SOCKET CONNECTION
// =====================

// token verification before socket connection
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;

  if (!token) {
    return next(new Error("No token provided"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.user = decoded; // Attach user info to socket object
    next();
  } catch (err) {
    return next(new Error("Invalid token"));
  }
});

io.on("connection", (socket) => {
  console.log("Authenticated User connected:", socket.user.username);

  // ---------------------
  // ROOM JOIN
  // ---------------------
  socket.on("join-room", (room) => {
    const existingClients = io.sockets.adapter.rooms.get(room);
    const roomSize = existingClients ? existingClients.size : 0;

    if (roomSize >= 5) {
      socket.emit("room-full", "Room limit reached (max 5 participants).");
      return;
    }

    socket.join(room);
    socket.data.room = room;

    console.log(`${socket.user.username} joined ${room}`);
    const clients = io.sockets.adapter.rooms.get(room);
    const participants = clients
      ? [...clients]
          .filter((socketId) => socketId !== socket.id)
          .map((socketId) => {
            const peerSocket = io.sockets.sockets.get(socketId);
            return {
              socketId,
              username: peerSocket?.user?.username || "User",
            };
          })
      : [];

    socket.emit("participants", participants);
    socket.to(room).emit("user-joined", {
      socketId: socket.id,
      username: socket.user.username,
    });
  });

  // ---------------------
  // CHAT MESSAGE
  // ---------------------
  socket.on("chat", (msg) => {
    const room = socket.data.room;
    if (!room) return;

    io.to(room).emit("chat", {
      user: socket.user.username,
      msg,
    });
  });

  // ---------------------
  // WEBRTC SIGNALING
  // ---------------------
  socket.on("offer", ({ to, offer }) => {
    if (!to || !offer) return;

    io.to(to).emit("offer", {
      from: socket.id,
      offer,
      username: socket.user.username,
    });
  });

  socket.on("answer", ({ to, answer }) => {
    if (!to || !answer) return;

    io.to(to).emit("answer", {
      from: socket.id,
      answer,
    });
  });

  socket.on("ice-candidate", ({ to, candidate }) => {
    if (!to || !candidate) return;

    io.to(to).emit("ice-candidate", {
      from: socket.id,
      candidate,
    });
  });

  // ---------------------
  // LEAVE ROOM
  // ---------------------
  socket.on("leave-room", () => {
    const room = socket.data.room;
    if (!room) return;

    console.log(`${socket.user.username} left ${room}`);

    socket.leave(room);

    socket.to(room).emit("system", `@${socket.user.username} left the call`);
    socket.to(room).emit("user-left", {
      socketId: socket.id,
      username: socket.user.username,
    });

    socket.data.room = null;
  });

  // ---------------------
  // DISCONNECT
  // ---------------------
  socket.on("disconnect", () => {
    const room = socket.data.room;
    if (!room) return;

    console.log(`${socket.user.username} disconnected from ${room}`);

    socket.to(room).emit("system", `@${socket.user.username} disconnected`);
    socket.to(room).emit("user-left", {
      socketId: socket.id,
      username: socket.user.username,
    });
  });
});

// =====================
// START SERVER
// =====================

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("connected to database");
    const port = process.env.PORT || 3000;
    server.listen(port, () => {
      console.log(`connected to port ${port}`);
    });
  } catch (err) {
    console.log(`db connection failed, ${err.message}`);
    process.exit(1);
  }
};

startServer();

app.use("/api/user", router);

app.get("/api/protected", protect, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});
