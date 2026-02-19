import { Box } from "@mui/material";
import { Navigate } from "react-router-dom";
import Navbar from "./Navbar.jsx";

function ProtectedRoutes({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <Navbar />
      <Box component="main" sx={{ px: { xs: 2, md: 4 }, py: { xs: 3, md: 4 } }}>
        {children}
      </Box>
    </>
  );
}

export default ProtectedRoutes;
