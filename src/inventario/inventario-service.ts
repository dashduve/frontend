import axiosInstance from './axiosInstance';

export interface MovimientoInventario {
  id_movimiento?: number;
  id_producto: number;
  tipo_movimiento: 'Entrada' | 'Salida' | 'Ajuste';
  cantidad: number;
  fecha_movimiento?: string;
  motivo?: string;
  id_usuario?: number;
  costo_unitario?: number;
  ubicacion?: string;
  // Campos adicionales para la UI
  nombre_producto?: string;
  codigo_barras?: string;
}

export interface MovimientoFiltros {
  id_producto?: number;
  tipo_movimiento?: 'Entrada' | 'Salida' | 'Ajuste';
  fecha_inicio?: string;
  fecha_fin?: string;
  page?: number;
  limit?: number;
}

export interface StockResumen {
  total_productos: number;
  valor_total: number;
  productos_sin_stock: number;
  productos_stock_bajo: number;
}

const inventarioService = {
  getMovimientos: async (filtros?: MovimientoFiltros) => {
    try {
      const response = await axiosInstance.get('/inventario/movimientos', { params: filtros });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getMovimiento: async (id: number) => {
    try {
      const response = await axiosInstance.get(`/inventario/movimientos/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createMovimiento: async (movimiento: MovimientoInventario) => {
    try {
      const response = await axiosInstance.post('/inventario/movimientos', movimiento);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getStockResumen: async () => {
    try {
      const response = await axiosInstance.get('/inventario/resumen');
      return response.data as StockResumen;
    } catch (error) {
      throw error;
    }
  },

  getProductosStockBajo: async () => {
    try {
      const response = await axiosInstance.get('/inventario/stock-bajo');
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  realizarInventarioFisico: async (productos: Array<{ id_producto: number, cantidad_real: number }>) => {
    try {
      const response = await axiosInstance.post('/inventario/fisico', { productos });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default inventarioService;
