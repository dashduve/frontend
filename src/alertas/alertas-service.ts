import axiosInstance from './axiosInstance';

export interface AlertaStock {
  id_alerta?: number;
  id_producto: number;
  nivel_minimo: number;
  estado: 'Activo' | 'Inactivo';
  fecha_creacion?: string;
  // Campos adicionales para la UI
  nombre_producto?: string;
  stock_actual?: number;
}

const alertasService = {
  getAlertas: async (estado?: 'Activo' | 'Inactivo') => {
    try {
      const response = await axiosInstance.get('/alertas', { 
        params: estado ? { estado } : undefined 
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getAlerta: async (id: number) => {
    try {
      const response = await axiosInstance.get(`/alertas/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  marcarComoResuelta: async (id: number) => {
    try {
      const response = await axiosInstance.patch(`/alertas/${id}`, { estado: 'Inactivo' });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  configurarAlerta: async (id_producto: number, nivel_minimo: number) => {
    try {
      const response = await axiosInstance.post('/alertas', { id_producto, nivel_minimo });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default alertasService;
