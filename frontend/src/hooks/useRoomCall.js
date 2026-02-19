import { useCallback, useRef, useState } from "react";
import { usePeerConnections } from "./room/usePeerConnections.js";
import { useMediaControls } from "./room/useMediaControls.js";
import { useRoomSignaling } from "./room/useRoomSignaling.js";

export const useRoomCall = ({ roomId, socket, onRoomFull }) => {
  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const hasLeftRoomRef = useRef(false);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [remoteUsers, setRemoteUsers] = useState([]);

  const {
    peersRef,
    upsertRemoteUser,
    cleanupPeer,
    createPeerConnection,
    cleanupAllPeers,
  } = usePeerConnections({
    socket,
    localStreamRef,
    setRemoteUsers,
  });

  const {
    isMuted,
    isCameraOff,
    isScreenSharing,
    toggleMute,
    toggleCamera,
    startScreenShare,
    stopScreenShare,
    cleanupMedia,
  } = useMediaControls({
    localVideoRef,
    localStreamRef,
    peersRef,
  });

  const cleanupCall = useCallback(() => {
    cleanupMedia();
    cleanupAllPeers();
  }, [cleanupMedia, cleanupAllPeers]);

  const emitLeaveRoomOnce = useCallback(() => {
    if (!socket || hasLeftRoomRef.current) return;
    socket.emit("leave-room");
    hasLeftRoomRef.current = true;
  }, [socket]);

  const leaveRoom = useCallback(() => {
    emitLeaveRoomOnce();
    cleanupCall();
  }, [emitLeaveRoomOnce, cleanupCall]);

  const sendMessage = useCallback(() => {
    if (!input.trim() || !socket) return;
    socket.emit("chat", input.trim());
    setInput("");
  }, [input, socket]);

  useRoomSignaling({
    socket,
    roomId,
    onRoomFull,
    hasLeftRoomRef,
    localVideoRef,
    localStreamRef,
    emitLeaveRoomOnce,
    cleanupCall,
    createPeerConnection,
    cleanupPeer,
    upsertRemoteUser,
    peersRef,
    setMessages,
  });

  return {
    localVideoRef,
    messages,
    input,
    setInput,
    isMuted,
    isCameraOff,
    isScreenSharing,
    remoteUsers,
    toggleMute,
    toggleCamera,
    startScreenShare,
    stopScreenShare,
    sendMessage,
    leaveRoom,
  };
};
