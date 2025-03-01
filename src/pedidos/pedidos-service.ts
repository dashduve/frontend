import axiosInstance from './axiosInstance';

export interface DetallePedido {
  id_detalle_pedido?: number;
  id_pedido?: number;
  id_producto: number;
  cantidad: number;
  precio_unitario: number;
  // Para UI
  nombre_producto?: string;
  codigo_barras?: string;
}

export interface Pedido {
  id_pedido?: number;
  id_empresa?: number;
  fecha_solicitud?: string;
  fecha_entrega?: string;
  estado: 'Pendiente' | 'Entregado' | 'Cancelado';
  // Relaciones
  detalles?: DetallePedido[];
  // Para UI
  total?: number;
  cantidad_items?: number;
}

export interface PedidoFiltros {
  estado?: 'Pendiente' | 'Entregado' | 'Cancelado';
  fecha_inicio?: string;
  fecha_fin?: string;
  page?: number;
  limit?: number;
}

const pedidosService = {
  getPedidos: async (filtros?: PedidoFiltros) => {
    try {
      const response = await axiosInstance.get('/pedidos', { params: filtros });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getPedido: async (id: number) => {
    try {
      const response = await axiosInstance.get(`/pedidos/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  createPedido: async (pedido: Pedido) => {
    try {
      const response = await axiosInstance.post('/pedidos', pedido);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updatePedido: async (id: number, pedido: Partial<Pedido>) => {
    try {
      const response = await axiosInstance.patch(`/pedidos/${id}`, pedido);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  deletePedido: async (id: number) => {
    try {
      const response = await axiosInstance.delete(`/pedidos/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  actualizarEstado: async (id: number, estado: 'Pendiente' | 'Entregado' | 'Cancelado') => {
    try {
      const response = await axiosInstance.patch(`/pedidos/${id}/estado`, { estado });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  recibirPedido: async (id: number) => {
    try {
      const response = await axiosInstance.post(`/pedidos/${id}/recibir`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default pedidosService;
