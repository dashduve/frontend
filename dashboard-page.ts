import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { ContentLayout } from '../../components/layout/ContentLayout';
import { Card } from '../../components/ui/Card';
import { DashboardStats } from '../../components/dashboards/DashboardStats';
import { InventarioResumen } from '../../components/dashboards/InventarioResumen';
import { AlertasList } from '../../components/alertas/AlertasList';
import { inventarioService } from '../../api/inventarioService';
import { alertasService } from '../../api/alertasService';
import { productosService } from '../../api/productosService';
import { Alert } from '../../components/ui/Alert';
import { useWebSocket } from '../../hooks/useWebSocket';
import { useOffline } from '../../hooks/useOffline';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { isOffline } = useOffline();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalProductos: 0,
    valorInventario: 0,
    productosEscasos: 0,
    movimientosRecientes: 0
  });
  const [alertas, setAlertas] = useState([]);
  const [productosPopulares, setProductosPopulares] = useState([]);
  
  // Configurar WebSocket para alertas en tiempo real
  const { lastMessage } = useWebSocket('alertas');
  
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Obtener estadísticas generales
        const statsData = await inventarioService.getEstadisticas();
        setStats(statsData);
        
        // Obtener alertas activas
        const alertasData = await alertasService.getAlertasActivas();
        setAlertas(alertasData);
        
        // Obtener productos más movidos
        const productosData = await productosService.getProductosPopulares();
        setProductosPopulares(productosData);
        
        setLoading(false);
      } catch (err) {
        setError('Error al cargar los datos del dashboard');
        setLoading(false);
        console.error(err);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  // Actualizar alertas cuando llega un mensaje WebSocket
  useEffect(() => {
    if (lastMessage) {
      try {
        const newAlerta = JSON.parse(lastMessage.data);
        setAlertas(prevAlertas => [newAlerta, ...prevAlertas]);
      } catch (err) {
        console.error('Error al procesar alerta en tiempo real', err);
      }
    }
  }, [lastMessage]);
  
  return (
    <ContentLayout title="Dashboard">
      {isOffline && (
        <Alert 
          type="warning" 
          message="Estás trabajando en modo offline. Algunos datos pueden no estar actualizados." 
        />
      )}
      
      {error && (
        <Alert 
          type="error" 
          message={error} 
          onClose={() => setError(null)} 
        />
      )}
      
      <DashboardStats 
        stats={stats} 
        loading={loading} 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card title="Resumen de Inventario">
          <InventarioResumen 
            productosPopulares={productosPopulares}
            loading={loading}
          />
        </Card>
        
        <Card title="Alertas de Stock">
          <AlertasList 
            alertas={alertas} 
            loading={loading}
            compact={true}
          />
        </Card>
      </div>
    </ContentLayout>
  );
};

export default DashboardPage;
