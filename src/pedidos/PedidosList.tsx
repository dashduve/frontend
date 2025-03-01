import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../ui/Table';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Alert from '../ui/Alert';
import { useFetch } from '../../hooks/useFetch';
import { pedidosService } from '../../api/pedidosService';
import { Pedido } from '../../types/models';
import { useOffline } from '../../hooks/useOffline';

const PedidosList: React.FC = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const navigate = useNavigate();
  const { isOffline } = useOffline();
  const { data, error, loading, fetchData } = useFetch<Pedido[]>();

  useEffect(() => {
    fetchData(pedidosService.getPedidos);
  }, [fetchData]);

  useEffect(() => {
    if (data) {
      setPedidos(data);
    }
  }, [data]);

  const handleVerDetalle = (id: number) => {
    navigate(`/pedidos/${id}`);
  };

  const handleNuevoPedido = () => {
    navigate('/pedidos/crear');
  };

  const actualizarEstadoPedido = async (id: number, estado: 'Pendiente' | 'Entregado' | 'Cancelado') => {
    try {
      await pedidosService.actualizarEstado(id, estado);
      fetchData(pedidosService.getPedidos);
    } catch (error) {
      console.error('Error al actualizar estado del pedido:', error);
    }
  };

  const columns = [
    { header: 'ID', accessor: 'id_pedido' },
    { header: 'Fecha Solicitud', accessor: 'fecha_solicitud', cell: (value: string) => new Date(value).toLocaleDateString() },
    { header: 'Fecha Entrega', accessor: 'fecha_entrega', cell: (value: string) => value ? new Date(value).toLocaleDateString() : 'Pendiente' },
    { 
      header: 'Estado', 
      accessor: 'estado',
      cell: (value: string) => {
        const colorMap: Record<string, string> = {
          'Pendiente': 'bg-yellow-100 text-yellow-800',
          'Entregado': 'bg-green-100 text-green-800',
          'Cancelado': 'bg-red-100 text-red-800'
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${colorMap[value]}`}>
            {value}
          </span>
        );
      }
    },
    { header: 'Total Productos', accessor: 'total_productos' },
    { header: 'Valor Total', accessor: 'valor_total', cell: (value: number) => `$${value.toFixed(2)}` },
    {
      header: 'Acciones',
      accessor: 'id_pedido',
      cell: (value: number, row: Pedido) => (
        <div className="flex space-x-2">
          <Button onClick={() => handleVerDetalle(value)} variant="secondary" size="sm">
            Ver Detalle
          </Button>
          {row.estado === 'Pendiente' && (
            <>
              <Button onClick={() => actualizarEstadoPedido(value, 'Entregado')} variant="success" size="sm">
                Marcar Entregado
              </Button>
              <Button onClick={() => actualizarEstadoPedido(value, 'Cancelado')} variant="danger" size="sm">
                Cancelar
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  if (loading) return <div className="text-center p-4">Cargando pedidos...</div>;

  if (error) return <Alert type="error" message={`Error al cargar pedidos: ${error}`} />;

  if (isOffline) {
    return (
      <Alert type="warning" message="Estás trabajando en modo sin conexión. Algunas funciones pueden estar limitadas." />
    );
  }

  return (
    <Card>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Pedidos</h2>
          <Button onClick={handleNuevoPedido} variant="primary">
            Nuevo Pedido
          </Button>
        </div>
        
        {pedidos.length === 0 ? (
          <Alert type="info" message="No hay pedidos disponibles." />
        ) : (
          <Table data={pedidos} columns={columns} />
        )}
      </div>
    </Card>
  );
};

export default PedidosList;