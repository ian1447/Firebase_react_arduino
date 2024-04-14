import React, { useState } from "react";
import { app, auth } from "../../config/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, useNavigate } from "react-router-dom";
import {
  AppBar,
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Toolbar
} from "@mui/material";

import EmergencyShareRoundedIcon from '@mui/icons-material/EmergencyShareRounded';

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div>
      <AppBar position="static">
				<Container maxWidth="xl">
					<Toolbar disableGutters>
						<EmergencyShareRoundedIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
						<Typography
							variant="h6"
							noWrap
							component="a"
							href="#app-bar-with-responsive-menu"
							sx={{
								mr: 2,
								display: { xs: "none", md: "flex" },
								fontFamily: "monospace",
								fontWeight: 700,
								letterSpacing: ".1rem",
								color: "inherit",
								textDecoration: "none",
							}}
						>
							 Responder Site
            </Typography>
            
						<EmergencyShareRoundedIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
						<Typography
							variant="subtitle1"
							noWrap
							component="a"
							href="#app-bar-with-responsive-menu"
							sx={{
								mr: 2,
								display: { xs: "flex", md: "none" },
								flexGrow: 1,
								fontFamily: "monospace",
								fontWeight: 700,
								letterSpacing: ".1rem",
								color: "inherit",
								textDecoration: "none",
							}}
						>
							 Responder Site
						</Typography>
					</Toolbar>
				</Container>
      </AppBar>

    <Container maxWidth="xs" sx={{ textAlign: "center", marginTop: "50px" }}>
      <Paper
        sx={{
          padding: 5,
          maxWidth: "100%",
          backgroundColor: "rgba(52, 52, 52, 0.1)",
        }}
        elevation={20}
      >
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Login
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <TextField
            label="Email"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => (e.keyCode === 13 ? handleLogin(e) : null)}
          />
          <Button variant="contained" onClick={handleLogin}>
            Login
          </Button>
        </Box>
      </Paper>
      </Container>
    </div>
  );
};

export default Login;
