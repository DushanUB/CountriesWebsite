import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  CssBaseline,
  Container
} from '@mui/material';
import {
  WbSunny as MorningIcon,
  Brightness4 as AfternoonIcon,
  Brightness3 as NightIcon
} from '@mui/icons-material';
import CountryList from "./components/CountryList";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import FlagScroller from "./components/FlagScroller";

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

const AppContent = () => {
  const [user, setUser] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    if (token && storedUsername) {
      setUser({ token, username: storedUsername });
    }

    // Update time every minute
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) {
      return { text: 'Good Morning', icon: <MorningIcon sx={{ mr: 1 }} /> };
    } else if (hour < 18) {
      return { text: 'Good Afternoon', icon: <AfternoonIcon sx={{ mr: 1 }} /> };
    } else {
      return { text: 'Good Evening', icon: <NightIcon sx={{ mr: 1 }} /> };
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUser(null);
    navigate("/login");
  };

  const { text: greeting, icon: timeIcon } = getGreeting();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar 
        position="fixed" 
        sx={{
          background: 'linear-gradient(180deg, #000000 0%, #1a1a1a 100%)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <Toolbar>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1, 
              cursor: 'pointer',
              fontFamily: "'Dancing Script', cursive",
              fontSize: '2.5rem',
              fontWeight: 700,
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #DAA520 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '3px 3px 6px rgba(0,0,0,0.3)',
              letterSpacing: '2px',
              transition: 'all 0.4s ease',
              '&:hover': {
                transform: 'scale(1.03)',
                background: 'linear-gradient(135deg, #FFE55C 0%, #FFB74D 50%, #E6B23F 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '3px'
              }
            }} 
            onClick={() => navigate("/")}
          >
            Country Explorer
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {user && (
              <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                {timeIcon}
                <Typography variant="body1" sx={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                  {greeting} {user.username}
                </Typography>
              </Box>
            )}
            {user ? (
              <Button 
                color="inherit" 
                onClick={handleLogout}
                sx={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.2)'
                  }
                }}
              >
                Logout
              </Button>
            ) : (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  color="inherit" 
                  onClick={() => navigate("/login")}
                  sx={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    px: 2,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                      borderColor: 'rgba(255, 255, 255, 0.2)'
                    },
                    '&:active': {
                      transform: 'translateY(0)',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.2)'
                    }
                  }}
                >
                  Login
                </Button>
                <Button 
                  variant="contained"
                  onClick={() => navigate("/register")}
                  sx={{
                    background: 'linear-gradient(135deg, #64B5F6 0%, #2196F3 50%, #1976D2 100%)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    px: 2,
                    transition: 'all 0.3s ease',
                    boxShadow: '0 2px 8px rgba(33, 150, 243, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #82C4F8 0%, #42A5F5 50%, #1E88E5 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(33, 150, 243, 0.4)',
                      borderColor: 'rgba(255, 255, 255, 0.2)'
                    },
                    '&:active': {
                      transform: 'translateY(0)',
                      boxShadow: '0 2px 6px rgba(33, 150, 243, 0.4)'
                    }
                  }}
                >
                  Register
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Toolbar /> {/* Spacer for fixed AppBar */}
      <Container 
        maxWidth={false} 
        sx={{ 
          mt: 4,
          px: { xs: 2, sm: 3 },
          pl: { xs: '190px', sm: '190px' }, // Increased left padding to account for FlagScroller
          mr: 0, // Remove right margin
          maxWidth: '100% !important' // Allow container to use full width
        }}
      >
        <Routes>
          <Route 
            path="/" 
            element={
              <ProtectedRoute>
                <CountryList />
              </ProtectedRoute>
            } 
          />
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </Container>
      <FlagScroller />
    </Box>
  );
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
};

export default App;