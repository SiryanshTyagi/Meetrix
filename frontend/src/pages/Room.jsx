import { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Chip, Grid, Paper, Stack, Typography } from "@mui/material";
import { getSocket } from "../socket.js";
import { useRoomCall } from "../hooks/useRoomCall.js";
import VideoPanel from "../components/videopanel.jsx";
import ChatPanel from "../components/chatpanel.jsx";
import RoomControls from "../components/RoomControls.jsx";

const Room = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const socket = getSocket();

  const handleRoomFull = useCallback(
    (message) => {
      alert(message || "Room is full.");
      navigate("/dashboard");
    },
    [navigate],
  );

  const {
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
  } = useRoomCall({
    roomId: id,
    socket,
    onRoomFull: handleRoomFull,
  });

  const handleChatKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleLeaveRoom = () => {
    leaveRoom();
    navigate("/dashboard");
  };

  return (
    <Box sx={{ maxWidth: 1260, mx: "auto" }}>
      <Paper sx={{ p: { xs: 2.5, md: 3 }, mb: 3 }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", md: "center" }}
          spacing={2}
        >
          <Box>
            <Typography variant="h4">Room</Typography>
            <Typography color="text.secondary" sx={{ mt: 0.5 }}>
              ID: {id}
            </Typography>
          </Box>
          <Chip color="primary" variant="outlined" label="Live Session" />
        </Stack>
      </Paper>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Paper sx={{ p: 2.5 }}>
            <VideoPanel localVideoRef={localVideoRef} remoteUsers={remoteUsers} />
            <RoomControls
              isMuted={isMuted}
              isCameraOff={isCameraOff}
              isScreenSharing={isScreenSharing}
              onToggleMute={toggleMute}
              onToggleCamera={toggleCamera}
              onToggleScreenShare={isScreenSharing ? stopScreenShare : startScreenShare}
              onLeave={handleLeaveRoom}
            />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <ChatPanel
            messages={messages}
            input={input}
            setInput={setInput}
            sendMessage={sendMessage}
            onInputKeyDown={handleChatKeyDown}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Room;
