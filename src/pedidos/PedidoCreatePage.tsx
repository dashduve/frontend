import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ContentLayout from '../components/layout/ContentLayout';
import PedidoForm from '../components/pedidos/PedidoForm';
import Alert from '../components/ui/Alert';
import { pedidosService } from '../api/pedidosService';
import { productosService } from '../api/productosService';
import { proveedoresService } from '../api/proveedoresService';
import { Producto, Proveedor } from '../types/models';

const PedidoCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [productos, setProductos] = useState<Producto[]>([]);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productosData, proveedoresData] = await Promise.all([
          productosService.getProductos(),
          proveedoresService.getProveedores()
        ]);
        setProductos(productosData);
        setProveedores(proveedoresData);
        setError(null);
      } catch (err) {
        setError('Error al cargar los datos necesarios. Por favor, intente nuevamente.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (pedidoData: any) => {
    try {
      await pedidosService.createPedido(pedidoData);
      navigate('/pedidos', { state: { success: 'Pedido creado con éxito' } });
    } catch (err) {
      setError('Error al crear el pedido. Por favor, intente nuevamente.');
      console.error(err);
    }
  };

  return (
    <ContentLayout title="Crear Nuevo Pedido">
      {error && <Alert type="error" message={error} />}
      
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Nuevo Pedido</h2>
        <p className="text-gray-600">Complete el formulario para crear un nuevo pedido a proveedor</p>
      </div>

      <PedidoForm 
        onSubmit={handleSubmit} 
        productos={productos}
        proveedores={proveedores}
        loading={loading}
      />
    </ContentLayout>
  );
};

export default PedidoCreatePage;