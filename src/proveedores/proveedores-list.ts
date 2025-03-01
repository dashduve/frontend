import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ContentLayout } from '../../components/layout/ContentLayout';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAlerts } from '../../context/AlertsContext';

interface Proveedor {
  id: number;
  nombre: string;
  contacto: string;
  telefono: string;
  email: string;
  direccion: string;
  estado: 'activo' | 'inactivo';
  productosCount?: number;
}

export const ProveedoresList = () => {
  const navigate = useNavigate();
  const { showAlert } = useAlerts();
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterText, setFilterText] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  const fetchProveedores = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/proveedores');
      setProveedores(res.data);
    } catch (error) {
      showAlert('Error al cargar los proveedores', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  const handleDelete = async (id: number) => {
    if (confirmDelete === id) {
      try {
        await axios.delete(`/api/proveedores/${id}`);
        showAlert('Proveedor eliminado correctamente', 'success');
        fetchProveedores();
      } catch (error) {
        showAlert('Error al eliminar el proveedor. Puede que tenga productos asociados.', 'error');
      }
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  const filteredProveedores = proveedores.filter(proveedor => 
    proveedor.nombre.toLowerCase().includes(filterText.toLowerCase()) ||
    proveedor.contacto.toLowerCase().includes(filterText.toLowerCase()) ||
    proveedor.email.toLowerCase().includes(filterText.toLowerCase()) ||
    proveedor.telefono.includes(filterText)
  );

  return (
    <ContentLayout title="Gestión de Proveedores">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="w-full md:w-1/3">
          <Input
            placeholder="Buscar proveedores..."
            value={filterText}
            onChange={e => setFilterText(e.target.value)}
            icon="search"
          />
        </div>
        <Button onClick={() => navigate('/proveedores/nuevo')}>
          Nuevo Proveedor
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredProveedores.length > 0 ? (
            filteredProveedores.map(proveedor => (
              <Card key={proveedor.id} className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">{proveedor.nombre}</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    proveedor.estado === 'activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {proveedor.estado === 'activo' ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                  <div>
                    <p className="text-sm text-gray-500">Contacto:</p>
                    <p className="text-gray-700">{proveedor.contacto}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Teléfono:</p>
                    <p className="text-gray-700">{proveedor.telefono}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email:</p>
                    <p className="text-gray-700">{proveedor.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Dirección:</p>
                    <p className="text-gray-700">{proveedor.direccion}</p>
                  </div>
                </div>
                
                {proveedor.productosCount !== undefined && (
                  <p className="text-sm text-gray-500 mb-4">
                    {proveedor.productosCount} productos asociados
                  </p>
                )}
                
                <div className="flex justify-end space-x-2 mt-auto">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigate(`/proveedores/${proveedor.id}`)}
                  >
                    Editar
                  </Button>
                  <Button 
                    variant="danger" 
                    size="sm"
                    onClick={() => handleDelete(proveedor.id)}
                  >
                    {confirmDelete === proveedor.id ? 'Confirmar' : 'Eliminar'}
                  </Button>
                </div>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-gray-500">No se encontraron proveedores.</p>
            </div>
          )}
        </div>
      )}
    </ContentLayout>
  );
};

export default ProveedoresList;
