import React from 'react';
import ContentLayout from '../components/layout/ContentLayout';
import ProveedoresList from '../components/proveedores/ProveedoresList';
import { useOffline } from '../hooks/useOffline';
import Alert from '../components/ui/Alert';

const ProveedoresPage: React.FC = () => {
  const isOffline = useOffline();

  return (
    <ContentLayout title="Gestión de Proveedores">
      {isOffline && (
        <Alert 
          type="warning" 
          message="Estás trabajando en modo sin conexión. Algunas funciones pueden no estar disponibles." 
        />
      )}
      <ProveedoresList />
    </ContentLayout>
  );
};

export default ProveedoresPage;