import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { productosService } from '../../api/productosService';
import { inventarioService } from '../../api/inventarioService';
import { Producto, MovimientoInventario } from '../../types/models';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { Table } from '../ui/Table';
import { Modal } from '../ui/Modal';
import { useOffline } from '../../hooks/useOffline';

const ProductoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isOffline = useOffline();
  
  const [producto, setProducto] = useState<Producto | null>(null);
  const [movimientos, setMovimientos] = useState<MovimientoInventario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [stockActual, setStockActual] = useState<number>(0);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchProductoData = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const [productoData, movimientosData, stockData] = await Promise.all([
          productosService.getProductoById(parseInt(id)),
          inventarioService.getMovimientosByProducto(parseInt(id)),
          inventarioService.getStockActual(parseInt(id))
        ]);
        
        setProducto(productoData);
        setMovimientos(movimientosData);
        setStockActual(stockData.stock_actual || 0);
      } catch (error) {
        console.error('Error al cargar datos del producto:', error);
        setError('No se pudo cargar la información del producto');
      } finally {
        setLoading(false);
      }
    };

    fetchProductoData();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      if (isOffline) {
        const offlineActions = JSON.parse(localStorage.getItem('offlineActions') || '[]');
        offlineActions.push({
          type: 'DELETE_PRODUCTO',
          id: parseInt(id),
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('offlineActions', JSON.stringify(offlineActions));
        navigate('/productos', { state: { message: 'Producto marcado para eliminación. Se procesará cuando vuelva la conexión.' } });
        return;
      }

      await productosService.deleteProducto(parseInt(id));
      navigate('/productos', { state: { message: 'Producto eliminado correctamente' } });
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      setError('No se pudo eliminar el producto');
      setDeleteModalOpen(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Cargando información del producto...</div>;
  }

  if (error) {
    return (
      <Alert 
        type="error" 
        message={error} 
        onClose={() => navigate('/productos')}
        action={{
          label: 'Volver a productos',
          onClick: () => navigate('/productos')
        }}
      />
    );
  }

  if (!producto) {
    return (
      <Alert 
        type="warning" 
        message="No se encontró el producto solicitado" 
        action={{
          label: 'Volver a productos',
          onClick: () => navigate('/productos')
        }}
      />
    );
  }

  const getStockStatusClass = () => {
    if (stockActual <= producto.stock_minimo) return 'bg-red-100 text-red-800';
    if (stockActual >= producto.stock_maximo) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{producto.nombre}</h1>
        <div className="space-x-2">
          <Button 
            variant="secondary"
            onClick={() => navigate(`/productos/editar/${id}`)}
          >
            Editar
          </Button>
          <Button 
            variant="danger"
            onClick={() => setDeleteModalOpen(true)}
          >
            Eliminar
          </Button>
        </div>
      </div>

      <Card className="overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-4">Información del Producto</h2>
            <div className="space-y-2">
              {producto.codigo_barras && (
                <div className="grid grid-cols-2">
                  <span className="font-medium">Código de Barras:</span>
                  <span>{producto.codigo_barras}</span>
                </div>
              )}
              <div className="grid grid-cols-2">
                <span className="font-medium">Precio de Compra:</span>
                <span>${producto.precio_compra.toFixed(2)}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="font-medium">Precio de Venta:</span>
                <span>${producto.precio_venta.toFixed(2)}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="font-medium">Categoría:</span>
                <span>{producto.categoria?.nombre || 'Sin categoría'}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="font-medium">Proveedor:</span>
                <span>{producto.proveedor?.nombre || 'Sin proveedor'}</span>
              </div>
              <div className="grid grid-cols-2">
                <span className="font-medium">Fecha de Creación:</span>
                <span>{new Date(producto.fecha_creacion).toLocaleDateString()}</span>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Detalles de Inventario</h2>
            <div className="space-y-4">
              <div className="p-4 rounded-md border">
                <div className="text-sm text-gray-500">Stock Actual</div>
                <div className={`text-2xl font-bold mt-1 px-2 py-1 rounded-md inline-block ${getStockStatusClass()}`}>
                  {stockActual} unidades
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-md border">
                  <div className="text-sm text-gray-500">Stock Mínimo</div>
                  <div className="text-lg font-semibold">{producto.stock_minimo} unidades</div>
                </div>
                <div className="p-3 rounded-md border">
                  <div className="text-sm text-gray-500">Stock Máximo</div>
                  <div className="text-lg font-semibold">{producto.stock_maximo} unidades</div>
                </div>
              </div>

              {producto.descripcion && (
                <div className="mt-4">
                  <h3 className="font-medium mb-1">Descripción:</h3>
                  <p className="text-gray-700">{producto.descripcion}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-4">Historial de Movimientos</h2>
        {movimientos.length > 0 ? (
          <Table
            columns={[
              { key: 'fecha_movimiento', title: 'Fecha' },
              { key: 'tipo_movimiento', title: 'Tipo' },
              { key: 'cantidad', title: 'Cantidad' },
              { key: 'motivo', title: 'Motivo' },
              { key: 'usuario', title: 'Usuario' }
            ]}
            data={movimientos.map(mov => ({
              ...mov,
              fecha_movimiento: new Date(mov.fecha_movimiento).toLocaleString(),
              tipo_movimiento: 
                mov.tipo_movimiento === 'Entrada' ? <span className="text-green-600">Entrada</span> :
                mov.tipo_movimiento === 'Salida' ? <span className="text-red-600">Salida</span> :
                <span className="text-blue-600">Ajuste</span>,
              usuario: mov.usuario?.nombre_completo || '-'
            }))}
          />
        ) : (
          <p className="text-gray-500 italic">No hay movimientos registrados para este producto.</p>
        )}
        
        <div className="mt-4">
          <Button 
            onClick={() => navigate(`/inventario/movimiento/nuevo?producto=${id}`)}
          >
            Registrar Movimiento
          </Button>
        </div>
      </Card>

      <Modal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title="Confirmar eliminación"
      >
        <div className="mb-6">
          <p>¿Está seguro que desea eliminar el producto <strong>{producto.nombre}</strong>?</p>
          <p className="text-red-600 mt-2 text-sm">Esta acción no se puede deshacer.</p>
        </div>
        
        <div className="flex justify-end space-x-3">
          <Button 
            variant="secondary"
            onClick={() => setDeleteModalOpen(false)}
          >
            Cancelar
          </Button>
          <Button 
            variant="danger"
            onClick={handleDelete}
          >
            Eliminar Producto
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default ProductoDetail;
