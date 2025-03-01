
import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { AlertsContext } from '../context/AlertsContext';
import ContentLayout from '../components/layout/ContentLayout';
import Card from '../components/ui/Card';
import { FaBoxOpen, FaShoppingCart, FaExclamationTriangle, FaChartLine } from 'react-icons/fa';

interface DashboardStats {
  totalProductos: number;
  totalVentas: number;
  ventasMes: number;
  stockBajo: number;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProductos: 0,
    totalVentas: 0,
    ventasMes: 0,
    stockBajo: 0
  });
  const [loading, setLoading] = useState(true);
  
  const { user } = useContext(AuthContext);
  const { showAlert } = useContext(AlertsContext);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Simulación de llamada a API
        // En producción, esto sería un fetch real a tu backend
        setTimeout(() => {
          setStats({
            totalProductos: 145,
            totalVentas: 32,
            ventasMes: 12500,
            stockBajo: 8
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        showAlert('Error al cargar datos del dashboard', 'error');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [showAlert]);

  const StatCard = ({ title, value, icon, color }: { title: string; value: number | string; icon: React.ReactNode; color: string }) => (
    <Card className={`p-6 flex items-center ${color}`}>
      <div className="p-3 rounded-full bg-white bg-opacity-30 mr-4">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-white text-opacity-80">{title}</p>
        <h3 className="text-2xl font-bold text-white">{value}</h3>
      </div>
    </Card>
  );

  if (loading) {
    return (
      <ContentLayout title="Dashboard">
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Productos"
          value={stats.totalProductos}
          icon={<FaBoxOpen className="text-white" size={24} />}
          color="bg-blue-500"
        />
        <StatCard
          title="Ventas Realizadas"
          value={stats.totalVentas}
          icon={<FaShoppingCart className="text-white" size={24} />}
          color="bg-green-500"
        />
        <StatCard
          title="Ventas del Mes"
          value={`$${stats.ventasMes.toLocaleString()}`}
          icon={<FaChartLine className="text-white" size={24} />}
          color="bg-purple-500"
        />
        <StatCard
          title="Productos con Stock Bajo"
          value={stats.stockBajo}
          icon={<FaExclamationTriangle className="text-white" size={24} />}
          color="bg-red-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Actividad Reciente</h2>
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-400 rounded-full mr-3"></div>
              <div>
                <p className="text-sm font-medium">Nueva venta registrada</p>
                <p className="text-xs text-gray-500">Hace 2 horas</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
              <div>
                <p className="text-sm font-medium">Producto actualizado: Laptop HP</p>
                <p className="text-xs text-gray-500">Hace 5 horas</p>
              </div>
            </div>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-400 rounded-full mr-3"></div>
              <div>
                <p className="text-sm font-medium">Stock bajo: Impresora Canon</p>
                <p className="text-xs text-gray-500">Hace 1 día</p>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Productos Más Vendidos</h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Laptop Dell XPS</span>
              <span className="text-sm bg-blue-100 text-blue-800 py-1 px-2 rounded">32 unidades</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Monitor Samsung 27"</span>
              <span className="text-sm bg-blue-100 text-blue-800 py-1 px-2 rounded">28 unidades</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Teclado Mecánico Logitech</span>
              <span className="text-sm bg-blue-100 text-blue-800 py-1 px-2 rounded">25 unidades</span>
            </div>
          </div>
        </Card>
      </div>
    </ContentLayout>
  );
};

export default Dashboard;
