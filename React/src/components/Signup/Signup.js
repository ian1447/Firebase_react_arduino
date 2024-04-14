import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth'; 
import { Container, Typography, TextField, Button, Box, Snackbar } from '@mui/material';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth,email, password);
      setOpenSnackbar(true);
      setTimeout(() => {
        setOpenSnackbar(false);
        navigate('/login');
      }, 2000); // Snackbar stays open for 2 seconds before navigating to login
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ textAlign: 'center', marginTop: '50px' }}>
      <Typography variant="h4" gutterBottom>
        Create Account
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
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
        />
        <Button variant="contained" onClick={handleSignup}>
          Create Account
        </Button>
        <Typography variant="body1">
        Already had an account, <Link to="/login">Login instead.</Link>
      </Typography>
      </Box>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        message="Account created successfully"
      />
    </Container>
  );
};

export default Signup;
