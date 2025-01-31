import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box
} from '@mui/material';
import { validatePhoneNumber } from '../utils';

const EditChat = ({ open, onClose, chat, onSave, chats }) => {
  const [name, setName] = useState(chat?.name || '');
  const [phoneNumber, setPhoneNumber] = useState(chat?.phoneNumber || '');
  const [error, setError] = useState('');

  const handleSave = () => {
    if (!name.trim() || !phoneNumber.trim()) {
      setError('All fields are required');
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      setError('Invalid phone number format');
      return;
    }

    const formattedPhone = phoneNumber.replace(/\D/g, '');
    const existingChat = chats.find(
      c => c.phoneNumber === formattedPhone && c.id !== chat?.id
    );

    if (existingChat) {
      setError('Chat with this number already exists');
      return;
    }

    onSave({
      id: chat?.id || Date.now().toString(),
      name: name.trim(),
      phoneNumber: formattedPhone,
      messages: chat?.messages || [],
      lastMessage: chat?.lastMessage || ''
    });

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{chat ? 'Edit Chat' : 'New Chat'}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setError('');
            }}
            margin="normal"
            error={!!error && !name.trim()}
          />
          <TextField
            fullWidth
            label="Phone Number"
            value={phoneNumber}
            onChange={(e) => {
              setPhoneNumber(e.target.value);
              setError('');
            }}
            margin="normal"
            error={!!error && !phoneNumber.trim()}
            helperText="Format: +1234567890"
          />
          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditChat;
