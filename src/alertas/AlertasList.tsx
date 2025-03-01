import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../ui/Table';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Alert from '../ui/Alert';
import { useFetch } from '../../hooks/useFetch';
import { alertasService } from '../../api/alertasService';
import { Alerta } from '../../types/models';
import { useOffline } from '../../hooks/useOffline';

const AlertasList: React.FC = () => {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const navigate = useNavigate();
  const { isOffline } = useOffline();
  const { data, error, loading, fetchData } = useFetch<Alerta[]>();

  useEffect(() => {
    fetchData(alertasService.getAlertas);
  }, [fetchData]);

  useEffect(() => {
    if (data) {
      setAlertas(data);
    }
  }, [data]);

  const handleVerDetalle = (id: number) => {
    navigate(`/alertas/${id}`);
  };

  const marcarComoResuelta = async (id: number) => {
    try {
      await alertasService.marcarComoResuelta(id);
      // Actualizar la lista de alertas
      fetchData(alertasService.getAlertas);
    } catch (error) {
      console.error('Error al marcar alerta como resuelta:', error);
    }
  };

  const columns = [
    { header: 'ID', accessor: 'id_alerta' },
    { header: 'Producto', accessor: 'producto.nombre' },
    { header: 'Nivel Mínimo', accessor: 'nivel_minimo' },
    { header: 'Stock Actual', accessor: 'stock_actual' },
    { header: 'Estado', accessor: 'estado' },
    { header: 'Fecha', accessor: 'fecha_creacion', cell: (value: string) => new Date(value).toLocaleDateString() },
    {
      header: 'Acciones',
      accessor: 'id_alerta',
      cell: (value: number) => (
        <div className="flex space-x-2">
          <Button onClick={() => handleVerDetalle(value)} variant="secondary" size="sm">
            Ver Detalle
          </Button>
          <Button onClick={() => marcarComoResuelta(value)} variant="success" size="sm">
            Marcar Resuelta
          </Button>
        </div>
      ),
    },
  ];

  if (loading) return <div className="text-center p-4">Cargando alertas...</div>;

  if (error) return <Alert type="error" message={`Error al cargar alertas: ${error}`} />;

  if (isOffline) {
    return (
      <Alert type="warning" message="Estás trabajando en modo sin conexión. Algunas funciones pueden estar limitadas." />
    );
  }

  return (
    <Card>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">Alertas de Stock</h2>
        {alertas.length === 0 ? (
          <Alert type="info" message="No hay alertas disponibles." />
        ) : (
          <Table data={alertas} columns={columns} />
        )}
      </div>
    </Card>
  );
};

export default AlertasList;