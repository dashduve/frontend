// Definición de tipos para todos los modelos del sistema

// Autenticación y Usuarios
export interface Usuario {
  id_usuario: number;
  nombre_completo: string;
  email: string;
  telefono?: string;
  estado: 'Activo' | 'Inactivo';
  fecha_creacion: string;
  ultima_conexion?: string;
  id_empresa?: number;
  empresa?: Empresa;
  roles?: Rol[];
}

export interface Rol {
  id_rol: number;
  nombre: string;
  descripcion?: string;
  fecha_creacion?: string;
}

export interface Empresa {
  id_empresa: number;
  nombre: string;
  ruc: string;
  direccion?: string;
  telefono?: string;
  email_contacto?: string;
  sector?: string;
  fecha_creacion?: string;
  estado: 'Activo' | 'Inactivo';
}

// Productos y Categorías
export interface Producto {
  id_producto: number;
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
  // Relaciones
  categoria?: Categoria;
  proveedor?: Proveedor;
  empresa?: Empresa;
  // Datos calculados
  stock_actual?: number;
}

export interface Categoria {
  id_categoria: number;
  nombre: string;
  descripcion?: string;
  fecha_creacion?: string;
}

export interface Proveedor {
  id_proveedor: number;
  nombre: string;
  contacto?: string;
  telefono?: string;
  email?: string;
  direccion?: string;
  fecha_creacion?: string;
}

// Inventario
export interface Inventario {
  id_inventario: number;
  id_empresa: number;
  fecha_actualizacion: string;
}

export interface MovimientoInventario {
  id_movimiento: number;
  id_producto: number;
  tipo_movimiento: 'Entrada' | 'Salida' | 'Ajuste';
  cantidad: number;
  fecha_movimiento: string;
  motivo?: string;
  id_usuario: number;
  costo_unitario?: number;
  ubicacion?: string;
  // Relaciones
  producto?: Producto;
  usuario?: Usuario;
}

// Alertas
export interface AlertaStock {
  id_alerta: number;
  id_producto: number;
  nivel_minimo: number;
  estado: 'Activo' | 'Inactivo';
  fecha_creacion: string;
  // Relación
  producto?: Producto;
}

// Reportes
export interface Reporte {
  id_reporte: number;
  id_empresa: number;
  tipo: 'Inventario' | 'Ventas' | 'Perdidas';
  fecha_generacion: string;
  archivo_pdf: string;
  id_usuario: number;
  // Relaciones
  empresa?: Empresa;
  usuario?: Usuario;
}

// Pedidos
export interface Pedido {
  id_pedido: number;
  id_empresa: number;
  fecha_solicitud: string;
  fecha_entrega?: string;
  estado: 'Pendiente' | 'Entregado' | 'Cancelado';
  // Relaciones
  empresa?: Empresa;
  detalles?: DetallePedido[];
}

export interface DetallePedido {
  id_detalle_pedido: number;
  id_pedido: number;
  id_producto: number;
  cantidad: number;
  precio_unitario: number;
  // Relaciones
  producto?: Producto;
  pedido?: Pedido;
}

// Tipos para paginación
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
    prev: number | null;
    next: number | null;
  };
}

// Tipos para estado de la aplicación
export interface AppNotification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: number;
  read: boolean;
}

export interface AppState {
  isOffline: boolean;
  isPendingSynchronization: boolean;
  pendingActions: number;
  notifications: AppNotification[];
}
