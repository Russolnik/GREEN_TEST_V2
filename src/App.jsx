import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeContextProvider } from './contexts/ThemeContext';
import LoginPage from './components/LoginPage';
import ChatPage from './components/ChatPage';
import { CssBaseline } from '@mui/material';

const PrivateRoute = ({ children }) => {
    const { credentials } = useAuth();
    
    // Проверяем наличие учетных данных
    if (!credentials?.instanceId || !credentials?.apiKey) {
        return <Navigate to="/login" replace />;
    }
    
    return children;
};

const PublicRoute = ({ children }) => {
    const { credentials } = useAuth();
    
    // Если пользователь уже авторизован, перенаправляем на главную
    if (credentials?.instanceId && credentials?.apiKey) {
        return <Navigate to="/" replace />;
    }
    
    return children;
};

const App = () => {
    return (
        <ThemeContextProvider>
            <AuthProvider>
                <CssBaseline />
                <Router>
                    <Routes>
                        {/* Публичные маршруты */}
                        <Route 
                            path="/login" 
                            element={
                                <PublicRoute>
                                    <LoginPage />
                                </PublicRoute>
                            } 
                        />
                        
                        {/* Защищенные маршруты */}
                        <Route
                            path="/"
                            element={
                                <PrivateRoute>
                                    <ChatPage />
                                </PrivateRoute>
                            }
                        />
                        
                        {/* Обработка всех остальных маршрутов */}
                        <Route 
                            path="*" 
                            element={<Navigate to="/" replace />} 
                        />
                    </Routes>
                </Router>
            </AuthProvider>
        </ThemeContextProvider>
    );
};

export default App;
