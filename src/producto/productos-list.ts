import React from 'react';
import { Table } from '../../ui/Table';
import { Button } from '../../ui/Button';
import { ProductoModel } from '../../../types/models';

interface ProductosListProps {
  productos: ProductoModel[];
  loading: boolean;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const ProductosList: React.FC<ProductosListProps> = ({
  productos,
  loading,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  onPageChange
}) => {
  const columns = [
    {
      header: 'Código',
      accessor: 'codigo_barras',
      cell: (row: ProductoModel) => (
        <div className="text-sm font-medium text-gray-900">
          {row.codigo_barras || '-'}
        </div>
      )
    },
    {
      header: 'Nombre',
      accessor: 'nombre',
      cell: (row: ProductoModel) => (
        <div>
          <div className="text-sm font-medium text-gray-900">{row.nombre}</div>
          {row.descripcion && (
            <div className="text-sm text-gray-500 truncate max-w-xs">{row.descripcion}</div>
          )}
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
      header: 'Stock',
      accessor: 'stock_actual',
      cell: (row: ProductoModel) => {
        const stockLevel = 
          row.stock_actual <= row.stock_minimo ? 'bg-red-100 text-red-800' :
          row.stock_actual >= row.stock_maximo ? 'bg-green-100 text-green-800' : 
          'bg-yellow-100 text-yellow-800';
        
        return (
          <div>
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${stockLevel}`}>
              {row.stock_actual}
            </span>
            <div className="text-xs text-gray-500 mt-1">
              Min: {row.stock_minimo} / Max: {row.stock_maximo}
            </div>
          </div>
        );
      }
    },
    {
      header: 'Precios',
      accessor: 'precio_venta',
      cell: (row: ProductoModel) => {
        const formatPrice = (price: number) => {
          return new Intl.NumberFormat('es-ES', {
            style: 'currency',
            currency: 'EUR'
          }).format(price);
        };
        
        return (
          <div>
            <div className="text-sm text-gray-900">Venta: {formatPrice(row.precio_venta)}</div>
            <div className="text-xs text-gray-500">Compra: {formatPrice(row.precio_compra)}</div>
          </div>
        );
      }
    },
    {
      header: 'Acciones',
      accessor: 'id_producto',
      cell: (row: ProductoModel) => (
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEdit(row.id_producto)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </Button>
          <Button 
            variant="danger" 
            size="sm"
            onClick={() => onDelete(row.id_producto)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </Button>
        </div>
      )
    }
  ];

  const loadingState = (
    <div className="text-center py-12">
      <svg className="animate-spin h-12 w-12 text-primary mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p className="mt-4 text-gray-600">Cargando productos...</p>
    </div>
  );

  const emptyState = (
    <div className="text-center py-12 bg-white rounded-lg shadow">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
      </svg>
      <h3 className="mt-4 text-lg font-medium text-gray-900">No hay productos</h3>
      <p className="mt-1 text-gray-500">No se encontraron productos en el inventario.</p>
    </div>
  );

  const renderPagination = () => {
    return (
      <div className="flex justify-between items-center mt-4">
        <div className="text-sm text-gray-700">
          Mostrando página <span className="font-medium">{currentPage}</span> de{' '}
          <span className="font-medium">{totalPages}</span>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </Button>
        </div>
      </div>
    );
  };

  if (loading) {
    return loadingState;
  }

  if (productos.length === 0) {
    return emptyState;
  }

  return (
    <div>
      <Table 
        columns={columns}
        data={productos}
        pagination={false}
      />
      {totalPages > 1 && renderPagination()}
    </div>
  );
};
