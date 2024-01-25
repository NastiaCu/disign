import React, { FC, ReactElement, useEffect, useState } from "react";
import {
  Container,
  Box,
  TextField,
  Button,
  InputAdornment,
  IconButton,
  FormControlLabel,
  FormGroup,
  Checkbox,
  Grid,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import OTPPopup from "./OTPPopup"; 

interface State {
  email: string;
  password: string;
  showPassword: boolean;
  name: string;
}

const Register: FC = (): ReactElement => {
  const [isRegistered, setIsRegistered] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [formState, setFormState] = useState<State>({
    email: "",
    password: "",
    showPassword: false,
    name: "",
  });

  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const [otpPopupOpen, setOTPPopupOpen] = useState(false);
  const [otpVerified, setOTPVerified] = useState(false);
  const [otp, setOtp] = useState(""); 

  const validate = (value: string) => {
    const errors: string[] = [];
  
    if (value.length < 8) {
      errors.push('Password is too short (minimum 8 characters).');
    }
  
    const lowercaseRegex = /[a-z]/;
    const uppercaseRegex = /[A-Z]/;
    const numbersRegex = /\d/;
  
    if (!lowercaseRegex.test(value)) {
      errors.push('Password must contain at least one lowercase letter.');
    }
  
    if (!uppercaseRegex.test(value)) {
      errors.push('Password must contain at least one uppercase letter.');
    }
  
    if (!numbersRegex.test(value)) {
      errors.push('Password must contain at least one number.');
    }
  
    setErrorMessages(errors);
  };
  
  useEffect(() => {
    console.log('isRegistered changed:', isRegistered);

    if (isRegistered) {
      setOTPPopupOpen(true);
    }
  }, [isRegistered]);

  const handleChange = (prop: keyof State, value: string | boolean): void => {
    if (prop === "password") {
      validate(value as string);
    }

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

  const resetOtp = () => {
    setOtp("");
  };

  const handleVerifyOTP = async (otp: string) => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/user/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          otp,
        }),
      });

      if (response.ok) {
        console.log("OTP verified successfully!");
        setOTPVerified(true);

        setOTPPopupOpen(false);

        setIsRegistered(true);

        window.location.href = '/login';

        resetOtp();
      } else {
        console.error("OTP verification failed");
      }
    } catch (error) {
      console.error("Error during OTP verification", error);
    }
  };

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (errorMessages.length === 0) {
      try {
        const response = await fetch('http://localhost:3001/api/v1/user/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formState.email,
            password: formState.password,
            name: formState.name,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const authToken = data.token;

          localStorage.setItem('token', authToken);
          console.log("Registration successful!");
          setIsLoggedIn(true);
          setOTPPopupOpen(true);

        } else {
          // Handle registration failure, show an error message, etc.
        }
      } catch (error) {
        // Handle network or server errors.
      }
    }
  };

  return (
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
          <h1>Register</h1>
        </Box>

        <form onSubmit={handleFormSubmit}>
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12}>
              <TextField
                variant="filled"
                label="Nickname"
                type="text"
                autoComplete="Nickname"
                fullWidth
                sx={{
                  bgcolor: "primary.contrastText",
                  borderRadius: "0.3rem",
                  '& input': {
                    paddingBottom: '14px',
                  },
                }}
                value={formState.name}
                onChange={(e) => handleChange("name", e.target.value)}
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
                label="Email"
                type="text"
                autoComplete="Email"
                autoFocus
                fullWidth
                sx={{
                  bgcolor: "primary.contrastText",
                  borderRadius: "0.3rem",
                  '& input': {
                    paddingBottom: '14px',
                  },
                }}
                value={formState.email}
                onChange={(e) => handleChange("email", e.target.value)}
                InputLabelProps={{
                  style: { color: "primary.contrastText" },
                  shrink: formState.email ? true : undefined,
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
              {errorMessages.map((message, index) => (
                <div key={index} style={{ color: "red", marginTop: "0.5rem" }}>
                  {message}
                </div>
              ))}
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

        <OTPPopup
          open={otpPopupOpen}
          onClose={() => {
            setOTPPopupOpen(false);
            resetOtp(); 
          }}
          onVerifyOTP={handleVerifyOTP}
        />
      </Box>
    </Container>
  );
};

export default Register;