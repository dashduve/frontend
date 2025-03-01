import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ContentLayout } from '../../components/layout/ContentLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAlerts } from '../../context/AlertsContext';

interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
  estado: 'activo' | 'inactivo';
  productosCount?: number;
}

export const CategoriasList = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlerts();
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const fetchCategorias = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/categorias');
      setCategorias(res.data);
    } catch (error) {
      showAlert('Error al cargar las categorías', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirmDelete === id) {
      try {
        await axios.delete(`/api/categorias/${id}`);
        showAlert('Categoría eliminada correctamente', 'success');
        fetchCategorias();
      } catch (error) {
        showAlert('Error al eliminar la categoría. Puede que tenga productos asociados.', 'error');
      }
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  const filteredCategorias = categorias.filter(categoria => 
    categoria.nombre.toLowerCase().includes(filterText.toLowerCase()) ||
    categoria.descripcion.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <ContentLayout title="Gestión de Categorías">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="w-full md:w-1/3">
          <Input
            placeholder="Buscar categorías..."
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
            icon="search"
          />
        </div>
        <Button onClick={() => navigate('/categorias/nueva')}>
          Nueva Categoría
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategorias.length > 0 ? (
            filteredCategorias.map(categoria => (
              <Card key={categoria.id} className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">{categoria.nombre}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    categoria.estado === 'activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {categoria.estado === 'activo' ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                <p className="text-gray-600 flex-grow mb-4">{categoria.descripcion}</p>
                {categoria.productosCount !== undefined && (
                  <p className="text-sm text-gray-500 mb-4">
                    {categoria.productosCount} productos asociados
                  </p>
                )}
                <div className="flex justify-end space-x-2 mt-auto">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/categorias/${categoria.id}`)}
                  >
                    Editar
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => handleDelete(categoria.id)}
                  >
                    {confirmDelete === categoria.id ? 'Confirmar' : 'Eliminar'}
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500">No se encontraron categorías.</p>
            </div>
          )}
        </div>
      )}
    </ContentLayout>
  );
};

export default CategoriasList;
