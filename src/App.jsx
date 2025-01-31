import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeContextProvider } from './contexts/ThemeContext';
import LoginPage from './components/LoginPage';
import ChatPage from './components/ChatPage';
import { CssBaseline } from '@mui/material';

const PrivateRoute = ({ children }) => {
    const { credentials } = useAuth();
    return credentials?.instanceId && credentials?.apiKey ? children : <Navigate to="/login" />;
};

const App = () => {
    return (
        <ThemeContextProvider>
            <AuthProvider>
                <CssBaseline />
                <Router>
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route
                            path="/"
                            element={
                                <PrivateRoute>
                                    <ChatPage />
                                </PrivateRoute>
                            }
                        />
                    </Routes>
                </Router>
            </AuthProvider>
        </ThemeContextProvider>
    );
};

export default App;
