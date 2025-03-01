import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { useFetch } from '../../hooks/useFetch';
import { inventarioService } from '../../api/inventarioService';
import { productosService } from '../../api/productosService';
import { Producto, Movimiento } from '../../types/models';

interface MovimientoFormProps {
  isEdit?: boolean;
}

const MovimientoForm: React.FC<MovimientoFormProps> = ({ isEdit = false }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { fetchData, loading } = useFetch();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Movimiento>>({
    idProducto: 0,
    tipoMovimiento: 'Entrada',
    cantidad: 0,
    motivo: '',
    costoUnitario: 0,
    ubicacion: ''
  });

  useEffect(() => {
    const loadProductos = async () => {
      try {
        const response = await fetchData(() => productosService.getProductos());
        setProductos(response.data);
      } catch (err) {
        setError('Error al cargar los productos');
        console.error(err);
      }
    };

    loadProductos();

    // Si estamos en modo edición, cargar el movimiento existente
    if (isEdit && id) {
      const loadMovimiento = async () => {
        try {
          const response = await fetchData(() => inventarioService.getMovimientoById(parseInt(id)));
          setFormData(response.data);
        } catch (err) {
          setError('Error al cargar los datos del movimiento');
          console.error(err);
        }
      };

      loadMovimiento();
    }
  }, [fetchData, isEdit, id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      if (isEdit && id) {
        await fetchData(() => inventarioService.updateMovimiento(parseInt(id), formData));
        setSuccess('Movimiento actualizado correctamente');
      } else {
        await fetchData(() => inventarioService.createMovimiento(formData));
        setSuccess('Movimiento registrado correctamente');
        setFormData({
          idProducto: 0,
          tipoMovimiento: 'Entrada',
          cantidad: 0,
          motivo: '',
          costoUnitario: 0,
          ubicacion: ''
        });
      }
    } catch (err: any) {
      setError(err.message || 'Error al procesar el movimiento');
      console.error(err);
    }
  };

  return (
    <Card>
      <Card.Header>
        <h5>{isEdit ? 'Editar Movimiento' : 'Nuevo Movimiento de Inventario'}</h5>
      </Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="idProducto">Producto *</label>
            <select 
              id="idProducto"
              name="idProducto"
              className="form-select"
              value={formData.idProducto}
              onChange={handleInputChange}
              required
            >
              <option value="">Seleccione un producto</option>
              {productos.map(producto => (
                <option key={producto.idProducto} value={producto.idProducto}>
                  {producto.nombre} - Stock actual: {producto.stockActual}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="tipoMovimiento">Tipo de Movimiento *</label>
            <select 
              id="tipoMovimiento"
              name="tipoMovimiento"
              className="form-select"
              value={formData.tipoMovimiento}
              onChange={handleInputChange}
              required
            >
              <option value="Entrada">Entrada</option>
              <option value="Salida">Salida</option>
              <option value="Ajuste">Ajuste</option>
            </select>
          </div>

          <div className="mb-3">
            <label htmlFor="cantidad">Cantidad *</label>
            <Input 
              id="cantidad"
              name="cantidad"
              type="number"
              value={formData.cantidad?.toString() || '0'}
              onChange={handleInputChange}
              min={1}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="costoUnitario">Costo Unitario *</label>
            <Input 
              id="costoUnitario"
              name="costoUnitario"
              type="number"
              value={formData.costoUnitario?.toString() || '0'}
              onChange={handleInputChange}
              min={0}
              step="0.01"
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="ubicacion">Ubicación</label>
            <Input 
              id="ubicacion"
              name="ubicacion"
              type="text"
              value={formData.ubicacion || ''}
              onChange={handleInputChange}
              placeholder="Almacén, Estante, etc."
            />
          </div>

          <div className="mb-3">
            <label htmlFor="motivo">Motivo / Observaciones</label>
            <textarea
              id="motivo"
              name="motivo"
              className="form-control"
              value={formData.motivo || ''}
              onChange={handleInputChange}
              rows={3}
              placeholder="Explique el motivo del movimiento"
            />
          </div>

          <div className="d-flex justify-content-between">
            <Button type="button" variant="outline-secondary" onClick={() => navigate('/inventario/movimientos')}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? 'Guardando...' : isEdit ? 'Actualizar' : 'Registrar Movimiento'}
            </Button>
          </div>
        </form>
      </Card.Body>
    </Card>
  );
};

export default MovimientoForm;