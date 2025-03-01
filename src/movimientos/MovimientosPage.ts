import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { Modal } from '../../components/ui/Modal';
import { MovimientosList } from '../../components/inventario/MovimientosList';
import { MovimientoForm } from '../../components/inventario/MovimientoForm';
import { inventarioService } from '../../api/inventarioService';
import { productosService } from '../../api/productosService';
import { MovimientoInventario, Producto } from '../../types/models';
import { useOffline } from '../../hooks/useOffline';
import ContentLayout from '../../components/layout/ContentLayout';

const MovimientosPage: React.FC = () => {
  const [showNewMovimientoModal, setShowNewMovimientoModal] = useState<boolean>(false);
  const [editingMovimientoId, setEditingMovimientoId] = useState<number | null>(null);
  const [producto, setProducto] = useState<Producto | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { isOffline } = useOffline();
  const { productoId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (productoId) {
      const fetchProducto = async () => {
        try {
          const data = await productosService.getProductoById(parseInt(productoId));
          setProducto(data);
        } catch (err) {
          console.error('Error al cargar producto:', err);
          setError('No se pudo cargar la información del producto');
        }
      };
      
      fetchProducto();
    }
  }, [productoId]);

  const handleSubmitMovimiento = async (data: Partial<MovimientoInventario>) => {
    try {
      setIsLoading(true);
      
      // Si venimos de un producto específico, asegurarnos de establecer el ID del producto
      if (productoId && !data.id_producto) {
        data.id_producto = parseInt(productoId);
      }
      
      if (editingMovimientoId) {
        await inventarioService.updateMovimiento(editingMovimientoId, data);
        setSuccess('Movimiento actualizado correctamente');
      } else {
        await inventarioService.createMovimiento(data);
        setSuccess('Movimiento registrado correctamente');
      }
      
      closeModal();
      // Recargar la lista
      setTimeout(() => {
        navigate(0);
      }, 1000);
    } catch (err) {
      console.error('Error al guardar movimiento:', err);
      setError('Ocurrió un error al guardar el movimiento. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditMovimiento = (id: number) => {
    setEditingMovimientoId(id);
    setShowNewMovimientoModal(true);
  };

  const closeModal = () => {
    setShowNewMovimientoModal(false);
    setEditingMovimientoId(null);
  };

  // Limpiar los mensajes de éxito después de 3 segundos
  React.useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const title = producto 
    ? `Movimientos de: ${producto.nombre}`
    : 'Movimientos de Inventario';

  return (
    <ContentLayout title={title}>
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}
      
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            {producto && (
              <div className="text-sm text-gray-500">
                <span className="font-semibold">Código:</span> {producto.codigo_barras} | 
                <span className="font-semibold ml-2">Stock Actual:</span> {producto.stock_actual || 0} | 
                <span className="font-semibold ml-2">Stock Mínimo:</span> {producto.stock_minimo}
              </div>
            )}
          </div>
          
          <div className="flex space-x-2">
            <Button 
              variant="secondary"
              onClick={() => navigate(-1)}
            >
              Volver
            </Button>
            
            <Button 
              variant="primary"
              onClick={() => setShowNewMovimientoModal(true)}
              disabled={isOffline}
            >
              Nuevo Movimiento
            </Button>
          </div>
        </div>
      </div>
      
      <Card>
        <div className="p-4">
          <MovimientosList 
            onEdit={handleEditMovimiento}
          />
        </div>
      </Card>
      
      <Modal 
        isOpen={showNewMovimientoModal} 
        onClose={closeModal}
        title={editingMovimientoId ? "Editar Movimiento" : "Nuevo Movimiento"}
      >
        <MovimientoForm 
          movimientoId={editingMovimientoId || undefined}
          onSubmit={handleSubmitMovimiento}
          onCancel={closeModal}
        />
      </Modal>
    </ContentLayout>
  );
};

export default MovimientosPage;
