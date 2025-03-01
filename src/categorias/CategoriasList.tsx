import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAll, deleteOne } from '../../api/categoriasService';
import Table from '../ui/Table';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Alert from '../ui/Alert';
import Modal from '../ui/Modal';
import { useAuth } from '../../hooks/useAuth';
import { Categoria } from '../../types/models';
import { useOffline } from '../../hooks/useOffline';

const CategoriasList: React.FC = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [categoriaToDelete, setCategoriaToDelete] = useState<number | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const isOffline = useOffline();

  const fetchCategorias = async () => {
    try {
      setLoading(true);
      const data = await getAll();
      setCategorias(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar las categorías. Inténtelo de nuevo más tarde.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  const handleEdit = (id: number) => {
    navigate(`/categorias/editar/${id}`);
  };

  const handleDelete = async () => {
    if (categoriaToDelete) {
      try {
        await deleteOne(categoriaToDelete);
        fetchCategorias();
        setShowDeleteModal(false);
        setCategoriaToDelete(null);
      } catch (err) {
        setError('Error al eliminar la categoría. Inténtelo de nuevo más tarde.');
        console.error(err);
      }
    }
  };

  const confirmDelete = (id: number) => {
    setCategoriaToDelete(id);
    setShowDeleteModal(true);
  };

  const columns = [
    { header: 'ID', accessor: 'id_categoria' },
    { header: 'Nombre', accessor: 'nombre' },
    { header: 'Descripción', accessor: 'descripcion' },
    { header: 'Fecha Creación', accessor: 'fecha_creacion', cell: (value: string) => new Date(value).toLocaleDateString() },
    {
      header: 'Acciones',
      accessor: 'id_categoria',
      cell: (value: number) => (
        <div className="flex space-x-2">
          <Button onClick={() => handleEdit(value)} disabled={isOffline} variant="primary" size="sm">
            Editar
          </Button>
          <Button onClick={() => confirmDelete(value)} disabled={isOffline} variant="danger" size="sm">
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      
      <Card className="mb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Categorías</h2>
          <Button 
            onClick={() => navigate('/categorias/crear')} 
            disabled={isOffline}
            variant="success"
          >
            Nueva Categoría
          </Button>
        </div>
        
        {loading ? (
          <p>Cargando categorías...</p>
        ) : (
          <Table 
            columns={columns} 
            data={categorias} 
            emptyMessage="No hay categorías disponibles"
          />
        )}
      </Card>

      <Modal 
        isOpen={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)}
        title="Confirmar Eliminación"
      >
        <p>¿Está seguro de que desea eliminar esta categoría? Esta acción no se puede deshacer.</p>
        <div className="flex justify-end mt-4 space-x-2">
          <Button onClick={() => setShowDeleteModal(false)} variant="secondary">Cancelar</Button>
          <Button onClick={handleDelete} variant="danger">Eliminar</Button>
        </div>
      </Modal>
    </div>
  );
};

export default CategoriasList;

