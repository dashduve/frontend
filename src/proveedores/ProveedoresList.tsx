import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAll, deleteOne } from '../../api/proveedoresService';
import Table from '../ui/Table';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Alert from '../ui/Alert';
import Modal from '../ui/Modal';
import { useAuth } from '../../hooks/useAuth';
import { Proveedor } from '../../types/models';
import { useOffline } from '../../hooks/useOffline';

const ProveedoresList: React.FC = () => {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [proveedorToDelete, setProveedorToDelete] = useState<number | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const isOffline = useOffline();

  const fetchProveedores = async () => {
    try {
      setLoading(true);
      const data = await getAll();
      setProveedores(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar los proveedores. Inténtelo de nuevo más tarde.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  const handleEdit = (id: number) => {
    navigate(`/proveedores/editar/${id}`);
  };

  const handleDelete = async () => {
    if (proveedorToDelete) {
      try {
        await deleteOne(proveedorToDelete);
        fetchProveedores();
        setShowDeleteModal(false);
        setProveedorToDelete(null);
      } catch (err) {
        setError('Error al eliminar el proveedor. Inténtelo de nuevo más tarde.');
        console.error(err);
      }
    }
  };

  const confirmDelete = (id: number) => {
    setProveedorToDelete(id);
    setShowDeleteModal(true);
  };

  const columns = [
    { header: 'ID', accessor: 'id_proveedor' },
    { header: 'Nombre', accessor: 'nombre' },
    { header: 'Contacto', accessor: 'contacto' },
    { header: 'Teléfono', accessor: 'telefono' },
    { header: 'Email', accessor: 'email' },
    { header: 'Dirección', accessor: 'direccion' },
    {
      header: 'Acciones',
      accessor: 'id_proveedor',
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
          <h2 className="text-xl font-semibold">Proveedores</h2>
          <Button 
            onClick={() => navigate('/proveedores/crear')} 
            disabled={isOffline}
            variant="success"
          >
            Nuevo Proveedor
          </Button>
        </div>
        
        {loading ? (
          <p>Cargando proveedores...</p>
        ) : (
          <Table 
            columns={columns} 
            data={proveedores} 
            emptyMessage="No hay proveedores disponibles"
          />
        )}
      </Card>

      <Modal 
        isOpen={showDeleteModal} 
        onClose={() => setShowDeleteModal(false)}
        title="Confirmar Eliminación"
      >
        <p>¿Está seguro de que desea eliminar este proveedor? Esta acción no se puede deshacer.</p>
        <div className="flex justify-end mt-4 space-x-2">
          <Button onClick={() => setShowDeleteModal(false)} variant="secondary">Cancelar</Button>
          <Button onClick={handleDelete} variant="danger">Eliminar</Button>
        </div>
      </Modal>
    </div>
  );
};

export default ProveedoresList;