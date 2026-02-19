import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0b6e78",
      dark: "#07535b",
      light: "#4daeb7",
    },
    secondary: {
      main: "#e1783a",
      dark: "#bd5e26",
      light: "#f0ad82",
    },
    background: {
      default: "#f4f8fb",
      paper: "#ffffff",
    },
    text: {
      primary: "#1f2937",
      secondary: "#5b6473",
    },
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: '"Manrope", "Segoe UI", sans-serif',
    h3: {
      fontWeight: 800,
      letterSpacing: "-0.02em",
    },
    h4: {
      fontWeight: 700,
      letterSpacing: "-0.01em",
    },
    h5: {
      fontWeight: 700,
    },
    button: {
      textTransform: "none",
      fontWeight: 700,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          paddingTop: 10,
          paddingBottom: 10,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0 14px 42px rgba(15, 23, 42, 0.09)",
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        fullWidth: true,
      },
    },
  },
});

export default theme;
