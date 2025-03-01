import React, { useState, useEffect } from 'react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Alert } from '../ui/Alert';
import { inventarioService } from '../../api/inventarioService';
import { productosService } from '../../api/productosService';
import { MovimientoInventario, Producto } from '../../types/models';
import { useOffline } from '../../hooks/useOffline';

interface MovimientoFormProps {
  movimientoId?: number;
  onSubmit: (data: Partial<MovimientoInventario>) => void;
  onCancel: () => void;
}

export const MovimientoForm: React.FC<MovimientoFormProps> = ({
  movimientoId,
  onSubmit,
  onCancel
}) => {
  const initialState: Partial<MovimientoInventario> = {
    id_producto: 0,
    tipo_movimiento: 'Entrada',
    cantidad: 0,
    motivo: '',
    costo_unitario: 0,
    ubicacion: ''
  };

  const [formData, setFormData] = useState<Partial<MovimientoInventario>>(initialState);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { isOffline } = useOffline();
  const isEditing = !!movimientoId;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Cargar productos
        const productosData = await productosService.getProductos();
        setProductos(productosData);

        // Si estamos editando, cargar los datos del movimiento
        if (isEditing) {
          const movimiento = await inventarioService.getMovimientoById(movimientoId);
          setFormData(movimiento);
        }
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setFormError('Error al cargar datos. Por favor, intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [movimientoId, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Manejar valores numéricos
    if (type === 'number') {
      setFormData({ ...formData, [name]: parseFloat(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = (): boolean => {
    if (!formData.id_producto) {
      setFormError('Debes seleccionar un producto');
      return false;
    }
    
    if (!formData.tipo_movimiento) {
      setFormError('Debes seleccionar un tipo de movimiento');
      return false;
    }
    
    if (!formData.cantidad || formData.cantidad <= 0) {
      setFormError('La cantidad debe ser mayor a 0');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      await onSubmit(formData);
      setFormError(null);
    } catch (error) {
      console.error('Error al guardar movimiento:', error);
      setFormError('Error al guardar el movimiento. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return <div className="text-center p-4">Cargando datos...</div>;
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4 p-4">
        <h2 className="text-xl font-bold mb-4">
          {isEditing ? 'Editar Movimiento' : 'Nuevo Movimiento'}
        </h2>
        
        {formError && <Alert type="error" message={formError} />}
        {isOffline && (
          <Alert 
            type="warning" 
            message="Estás en modo offline. Los cambios se sincronizarán cuando vuelvas a estar en línea." 
          />
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="id_producto" className="block text-sm font-medium text-gray-700 mb-1">
              Producto *
            </label>
            <select
              id="id_producto"
              name="id_producto"
              value={formData.id_producto || ''}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
              disabled={isOffline && isEditing}
            >
              <option value="">Seleccionar producto</option>
              {productos.map(producto => (
                <option key={producto.id_producto} value={producto.id_producto}>
                  {producto.nombre} (Stock: {producto.stock_actual || 0})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="tipo_movimiento" className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Movimiento *
            </label>
            <select
              id="tipo_movimiento"
              name="tipo_movimiento"
              value={formData.tipo_movimiento || 'Entrada'}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="Entrada">Entrada</option>
              <option value="Salida">Salida</option>
              <option value="Ajuste">Ajuste</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="cantidad" className="block text-sm font-medium text-gray-700 mb-1">
              Cantidad *
            </label>
            <Input
              id="cantidad"
              name="cantidad"
              type="number"
              value={formData.cantidad || ''}
              onChange={handleChange}
              min="1"
              required
            />
          </div>
          
          <div>
            <label htmlFor="costo_unitario" className="block text-sm font-medium text-gray-700 mb-1">
              Costo Unitario
            </label>
            <Input
              id="costo_unitario"
              name="costo_unitario"
              type="number"
              step="0.01"
              value={formData.costo_unitario || ''}
              onChange={handleChange}
            />
          </div>
          
          <div>
            <label htmlFor="ubicacion" className="block text-sm font-medium text-gray-700 mb-1">
              Ubicación
            </label>
            <Input
              id="ubicacion"
              name="ubicacion"
              type="text"
              value={formData.ubicacion || ''}
              onChange={handleChange}
            />
          </div>
          
          <div className="col-span-2">
            <label htmlFor="motivo" className="block text-sm font-medium text-gray-700 mb-1">
              Motivo
            </label>
            <textarea
              id="motivo"
              name="motivo"
              value={formData.motivo || ''}
              onChange={handleChange}
              rows={3}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Card>
  );
};
