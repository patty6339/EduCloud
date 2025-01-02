import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import logo from '../../assets/images/logo.svg';
import defaultAvatar from '../../assets/images/default-avatar.svg';
import { logout } from '../../store/slices/authSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <Box
            component="img"
            src={logo}
            alt="EduCloud Logo"
            sx={{ height: 40, mr: 1 }}
          />
        </Link>
        <Box sx={{ flexGrow: 1 }} />
        {isAuthenticated ? (
          <>
            <Button color="inherit" onClick={() => navigate('/courses')}>
              Courses
            </Button>
            <Button color="inherit" onClick={() => navigate('/live-classes')}>
              Live Classes
            </Button>
            <Box sx={{ ml: 2, display: 'flex', alignItems: 'center' }}>
              <Avatar
                src={user?.avatar || defaultAvatar}
                alt={user?.name}
                sx={{ width: 32, height: 32, mr: 1 }}
              />
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Button color="inherit" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/signup')}
              sx={{ ml: 1 }}
            >
              Sign Up
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
