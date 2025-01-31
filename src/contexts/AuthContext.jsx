import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [credentials, setCredentials] = useState(() => {
    const saved = localStorage.getItem('whatsapp-credentials');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (instanceId, apiKey) => {
    const newCredentials = { instanceId, apiKey };
    setCredentials(newCredentials);
    localStorage.setItem('whatsapp-credentials', JSON.stringify(newCredentials));
  };

  const updateCredentials = (instanceId, apiKey) => {
    const newCredentials = { instanceId, apiKey };
    setCredentials(newCredentials);
    localStorage.setItem('whatsapp-credentials', JSON.stringify(newCredentials));
  };

  const logout = () => {
    setCredentials(null);
    localStorage.removeItem('whatsapp-credentials');
  };

  const value = {
    credentials,
    login,
    logout,
    updateCredentials,
    isAuthenticated: !!credentials
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
