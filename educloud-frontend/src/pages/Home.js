import React from 'react';
import { Container, Typography, Grid, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Navbar from './../components/shared/Navbar';
import Footer from './../components/shared/Footer';
import heroImage from '../assets/images/hero.svg';

const Home = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <Container maxWidth="lg">
        <Box sx={{ my: 8 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom>
                Welcome to EduCloud
              </Typography>
              <Typography variant="h5" color="textSecondary" paragraph>
                Your gateway to interactive online learning. Join our platform to access high-quality courses,
                live classes, and connect with expert instructors.
              </Typography>
              <Box sx={{ mt: 4 }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  onClick={() => navigate('/signup')}
                  sx={{ mr: 2 }}
                >
                  Get Started
                </Button>
                <Button
                  variant="outlined"
                  color="primary"
                  size="large"
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                component="img"
                src={heroImage}
                alt="EduCloud Learning Platform"
                sx={{
                  width: '100%',
                  maxWidth: '500px',
                  height: 'auto',
                  display: 'block',
                  margin: '0 auto',
                }}
              />
            </Grid>
          </Grid>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default Home;
