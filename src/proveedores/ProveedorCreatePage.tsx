import React from 'react';
import ContentLayout from '../components/layout/ContentLayout';
import ProveedorForm from '../components/proveedores/ProveedorForm';
import { useOffline } from '../hooks/useOffline';
import Alert from '../components/ui/Alert';

const ProveedorCreatePage: React.FC = () => {
  const isOffline = useOffline();

  return (
    <ContentLayout title="Nuevo Proveedor">
      {isOffline && (
        <Alert 
          type="warning" 
          message="Estás trabajando en modo sin conexión. Algunas funciones pueden no estar disponibles." 
        />
      )}
      <ProveedorForm isEditing={false} />
    </ContentLayout>
  );
};

export default ProveedorCreatePage;