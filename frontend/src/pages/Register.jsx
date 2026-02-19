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

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/user/register`, {
        username,
        password,
      });

      const token = response.data.token;
      localStorage.setItem("token", token);
      connectSocket(token);
      navigate("/dashboard");
    } catch (e) {
      setError(e.response?.data?.message || "Registration failed");
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
        <Stack spacing={2.5} component="form" onSubmit={handleRegister}>
          <Box>
            <Typography variant="h4" sx={{ mb: 0.5 }}>
              Create account
            </Typography>
            <Typography color="text.secondary">
              Get started with secure rooms and real-time video calls.
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
            {isLoading ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              "Create account"
            )}
          </Button>

          <Typography color="text.secondary" sx={{ textAlign: "center" }}>
            Already have an account?{" "}
            <Link component={RouterLink} to="/" underline="hover" fontWeight={700}>
              Login
            </Link>
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}

export default Register;
