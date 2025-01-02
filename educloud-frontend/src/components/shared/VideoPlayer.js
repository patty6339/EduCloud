import React, { useState } from 'react';
import {
  Box,
  IconButton,
  Slider,
  Typography,
  Paper,
  useTheme,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff,
  Fullscreen,
} from '@mui/icons-material';

const VideoPlayer = ({ url }) => {
  const theme = useTheme();
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);

  const handlePlayPause = () => {
    setPlaying(!playing);
    // Add video play/pause logic here
  };

  const handleTimeUpdate = (event) => {
    setCurrentTime(event.target.currentTime);
  };

  const handleLoadedMetadata = (event) => {
    setDuration(event.target.duration);
  };

  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue);
    setMuted(newValue === 0);
    // Add volume change logic here
  };

  const handleMuteToggle = () => {
    setMuted(!muted);
    if (!muted) {
      setVolume(0);
    } else {
      setVolume(1);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <Paper elevation={3}>
      <Box sx={{ position: 'relative', width: '100%', bgcolor: 'black' }}>
        <video
          width="100%"
          height="auto"
          src={url}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
        />
        
        {/* Controls overlay */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            bgcolor: 'rgba(0, 0, 0, 0.7)',
            p: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <IconButton
              onClick={handlePlayPause}
              sx={{ color: 'white' }}
            >
              {playing ? <Pause /> : <PlayArrow />}
            </IconButton>
            
            <Box sx={{ flex: 1, mx: 2 }}>
              <Slider
                value={currentTime}
                max={duration}
                onChange={(e, newValue) => setCurrentTime(newValue)}
                sx={{
                  color: theme.palette.primary.main,
                  '& .MuiSlider-thumb': {
                    width: 12,
                    height: 12,
                  },
                }}
              />
            </Box>
            
            <Typography variant="body2" sx={{ color: 'white', minWidth: 65 }}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              onClick={handleMuteToggle}
              sx={{ color: 'white' }}
            >
              {muted ? <VolumeOff /> : <VolumeUp />}
            </IconButton>
            
            <Box sx={{ width: 100, mx: 2 }}>
              <Slider
                value={volume}
                max={1}
                step={0.1}
                onChange={handleVolumeChange}
                sx={{
                  color: theme.palette.primary.main,
                  '& .MuiSlider-thumb': {
                    width: 12,
                    height: 12,
                  },
                }}
              />
            </Box>
            
            <IconButton
              onClick={() => {/* Add fullscreen logic */}}
              sx={{ color: 'white', ml: 'auto' }}
            >
              <Fullscreen />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default VideoPlayer;
