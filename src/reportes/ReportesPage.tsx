import React, { useState } from 'react';
import { ContentLayout } from '../components/layout/ContentLayout';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Alert } from '../components/ui/Alert';
import ReportesList from '../components/reportes/ReportesList';
import ReporteForm from '../components/reportes/ReporteForm';
import { useFetch } from '../hooks/useFetch';
import { reportesService } from '../api/reportesService';

const ReportesPage: React.FC = () => {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { fetchData, loading } = useFetch();

  const generarReporteRapido = async (tipo: string) => {
    setError(null);
    setSuccess(null);
    try {
      await fetchData(() => 
        reportesService.generateReporte({
          tipo,
          formato: 'PDF'
        })
      );
      setSuccess(`Reporte de ${tipo} generado correctamente`);
      setMostrarFormulario(false);
      // Recargar la lista de reportes
      window.location.reload();
    } catch (err: any) {
      setError(err.message || `Error al generar el reporte de ${tipo}`);
    }
  };

  return (
    <ContentLayout title="Gestión de Reportes">
      <div className="row mb-4">
        <div className="col-md-12">
          <Card>
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Reportes</h5>
                <Button 
                  variant="primary" 
                  onClick={() => setMostrarFormulario(!mostrarFormulario)}
                >
                  {mostrarFormulario ? 'Cancelar' : 'Nuevo Reporte Personalizado'}
                </Button>
              </div>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              
              {mostrarFormulario ? (
                <ReporteForm onCancel={() => setMostrarFormulario(false)} />
              ) : (
                <div className="mb-4">
                  <div className="row g-3">
                    <div className="col-md-4">
                      <Card>
                        <Card.Body className="text-center">
                          <h5>Reporte de Inventario</h5>
                          <p>Genera un reporte con el estado actual del inventario</p>
                          <Button 
                            variant="outline-primary" 
                            onClick={() => generarReporteRapido('Inventario')}
                            disabled={loading}
                          >
                            {loading ? 'Generando...' : 'Generar Reporte'}
                          </Button>
                        </Card.Body>
                      </Card>
                    </div>
                    <div className="col-md-4">
                      <Card>
                        <Card.Body className="text-center">
                          <h5>Reporte de Movimientos</h5>
                          <p>Genera un reporte con los movimientos del último mes</p>
                          <Button 
                            variant="outline-success" 
                            onClick={() => generarReporteRapido('Movimientos')}
                            disabled={loading}
                          >
                            {loading ? 'Generando...' : 'Generar Reporte'}
                          </Button>
                        </Card.Body>
                      </Card>
                    </div>
                    <div className="col-md-4">
                      <Card>
                        <Card.Body className="text-center">
                          <h5>Reporte de Alertas</h5>
                          <p>Genera un reporte con las alertas de stock mínimo</p>
                          <Button 
                            variant="outline-danger" 
                            onClick={() => generarReporteRapido('Alertas')}
                            disabled={loading}
                          >
                            {loading ? 'Generando...' : 'Generar Reporte'}
                          </Button>
                        </Card.Body>
                      </Card>
                    </div>
                  </div>
                </div>
              )}
              
              <ReportesList />
            </Card.Body>
          </Card>
        </div>
      </div>
    </ContentLayout>
  );
};

export default ReportesPage;