import {
  AppBar,
  Avatar,
  Box,
  Button,
  Chip,
  Toolbar,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { disconnectSocket } from "../socket";

const getUsernameFromToken = () => {
  const token = localStorage.getItem("token");
  if (!token) return "User";

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload?.username || "User";
  } catch {
    return "User";
  }
};

function Navbar() {
  const navigate = useNavigate();
  const username = getUsernameFromToken();

  const handleLogout = () => {
    disconnectSocket();
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: "linear-gradient(120deg, #0b6e78 0%, #084c58 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.16)",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Avatar sx={{ bgcolor: "rgba(255,255,255,0.22)", fontWeight: 700 }}>
            {username.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
              Meetrix
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.86 }}>
              Secure video meetings
            </Typography>
          </Box>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
          <Chip
            label={`@${username}`}
            variant="filled"
            sx={{
              color: "white",
              bgcolor: "rgba(255,255,255,0.17)",
              border: "1px solid rgba(255,255,255,0.25)",
            }}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={handleLogout}
            sx={{ boxShadow: "none", fontWeight: 700 }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
