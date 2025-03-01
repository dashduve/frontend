import axios from 'axios';
import { getToken, removeToken } from '../utils/storage';

// URL base de la API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Crear instancia de Axios con configuración por defecto
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token a todas las peticiones
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores de respuesta
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el error es 401 (No autorizado), limpiar el token y recargar
    if (error.response && error.response.status === 401) {
      removeToken();
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
