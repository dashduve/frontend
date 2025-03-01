import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productosService } from '../../api/productosService';
import { categoriasService } from '../../api/categoriasService';
import { proveedoresService } from '../../api/proveedoresService';
import { Producto, Categoria, Proveedor } from '../../types/models';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { useAuth } from '../../hooks/useAuth';
import { useOffline } from '../../hooks/useOffline';

type ProductoFormProps = {
  isEditing?: boolean;
};

const ProductoForm: React.FC<ProductoFormProps> = ({ isEditing = false }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isOffline = useOffline();
  
  const [formData, setFormData] = useState<Partial<Producto>>({
    nombre: '',
    descripcion: '',
    codigo_barras: '',
    precio_compra: 0,
    precio_venta: 0,
    stock_minimo: 0,
    stock_maximo: 1000,
    id_categoria: undefined,
    id_proveedor: undefined,
    id_empresa: user?.id_empresa
  });
  
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchDependencies = async () => {
      try {
        const [categoriasData, proveedoresData] = await Promise.all([
          categoriasService.getCategorias(),
          proveedoresService.getProveedores()
        ]);
        setCategorias(categoriasData);
        setProveedores(proveedoresData);
      } catch (error) {
        setError('Error al cargar datos necesarios');
        console.error('Error al cargar dependencias:', error);
      }
    };

    fetchDependencies();
  }, []);

  useEffect(() => {
    if (isEditing && id) {
      const fetchProducto = async () => {
        setLoading(true);
        try {
          const data = await productosService.getProductoById(parseInt(id));
          setFormData(data);
        } catch (error) {
          setError('Error al cargar los datos del producto');
          console.error('Error al cargar producto:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchProducto();
    }
  }, [isEditing, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    let parsedValue: string | number = value;

    // Convertir valores numéricos
    if (type === 'number') {
      parsedValue = value === '' ? 0 : parseFloat(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (isOffline) {
        // Guardar en localStorage para sincronización posterior
        const offlineActions = JSON.parse(localStorage.getItem('offlineActions') || '[]');
        offlineActions.push({
          type: isEditing ? 'UPDATE_PRODUCTO' : 'CREATE_PRODUCTO',
          data: formData,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('offlineActions', JSON.stringify(offlineActions));
        setSuccess(`Producto ${isEditing ? 'actualizado' : 'creado'} en modo offline. Se sincronizará cuando recupere la conexión.`);
        return;
      }

      if (isEditing && id) {
        await productosService.updateProducto(parseInt(id), formData as Producto);
        setSuccess('Producto actualizado correctamente');
      } else {
        await productosService.createProducto(formData as Producto);
        setSuccess('Producto creado correctamente');
        setFormData({
          nombre: '',
          descripcion: '',
          codigo_barras: '',
          precio_compra: 0,
          precio_venta: 0,
          stock_minimo: 0,
          stock_maximo: 1000,
          id_categoria: undefined,
          id_proveedor: undefined,
          id_empresa: user?.id_empresa
        });
      }
    } catch (error) {
      setError('Error al guardar el producto');
      console.error('Error al guardar producto:', error);
    } finally {
      setLoading(false);
      // Redirigir después de un breve retraso si fue exitoso
      if (!isOffline) {
        setTimeout(() => {
          navigate('/productos');
        }, 2000);
      }
    }
  };

  if (loading && isEditing) {
    return <div className="text-center py-8">Cargando datos del producto...</div>;
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">
        {isEditing ? 'Editar Producto' : 'Crear Nuevo Producto'}
      </h2>
      
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nombre" className="block mb-1">Nombre *</label>
          <Input
            id="nombre"
            name="nombre"
            value={formData.nombre || ''}
            onChange={handleChange}
            required
            placeholder="Nombre del producto"
          />
        </div>
        
        <div>
          <label htmlFor="codigo_barras" className="block mb-1">Código de Barras</label>
          <Input
            id="codigo_barras"
            name="codigo_barras"
            value={formData.codigo_barras || ''}
            onChange={handleChange}
            placeholder="Código de barras"
          />
        </div>
        
        <div>
          <label htmlFor="descripcion" className="block mb-1">Descripción</label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
            rows={3}
            placeholder="Descripción del producto"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="precio_compra" className="block mb-1">Precio de Compra *</label>
            <Input
              id="precio_compra"
              name="precio_compra"
              type="number"
              step="0.01"
              value={formData.precio_compra || ''}
              onChange={handleChange}
              required
              placeholder="0.00"
            />
          </div>
          
          <div>
            <label htmlFor="precio_venta" className="block mb-1">Precio de Venta *</label>
            <Input
              id="precio_venta"
              name="precio_venta"
              type="number"
              step="0.01"
              value={formData.precio_venta || ''}
              onChange={handleChange}
              required
              placeholder="0.00"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="stock_minimo" className="block mb-1">Stock Mínimo</label>
            <Input
              id="stock_minimo"
              name="stock_minimo"
              type="number"
              value={formData.stock_minimo || ''}
              onChange={handleChange}
              placeholder="0"
            />
          </div>
          
          <div>
            <label htmlFor="stock_maximo" className="block mb-1">Stock Máximo</label>
            <Input
              id="stock_maximo"
              name="stock_maximo"
              type="number"
              value={formData.stock_maximo || ''}
              onChange={handleChange}
              placeholder="1000"
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="id_categoria" className="block mb-1">Categoría</label>
            <select
              id="id_categoria"
              name="id_categoria"
              value={formData.id_categoria || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Seleccione una categoría</option>
              {categorias.map((categoria) => (
                <option key={categoria.id_categoria} value={categoria.id_categoria}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="id_proveedor" className="block mb-1">Proveedor</label>
            <select
              id="id_proveedor"
              name="id_proveedor"
              value={formData.id_proveedor || ''}
              onChange={handleChange}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Seleccione un proveedor</option>
              {proveedores.map((proveedor) => (
                <option key={proveedor.id_proveedor} value={proveedor.id_proveedor}>
                  {proveedor.nombre}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="flex justify-end space-x-4 pt-4">
          <Button 
            type="button" 
            variant="secondary"
            onClick={() => navigate('/productos')}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={loading}
          >
            {loading ? 'Guardando...' : isEditing ? 'Actualizar Producto' : 'Crear Producto'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ProductoForm;
