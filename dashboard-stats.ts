import React from 'react';
import { Card } from '../../ui/Card';

interface StatsProps {
  stats: {
    totalProductos: number;
    valorInventario: number;
    productosEscasos: number;
    movimientosRecientes: number;
  };
  loading: boolean;
}

export const DashboardStats: React.FC<StatsProps> = ({ stats, loading }) => {
  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };

  const statItems = [
    {
      title: 'Total Productos',
      value: stats.totalProductos,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
        </svg>
      ),
      formatter: (val: number) => val.toString()
    },
    {
      title: 'Valor del Inventario',
      value: stats.valorInventario,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      formatter: formatCurrency
    },
    {
      title: 'Productos Escasos',
      value: stats.productosEscasos,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      formatter: (val: number) => val.toString()
    },
    {
      title: 'Movimientos Recientes',
      value: stats.movimientosRecientes,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      ),
      formatter: (val: number) => val.toString()
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((item, index) => (
        <Card key={index}>
          <div className="flex items-center p-4">
            <div className="rounded-full p-3 bg-gray-100">{item.icon}</div>
            <div className="ml-4">
              <h3 className="text-gray-500 text-sm font-medium">{item.title}</h3>
              {loading ? (
                <div className="h-6 w-24 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <p className="text-2xl font-semibold text-gray-900">{item.formatter(item.value)}</p>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
