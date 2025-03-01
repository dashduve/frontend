import axiosInstance from './axiosInstance';

export interface Categoria {
  id_categoria?: number;
  nombre: string;
  descripcion?: string;
  fecha_creacion?: string;
}

const categoriasService = {
  getCategorias: async () => {
    try {
      const response = await axiosInstance.get('/categorias');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getCategoria: async (id: number) => {
    try {
      const response = await axiosInstance.get(`/categorias/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createCategoria: async (categoria: Categoria) => {
    try {
      const response = await axiosInstance.post('/categorias', categoria);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateCategoria: async (id: number, categoria: Partial<Categoria>) => {
    try {
      const response = await axiosInstance.patch(`/categorias/${id}`, categoria);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteCategoria: async (id: number) => {
    try {
      const response = await axiosInstance.delete(`/categorias/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default categoriasService;
