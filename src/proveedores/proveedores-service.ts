import axiosInstance from './axiosInstance';

export interface Proveedor {
  id_proveedor?: number;
  nombre: string;
  contacto?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  fecha_creacion?: string;
}

const proveedoresService = {
  getProveedores: async () => {
    try {
      const response = await axiosInstance.get('/proveedores');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getProveedor: async (id: number) => {
    try {
      const response = await axiosInstance.get(`/proveedores/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createProveedor: async (proveedor: Proveedor) => {
    try {
      const response = await axiosInstance.post('/proveedores', proveedor);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateProveedor: async (id: number, proveedor: Partial<Proveedor>) => {
    try {
      const response = await axiosInstance.patch(`/proveedores/${id}`, proveedor);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteProveedor: async (id: number) => {
    try {
      const response = await axiosInstance.delete(`/proveedores/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default proveedoresService;
