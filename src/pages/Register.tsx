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

interface State {
  email: string;
  password: string;
  showPassword: boolean;
  nickname: string;
}

const Register: FC = (): ReactElement => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  const [formState, setFormState] = useState<State>({
    email: "",
    password: "",
    showPassword: false,
    nickname: "",
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
      const response = await fetch('http://localhost:3001/api/v1/user/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formState.email,
          password: formState.password,
          nickname: formState.nickname,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const authToken = data.token;
        
        localStorage.setItem('token', authToken);
        console.log("Registration successful!");
        setIsLoggedIn(true);

      } else {
        // Handle registration failure, show an error message, etc.
      }
    } catch (error) {
      // Handle network or server errors.
    }
  };
  
    const checkUserAccount = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/v1/user/signup', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`, 
          },
        });

        if (response.ok) {
          // User has an account, redirect to login page
          
        } else {
            const response = await fetch('http://localhost:3001/api/v1/user/signup', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  email: formState.email,
                  password: formState.password,
                  nickname: formState.nickname,
                }),
              });
        
              if (response.ok) {
                const data = await response.json();
                const authToken = data.token;
                
                localStorage.setItem('token', authToken);
                console.log("Registration successful!");
                setIsLoggedIn(true);
              }
            }
        } catch (error) {
          // Handle network or server errors.
        }
      };

  return (
        <Container fixed maxWidth="sm" sx ={{ padding: "20px"}}>
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
              <h1>Register</h1>
            </Box>

            <form onSubmit={handleFormSubmit}>
              <Grid container spacing={2} justifyContent="center" >
                
                <Grid item xs={12}>
                  <TextField
                    variant="outlined"
                    label="Nickname"
                    type="text"
                    autoComplete="Nickname"
                    fullWidth
                    sx={{
                        bgcolor: "primary.contrastText",
                        borderRadius: "0.3rem",
                    }}
                    value={formState.nickname}
                    onChange={(e) => handleChange("nickname", e.target.value)}
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
                    variant="outlined"
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
                  <FormControl 
                    variant="outlined" 
                    fullWidth 
                    sx={{
                      bgcolor: "primary.contrastText",
                      borderRadius: "0.3rem",
                    }}
                  >
                    <InputLabel htmlFor="outlined-adornment-password" style={{ color: "primary.contrastText" }}>
                      Password
                    </InputLabel>
                    <OutlinedInput
                      label="Password"
                      id="outlined-adornment-password"
                      type={formState.showPassword ? "text" : "password"}
                      value={formState.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      endAdornment={
                        <InputAdornment position="end">
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
                      }
                    />
                  </FormControl>
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

                <Grid item xs={12} >            
                    <Button type="submit" variant="contained" fullWidth>
                      Register
                    </Button>
                </Grid>
              </Grid>
            </form>
          </Box>
        </Container>
      )}

export default Register;
