import { useCallback, useRef } from "react";

export const usePeerConnections = ({ socket, localStreamRef, setRemoteUsers }) => {
  const peersRef = useRef(new Map());

  const upsertRemoteUser = useCallback(
    (socketId, patch) => {
      setRemoteUsers((prev) => {
        const index = prev.findIndex((u) => u.socketId === socketId);
        if (index === -1) {
          return [
            ...prev,
            {
              socketId,
              username: patch.username || "Participant",
              stream: patch.stream || null,
            },
          ];
        }

        const next = [...prev];
        next[index] = { ...next[index], ...patch };
        return next;
      });
    },
    [setRemoteUsers],
  );

  const removeRemoteUser = useCallback(
    (socketId) => {
      setRemoteUsers((prev) => prev.filter((u) => u.socketId !== socketId));
    },
    [setRemoteUsers],
  );

  const cleanupPeer = useCallback(
    (socketId) => {
      const peer = peersRef.current.get(socketId);
      if (peer) {
        peer.ontrack = null;
        peer.onicecandidate = null;
        peer.close();
        peersRef.current.delete(socketId);
      }
      removeRemoteUser(socketId);
    },
    [removeRemoteUser],
  );

  const createPeerConnection = useCallback(
    (remoteSocketId, remoteUsername = "Participant") => {
      const existing = peersRef.current.get(remoteSocketId);
      if (existing) {
        upsertRemoteUser(remoteSocketId, { username: remoteUsername });
        return existing;
      }

      const peer = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      peer.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", {
            to: remoteSocketId,
            candidate: event.candidate,
          });
        }
      };

      peer.ontrack = (event) => {
        const [remoteStream] = event.streams;
        if (remoteStream) {
          upsertRemoteUser(remoteSocketId, {
            username: remoteUsername,
            stream: remoteStream,
          });
        }
      };

      const localStream = localStreamRef.current;
      if (localStream) {
        localStream.getTracks().forEach((track) => {
          peer.addTrack(track, localStream);
        });
      }

      peersRef.current.set(remoteSocketId, peer);
      upsertRemoteUser(remoteSocketId, { username: remoteUsername });

      return peer;
    },
    [localStreamRef, socket, upsertRemoteUser],
  );

  const cleanupAllPeers = useCallback(() => {
    for (const peer of peersRef.current.values()) {
      peer.close();
    }
    peersRef.current.clear();
    setRemoteUsers([]);
  }, [setRemoteUsers]);

  return {
    peersRef,
    upsertRemoteUser,
    cleanupPeer,
    createPeerConnection,
    cleanupAllPeers,
  };
};
