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
import { whatsappApi } from '../api/whatsappApi';

const Settings = ({ open, onClose }) => {
  const { credentials, updateCredentials } = useAuth();
  const [instanceId, setInstanceId] = useState(credentials?.instanceId || '');
  const [apiKey, setApiKey] = useState(credentials?.apiKey || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const validateInputs = () => {
    if (!instanceId.trim()) {
      setError('Пожалуйста, введите Instance ID');
      return false;
    }
    if (!apiKey.trim()) {
      setError('Пожалуйста, введите API Key');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    setError('');
    setSuccess(false);

    if (!validateInputs()) {
      return;
    }

    setLoading(true);
    try {
      await whatsappApi.checkAuth(instanceId.trim(), apiKey.trim());
      updateCredentials(instanceId.trim(), apiKey.trim());
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message || 'Ошибка проверки учетных данных');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setError('');
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
      <DialogTitle>Настройки API</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
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
            error={!!error && !instanceId}
            helperText={!!error && !instanceId ? 'Обязательное поле' : ''}
          />
          <TextField
            margin="dense"
            label="API Key"
            fullWidth
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            disabled={loading}
            error={!!error && !apiKey}
            helperText={!!error && !apiKey ? 'Обязательное поле' : ''}
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
          disabled={loading || (!instanceId && !apiKey)}
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
