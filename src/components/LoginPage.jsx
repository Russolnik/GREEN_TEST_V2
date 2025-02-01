import React, { useState } from 'react';
import { Box, TextField, Button, Container, Typography, Paper } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { whatsappApi } from '../api/whatsappApi';

const LoginPage = () => {
    const [instanceId, setInstanceId] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!instanceId.trim() || !apiKey.trim()) {
            setError('Both fields are required');
            setLoading(false);
            return;
        }

        try {
            // Пробуем отправить тестовое сообщение для проверки API
            const result = await whatsappApi.sendMessage(
                instanceId.trim(),
                apiKey.trim(),
                "777777777777", // Тестовый номер
                "test" // Тестовое сообщение
            );

            if (result.success === false) {
                throw new Error('API validation failed');
            }

            login(instanceId.trim(), apiKey.trim());
        } catch (err) {
            console.error('Login error:', err);
            setError('Failed to validate API credentials. Please check your Instance ID and API Key.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ 
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Paper 
                    elevation={3} 
                    sx={{ 
                        p: 4, 
                        width: '100%',
                        bgcolor: 'background.paper'
                    }}
                >
                    <Typography 
                        component="h1" 
                        variant="h4" 
                        sx={{ 
                            mb: 4,
                            textAlign: 'center',
                            color: 'primary.main',
                            fontWeight: 'bold'
                        }}
                    >
                        WhatsApp Web Login
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            autoFocus
                            margin="normal"
                            required
                            fullWidth
                            label="Instance ID"
                            value={instanceId}
                            onChange={(e) => {
                                setInstanceId(e.target.value);
                                setError('');
                            }}
                            disabled={loading}
                            error={!!error && !instanceId.trim()}
                            helperText={error && !instanceId.trim() ? 'Instance ID is required' : ''}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            label="API Key"
                            value={apiKey}
                            onChange={(e) => {
                                setApiKey(e.target.value);
                                setError('');
                            }}
                            disabled={loading}
                            error={!!error && !apiKey.trim()}
                            helperText={error && !apiKey.trim() ? 'API Key is required' : ''}
                        />
                        {error && (
                            <Typography 
                                color="error" 
                                variant="body2" 
                                sx={{ mt: 2, textAlign: 'center' }}
                            >
                                {error}
                            </Typography>
                        )}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            disabled={loading}
                        >
                            {loading ? 'Validating...' : 'Login'}
                        </Button>
                        <Typography 
                            variant="body2" 
                            color="text.secondary"
                            align="center"
                        >
                            Get your credentials at{' '}
                            <a 
                                href="https://green-api.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: 'inherit' }}
                            >
                                Green API
                            </a>
                        </Typography>
                    </form>
                </Paper>
            </Box>
        </Container>
    );
};

export default LoginPage;
