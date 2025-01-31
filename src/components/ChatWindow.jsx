import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Paper,
  InputAdornment
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import '../styles/whatsapp-background.css';

const ChatWindow = ({ chat, onSendMessage, onBackClick, isMobile }) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  if (!chat) {
    return (
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: 'background.default'
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Select a chat to start messaging
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default'
      }}
    >
      <Box
        sx={{
          p: 2,
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {isMobile && (
          <IconButton
            edge="start"
            color="inherit"
            onClick={onBackClick}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
        )}
        <Typography variant="h6">{chat.name}</Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }}
        className="chat-background"
      >
        {chat.messages.map((msg, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              justifyContent: msg.isSent ? 'flex-end' : 'flex-start'
            }}
          >
            <Paper
              sx={{
                p: 1,
                maxWidth: '70%',
                bgcolor: msg.isSent ? 'primary.light' : 'background.paper',
                borderRadius: 2
              }}
            >
              <Typography variant="body1">{msg.text}</Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', textAlign: 'right' }}
              >
                {msg.time}
              </Typography>
            </Paper>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          p: 2,
          bgcolor: 'background.paper',
          borderTop: 1,
          borderColor: 'divider'
        }}
      >
        <TextField
          fullWidth
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton type="submit" color="primary" disabled={!message.trim()}>
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      </Box>
    </Box>
  );
};

export default ChatWindow;
