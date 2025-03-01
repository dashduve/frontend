import axiosInstance from './axiosInstance';

export interface ReporteParams {
  tipo: 'Inventario' | 'Ventas' | 'Perdidas';
  fecha_inicio?: string;
  fecha_fin?: string;
  id_categoria?: number;
  id_proveedor?: number;
  formato?: 'pdf' | 'excel' | 'csv';
}

export interface Reporte {
  id_reporte: number;
  tipo: 'Inventario' | 'Ventas' | 'Perdidas';
  fecha_generacion: string;
  archivo_pdf: string;
  id_usuario: number;
  nombre_usuario?: string;
}

const reportesService = {
  getReportes: async () => {
    try {
      const response = await axiosInstance.get('/reportes');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  generateReporte: async (params: ReporteParams) => {
    try {
      const response = await axiosInstance.post('/reportes/generar', params, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getReporteInventarioActual: async (formato: 'pdf' | 'excel' | 'csv' = 'pdf') => {
    try {
      const response = await axiosInstance.get(`/reportes/inventario-actual?formato=${formato}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getReporteMovimientos: async (fecha_inicio: string, fecha_fin: string, formato: 'pdf' | 'excel' | 'csv' = 'pdf') => {
    try {
      const response = await axiosInstance.get(`/reportes/movimientos`, {
        params: { fecha_inicio, fecha_fin, formato },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getReporteValoracion: async (formato: 'pdf' | 'excel' | 'csv' = 'pdf') => {
    try {
      const response = await axiosInstance.get(`/reportes/valoracion?formato=${formato}`, {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default reportesService;
