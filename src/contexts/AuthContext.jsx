import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [credentials, setCredentials] = useState(null);
  const [loading, setLoading] = useState(true);

  // Загружаем учетные данные при инициализации
  useEffect(() => {
    try {
      const saved = localStorage.getItem('whatsapp-credentials');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.instanceId && parsed?.apiKey) {
          setCredentials(parsed);
        }
      }
    } catch (error) {
      console.error('Error loading credentials:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (instanceId, apiKey) => {
    try {
      const newCredentials = { instanceId, apiKey };
      setCredentials(newCredentials);
      localStorage.setItem('whatsapp-credentials', JSON.stringify(newCredentials));
      return true;
    } catch (error) {
      console.error('Error saving credentials:', error);
      return false;
    }
  };

  const updateCredentials = (instanceId, apiKey) => {
    try {
      const newCredentials = { instanceId, apiKey };
      setCredentials(newCredentials);
      localStorage.setItem('whatsapp-credentials', JSON.stringify(newCredentials));
      return true;
    } catch (error) {
      console.error('Error updating credentials:', error);
      return false;
    }
  };

  const logout = () => {
    try {
      setCredentials(null);
      localStorage.removeItem('whatsapp-credentials');
      return true;
    } catch (error) {
      console.error('Error during logout:', error);
      return false;
    }
  };

  const value = {
    credentials,
    login,
    logout,
    updateCredentials,
    isAuthenticated: !!credentials,
    isLoading: loading
  };

  // Показываем загрузку, пока проверяем авторизацию
  if (loading) {
    return null;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
