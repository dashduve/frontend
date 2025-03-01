import React from 'react';
import { Table } from '../../ui/Table';
import { ProductoModel } from '../../../types/models';

interface InventarioResumenProps {
  productosPopulares: ProductoModel[];
  loading: boolean;
}

export const InventarioResumen: React.FC<InventarioResumenProps> = ({ productosPopulares, loading }) => {
  const columns = [
    {
      header: 'Producto',
      accessor: 'nombre',
      cell: (row: ProductoModel) => (
        <div className="flex items-center">
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">{row.nombre}</div>
            <div className="text-sm text-gray-500">{row.codigo_barras || '-'}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Categoría',
      accessor: 'categoria.nombre',
      cell: (row: ProductoModel) => (
        <div className="text-sm text-gray-900">{row.categoria?.nombre || '-'}</div>
      )
    },
    {
      header: 'Stock Actual',
      accessor: 'stock_actual',
      cell: (row: ProductoModel) => {
        const stockLevel = 
          row.stock_actual <= row.stock_minimo ? 'bg-red-100 text-red-800' :
          row.stock_actual >= row.stock_maximo ? 'bg-green-100 text-green-800' : 
          'bg-yellow-100 text-yellow-800';
        
        return (
          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${stockLevel}`}>
            {row.stock_actual}
          </span>
        );
      }
    },
    {
      header: 'Valor',
      accessor: 'valor_total',
      cell: (row: ProductoModel) => {
        const valorTotal = row.stock_actual * row.precio_venta;
        return (
          <div className="text-sm text-gray-900">
            {new Intl.NumberFormat('es-ES', {
              style: 'currency',
              currency: 'EUR'
            }).format(valorTotal)}
          </div>
        );
      }
    }
  ];

  const loadingState = (
    <div className="text-center py-6">
      <svg className="animate-spin h-8 w-8 text-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p className="mt-2 text-gray-600">Cargando productos...</p>
    </div>
  );

  const emptyState = (
    <div className="text-center py-6">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
      </svg>
      <p className="mt-2 text-gray-600">No hay productos en el inventario</p>
    </div>
  );

  return (
    <div>
      {loading ? (
        loadingState
      ) : productosPopulares.length === 0 ? (
        emptyState
      ) : (
        <>
          <Table 
            columns={columns}
            data={productosPopulares}
            pagination={false}
          />
          <div className="mt-4 text-right">
            <a 
              href="/productos" 
              className="text-primary text-sm font-medium hover:text-primary-dark"
            >
              Ver todos los productos →
            </a>
          </div>
        </>
      )}
    </div>
  );
};
