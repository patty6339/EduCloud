import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  Grid,
  Paper,
  IconButton,
  Typography,
  Badge,
  Tooltip,
} from '@mui/material';
import {
  Mic as MicIcon,
  MicOff as MicOffIcon,
  Videocam as VideocamIcon,
  VideocamOff as VideocamOffIcon,
  ScreenShare as ScreenShareIcon,
  StopScreenShare as StopScreenShareIcon,
  PresentToAll as PresentToAllIcon,
} from '@mui/icons-material';
import webRTCService from '../../services/webrtc';

const VideoConference = ({ classId, isTeacher }) => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [participants, setParticipants] = useState(new Map());
  const localVideoRef = useRef();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const initializeStream = async () => {
      try {
        const stream = await webRTCService.initializeStream();
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error initializing stream:', error);
      }
    };

    webRTCService.onTrack = (participantId, stream) => {
      setParticipants((prev) => new Map(prev.set(participantId, stream)));
    };

    webRTCService.onParticipantLeft = (participantId) => {
      setParticipants((prev) => {
        const updated = new Map(prev);
        updated.delete(participantId);
        return updated;
      });
    };

    initializeStream();

    return () => {
      webRTCService.cleanup();
    };
  }, []);

  const handleToggleAudio = async () => {
    await webRTCService.toggleAudio(!isAudioEnabled);
    setIsAudioEnabled(!isAudioEnabled);
  };

  const handleToggleVideo = async () => {
    await webRTCService.toggleVideo(!isVideoEnabled);
    setIsVideoEnabled(!isVideoEnabled);
  };

  const handleToggleScreenShare = async () => {
    try {
      if (isScreenSharing) {
        await webRTCService.switchToCamera();
      } else {
        await webRTCService.switchToScreenShare();
      }
      setIsScreenSharing(!isScreenSharing);
    } catch (error) {
      console.error('Error toggling screen share:', error);
    }
  };

  const renderParticipantVideo = (stream, participantId) => (
    <Grid item xs={12} sm={6} md={4} key={participantId}>
      <Paper elevation={3} sx={{ p: 1, bgcolor: 'background.paper' }}>
        <Box sx={{ position: 'relative', width: '100%', paddingTop: '56.25%' }}>
          <video
            autoPlay
            playsInline
            ref={(video) => {
              if (video) video.srcObject = stream;
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: 1,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              bottom: 8,
              left: 8,
              backgroundColor: 'rgba(0, 0, 0, 0.6)',
              color: 'white',
              padding: '4px 8px',
              borderRadius: 1,
            }}
          >
            <Typography variant="caption">
              {participantId === user.id ? 'You' : 'Participant'}
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Grid>
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={2}>
        {/* Local Video */}
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ p: 1, bgcolor: 'background.paper' }}>
            <Box sx={{ position: 'relative', width: '100%', paddingTop: '56.25%' }}>
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  borderRadius: 1,
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 8,
                  left: 8,
                  backgroundColor: 'rgba(0, 0, 0, 0.6)',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: 1,
                }}
              >
                <Typography variant="caption">You</Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Participant Videos */}
        {Array.from(participants).map(([participantId, stream]) =>
          renderParticipantVideo(stream, participantId)
        )}
      </Grid>

      {/* Controls */}
      <Paper
        elevation={3}
        sx={{
          position: 'fixed',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          p: 2,
          borderRadius: 8,
          bgcolor: 'background.paper',
          display: 'flex',
          gap: 2,
          zIndex: 1000,
        }}
      >
        <Tooltip title={isAudioEnabled ? 'Mute' : 'Unmute'}>
          <IconButton
            onClick={handleToggleAudio}
            color={isAudioEnabled ? 'primary' : 'error'}
          >
            {isAudioEnabled ? <MicIcon /> : <MicOffIcon />}
          </IconButton>
        </Tooltip>

        <Tooltip title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}>
          <IconButton
            onClick={handleToggleVideo}
            color={isVideoEnabled ? 'primary' : 'error'}
          >
            {isVideoEnabled ? <VideocamIcon /> : <VideocamOffIcon />}
          </IconButton>
        </Tooltip>

        {isTeacher && (
          <Tooltip title={isScreenSharing ? 'Stop sharing' : 'Share screen'}>
            <IconButton
              onClick={handleToggleScreenShare}
              color={isScreenSharing ? 'error' : 'primary'}
            >
              {isScreenSharing ? <StopScreenShareIcon /> : <ScreenShareIcon />}
            </IconButton>
          </Tooltip>
        )}

        {isTeacher && (
          <Tooltip title="Present">
            <IconButton color="primary">
              <PresentToAllIcon />
            </IconButton>
          </Tooltip>
        )}
      </Paper>
    </Box>
  );
};

export default VideoConference;
