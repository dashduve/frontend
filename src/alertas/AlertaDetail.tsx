import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import { useFetch } from '../../hooks/useFetch';
import { alertasService } from '../../api/alertasService';
import { productosService } from '../../api/productosService';
import { Alerta, Producto } from '../../types/models';

const AlertaDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [alerta, setAlerta] = useState<Alerta | null>(null);
  const [producto, setProducto] = useState<Producto | null>(null);
  const { data: alertaData, error: alertaError, loading: alertaLoading, fetchData: fetchAlerta } = useFetch<Alerta>();
  const { data: productoData, error: productoError, loading: productoLoading, fetchData: fetchProducto } = useFetch<Producto>();

  useEffect(() => {
    if (id) {
      fetchAlerta(() => alertasService.getAlertaById(parseInt(id)));
    }
  }, [id, fetchAlerta]);

  useEffect(() => {
    if (alertaData) {
      setAlerta(alertaData);
      if (alertaData.id_producto) {
        fetchProducto(() => productosService.getProductoById(alertaData.id_producto));
      }
    }
  }, [alertaData, fetchProducto]);

  useEffect(() => {
    if (productoData) {
      setProducto(productoData);
    }
  }, [productoData]);

  const handleResolverAlerta = async () => {
    if (id) {
      try {
        await alertasService.marcarComoResuelta(parseInt(id));
        navigate('/alertas');
      } catch (error) {
        console.error('Error al resolver la alerta:', error);
      }
    }
  };

  const handleCrearPedido = () => {
    if (producto) {
      navigate('/pedidos/crear', { state: { productoId: producto.id_producto } });
    }
  };

  if (alertaLoading || productoLoading) return <div className="text-center p-4">Cargando detalles...</div>;

  if (alertaError) return <Alert type="error" message={`Error al cargar la alerta: ${alertaError}`} />;
  if (productoError) return <Alert type="error" message={`Error al cargar el producto: ${productoError}`} />;

  if (!alerta) return <Alert type="warning" message="No se encontró la alerta solicitada." />;

  return (
    <Card>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Detalle de Alerta</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-2">Información de la Alerta</h3>
            <p><span className="font-medium">ID:</span> {alerta.id_alerta}</p>
            <p><span className="font-medium">Nivel Mínimo:</span> {alerta.nivel_minimo}</p>
            <p><span className="font-medium">Estado:</span> {alerta.estado}</p>
            <p><span className="font-medium">Fecha de Creación:</span> {new Date(alerta.fecha_creacion).toLocaleString()}</p>
          </div>
          
          {producto && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">Información del Producto</h3>
              <p><span className="font-medium">Código:</span> {producto.codigo_barras}</p>
              <p><span className="font-medium">Nombre:</span> {producto.nombre}</p>
              <p><span className="font-medium">Precio de Compra:</span> ${producto.precio_compra}</p>
              <p><span className="font-medium">Stock Actual:</span> <span className="text-red-600 font-bold">{alerta.stock_actual}</span></p>
              <p><span className="font-medium">Stock Mínimo:</span> {producto.stock_minimo}</p>
            </div>
          )}
        </div>
        
        <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg mb-6">
          <h3 className="font-semibold text-lg mb-2">Acciones Recomendadas</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Realizar un pedido al proveedor para reponer el inventario</li>
            <li>Verificar si existen productos similares con stock disponible</li>
            <li>Revisar el historial de movimientos para identificar patrones de consumo</li>
          </ul>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => navigate('/alertas')} variant="secondary">
            Volver a la lista
          </Button>
          <Button onClick={handleCrearPedido} variant="primary">
            Crear Pedido de Reposición
          </Button>
          <Button onClick={handleResolverAlerta} variant="success">
            Marcar como Resuelta
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default AlertaDetail;