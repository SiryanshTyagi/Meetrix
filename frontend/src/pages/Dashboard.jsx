import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import {
  Alert,
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

function Dashboard() {
  const [roomId, setRoomId] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCreate = () => {
    const meetingId = uuidv4();
    navigate(`/room/${meetingId}`);
  };

  const handleJoin = () => {
    if (!roomId.trim()) {
      setError("Please enter a valid room ID.");
      return;
    }

    setError("");
    navigate(`/room/${roomId.trim()}`);
  };

  return (
    <Box sx={{ maxWidth: 1080, mx: "auto" }}>
      <Paper sx={{ p: { xs: 3, md: 4 }, mb: 3 }}>
        <Typography variant="h4" sx={{ mb: 1 }}>
          Meeting Dashboard
        </Typography>
        <Typography color="text.secondary">
          Start instant calls or join with a room code. Built with MERN, Socket.IO,
          WebRTC, and JWT auth.
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Stack spacing={2}>
              <Typography variant="h5">Create new room</Typography>
              <Typography color="text.secondary">
                Generate a unique room ID and start your call right away.
              </Typography>
              <Button variant="contained" size="large" onClick={handleCreate}>
                Create Room
              </Button>
            </Stack>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper sx={{ p: 3, height: "100%" }}>
            <Stack spacing={2}>
              <Typography variant="h5">Join existing room</Typography>
              <Typography color="text.secondary">
                Enter the room ID shared by your teammate.
              </Typography>

              {error && <Alert severity="warning">{error}</Alert>}

              <TextField
                label="Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="e.g. 9b12a3e4-..."
              />
              <Button variant="outlined" size="large" onClick={handleJoin}>
                Join Room
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
