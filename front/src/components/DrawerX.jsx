import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SchoolIcon from "@mui/icons-material/SchoolRounded";
import EditCalendarIcon from "@mui/icons-material/EditCalendarRounded";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLongRounded";
import BarChartIcon from "@mui/icons-material/BarChart";
import AccountCircle from "@mui/icons-material/AccountCircle";
import DarkModeOutlined from "@mui/icons-material/DarkModeOutlined";
import LightModeRounded from "@mui/icons-material/LightModeRounded";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, MenuItem } from "@mui/material";
import logo from "../img/cufa-logo.png";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.enteringScreen,
        }),
      },
    },
  ],
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  variants: [
    {
      props: ({ open }) => open,
      style: {
        ...openedMixin(theme),
        "& .MuiDrawer-paper": openedMixin(theme),
      },
    },
    {
      props: ({ open }) => !open,
      style: {
        ...closedMixin(theme),
        "& .MuiDrawer-paper": closedMixin(theme),
      },
    },
  ],
}));

export default function DrawerX({
  showAlert,
  changeColorMode,
  colorMode,
  openDrawer,
  setOpenDrawer,
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleUserMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useAuth();

  // logout
  const handleLogout = async () => {
    logout();
    navigate("/login"); // redirigir a login
  };

  const theme = useTheme();

  // drawer
  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };
  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={openDrawer}>
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={handleDrawerOpen}
            edge="start"
            sx={[
              {
                marginRight: 5,
              },
              openDrawer && { display: "none" },
            ]}
          >
            <MenuIcon />
          </IconButton>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
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
              <img
                src={logo}
                style={{ width: 40, marginRight: 5 }}
                alt="logo"
              />
              <Typography
                variant="h5"
                sx={{ fontStyle: "italic", fontWeight: "bold" }}
              >
                CUFA
              </Typography>
            </Box>
            <Box>
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
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "bottom",
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
                <MenuItem
                  onClick={() => {
                    navigate("/profile");
                    handleClose();
                  }}
                >
                  Perfil
                </MenuItem>
                <MenuItem onClick={handleLogout}>Cerrar sesión</MenuItem>
              </Menu>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer variant="permanent" open={openDrawer}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />

        <List>
          <ListItem key="courses" disablePadding>
            <ListItemButton onClick={() => navigate("/courses")}>
              <ListItemIcon>
                {
                  <SchoolIcon
                    sx={{
                      color:
                        location.pathname === "/courses" &&
                        theme.palette.primary.dark,
                    }}
                  />
                }
              </ListItemIcon>
              <ListItemText primary="Materias" />
            </ListItemButton>
          </ListItem>

          <ListItem key="planner" disablePadding>
            <ListItemButton onClick={() => navigate("/planner")}>
              <ListItemIcon>
                {
                  <EditCalendarIcon
                    sx={{
                      color:
                        location.pathname === "/planner" &&
                        theme.palette.primary.dark,
                    }}
                  />
                }
              </ListItemIcon>
              <ListItemText primary="Planificador" />
            </ListItemButton>
          </ListItem>

          <ListItem key="history" disablePadding>
            <ListItemButton onClick={() => navigate("/history")}>
              <ListItemIcon>
                {
                  <ReceiptLongIcon
                    sx={{
                      color:
                        location.pathname === "/history" &&
                        theme.palette.primary.dark,
                    }}
                  />
                }
              </ListItemIcon>
              <ListItemText primary="Historial" />
            </ListItemButton>
          </ListItem>

          <ListItem key="statistics" disablePadding>
            <ListItemButton onClick={() => navigate("/statistics")}>
              <ListItemIcon>
                {
                  <BarChartIcon
                    sx={{
                      color:
                        location.pathname === "/statistics" &&
                        theme.palette.primary.dark,
                    }}
                  />
                }
              </ListItemIcon>
              <ListItemText primary="Estadisticas" />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
    </Box>
  );
}
