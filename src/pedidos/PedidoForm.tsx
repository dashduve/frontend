import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Card from '../ui/Card';
import Alert from '../ui/Alert';
import { Pedido, DetallePedido, Producto } from '../../types/models';
import { pedidosService } from '../../api/pedidosService';
import { productosService } from '../../api/productosService';

interface PedidoFormProps {
  pedido?: Pedido;
  isEditing?: boolean;
}

const PedidoForm: React.FC<PedidoFormProps> = ({ pedido, isEditing = false }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Partial<Pedido>>({
    id_empresa: 0,
    fecha_entrega: '',
    estado: 'Pendiente'
  });
  
  const [detalles, setDetalles] = useState<Partial<DetallePedido>[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Cargar datos del pedido si estamos editando
  useEffect(() => {
    const loadData = async () => {
      try {
        // Cargar productos disponibles
        const productosData = await productosService.getAll();
        setProductos(productosData);
        
        // Si estamos editando, cargar datos del pedido
        if (isEditing && pedido) {
          setFormData({
            id_empresa: pedido.id_empresa,
            fecha_entrega: pedido.fecha_entrega ? new Date(pedido.fecha_entrega).toISOString().split('T')[0] : '',
            estado: pedido.estado
          });
          
          // Cargar detalles del pedido
          const detallesData = await pedidosService.getDetallesPedido(pedido.id_pedido);
          setDetalles(detallesData);
        } else {
          // Para nuevo pedido, agregar un detalle vacío
          setDetalles([{ id_producto: 0, cantidad: 1, precio_unitario: 0 }]);
        }
      } catch (err) {
        setError('Error al cargar datos necesarios para el formulario');
        console.error(err);
      }
    };
    
    loadData();
  }, [isEditing, pedido]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleDetalleChange = (index: number, field: string, value: any) => {
    const newDetalles = [...detalles];
    newDetalles[index] = {
      ...newDetalles[index],
      [field]: value
    };
    
    // Si cambió el producto, actualizar el precio unitario
    if (field === 'id_producto') {
      const producto = productos.find(p => p.id_producto === parseInt(value));
      if (producto) {
        newDetalles[index].precio_unitario = producto.precio_venta;
      }
    }
    
    setDetalles(newDetalles);
  };
  
  const addDetalleRow = () => {
    setDetalles([...detalles, { id_producto: 0, cantidad: 1, precio_unitario: 0 }]);
  };
  
  const removeDetalleRow = (index: number) => {
    if (detalles.length > 1) {
      const newDetalles = detalles.filter((_, i) => i !== index);
      setDetalles(newDetalles);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      // Validar datos
      if (!formData.id_empresa) {
        throw new Error('La empresa es requerida');
      }
      
      if (detalles.some(d => !d.id_producto || !d.cantidad || !d.precio_unitario)) {
        throw new Error('Todos los detalles del pedido deben estar completos');
      }
      
      // Crear o actualizar pedido
      let response;
      if (isEditing && pedido) {
        response = await pedidosService.update(pedido.id_pedido, {
          ...formData,
          detalles: detalles as DetallePedido[]
        });
        setSuccess('Pedido actualizado correctamente');
      } else {
        response = await pedidosService.create({
          ...formData,
          detalles: detalles as DetallePedido[]
        });
        setSuccess('Pedido creado correctamente');
      }
      
      setTimeout(() => {
        navigate('/pedidos');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Error al procesar el pedido');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">
        {isEditing ? 'Editar Pedido' : 'Crear Nuevo Pedido'}
      </h2>
      
      {error && <Alert type="error" message={error} className="mb-4" />}
      {success && <Alert type="success" message={success} className="mb-4" />}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Fecha de Entrega</label>
          <Input
            type="date"
            name="fecha_entrega"
            value={formData.fecha_entrega || ''}
            onChange={handleInputChange}
            required
          />
        </div>
        
        {isEditing && (
          <div className="mb-4">
            <label className="block mb-2">Estado</label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            >
              <option value="Pendiente">Pendiente</option>
              <option value="Entregado">Entregado</option>
              <option value="Cancelado">Cancelado</option>
            </select>
          </div>
        )}
        
        <h3 className="text-lg font-semibold mt-6 mb-2">Detalle del Pedido</h3>
        
        {detalles.map((detalle, index) => (
          <div key={index} className="p-3 border rounded mb-3 bg-gray-50">
            <div className="flex flex-wrap -mx-2">
              <div className="px-2 w-full md:w-1/2">
                <label className="block mb-1">Producto</label>
                <select
                  value={detalle.id_producto || 0}
                  onChange={(e) => handleDetalleChange(index, 'id_producto', parseInt(e.target.value))}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value={0}>Seleccionar producto</option>
                  {productos.map(producto => (
                    <option key={producto.id_producto} value={producto.id_producto}>
                      {producto.nombre}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="px-2 w-full md:w-1/6">
                <label className="block mb-1">Cantidad</label>
                <Input
                  type="number"
                  min="1"
                  value={detalle.cantidad || ''}
                  onChange={(e) => handleDetalleChange(index, 'cantidad', parseInt(e.target.value))}
                  required
                />
              </div>
              
              <div className="px-2 w-full md:w-1/6">
                <label className="block mb-1">Precio</label>
                <Input
                  type="number"
                  step="0.01"
                  value={detalle.precio_unitario || ''}
                  onChange={(e) => handleDetalleChange(index, 'precio_unitario', parseFloat(e.target.value))}
                  required
                />
              </div>
              
              <div className="px-2 w-full md:w-1/6 flex items-end">
                <Button 
                  type="button" 
                  variant="danger" 
                  className="mb-1"
                  onClick={() => removeDetalleRow(index)}
                  disabled={detalles.length <= 1}
                >
                  Eliminar
                </Button>
              </div>
            </div>
          </div>
        ))}
        
        <div className="mb-4">
          <Button type="button" variant="secondary" onClick={addDetalleRow}>
            + Agregar Producto
          </Button>
        </div>
        
        <div className="mt-6 flex justify-between">
          <Button type="button" variant="secondary" onClick={() => navigate('/pedidos')}>
            Cancelar
          </Button>
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Procesando...' : isEditing ? 'Actualizar Pedido' : 'Crear Pedido'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default PedidoForm;