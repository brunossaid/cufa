import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import DrawerX from "./components/DrawerX";
import AlertX from "./components/AlertX";
import React from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { Box } from "@mui/material";
import { AuthProvider, useAuth } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import CoursesPage from "./pages/CoursesPage";
import PlannerPage from "./pages/PlannerPage";
import HistoryPage from "./pages/HistoryPage";
import StatisticsPage from "./pages/StatisticsPage";
import { useState } from "react";
import CoursePage from "./pages/CoursePage";

/*
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#0fc5f7",
    },
  },
});
*/

function AppContent() {
  const { isAuthenticated, user } = useAuth();

  // alerta
  const [snackPack, setSnackPack] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [messageInfo, setMessageInfo] = React.useState(undefined);

  const showAlert = (message, severity, icon) => {
    setSnackPack((prev) => [
      ...prev,
      { message, severity, icon, key: new Date().getTime() },
    ]);
  };

  React.useEffect(() => {
    if (snackPack.length && !messageInfo) {
      setMessageInfo({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setOpen(true);
    } else if (snackPack.length && messageInfo && open) {
      setOpen(false);
    }
  }, [snackPack, messageInfo, open]);

  // temas
  const [colorMode, setColorMode] = useState(
    localStorage.getItem("theme") === "light" ? "light" : "dark"
  );
  const changeColorMode = () => {
    if (colorMode === "light") {
      setColorMode("dark");
      localStorage.setItem("theme", "dark");
    } else if (colorMode === "dark") {
      setColorMode("light");
      localStorage.setItem("theme", "light");
    }
  };
  const theme = createTheme({
    palette: {
      mode: colorMode,
      primary: { main: colorMode === "light" ? "#171717" : "#0fc5f7" },
      background: {
        default: colorMode === "light" ? "#FFFFFF" : "#000000",
        paper: colorMode === "dark" ? "#000000" : "#FFFFFF",
      },
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AlertX
        {...{
          messageInfo,
          setMessageInfo,
          snackPack,
          setSnackPack,
          open,
          setOpen,
        }}
      />
      {isAuthenticated === true ? (
        // si el usuario esta autenticado, se muestran las rutas protegidas
        <>
          <DrawerX {...{ showAlert, changeColorMode, colorMode }} />
          <Box
            sx={{
              marginLeft: "300px",
              marginRight: "60px",
              marginTop: "100px",
            }}
          >
            <Routes>
              <Route path="/home" element={<HomePage />} />
              <Route
                path="/courses"
                element={<CoursesPage showAlert={showAlert} />}
              />
              <Route
                path="/courses/:code"
                element={<CoursePage showAlert={showAlert} />}
              />
              <Route
                path="/planner"
                element={<PlannerPage showAlert={showAlert} />}
              />
              <Route path="/history" element={<HistoryPage />} />
              <Route path="/statistics" element={<StatisticsPage />} />
              <Route path="/profile" element={<h1>User Profile</h1>} />
              <Route path="*" element={<Navigate to="/home" />} />
            </Routes>
          </Box>
        </>
      ) : isAuthenticated === false ? (
        // si el usuario NO esta autenticado, se muestran las rutas publicas (login y register)
        <Routes>
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/" /> : <LoginPage />}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to="/" /> : <RegisterPage />}
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      ) : null}
    </ThemeProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
