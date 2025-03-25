import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import client from '../apolloClient';

function Header() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout =async  () => {
    localStorage.removeItem('authToken'); 
    localStorage.removeItem('user'); 
    await client.clearStore(); 
    navigate('/login'); 
  };

  const handleGoToDashboard = () => {
    navigate('/'); 
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Welcome, {user?.name}!
        </Typography>

        <Button color="inherit" onClick={handleGoToDashboard}>
          Dashboard
        </Button>

        <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Header;