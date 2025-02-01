import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
  Box,
  CircularProgress
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Settings = ({ open, onClose }) => {
  const { credentials, updateCredentials } = useAuth();
  const [instanceId, setInstanceId] = useState(credentials?.instanceId || '');
  const [apiKey, setApiKey] = useState(credentials?.apiKey || '');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = () => {
    if (!instanceId.trim() || !apiKey.trim()) {
      return;
    }

    setLoading(true);
    updateCredentials(instanceId.trim(), apiKey.trim());
    setSuccess(true);
    
    setTimeout(() => {
      setLoading(false);
      onClose();
    }, 1000);
  };

  const handleClose = () => {
    if (!loading) {
      setSuccess(false);
      onClose();
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Настройки Green API</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              Настройки успешно сохранены
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Instance ID"
            fullWidth
            value={instanceId}
            onChange={(e) => setInstanceId(e.target.value)}
            disabled={loading}
            required
          />
          <TextField
            margin="dense"
            label="API Key"
            fullWidth
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            disabled={loading}
            required
          />
          <Box sx={{ mt: 2, color: 'text.secondary', fontSize: '0.875rem' }}>
            Получите учетные данные в{' '}
            <a 
              href="https://green-api.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: 'inherit' }}
            >
              Green API
            </a>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={loading}>
          Отмена
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          disabled={loading || !instanceId.trim() || !apiKey.trim()}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : (
            'Сохранить'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Settings;
