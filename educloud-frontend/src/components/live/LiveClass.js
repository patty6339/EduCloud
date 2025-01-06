import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
} from '@mui/material';
import {
  VideoCall as VideoCallIcon,
  People as PeopleIcon,
  Chat as ChatIcon,
} from '@mui/icons-material';
import VideoConference from './VideoConference';
import ChatBox from '../Chat/ChatBox';
import { useLiveClass } from '../../hooks/useWebSocket';
import { joinLiveClass, clearLiveClass } from '../../store/slices/liveClassSlice';
import LoadingSpinner from '../Shared/LoadingSpinner';
import liveClassImage from '../../assets/images/live-class.svg';

const LiveClass = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { startClass, endClass } = useLiveClass(id);
  
  const {
    activeClass,
    participants,
    status,
    loading,
    error,
  } = useSelector((state) => state.liveClass);
  
  const { user } = useSelector((state) => state.auth);
  const isTeacher = user?.role === 'teacher';

  useEffect(() => {
    if (id) {
      dispatch(joinLiveClass(id));
    }
    return () => {
      dispatch(clearLiveClass());
    };
  }, [dispatch, id]);

  if (loading) {
    return <LoadingSpinner message="Joining live class..." />;
  }

  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          p: 4,
        }}
      >
        <img
          src={liveClassImage}
          alt="Live class error"
          style={{ width: '200px', marginBottom: '24px' }}
        />
        <Typography variant="h5" color="error" gutterBottom>
          {error}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => dispatch(joinLiveClass(id))}
        >
          Try Again
        </Button>
      </Box>
    );
  }

  if (!activeClass) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '400px',
          p: 4,
        }}
      >
        <img
          src={liveClassImage}
          alt="No live class"
          style={{ width: '200px', marginBottom: '24px' }}
        />
        <Typography variant="h5" gutterBottom>
          Class Not Found
        </Typography>
        <Typography variant="body1" color="textSecondary" align="center">
          The live class you're looking for doesn't exist or has ended.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Main Content */}
        <Grid item xs={12} md={8}>
          <Paper elevation={2}>
            {/* Video Conference */}
            <Box sx={{ position: 'relative' }}>
              <VideoConference classId={id} isTeacher={isTeacher} />
              {isTeacher && (
                <Box
                  sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    zIndex: 1,
                  }}
                >
                  {status === 'inactive' ? (
                    <Button
                      variant="contained"
                      color="primary"
                      startIcon={<VideoCallIcon />}
                      onClick={startClass}
                    >
                      Start Class
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      color="error"
                      onClick={endClass}
                    >
                      End Class
                    </Button>
                  )}
                </Box>
              )}
            </Box>

            {/* Class Info */}
            <Box sx={{ p: 2 }}>
              <Typography variant="h5" gutterBottom>
                {activeClass.title}
              </Typography>
              <Typography variant="subtitle1" color="textSecondary" gutterBottom>
                {activeClass.instructor}
              </Typography>
              <Typography variant="body1">
                {activeClass.description}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Participants */}
          <Paper elevation={2} sx={{ mb: 3, p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <PeopleIcon sx={{ mr: 1 }} />
              <Typography variant="h6">
                Participants ({participants.length})
              </Typography>
            </Box>
            <List>
              {participants.map((participant) => (
                <ListItem key={participant.id}>
                  <ListItemAvatar>
                    <Avatar src={participant.avatar} alt={participant.name}>
                      {participant.name[0]}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={participant.name}
                    secondary={participant.role}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>

          {/* Chat */}
          <Paper elevation={2} sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <ChatIcon sx={{ mr: 1 }} />
              <Typography variant="h6">Class Chat</Typography>
            </Box>
            <ChatBox roomId={id} height={400} />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default LiveClass;
