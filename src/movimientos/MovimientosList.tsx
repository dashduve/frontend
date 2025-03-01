import React, { useState, useEffect } from 'react';
import { Table } from '../ui/Table';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Alert } from '../ui/Alert';
import { useFetch } from '../../hooks/useFetch';
import { inventarioService } from '../../api/inventarioService';
import { Movimiento } from '../../types/models';
import { useNavigate } from 'react-router-dom';

interface MovimientosListProps {
  filtroProducto?: number;
  filtroTipo?: string;
  limitarResultados?: number;
}

const MovimientosList: React.FC<MovimientosListProps> = ({ 
  filtroProducto, 
  filtroTipo, 
  limitarResultados 
}) => {
  const navigate = useNavigate();
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { fetchData, loading } = useFetch();

  useEffect(() => {
    const loadMovimientos = async () => {
      try {
        const params: Record<string, any> = {};
        if (filtroProducto) params.idProducto = filtroProducto;
        if (filtroTipo) params.tipoMovimiento = filtroTipo;
        if (limitarResultados) params.limit = limitarResultados;

        const response = await fetchData(() => 
          inventarioService.getMovimientos(params)
        );
        setMovimientos(response.data);
      } catch (err) {
        setError('Error al cargar los movimientos de inventario');
        console.error(err);
      }
    };

    loadMovimientos();
  }, [fetchData, filtroProducto, filtroTipo, limitarResultados]);

  const handleView = (id: number) => {
    navigate(`/inventario/movimientos/${id}`);
  };

  const columns = [
    {
      header: 'ID',
      accessor: 'idMovimiento',
    },
    {
      header: 'Producto',
      accessor: 'producto.nombre',
    },
    {
      header: 'Tipo',
      accessor: 'tipoMovimiento',
      cell: (value: string) => (
        <span className={`badge ${value === 'Entrada' ? 'bg-success' : value === 'Salida' ? 'bg-danger' : 'bg-warning'}`}>
          {value}
        </span>
      ),
    },
    {
      header: 'Cantidad',
      accessor: 'cantidad',
    },
    {
      header: 'Fecha',
      accessor: 'fechaMovimiento',
      cell: (value: string) => new Date(value).toLocaleString(),
    },
    {
      header: 'Usuario',
      accessor: 'usuario.nombreCompleto',
    },
    {
      header: 'Acciones',
      cell: (_: any, row: Movimiento) => (
        <Button onClick={() => handleView(row.idMovimiento)} variant="outline-primary" size="sm">
          Ver detalles
        </Button>
      ),
    },
  ];

  return (
    <Card>
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Movimientos de Inventario</h5>
          <Button onClick={() => navigate('/inventario/movimientos/nuevo')} variant="primary">
            Nuevo Movimiento
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Table 
          columns={columns} 
          data={movimientos} 
          loading={loading}
          emptyMessage="No hay movimientos de inventario para mostrar"
        />
      </Card.Body>
    </Card>
  );
};

export default MovimientosList;