import React, { createContext, useContext, useMemo, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const ColorModeContext = createContext({ 
  toggleColorMode: () => {},
  mode: 'light'
});

export const useColorMode = () => {
  return useContext(ColorModeContext);
};

export const ThemeContextProvider = ({ children }) => {
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem('theme-mode');
    return savedMode || 'light';
  });

  const colorMode = useMemo(
    () => ({
      mode,
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === 'light' ? 'dark' : 'light';
          localStorage.setItem('theme-mode', newMode);
          return newMode;
        });
      },
    }),
    [mode]
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#00a884',
          },
          secondary: {
            main: '#128c7e',
          },
          background: {
            default: mode === 'light' ? '#f0f2f5' : '#111b21',
            paper: mode === 'light' ? '#ffffff' : '#202c33',
          },
        },
      }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ColorModeContext.Provider>
  );
};
