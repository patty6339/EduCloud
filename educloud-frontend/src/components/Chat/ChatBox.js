import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  Box,
  TextField,
  IconButton,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  Badge,
} from '@mui/material';
import {
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  EmojiEmotions as EmojiIcon,
} from '@mui/icons-material';
import { useChatRoom } from '../../hooks/useWebSocket';
import EmojiPicker from 'emoji-picker-react';

const ChatBox = ({ roomId, height = 400 }) => {
  const [message, setMessage] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { messages } = useSelector((state) => state.chat);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const { sendMessage } = useChatRoom(roomId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim()) {
      sendMessage({
        content: message,
        type: 'text',
        sender: user,
        timestamp: new Date().toISOString(),
      });
      setMessage('');
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        alert('File size should not exceed 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = async (e) => {
        sendMessage({
          content: e.target.result,
          type: 'file',
          fileName: file.name,
          fileType: file.type,
          sender: user,
          timestamp: new Date().toISOString(),
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const onEmojiClick = (event, emojiObject) => {
    setMessage((prevMessage) => prevMessage + emojiObject.emoji);
    setShowEmoji(false);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderMessage = (msg) => {
    const isOwnMessage = msg.sender.id === user.id;

    return (
      <ListItem
        key={msg.id}
        sx={{
          flexDirection: isOwnMessage ? 'row-reverse' : 'row',
          alignItems: 'flex-start',
          py: 1,
        }}
      >
        <ListItemAvatar>
          <Avatar src={msg.sender.avatar} alt={msg.sender.name}>
            {msg.sender.name[0]}
          </Avatar>
        </ListItemAvatar>
        <Box
          sx={{
            maxWidth: '70%',
            backgroundColor: isOwnMessage ? 'primary.light' : 'grey.100',
            borderRadius: 2,
            p: 1,
            mx: 1,
          }}
        >
          <Typography variant="subtitle2" color="textSecondary">
            {msg.sender.name}
          </Typography>
          {msg.type === 'text' ? (
            <Typography variant="body1">{msg.content}</Typography>
          ) : (
            <Box>
              {msg.fileType.startsWith('image/') ? (
                <img
                  src={msg.content}
                  alt={msg.fileName}
                  style={{ maxWidth: '100%', borderRadius: 4 }}
                />
              ) : (
                <Box
                  component="a"
                  href={msg.content}
                  download={msg.fileName}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    color: 'inherit',
                    textDecoration: 'none',
                  }}
                >
                  <AttachFileIcon sx={{ mr: 1 }} />
                  <Typography variant="body2">{msg.fileName}</Typography>
                </Box>
              )}
            </Box>
          )}
          <Typography
            variant="caption"
            color="textSecondary"
            sx={{ display: 'block', textAlign: 'right', mt: 0.5 }}
          >
            {formatTime(msg.timestamp)}
          </Typography>
        </Box>
      </ListItem>
    );
  };

  return (
    <Paper
      elevation={3}
      sx={{
        height,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Messages List */}
      <List
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
          bgcolor: 'background.default',
        }}
      >
        {messages[roomId]?.map(renderMessage)}
        <div ref={messagesEndRef} />
      </List>

      <Divider />

      {/* Emoji Picker */}
      {showEmoji && (
        <Box sx={{ position: 'absolute', bottom: '100%', right: 0, zIndex: 1 }}>
          <EmojiPicker onEmojiClick={onEmojiClick} />
        </Box>
      )}

      {/* Message Input */}
      <Box
        component="form"
        onSubmit={handleSend}
        sx={{
          p: 2,
          backgroundColor: 'background.paper',
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <IconButton
          size="small"
          onClick={() => fileInputRef.current?.click()}
          color="primary"
        >
          <AttachFileIcon />
        </IconButton>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          style={{ display: 'none' }}
          accept="image/*,.pdf,.doc,.docx"
        />
        
        <IconButton
          size="small"
          onClick={() => setShowEmoji(!showEmoji)}
          color="primary"
        >
          <EmojiIcon />
        </IconButton>

        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          sx={{ flex: 1 }}
        />

        <IconButton
          type="submit"
          color="primary"
          disabled={!message.trim()}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default ChatBox;
