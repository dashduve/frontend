import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Table } from '../ui/Table';
import { Alert } from '../ui/Alert';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { useFetch } from '../../hooks/useFetch';
import { inventarioService } from '../../api/inventarioService';
import { Producto } from '../../types/models';

const StockActual: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [filteredProductos, setFilteredProductos] = useState<Producto[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { fetchData, loading } = useFetch();

  useEffect(() => {
    const cargarStock = async () => {
      try {
        const response = await fetchData(() => inventarioService.getStockActual());
        setProductos(response.data);
        setFilteredProductos(response.data);
      } catch (err) {
        setError('Error al cargar el inventario actual');
        console.error(err);
      }
    };

    cargarStock();
  }, [fetchData]);

  useEffect(() => {
    // Filtrar productos cuando cambie la búsqueda o categoría
    let filtered = [...productos];
    
    if (busqueda) {
      const searchTerm = busqueda.toLowerCase();
      filtered = filtered.filter(
        p => p.nombre.toLowerCase().includes(searchTerm) || 
             p.codigoBarras?.toLowerCase().includes(searchTerm)
      );
    }
    
    if (filtroCategoria && filtroCategoria !== 'todas') {
      filtered = filtered.filter(p => p.idCategoria === parseInt(filtroCategoria));
    }
    
    setFilteredProductos(filtered);
  }, [busqueda, filtroCategoria, productos]);

  // Obtener categorías únicas para el filtro
  const categorias = Array.from(new Set(productos.map(p => p.categoria?.nombre)))
    .filter(Boolean)
    .sort();

  // Función para determinar el color según el nivel de stock
  const getStockStatusColor = (producto: Producto) => {
    if (!producto.stockActual) return 'text-secondary';
    if (producto.stockActual <= producto.stockMinimo) return 'text-danger';
    if (producto.stockActual <= producto.stockMinimo * 1.5) return 'text-warning';
    return 'text-success';
  };

  const columns = [
    {
      header: 'Código',
      accessor: 'codigoBarras',
    },
    {
      header: 'Producto',
      accessor: 'nombre',
    },
    {
      header: 'Categoría',
      accessor: 'categoria.nombre',
    },
    {
      header: 'Stock Actual',
      accessor: 'stockActual',
      cell: (value: number, row: Producto) => (
        <span className={getStockStatusColor(row)}>
          {value} {row.stockActual <= row.stockMinimo && '⚠️'}
        </span>
      ),
    },
    {
      header: 'Stock Mínimo',
      accessor: 'stockMinimo',
    },
    {
      header: 'Stock Máximo',
      accessor: 'stockMaximo',
    },
    {
      header: 'Último Movimiento',
      accessor: 'ultimaActualizacion',
      cell: (value: string) => value ? new Date(value).toLocaleString() : 'Sin movimientos',
    }
  ];

  return (
    <Card>
      <Card.Header>
        <h5>Inventario Actual</h5>
      </Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <div className="row mb-3">
          <div className="col-md-6">
            <Input
              type="text"
              placeholder="Buscar por nombre o código"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
            >
              <option value="todas">Todas las categorías</option>
              {categorias.map((cat, index) => (
                <option key={index} value={index + 1}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <Button
              variant="outline-secondary"
              onClick={() => {
                setBusqueda('');
                setFiltroCategoria('');
              }}
            >
              Limpiar
            </Button>
          </div>
        </div>
        
        <div className="mb-3">
          <div className="d-flex justify-content-end">
            <span className="me-3">
              <span className="text-danger">⚠️</span> Stock crítico
            </span>
            <span className="me-3">
              <span className="text-warning">■</span> Stock bajo
            </span>
            <span>
              <span className="text-success">■</span> Stock normal
            </span>
          </div>
        </div>
        
        <Table
          columns={columns}
          data={filteredProductos}
          loading={loading}
          emptyMessage="No hay productos en el inventario"
        />
      </Card.Body>
    </Card>
  );
};

export default StockActual;