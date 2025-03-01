import { useState, useEffect, useCallback, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { authService } from '../api/authService';
import { Usuario } from '../types/models';

interface UseAuthResult {
  isAuthenticated: boolean;
  user: Usuario | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<Usuario>, password: string) => Promise<void>;
  logout: () => void;
  checkAuthStatus: () => Promise<boolean>;
}

export const useAuth = (): UseAuthResult => {
  const { 
    user, 
    setUser, 
    isAuthenticated, 
    setIsAuthenticated 
  } = useContext(AuthContext);
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Verificar estado de autenticación al iniciar
  const checkAuthStatus = useCallback(async (): Promise<boolean> => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setIsAuthenticated(false);
        return false;
      }
      
      // Verificar si el token es válido obteniendo datos del usuario
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      // Si hay error, limpiar datos de autenticación
      localStorage.removeItem('token');
      setUser(null);
      setIsAuthenticated(false);
      return false;
    } finally {
      setLoading(false);
    }
  }, [setUser, setIsAuthenticated]);
  
  // Iniciar sesión
  const login = async (email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      const { token, user } = await authService.login(email, password);
      
      // Guardar token
      localStorage.setItem('token', token);
      
      // Actualizar estado
      setUser(user);
      setIsAuthenticated(true);
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Registrar nuevo usuario
  const register = async (userData: Partial<Usuario>, password: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      await authService.register(userData, password);
      // Después de registrarse, automáticamente iniciar sesión
      await login(userData.email!, password);
    } catch (err: any) {
      setError(err.message || 'Error al registrarse');
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Cerrar sesión
  const logout = (): void => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);
  };
  
  // Verificar autenticación al cargar el componente
  useEffect(() => {
    checkAuthStatus();
  }, [checkAuthStatus]);
  
  return {
    isAuthenticated,
    user,
    loading,
    error,
    login,
    register,
    logout,
    checkAuthStatus
  };
};

export default useAuth;