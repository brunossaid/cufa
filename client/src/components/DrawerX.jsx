import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import SchoolIcon from "@mui/icons-material/SchoolRounded";
import EditCalendarIcon from "@mui/icons-material/EditCalendarRounded";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLongRounded";
import BarChartIcon from "@mui/icons-material/BarChart";
import { AppBar, IconButton, Menu, MenuItem } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";
import LightModeRounded from "@mui/icons-material/LightModeRounded";
import { useNavigate } from "react-router-dom";
import react_img from "../assets/react.svg";
import { logoutRequest } from "../api/auth";
import { useAuth } from "../context/AuthContext";

const drawerWidth = 240;

export default function DrawerX({ showAlert, changeColorMode, colorMode }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleUserMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();

  const { user, logout } = useAuth();

  // logout
  const handleLogout = async () => {
    logout();
    navigate("/login"); // redirigir a login
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box
            onClick={() => navigate("/")}
            sx={{
              display: "flex",
              alignItems: "center",
              ":hover": { cursor: "pointer" },
              marginRight: 2,
            }}
          >
            <img src={react_img} style={{ width: 40, marginRight: 4 }} />
            <Typography
              variant="h5"
              sx={{ fontStyle: "italic", fontWeight: "bold" }}
            >
              CUFA
            </Typography>
          </Box>
          <div>
            <IconButton
              onClick={changeColorMode}
              color="inherit"
              sx={{ marginRight: 1 }}
            >
              {colorMode === "dark" ? (
                <DarkModeOutlined />
              ) : (
                <LightModeRounded />
              )}
            </IconButton>
            <IconButton onClick={handleUserMenu} color="inherit">
              <AccountCircle />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar />
        <Divider />
        <List>
          <ListItem key="courses" disablePadding>
            <ListItemButton onClick={() => navigate("/courses")}>
              <ListItemIcon>{<SchoolIcon />}</ListItemIcon>
              <ListItemText primary="Materias" />
            </ListItemButton>
          </ListItem>

          <ListItem key="planner" disablePadding>
            <ListItemButton onClick={() => navigate("/planner")}>
              <ListItemIcon>{<EditCalendarIcon />}</ListItemIcon>
              <ListItemText primary="Planificador" />
            </ListItemButton>
          </ListItem>

          <ListItem key="history" disablePadding>
            <ListItemButton onClick={() => navigate("/history")}>
              <ListItemIcon>{<ReceiptLongIcon />}</ListItemIcon>
              <ListItemText primary="Historial" />
            </ListItemButton>
          </ListItem>

          <ListItem key="statistics" disablePadding>
            <ListItemButton onClick={() => navigate("/statistics")}>
              <ListItemIcon>{<BarChartIcon />}</ListItemIcon>
              <ListItemText primary="Estadisticas" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
}
