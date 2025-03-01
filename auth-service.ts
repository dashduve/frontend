import axiosInstance from './axiosInstance';
import { setToken, removeToken } from '../utils/storage';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  nombre_completo: string;
  email: string;
  telefono?: string;
  password: string;
  id_empresa?: number;
}

export interface User {
  id_usuario: number;
  nombre_completo: string;
  email: string;
  telefono?: string;
  estado: 'Activo' | 'Inactivo';
  fecha_creacion: string;
  ultima_conexion: string;
  id_empresa?: number;
  roles: { id_rol: number; nombre: string }[];
}

const authService = {
  login: async (credentials: LoginCredentials) => {
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      const { token, user } = response.data;
      setToken(token);
      return user;
    } catch (error) {
      throw error;
    }
  },

  register: async (userData: RegisterData) => {
    try {
      const response = await axiosInstance.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: () => {
    removeToken();
  },

  getCurrentUser: async () => {
    try {
      const response = await axiosInstance.get('/auth/profile');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateProfile: async (id: number, userData: Partial<User>) => {
    try {
      const response = await axiosInstance.patch(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  changePassword: async (id: number, passwords: { currentPassword: string; newPassword: string }) => {
    try {
      const response = await axiosInstance.post(`/users/${id}/change-password`, passwords);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default authService;
