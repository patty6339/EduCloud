import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
} from '@mui/material';
import {
  People as PeopleIcon,
  School as SchoolIcon,
  VideoCall as VideoCallIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';

const AdminDashboard = () => {
  const stats = [
    { label: 'Total Users', value: '1,234', icon: <PeopleIcon /> },
    { label: 'Active Courses', value: '45', icon: <SchoolIcon /> },
    { label: 'Live Sessions', value: '12', icon: <VideoCallIcon /> },
    { label: 'Course Completions', value: '789', icon: <AssessmentIcon /> },
  ];

  const recentActivities = [
    { text: 'New course "Advanced React" created', time: '2 hours ago' },
    { text: 'User report generated for Q4', time: '5 hours ago' },
    { text: 'System maintenance completed', time: '1 day ago' },
    { text: 'New teacher account approved', time: '2 days ago' },
  ];

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  {stat.icon}
                  <Typography variant="h6" sx={{ ml: 1 }}>
                    {stat.label}
                  </Typography>
                </Box>
                <Typography variant="h4">{stat.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Activities */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Recent Activities
            </Typography>
            <List>
              {recentActivities.map((activity, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={activity.text}
                    secondary={activity.time}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  startIcon={<SchoolIcon />}
                >
                  Add Course
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  startIcon={<PeopleIcon />}
                >
                  Manage Users
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  color="info"
                  fullWidth
                  startIcon={<VideoCallIcon />}
                >
                  Schedule Live Class
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="contained"
                  color="success"
                  fullWidth
                  startIcon={<AssessmentIcon />}
                >
                  Generate Reports
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
