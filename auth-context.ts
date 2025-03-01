import React, { createContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../api/authService';
import { storage } from '../utils/storage';

interface User {
  id_usuario: number;
  nombre_completo: string;
  email: string;
  id_empresa: number;
  roles: string[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (userData: RegisterData) => Promise<void>;
}

interface RegisterData {
  nombre_completo: string;
  email: string;
  password: string;
  telefono?: string;
  empresa?: {
    nombre: string;
    ruc: string;
    direccion?: string;
    telefono?: string;
    email_contacto?: string;
    sector?: string;
  };
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  register: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Verificar si hay un usuario en el almacenamiento local al cargar
  useEffect(() => {
    const checkAuth = async () => {
      const token = storage.getToken();
      if (token) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch (error) {
          console.error('Error al verificar autenticación:', error);
          storage.clearToken();
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  // Función de inicio de sesión
  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await authService.login(email, password);
      storage.setToken(response.token);
      const userData = await authService.getCurrentUser();
      setUser(userData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error en login:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  // Función de cierre de sesión
  const logout = useCallback(() => {
    storage.clearToken();
    setUser(null);
    navigate('/login');
  }, [navigate]);

  // Función de registro
  const register = useCallback(async (userData: RegisterData) => {
    setIsLoading(true);
    try {
      const response = await authService.register(userData);
      storage.setToken(response.token);
      const userInfo = await authService.getCurrentUser();
      setUser(userInfo);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error en registro:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
