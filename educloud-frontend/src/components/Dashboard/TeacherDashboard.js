import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Divider,
} from '@mui/material';
import {
  VideoCall as VideoCallIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Add as AddIcon,
  Message as MessageIcon,
} from '@mui/icons-material';
import coursePlaceholder from '../../assets/images/course-placeholder.svg';

const TeacherDashboard = () => {
  const courses = [
    {
      id: 1,
      title: 'Advanced React Development',
      students: 45,
      nextClass: 'Component Lifecycle',
      thumbnail: null,
    },
    {
      id: 2,
      title: 'JavaScript Fundamentals',
      students: 78,
      nextClass: 'ES6 Features',
      thumbnail: null,
    },
  ];

  const upcomingClasses = [
    {
      title: 'React Component Patterns',
      time: 'Today, 2:00 PM',
      attendees: 32,
    },
    {
      title: 'JavaScript Error Handling',
      time: 'Tomorrow, 3:00 PM',
      attendees: 45,
    },
  ];

  const recentMessages = [
    {
      student: 'Alice Johnson',
      message: 'Question about React Hooks',
      time: '10 minutes ago',
    },
    {
      student: 'Bob Smith',
      message: 'Assignment submission',
      time: '1 hour ago',
    },
  ];

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Teacher Dashboard</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
        >
          Create New Course
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Course Cards */}
        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom>
            Your Courses
          </Typography>
          <Grid container spacing={2}>
            {courses.map((course) => (
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
                      <PeopleIcon sx={{ mr: 1 }} color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {course.students} Students Enrolled
                      </Typography>
                    </Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Next Class: {course.nextClass}
                    </Typography>
                    <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<VideoCallIcon />}
                        fullWidth
                      >
                        Start Class
                      </Button>
                      <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<AssignmentIcon />}
                        fullWidth
                      >
                        Assignments
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Upcoming Classes */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Upcoming Classes
            </Typography>
            <List>
              {upcomingClasses.map((class_, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <VideoCallIcon color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary={class_.title}
                    secondary={`${class_.time} • ${class_.attendees} attendees`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>

          {/* Recent Messages */}
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Messages
            </Typography>
            <List>
              {recentMessages.map((message, index) => (
                <React.Fragment key={index}>
                  <ListItem alignItems="flex-start">
                    <ListItemIcon>
                      <MessageIcon color="action" />
                    </ListItemIcon>
                    <ListItemText
                      primary={message.student}
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                          >
                            {message.message}
                          </Typography>
                          {` — ${message.time}`}
                        </>
                      }
                    />
                  </ListItem>
                  {index < recentMessages.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
            <Button
              variant="text"
              color="primary"
              fullWidth
              sx={{ mt: 1 }}
            >
              View All Messages
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TeacherDashboard;
