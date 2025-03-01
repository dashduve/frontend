import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ContentLayout } from '../../components/layout/ContentLayout';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAlerts } from '../../context/AlertsContext';
import axios from 'axios';

interface Producto {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  stockMinimo: number;
  categoriaId: number;
  proveedorId: number;
  codigo: string;
  unidadMedida: string;
  imagen?: string;
  estado: 'activo' | 'inactivo';
}

interface Categoria {
  id: number;
  nombre: string;
}

interface Proveedor {
  id: number;
  nombre: string;
}

export const ProductoDetalle = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showAlert } = useAlerts();
  const [loading, setLoading] = useState(true);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [producto, setProducto] = useState<Producto>({
    id: 0,
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    stockMinimo: 0,
    categoriaId: 0,
    proveedorId: 0,
    codigo: '',
    unidadMedida: '',
    imagen: '',
    estado: 'activo'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productoRes, categoriasRes, proveedoresRes] = await Promise.all([
          axios.get(`/api/productos/${id}`),
          axios.get('/api/categorias'),
          axios.get('/api/proveedores')
        ]);
        
        setProducto(productoRes.data);
        setCategorias(categoriasRes.data);
        setProveedores(proveedoresRes.data);
      } catch (error) {
        showAlert('Error al cargar los datos del producto', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (id !== 'nuevo') {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [id, showAlert]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    setProducto({
      ...producto,
      [name]: type === 'number' ? parseFloat(value) : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id === 'nuevo') {
        await axios.post('/api/productos', producto);
        showAlert('Producto creado exitosamente', 'success');
      } else {
        await axios.put(`/api/productos/${id}`, producto);
        showAlert('Producto actualizado exitosamente', 'success');
      }
      navigate('/productos');
    } catch (error) {
      showAlert('Error al guardar el producto', 'error');
    }
  };

  if (loading) {
    return (
      <ContentLayout title="Cargando producto...">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout title={id === 'nuevo' ? 'Nuevo Producto' : 'Editar Producto'}>
      <Card className="max-w-3xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                label="Nombre"
                name="nombre"
                value={producto.nombre}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Input
                label="Código"
                name="codigo"
                value={producto.codigo}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                name="descripcion"
                value={producto.descripcion}
                onChange={handleChange}
                rows={3}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
              />
            </div>
            <div>
              <Input
                label="Precio"
                type="number"
                name="precio"
                value={producto.precio.toString()}
                onChange={handleChange}
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <Input
                label="Stock Actual"
                type="number"
                name="stock"
                value={producto.stock.toString()}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
            <div>
              <Input
                label="Stock Mínimo"
                type="number"
                name="stockMinimo"
                value={producto.stockMinimo.toString()}
                onChange={handleChange}
                min="0"
                required
              />
            </div>
            <div>
              <Input
                label="Unidad de Medida"
                name="unidadMedida"
                value={producto.unidadMedida}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <select
                name="categoriaId"
                value={producto.categoriaId}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                required
              >
                <option value="">Seleccione una categoría</option>
                {categorias.map(categoria => (
                  <option key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Proveedor
              </label>
              <select
                name="proveedorId"
                value={producto.proveedorId}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                required
              >
                <option value="">Seleccione un proveedor</option>
                {proveedores.map(proveedor => (
                  <option key={proveedor.id} value={proveedor.id}>
                    {proveedor.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                name="estado"
                value={producto.estado}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                required
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
            <div>
              <Input
                label="URL de Imagen"
                name="imagen"
                value={producto.imagen || ''}
                onChange={handleChange}
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate('/productos')}
            >
              Cancelar
            </Button>
            <Button type="submit">
              {id === 'nuevo' ? 'Crear Producto' : 'Actualizar Producto'}
            </Button>
          </div>
        </form>
      </Card>
    </ContentLayout>
  );
};

export default ProductoDetalle;
