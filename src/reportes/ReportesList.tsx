import React, { useState, useEffect } from 'react';
import { Table } from '../ui/Table';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Alert } from '../ui/Alert';
import { useFetch } from '../../hooks/useFetch';
import { reportesService } from '../../api/reportesService';
import { Reporte } from '../../types/models';

const ReportesList: React.FC = () => {
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [error, setError] = useState<string | null>(null);
  const { fetchData, loading } = useFetch();

  useEffect(() => {
    const loadReportes = async () => {
      try {
        const response = await fetchData(() => reportesService.getReportes());
        setReportes(response.data);
      } catch (err) {
        setError('Error al cargar los reportes');
        console.error(err);
      }
    };

    loadReportes();
  }, [fetchData]);

  const handleDownload = async (idReporte: number) => {
    try {
      await reportesService.downloadReporte(idReporte);
    } catch (err) {
      setError('Error al descargar el reporte');
      console.error(err);
    }
  };

  const handleDelete = async (idReporte: number) => {
    if (window.confirm('¿Está seguro que desea eliminar este reporte?')) {
      try {
        await fetchData(() => reportesService.deleteReporte(idReporte));
        setReportes(reportes.filter(reporte => reporte.idReporte !== idReporte));
      } catch (err) {
        setError('Error al eliminar el reporte');
        console.error(err);
      }
    }
  };

  const columns = [
    {
      header: 'ID',
      accessor: 'idReporte',
    },
    {
      header: 'Tipo',
      accessor: 'tipo',
      cell: (value: string) => {
        let badge = '';
        switch (value) {
          case 'Inventario':
            badge = 'bg-primary';
            break;
          case 'Ventas':
            badge = 'bg-success';
            break;
          case 'Perdidas':
            badge = 'bg-danger';
            break;
          default:
            badge = 'bg-secondary';
        }
        return <span className={`badge ${badge}`}>{value}</span>;
      },
    },
    {
      header: 'Fecha Generación',
      accessor: 'fechaGeneracion',
      cell: (value: string) => new Date(value).toLocaleString(),
    },
    {
      header: 'Generado por',
      accessor: 'usuario.nombreCompleto',
    },
    {
      header: 'Acciones',
      cell: (_: any, row: Reporte) => (
        <div className="d-flex gap-2">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => handleDownload(row.idReporte)}
          >
            <i className="bi bi-download"></i> Descargar
          </Button>
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => handleDelete(row.idReporte)}
          >
            <i className="bi bi-trash"></i>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <Card>
      <Card.Header>
        <h5>Reportes Generados</h5>
      </Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Table
          columns={columns}
          data={reportes}
          loading={loading}
          emptyMessage="No hay reportes generados"
        />
      </Card.Body>
    </Card>
  );
};

export default ReportesList;