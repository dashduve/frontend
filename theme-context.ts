import React, { createContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
  setMode: (mode: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  mode: 'light',
  toggleTheme: () => {},
  setMode: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Verificar si hay un tema guardado en el almacenamiento local
  const [mode, setMode] = useState<ThemeMode>(() => {
    const savedMode = storage.getTheme();
    // Comprobar si el sistema prefiere el tema oscuro
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return (savedMode as ThemeMode) || (prefersDarkMode ? 'dark' : 'light');
  });

  // Actualizar el tema en el almacenamiento local cuando cambie
  useEffect(() => {
    storage.setTheme(mode);
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  // Función para alternar entre temas
  const toggleTheme = () => {
    setMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
  };

  const value = {
    mode,
    toggleTheme,
    setMode,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
