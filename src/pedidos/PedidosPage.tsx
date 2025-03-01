import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ContentLayout from '../components/layout/ContentLayout';
import PedidosList from '../components/pedidos/PedidosList';
import Button from '../components/ui/Button';
import { Pedido } from '../types/models';
import { pedidosService } from '../api/pedidosService';
import Alert from '../components/ui/Alert';

const PedidosPage: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        setLoading(true);
        const data = await pedidosService.getPedidos();
        setPedidos(data);
        setError(null);
      } catch (err) {
        setError('Error al cargar los pedidos. Por favor, intente nuevamente.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, []);

  const handleStatusChange = async (id: number, newStatus: 'Pendiente' | 'Entregado' | 'Cancelado') => {
    try {
      await pedidosService.updatePedidoStatus(id, newStatus);
      setPedidos(pedidos.map(pedido => 
        pedido.id_pedido === id ? { ...pedido, estado: newStatus } : pedido
      ));
    } catch (err) {
      setError('Error al actualizar el estado del pedido.');
      console.error(err);
    }
  };

  return (
    <ContentLayout title="Gestión de Pedidos">
      {error && <Alert type="error" message={error} />}
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Listado de Pedidos</h2>
          <p className="text-gray-600">Gestione sus pedidos a proveedores</p>
        </div>
        <Link to="/pedidos/nuevo">
          <Button type="primary">Nuevo Pedido</Button>
        </Link>
      </div>

      <PedidosList 
        pedidos={pedidos} 
        loading={loading} 
        onStatusChange={handleStatusChange} 
      />
    </ContentLayout>
  );
};

export default PedidosPage;