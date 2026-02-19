import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { Box, CssBaseline, GlobalStyles, ThemeProvider } from "@mui/material";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Room from "./pages/Room.jsx";
import ProtectedRoutes from "./components/ProtectedRoutes.jsx";
import { connectSocket } from "./socket";
import theme from "./theme";

function App() {
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      connectSocket(token);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          body: {
            background:
              "radial-gradient(circle at 8% 8%, #d8f0ff 0%, transparent 34%), radial-gradient(circle at 92% 14%, #ffe8d5 0%, transparent 40%), #f4f8fb",
          },
        }}
      />
      <Box minHeight="100vh">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoutes>
                <Dashboard />
              </ProtectedRoutes>
            }
          />
          <Route
            path="/room/:id"
            element={
              <ProtectedRoutes>
                <Room />
              </ProtectedRoutes>
            }
          />
        </Routes>
      </Box>
    </ThemeProvider>
  );
}

export default App;
