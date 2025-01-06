import React from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import coursePlaceholder from '../../assets/images/course-placeholder.svg';
import emptyState from '../../assets/images/empty-state.svg';

const CourseList = ({ courses = [] }) => {
  const navigate = useNavigate();

  if (!courses.length) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          py: 8,
        }}
      >
        <img src={emptyState} alt="No courses" style={{ width: 200, marginBottom: 16 }} />
        <Typography variant="h6" color="textSecondary">
          No courses available
        </Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {courses.map((course) => (
        <Grid item xs={12} sm={6} md={4} key={course._id}>
          <Card
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
              '&:hover': {
                transform: 'translateY(-4px)',
                transition: 'transform 0.2s ease-in-out',
              },
            }}
            onClick={() => navigate(`/courses/${course._id}`)}
          >
            <CardMedia
              component="img"
              height="140"
              image={course.thumbnail || coursePlaceholder}
              alt={course.title}
            />
            <CardContent>
              <Typography gutterBottom variant="h6" component="h2">
                {course.title}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                {course.description}
              </Typography>
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="body2" color="primary">
                  {course.instructor}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {course.duration}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default CourseList;
