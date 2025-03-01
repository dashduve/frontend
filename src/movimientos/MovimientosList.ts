import React, { useState, useEffect } from 'react';
import { Table } from '../ui/Table';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { inventarioService } from '../../api/inventarioService';
import { MovimientoInventario } from '../../types/models';
import { useOffline } from '../../hooks/useOffline';

interface MovimientosListProps {
  onEdit?: (id: number) => void;
  onView?: (id: number) => void;
}

export const MovimientosList: React.FC<MovimientosListProps> = ({ onEdit, onView }) => {
  const [movimientos, setMovimientos] = useState<MovimientoInventario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isOffline } = useOffline();
  
  useEffect(() => {
    const fetchMovimientos = async () => {
      try {
        setLoading(true);
        const data = await inventarioService.getMovimientos();
        setMovimientos(data);
        setError(null);
      } catch (err) {
        setError('Error al cargar los movimientos de inventario');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovimientos();
  }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro que desea eliminar este movimiento?')) {
      try {
        await inventarioService.deleteMovimiento(id);
        setMovimientos(movimientos.filter(m => m.id_movimiento !== id));
      } catch (err) {
        setError('Error al eliminar el movimiento');
        console.error(err);
      }
    }
  };

  const columns = [
    { header: 'ID', accessor: 'id_movimiento' },
    { header: 'Producto', accessor: 'producto.nombre' },
    { header: 'Tipo', accessor: 'tipo_movimiento' },
    { header: 'Cantidad', accessor: 'cantidad' },
    { 
      header: 'Fecha',
      accessor: 'fecha_movimiento',
      cell: (value: string) => new Date(value).toLocaleString()
    },
    { header: 'Motivo', accessor: 'motivo' },
    { header: 'Costo', accessor: 'costo_unitario' },
    { 
      header: 'Acciones',
      accessor: 'id_movimiento',
      cell: (value: number) => (
        <div className="flex space-x-2">
          {onView && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onView(value)}
              disabled={isOffline}
            >
              Ver
            </Button>
          )}
          {onEdit && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onEdit(value)}
              disabled={isOffline}
            >
              Editar
            </Button>
          )}
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDelete(value)}
            disabled={isOffline}
          >
            Eliminar
          </Button>
        </div>
      )
    }
  ];

  if (loading) return <div className="text-center p-4">Cargando movimientos...</div>;

  return (
    <div className="space-y-4">
      {error && <Alert type="error" message={error} />}
      {isOffline && <Alert type="warning" message="Estás trabajando en modo offline. Algunas funciones pueden estar limitadas." />}
      
      {movimientos.length === 0 ? (
        <div className="text-center p-4">
          <p className="text-gray-500">No hay movimientos de inventario registrados</p>
        </div>
      ) : (
        <Table
          columns={columns}
          data={movimientos}
          onRowClick={(row) => onView && onView(row.id_movimiento)}
        />
      )}
    </div>
  );
};
