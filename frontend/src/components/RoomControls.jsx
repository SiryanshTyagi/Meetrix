import { Button, Stack } from "@mui/material";
import MicOffIcon from "@mui/icons-material/MicOff";
import MicIcon from "@mui/icons-material/Mic";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import CallEndIcon from "@mui/icons-material/CallEnd";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";

const RoomControls = ({
  isMuted,
  isCameraOff,
  isScreenSharing,
  onToggleMute,
  onToggleCamera,
  onToggleScreenShare,
  onLeave,
}) => {
  return (
    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 2.5 }}>
      <Button
        variant={isMuted ? "contained" : "outlined"}
        color={isMuted ? "warning" : "primary"}
        onClick={onToggleMute}
        startIcon={isMuted ? <MicOffIcon /> : <MicIcon />}
      >
        {isMuted ? "Unmute" : "Mute"}
      </Button>

      <Button
        variant={isCameraOff ? "contained" : "outlined"}
        color={isCameraOff ? "warning" : "primary"}
        onClick={onToggleCamera}
        startIcon={isCameraOff ? <VideocamOffIcon /> : <VideocamIcon />}
      >
        {isCameraOff ? "Turn Camera On" : "Turn Camera Off"}
      </Button>

      <Button
        variant={isScreenSharing ? "contained" : "outlined"}
        color={isScreenSharing ? "secondary" : "primary"}
        onClick={onToggleScreenShare}
        startIcon={isScreenSharing ? <StopScreenShareIcon /> : <ScreenShareIcon />}
      >
        {isScreenSharing ? "Stop Sharing" : "Share Screen"}
      </Button>

      <Button variant="contained" color="error" onClick={onLeave} startIcon={<CallEndIcon />}>
        Leave Call
      </Button>
    </Stack>
  );
};

export default RoomControls;
