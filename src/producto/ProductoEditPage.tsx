import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductoForm from '../components/productos/ProductoForm';
import Alert from '../components/ui/Alert';
import { productosService } from '../api/productosService';
import { Producto } from '../types/models';

const ProductoEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [producto, setProducto] = useState<Producto | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProducto = async () => {
      try {
        if (!id) return;
        
        const productoData = await productosService.getById(parseInt(id));
        setProducto(productoData);
      } catch (err) {
        setError('Error al cargar los datos del producto');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducto();
  }, [id]);
  
  if (loading) return <div className="text-center p-4">Cargando producto...</div>;
  
  if (error) return <Alert type="error" message={error} />;
  
  if (!producto) return <Alert type="error" message="No se encontró el producto solicitado" />;
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Editar Producto</h1>
      <ProductoForm producto={producto} isEditing={true} />
    </div>
  );
};

export default ProductoEditPage;