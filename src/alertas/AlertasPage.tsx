import React, { useEffect, useState } from 'react';
import ContentLayout from '../components/layout/ContentLayout';
import AlertasList from '../components/alertas/AlertasList';
import { Alert } from '../types/models';
import { useAlerts } from '../context/AlertsContext';
import { alertasService } from '../api/alertasService';
import Alert from '../components/ui/Alert';

const AlertasPage: React.FC = () => {
  const [alertas, setAlertas] = useState<Alert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { markAsRead } = useAlerts();

  useEffect(() => {
    const fetchAlertas = async () => {
      try {
        setLoading(true);
        const data = await alertasService.getAlertas();
        setAlertas(data);
        setError(null);
      } catch (err) {
        setError('Error al cargar las alertas. Por favor, intente nuevamente.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlertas();
  }, []);

  const handleMarkAsRead = async (id: number) => {
    try {
      await alertasService.markAsRead(id);
      markAsRead(id);
      setAlertas(alertas.map(alerta => 
        alerta.id_alerta === id ? { ...alerta, estado: 'Inactivo' } : alerta
      ));
    } catch (err) {
      setError('Error al marcar la alerta como leída.');
      console.error(err);
    }
  };

  return (
    <ContentLayout title="Alertas de Stock">
      {error && <Alert type="error" message={error} />}
      
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Alertas activas</h2>
        <p className="text-gray-600">Gestione las alertas de stock bajo mínimo y otros avisos importantes.</p>
      </div>

      <AlertasList 
        alertas={alertas} 
        loading={loading} 
        onMarkAsRead={handleMarkAsRead} 
      />
    </ContentLayout>
  );
};

export default AlertasPage;