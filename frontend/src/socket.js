import { io } from "socket.io-client";
import { SOCKET_URL } from "./config";

let socket;
let socketToken;

export const connectSocket = (token) => {
  if (!token) return null;

  if (!socket) {
    socket = io(SOCKET_URL, {
      autoConnect: false,
      forceNew: true,
      auth: { token },
    });
  }

  if (socketToken !== token) {
    socket.auth = { token };

    if (socket.connected) {
      socket.disconnect();
    }
  }

  socketToken = token;

  if (!socket.connected) {
    socket.connect();
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }

  socketToken = null;
};

export const getSocket = () => socket;
