import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Alert } from '../../components/ui/Alert';
import { Modal } from '../../components/ui/Modal';
import { StockActual } from '../../components/inventario/StockActual';
import { MovimientosList } from '../../components/inventario/MovimientosList';
import { MovimientoForm } from '../../components/inventario/MovimientoForm';
import { inventarioService } from '../../api/inventarioService';
import { MovimientoInventario } from '../../types/models';
import { useOffline } from '../../hooks/useOffline';
import ContentLayout from '../../components/layout/ContentLayout';

const InventarioPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'stock' | 'movimientos'>('stock');
  const [showNewMovimientoModal, setShowNewMovimientoModal] = useState<boolean>(false);
  const [editingMovimientoId, setEditingMovimientoId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { isOffline } = useOffline();
  const navigate = useNavigate();

  const handleSubmitMovimiento = async (data: Partial<MovimientoInventario>) => {
    try {
      setIsLoading(true);
      
      if (editingMovimientoId) {
        await inventarioService.updateMovimiento(editingMovimientoId, data);
        setSuccess('Movimiento actualizado correctamente');
      } else {
        await inventarioService.createMovimiento(data);
        setSuccess('Movimiento registrado correctamente');
      }
      
      closeModal();
      // Recargar la página para ver los cambios actualizados
      if (activeTab === 'movimientos') {
        setActiveTab('stock');
        setTimeout(() => setActiveTab('movimientos'), 100);
      } else {
        setActiveTab('movimientos');
        setTimeout(() => setActiveTab('stock'), 100);
      }
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

  const handleViewMovimiento = (id: number) => {
    navigate(`/inventario/movimientos/${id}`);
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

  return (
    <ContentLayout title="Gestión de Inventario">
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}
      
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <div className="tabs mb-4 sm:mb-0">
            <button 
              className={`mr-4 px-4 py-2 font-medium ${activeTab === 'stock' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('stock')}
            >
              Stock Actual
            </button>
            <button 
              className={`px-4 py-2 font-medium ${activeTab === 'movimientos' 
                ? 'border-b-2 border-blue-500 text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('movimientos')}
            >
              Movimientos
            </button>
          </div>
          
          <Button 
            variant="primary"
            onClick={() => setShowNewMovimientoModal(true)}
            disabled={isOffline}
          >
            Nuevo Movimiento
          </Button>
        </div>
      </div>
      
      {activeTab === 'stock' ? (
        <StockActual />
      ) : (
        <Card>
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Movimientos de Inventario</h2>
            <MovimientosList 
              onEdit={handleEditMovimiento} 
              onView={handleViewMovimiento} 
            />
          </div>
        </Card>
      )}
      
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

export default InventarioPage;
