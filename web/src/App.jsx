import { useState } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
import {
  Toolbar,
  AppBar,
  Menu,
  MenuItem,
  IconButton,
  Typography,
  Snackbar,
} from "@mui/material";

import HomeComponent from "./components/HomeComponent";
import AlertComponent from "./components/AlertComponent";
import AddAdvisory from "./components/AddAdvisory";
import ListAdvisories from "./components/ListAdvisories";

const App = () => {
  // Snackbar
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");

  const showSnackBar = (message) => {
    setMessage(message);
    setOpen(true);
  };

  const closeSnackBar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  return (
    <ThemeProvider theme={theme}>
      <AppBar>
        <Toolbar>
          <Typography variant="h6" color="inherit">
            INFO3139 - Case #1
          </Typography>
          <IconButton
            id="menubtn"
            onClick={handleClick}
            color="inherit"
            style={{ marginLeft: "auto", paddingRight: "1vh" }}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            id="simple-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem component={NavLink} to="/home" onClick={handleClose}>
              Home
            </MenuItem>
            <MenuItem component={NavLink} to="/reset" onClick={handleClose}>
              Reset Data
            </MenuItem>
            <MenuItem component={NavLink} to="/add" onClick={handleClose}>
              Add Advisory
            </MenuItem>
            <MenuItem
              component={NavLink}
              to="/advisories"
              onClick={handleClose}
            >
              List Advisories
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Routes>
        <Route
          path="/"
          element={<HomeComponent />}
        />
        <Route
          path="/home"
          element={<HomeComponent />}
        />
        <Route
          path="/reset"
          element={<AlertComponent showSnackBar={showSnackBar} />}
        />
        <Route
          path="/add"
          element={<AddAdvisory showSnackBar={showSnackBar} />}
        />
        <Route
          path="/advisories"
          element={<ListAdvisories showSnackBar={showSnackBar} />}
        />
      </Routes>
      <Snackbar
        open={open}
        message={message}
        autoHideDuration={6000}
        onClose={closeSnackBar}
      />
    </ThemeProvider>
  );
};
export default App;
