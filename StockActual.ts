import React, { useState, useEffect } from 'react';
import { Table } from '../ui/Table';
import { Alert } from '../ui/Alert';
import { Card } from '../ui/Card';
import { inventarioService } from '../../api/inventarioService';
import { Producto } from '../../types/models';
import { useOffline } from '../../hooks/useOffline';

interface StockActualProps {
  onProductSelect?: (productId: number) => void;
  showLowStock?: boolean;
}

export const StockActual: React.FC<StockActualProps> = ({ 
  onProductSelect,
  showLowStock = false
}) => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { isOffline } = useOffline();

  useEffect(() => {
    const fetchStock = async () => {
      try {
        setLoading(true);
        let data;
        
        if (showLowStock) {
          data = await inventarioService.getProductosBajoStock();
        } else {
          data = await inventarioService.getStockActual();
        }
        
        setProductos(data);
        setError(null);
      } catch (err) {
        setError('Error al cargar la información de stock');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStock();
  }, [showLowStock]);

  const getStockStatusClass = (producto: Producto): string => {
    const stockActual = producto.stock_actual || 0;
    
    if (stockActual <= producto.stock_minimo) {
      return 'text-red-600 font-bold';
    } else if (stockActual <= producto.stock_minimo * 1.5) {
      return 'text-yellow-600 font-bold';
    }
    return 'text-green-600';
  };

  const columns = [
    { header: 'Código', accessor: 'codigo_barras' },
    { header: 'Producto', accessor: 'nombre' },
    { header: 'Categoría', accessor: 'categoria.nombre' },
    { 
      header: 'Stock Actual', 
      accessor: 'stock_actual',
      cell: (value: number, row: Producto) => (
        <span className={getStockStatusClass(row)}>
          {value || 0}
        </span>
      )
    },
    { header: 'Stock Mínimo', accessor: 'stock_minimo' },
    { header: 'Stock Máximo', accessor: 'stock_maximo' },
    { 
      header: 'Última Actualización', 
      accessor: 'ultima_actualizacion',
      cell: (value: string) => value ? new Date(value).toLocaleString() : 'N/A'
    }
  ];

  if (loading) return <div className="text-center p-4">Cargando inventario...</div>;

  return (
    <Card className="overflow-hidden">
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4">
          {showLowStock ? 'Productos con Bajo Stock' : 'Stock Actual de Productos'}
        </h2>
        
        {error && <Alert type="error" message={error} />}
        {isOffline && <Alert type="warning" message="Estás trabajando en modo offline. Los datos pueden no estar actualizados." />}
        
        {productos.length === 0 ? (
          <div className="text-center p-4">
            <p className="text-gray-500">
              {showLowStock 
                ? 'No hay productos con bajo stock actualmente'
                : 'No hay productos en el inventario'}
            </p>
          </div>
        ) : (
          <Table
            columns={columns}
            data={productos}
            onRowClick={row => onProductSelect && onProductSelect(row.id_producto)}
          />
        )}
      </div>
    </Card>
  );
};
