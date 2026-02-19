import { useEffect } from "react";

export const useRoomSignaling = ({
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
}) => {
  useEffect(() => {
    if (!socket) return;

    hasLeftRoomRef.current = false;

    const initMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        localStreamRef.current = stream;

        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
          localVideoRef.current.play().catch(() => {});
        }
      } catch (err) {
        console.error("Media error:", err);
      }
    };

    const onParticipants = async (participants) => {
      for (const participant of participants) {
        const peer = createPeerConnection(
          participant.socketId,
          participant.username || "Participant",
        );

        try {
          const offer = await peer.createOffer();
          await peer.setLocalDescription(offer);
          socket.emit("offer", {
            to: participant.socketId,
            offer,
          });
        } catch (err) {
          console.error("Offer creation error:", err);
        }
      }
    };

    const onUserJoined = ({ socketId, username }) => {
      if (!socketId) return;
      upsertRemoteUser(socketId, { username: username || "Participant" });
      setMessages((prev) => [
        ...prev,
        { user: "System", msg: `@${username || "Participant"} joined the call` },
      ]);
    };

    const onOffer = async ({ from, offer, username }) => {
      if (!from || !offer) return;

      const peer = createPeerConnection(from, username || "Participant");

      try {
        await peer.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);
        socket.emit("answer", { to: from, answer });
      } catch (err) {
        console.error("Offer handling error:", err);
      }
    };

    const onAnswer = async ({ from, answer }) => {
      if (!from || !answer) return;

      const peer = peersRef.current.get(from);
      if (!peer) return;

      try {
        await peer.setRemoteDescription(new RTCSessionDescription(answer));
      } catch (err) {
        console.error("Answer handling error:", err);
      }
    };

    const onIceCandidate = async ({ from, candidate }) => {
      if (!from || !candidate) return;

      const peer = peersRef.current.get(from);
      if (!peer) return;

      try {
        await peer.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (err) {
        console.error("ICE error:", err);
      }
    };

    const onChat = (data) => {
      setMessages((prev) => [...prev, data]);
    };

    const onUserLeft = ({ socketId } = {}) => {
      if (!socketId) return;
      cleanupPeer(socketId);
    };

    const onSystem = (message) => {
      setMessages((prev) => [...prev, { user: "System", msg: message }]);
    };

    const onRoomFullEvent = (message) => {
      if (onRoomFull) {
        onRoomFull(message);
      }
    };

    socket.on("participants", onParticipants);
    socket.on("user-joined", onUserJoined);
    socket.on("offer", onOffer);
    socket.on("answer", onAnswer);
    socket.on("ice-candidate", onIceCandidate);
    socket.on("chat", onChat);
    socket.on("user-left", onUserLeft);
    socket.on("system", onSystem);
    socket.on("room-full", onRoomFullEvent);

    initMedia().then(() => {
      socket.emit("join-room", roomId);
    });

    return () => {
      emitLeaveRoomOnce();

      socket.off("participants", onParticipants);
      socket.off("user-joined", onUserJoined);
      socket.off("offer", onOffer);
      socket.off("answer", onAnswer);
      socket.off("ice-candidate", onIceCandidate);
      socket.off("chat", onChat);
      socket.off("user-left", onUserLeft);
      socket.off("system", onSystem);
      socket.off("room-full", onRoomFullEvent);

      cleanupCall();
    };
  }, [
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
  ]);
};
