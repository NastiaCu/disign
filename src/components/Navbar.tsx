import React, { FC, ReactElement } from "react";
import {
  Box,
  Link,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { routes } from "../routes";
import { NavLink } from "react-router-dom";
import logo from "../assets/logo.png";

const Navbar: FC = (): ReactElement => {
  const [anchorElNav, setAnchorElNav] = React.useState(null);

  const handleOpenNavMenu = (event: any) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "auto",
        backgroundColor: "primary.light",
        borderBottomLeftRadius: '20px',
        borderBottomRightRadius: '20px',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters >
            <IconButton>
                <NavLink to="/" style={{ textDecoration: "none" }}>
                     <img src={logo} alt="logo" width="auto" height="30px" /> 
                </NavLink>
            </IconButton>
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" }, borderRadius: "2rem" }}>
            <IconButton
              size="large"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {routes.map((page) => (
                <Link
                  key={page.key}
                  component={NavLink}
                  to={page.path}
                  color="primary.main"
                  underline="none"
                  variant="button"
                  sx={{
                    borderRadius: '2rem',
                    "&:hover": {
                      backgroundColor: "#7C81AD", 
                      opacity: [0.9, 0.8, 0.7],
                    },
                  }}
                >
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Typography textAlign="center">{page.title}</Typography>
                  </MenuItem>
                </Link>
              ))}
            </Menu>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                alignItems: "center",
                marginLeft: "1rem",
              }}
            >
              {routes
                .filter((page) => page.key !== 'login-route' && page.key !== 'register-route')
                .map((page) => (
                  <Button
                    key={page.key}
                    sx={{
                      borderRadius: '2rem',
                      '&:hover': {
                        backgroundColor: '#7C81AD',
                        opacity: [0.9, 0.8, 0.7],
                      },
                    }}
                  >
                    <Link
                      component={NavLink}
                      to={page.path}
                      color="primary.contrastText"
                      underline="none"
                      variant="button"
                    >
                      {page.title}
                    </Link>
                  </Button>
                ))}
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </Box>
  );
};

export default Navbar;