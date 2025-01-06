import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import errorImage from '../../assets/images/error.svg';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        p: 3,
        textAlign: 'center',
      }}
    >
      <img
        src={errorImage}
        alt="Unauthorized"
        style={{ width: '120px', marginBottom: '24px' }}
      />
      <Typography variant="h4" gutterBottom color="error">
        Access Denied
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 450 }}>
        You don't have permission to access this page. Please contact your administrator
        if you believe this is a mistake.
      </Typography>
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/')}
        >
          Go to Home
        </Button>
      </Box>
    </Box>
  );
};

export default UnauthorizedPage;
