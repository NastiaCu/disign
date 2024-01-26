import React, { FC, ReactElement, useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  FormControl,
  InputAdornment,
  IconButton,
  InputLabel,
  OutlinedInput,
  FormControlLabel,
  FormGroup,
  Checkbox,
  Grid,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Link } from "react-router-dom";

interface State {
  email: string;
  password: string;
  showPassword: boolean;
}

const Login: FC = (): ReactElement => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  const [formState, setFormState] = useState<State>({
    email: "",
    password: "",
    showPassword: false,
  });

  const handleChange = (prop: keyof State, value: string | boolean): void => {
    setFormState({ ...formState, [prop]: value });
  };

  const handleClickShowPassword = (): void => {
    setFormState({ ...formState, showPassword: !formState.showPassword });
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ): void => {
    event.preventDefault();
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/v1/user/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formState.email,
          password: formState.password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const authToken = data.token;
        
        localStorage.setItem('token', authToken);
        console.log("Success!!");
        setIsLoggedIn(true);

      } else {
        // Handle login failure, show an error message, etc.
      }
    } catch (error) {
      // Handle network or server errors.
    }
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      window.location.href = '/login'; 
    } catch (error) {
      // Handle errors if necessary
    }
  };

  return (
    <div>
      {isLoggedIn ? (
        window.location.href = '/profile' 
      ) : (
        <Container fixed maxWidth="sm" sx={{ padding: "20px" }}>
          <Box
            sx={{
              mt: "10px",
              mx: "auto",
              p: "40px",
              width: 500,
              height: 600,
              justifyContent: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              bgcolor: "primary.light",
              borderRadius: "2rem",
              boxShadow: 1,
              color: "primary.contrastText",
            }}
          >
            <Box sx={{ mx: "auto", my: "0.5rem", alignItems: "left", justifyContent: "left" }}>
              <h1>Log In</h1>
            </Box>

            <form onSubmit={handleFormSubmit}>
              <Grid container spacing={2} justifyContent="center" >
                <Grid item xs={12}>
                  <TextField
                    variant="filled"
                    label="Email"
                    type="text"
                    autoComplete="Email"
                    autoFocus
                    fullWidth
                    sx={{
                      bgcolor: "primary.contrastText",
                      borderRadius: "0.3rem",
                    }}
                    value={formState.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    InputLabelProps={{
                      style: { color: "primary.contrastText" },
                    }}
                    InputProps={{
                      style: { color: "primary.contrastText" },
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    variant="filled"
                    label="Password"
                    type={formState.showPassword ? "text" : "password"}
                    fullWidth
                    sx={{
                      bgcolor: "primary.contrastText",
                      borderRadius: "0.3rem",
                      '& input': {
                        paddingBottom: '14px', 
                        verticalAlign: formState.password ? 'baseline' : 'middle',
                      },
                    }}
                    value={formState.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    InputLabelProps={{
                      style: { color: "primary.contrastText" },
                    }}
                    InputProps={{
                      style: { color: "primary.contrastText" },
                      endAdornment: (
                        <InputAdornment position="end" sx={{ marginTop: "0.5rem" }}>
                          <IconButton
                            style={{ color: "primary.main" }}
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {formState.showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          color="primary"
                          checked={formState.showPassword}
                          onChange={() => handleChange("showPassword", !formState.showPassword)}
                        />
                      }
                      label="Show Password"
                    />
                  </FormGroup>
                </Grid>

                <Grid item xs={12}>
                  {localStorage.getItem('token') ? (
                    <Button onClick={handleLogout} variant="contained" fullWidth>
                      Logout
                    </Button>
                  ) : (
                    <Button type="submit" variant="contained" fullWidth>
                      <Link to="/home" style={{ textDecoration: 'none', color: 'inherit' }}>
                        Log In
                      </Link>
                    </Button>
                  )}
                </Grid>
              </Grid>
            </form>
          </Box>
        </Container>
      )}
    </div>
  );
};

export default Login;
