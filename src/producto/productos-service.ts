import axiosInstance from './axiosInstance';

export interface Producto {
  id_producto?: number;
  codigo_barras?: string;
  nombre: string;
  descripcion?: string;
  id_categoria?: number;
  precio_compra: number;
  precio_venta: number;
  stock_minimo: number;
  stock_maximo: number;
  id_empresa?: number;
  id_proveedor?: number;
  fecha_creacion?: string;
  ultima_actualizacion?: string;
  // Campos calculados
  stock_actual?: number;
  categoria?: string;
  proveedor?: string;
}

export interface ProductoFiltros {
  nombre?: string;
  id_categoria?: number;
  id_proveedor?: number;
  stock_bajo?: boolean;
  page?: number;
  limit?: number;
}

const productosService = {
  getProductos: async (filtros?: ProductoFiltros) => {
    try {
      const response = await axiosInstance.get('/productos', { params: filtros });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getProducto: async (id: number) => {
    try {
      const response = await axiosInstance.get(`/productos/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createProducto: async (producto: Producto) => {
    try {
      const response = await axiosInstance.post('/productos', producto);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateProducto: async (id: number, producto: Partial<Producto>) => {
    try {
      const response = await axiosInstance.patch(`/productos/${id}`, producto);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deleteProducto: async (id: number) => {
    try {
      const response = await axiosInstance.delete(`/productos/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getStockActual: async (id: number) => {
    try {
      const response = await axiosInstance.get(`/productos/${id}/stock`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  buscarPorCodigoBarras: async (codigo: string) => {
    try {
      const response = await axiosInstance.get(`/productos/barcode/${codigo}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default productosService;
