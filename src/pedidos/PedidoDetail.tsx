import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import { Pedido, DetallePedido, Producto } from '../../types/models';
import { pedidosService } from '../../api/pedidosService';
import { productosService } from '../../api/productosService';

const PedidoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [detalles, setDetalles] = useState<DetallePedido[]>([]);
  const [productosMap, setProductosMap] = useState<Map<number, Producto>>(new Map());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const loadPedido = async () => {
      try {
        if (!id) return;
        
        // Cargar pedido
        const pedidoData = await pedidosService.getById(parseInt(id));
        setPedido(pedidoData);
        
        // Cargar detalles
        const detallesData = await pedidosService.getDetallesPedido(parseInt(id));
        setDetalles(detallesData);
        
        // Cargar productos para mostrar nombres
        const productosData = await productosService.getAll();
        const productosMap = new Map();
        productosData.forEach(producto => {
          productosMap.set(producto.id_producto, producto);
        });
        setProductosMap(productosMap);
      } catch (err) {
        setError('Error al cargar los detalles del pedido');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadPedido();
  }, [id]);
  
  const getEstadoClass = (estado: string) => {
    switch (estado) {
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Entregado':
        return 'bg-green-100 text-green-800';
      case 'Cancelado':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const handleEditClick = () => {
    navigate(`/pedidos/editar/${id}`);
  };
  
  const handleProcesarEntrega = async () => {
    try {
      if (!id) return;
      
      await pedidosService.update(parseInt(id), {
        ...pedido,
        estado: 'Entregado'
      });
      
      // Actualizar el estado local del pedido
      setPedido(prev => prev ? { ...prev, estado: 'Entregado' } : null);
      
    } catch (err) {
      setError('Error al procesar la entrega del pedido');
      console.error(err);
    }
  };
  
  if (loading) return <div className="text-center p-4">Cargando detalles del pedido...</div>;
  
  if (error) return <Alert type="error" message={error} />;
  
  if (!pedido) return <Alert type="error" message="No se encontró el pedido solicitado" />;
  
  // Calcular total del pedido
  const total = detalles.reduce((sum, detalle) => sum + (detalle.cantidad * detalle.precio_unitario), 0);
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Detalles del Pedido #{id}</h1>
        <div className="flex space-x-2">
          <Button
            variant="secondary"
            onClick={() => navigate('/pedidos')}
          >
            Volver
          </Button>
          {pedido.estado === 'Pendiente' && (
            <>
              <Button
                variant="primary"
                onClick={handleEditClick}
              >
                Editar
              </Button>
              <Button
                variant="success"
                onClick={handleProcesarEntrega}
              >
                Marcar como Entregado
              </Button>
            </>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <h2 className="text-lg font-semibold mb-4">Información del Pedido</h2>
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">ID Pedido:</span>
              <span>{pedido.id_pedido}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Fecha de Solicitud:</span>
              <span>{new Date(pedido.fecha_solicitud).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Fecha de Entrega:</span>
              <span>{pedido.fecha_entrega ? new Date(pedido.fecha_entrega).toLocaleDateString() : 'No especificada'}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Estado:</span>
              <span className={`px-2 py-1 rounded-full text-xs ${getEstadoClass(pedido.estado)}`}>
                {pedido.estado}
              </span>
            </div>
          </div>
        </Card>
        
        <Card>
          <h2 className="text-lg font-semibold mb-4">Resumen</h2>
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Total de Productos:</span>
              <span>{detalles.length}</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Cantidad Total:</span>
              <span>{detalles.reduce((sum, detalle) => sum + detalle.cantidad, 0)} unidades</span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="font-medium">Total:</span>
              <span className="font-bold">${total.toFixed(2)}</span>
            </div>
          </div>
        </Card>
      </div>
      
      <Card>
        <h2 className="text-lg font-semibold mb-4">Productos</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio Unitario</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subtotal</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {detalles.map((detalle, index) => {
                const producto = productosMap.get(detalle.id_producto);
                const subtotal = detalle.cantidad * detalle.precio_unitario;
                
                return (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {producto ? producto.nombre : `Producto #${detalle.id_producto}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {detalle.cantidad}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${detalle.precio_unitario.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium">
                      ${subtotal.toFixed(2)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50">
                <td colSpan={3} className="px-6 py-4 text-right font-bold">Total:</td>
                <td className="px-6 py-4 font-bold">${total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default PedidoDetail;