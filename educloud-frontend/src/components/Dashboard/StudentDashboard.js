import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardMedia,
  LinearProgress,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  PlayCircleOutline as PlayIcon,
  Assignment as AssignmentIcon,
  Schedule as ScheduleIcon,
  EmojiEvents as TrophyIcon,
} from '@mui/icons-material';
import coursePlaceholder from '../../assets/images/course-placeholder.svg';

const StudentDashboard = () => {
  const enrolledCourses = [
    {
      id: 1,
      title: 'Introduction to React',
      progress: 75,
      nextLesson: 'React Hooks',
      thumbnail: null,
    },
    {
      id: 2,
      title: 'Advanced JavaScript',
      progress: 45,
      nextLesson: 'Promises and Async/Await',
      thumbnail: null,
    },
  ];

  const upcomingClasses = [
    {
      title: 'React Performance Optimization',
      instructor: 'John Doe',
      time: 'Today, 3:00 PM',
    },
    {
      title: 'JavaScript Best Practices',
      instructor: 'Jane Smith',
      time: 'Tomorrow, 2:00 PM',
    },
  ];

  const achievements = [
    { title: 'First Course Completed', date: '2024-12-15' },
    { title: 'Perfect Quiz Score', date: '2024-12-20' },
  ];

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Welcome Back, Student!
      </Typography>

      <Grid container spacing={3}>
        {/* Enrolled Courses */}
        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom>
            Your Courses
          </Typography>
          <Grid container spacing={2}>
            {enrolledCourses.map((course) => (
              <Grid item xs={12} sm={6} key={course.id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image={course.thumbnail || coursePlaceholder}
                    alt={course.title}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {course.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Box sx={{ width: '100%', mr: 1 }}>
                        <LinearProgress variant="determinate" value={course.progress} />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {course.progress}%
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Next: {course.nextLesson}
                    </Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<PlayIcon />}
                      fullWidth
                    >
                      Continue Learning
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Upcoming Classes */}
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Upcoming Live Classes
            </Typography>
            <List>
              {upcomingClasses.map((class_, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <ScheduleIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={class_.title}
                    secondary={`${class_.instructor} • ${class_.time}`}
                  />
                </ListItem>
              ))}
            </List>
            <Button variant="outlined" color="primary" fullWidth>
              View All Classes
            </Button>
          </Paper>

          {/* Achievements */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Achievements
            </Typography>
            <List>
              {achievements.map((achievement, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <TrophyIcon color="secondary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={achievement.title}
                    secondary={new Date(achievement.date).toLocaleDateString()}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentDashboard;
