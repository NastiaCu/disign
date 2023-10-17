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
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

interface State {
  email: string;
  password: string;
  showPassword: boolean;
}

const Login: FC = (): ReactElement => {
  const [formState, setFormState] = useState<State>({
    email: "",
    password: "",
    showPassword: false,
  });

  const handleChange = (
    prop: keyof State,
    value: string | boolean
  ): void => {
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

  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log(formState.email, formState.password);
  };

  return (
    <Container fixed maxWidth="xs">
        <Box
            sx={{
            mt: "10px",
            mx: "auto", 
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
            <Box sx={{ mb: 1, color: "primary.contrastText", display: "flex", flexWrap: "wrap" }}>
                <TextField
                variant="outlined"
                label="Email"
                type="text"
                autoComplete="Email"
                autoFocus
                margin="normal"
                sx={{
                    width: "400px",
                    bgcolor: "primary.contrastText",
                    borderRadius: "0.3rem",
                }}
                value={formState.email}
                onChange={(e) => handleChange("email", e.target.value)}
                style={{
                    color: "primary.contrastText",
                }}
                InputLabelProps={{
                    style: {
                    color: "primary.contrastText",
                    },
                }}
                InputProps={{
                    style: {
                    color: "primary.contrastText",
                    },
                }}
                />
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                <FormControl
                sx={{
                    width: "400px",
                    backgroundColor: "primary.contrastText",
                    borderRadius: "0.3rem",
                }}
                variant="outlined"
                >
                <InputLabel htmlFor="outlined-adornment-password" size="normal" style={{ color: "primaty.main" }}>
                    Password
                </InputLabel>
                <OutlinedInput
                    style={{ color: "primaty.contrastText" }}
                    label="Password"
                    id="outlined-adornment-password"
                    type={formState.showPassword ? "text" : "password"}
                    value={formState.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                        style={{
                            color: "primary.main",
                        }}
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                        >
                        {formState.showPassword ? <VisibilityOff style={{ color: "primaty.main" }}/> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                    }
                />
                </FormControl>
            </Box>

            <FormGroup>
                <FormControlLabel
                control={
                    <Checkbox
                    sx={{
                        position: "inherited",
                        color: "primary.main",
                        "&.Mui-checked": {
                        color: "primary.main",
                        },
                    }}
                    checked={formState.showPassword}
                    onChange={() => handleChange("showPassword", !formState.showPassword)}
                    />
                }
                label="Show Password"
                />
            </FormGroup>

            <Button type="submit" variant="contained" sx={{ my: "1rem", color: "primary.contrastText", textTransform: "none" }}>
                Log In
            </Button>

            <Button sx={{ my: "1rem", color: "primary.contrastText", textTransform: "none" }}>Forgot your password?</Button>
            </form>
        </Box>
    </Container>
  );
};

export default Login;
