import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import { 
  Container, 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Box,
  Link
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';

const LoginPage = ({ setUser }) => {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(credentials);
      localStorage.setItem("token", response.token);
      localStorage.setItem("username", credentials.username);
      setUser({ token: response.token, username: credentials.username });
      navigate("/");
    } catch (error) {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            mt: 3,
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}
        >
          {error && (
            <Typography color="error" variant="body2" align="center">
              {error}
            </Typography>
          )}
          <TextField
            required
            fullWidth
            label="Username"
            variant="outlined"
            onChange={(e) => setCredentials({...credentials, username: e.target.value})}
          />
          <TextField
            required
            fullWidth
            label="Password"
            type="password"
            variant="outlined"
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
          />
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleSubmit}
            sx={{ mt: 2 }}
          >
            Sign In
          </Button>
          <Box sx={{ mt: 2, textAlign: 'center' }}>
            <Link
              component="button"
              variant="body2"
              onClick={() => navigate("/register")}
            >
              Don't have an account? Sign Up
            </Link>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;