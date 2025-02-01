import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeContextProvider } from './contexts/ThemeContext';
import LoginPage from './components/LoginPage';
import ChatPage from './components/ChatPage';
import { CssBaseline } from '@mui/material';

const AppContent = () => {
    const { credentials } = useAuth();
    const isAuthenticated = credentials?.instanceId && credentials?.apiKey;

    return (
        <Routes>
            <Route
                path="*"
                element={isAuthenticated ? <ChatPage /> : <LoginPage />}
            />
        </Routes>
    );
};

const App = () => {
    return (
        <ThemeContextProvider>
            <AuthProvider>
                <CssBaseline />
                <Router>
                    <AppContent />
                </Router>
            </AuthProvider>
        </ThemeContextProvider>
    );
};

export default App;
