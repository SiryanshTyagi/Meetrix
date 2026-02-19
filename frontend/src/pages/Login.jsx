import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { connectSocket } from "../socket";
import { API_BASE_URL } from "../config";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/user/login`, {
        username,
        password,
      });

      const token = response.data.token;
      localStorage.setItem("token", token);
      connectSocket(token);
      navigate("/dashboard");
    } catch (e) {
      setError(e.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        px: 2,
      }}
    >
      <Paper sx={{ width: "100%", maxWidth: 450, p: { xs: 3, md: 4 } }}>
        <Stack spacing={2.5} component="form" onSubmit={handleLogin}>
          <Box>
            <Typography variant="h4" sx={{ mb: 0.5 }}>
              Welcome back
            </Typography>
            <Typography color="text.secondary">
              Login to continue your video meeting workspace.
            </Typography>
          </Box>

          {error && <Alert severity="error">{error}</Alert>}

          <TextField
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" variant="contained" size="large" disabled={isLoading}>
            {isLoading ? <CircularProgress size={22} color="inherit" /> : "Login"}
          </Button>

          <Typography color="text.secondary" sx={{ textAlign: "center" }}>
            New here?{" "}
            <Link component={RouterLink} to="/register" underline="hover" fontWeight={700}>
              Create an account
            </Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}

export default Login;
