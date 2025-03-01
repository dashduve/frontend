import React from 'react';
import ContentLayout from '../components/layout/ContentLayout';
import CategoriaForm from '../components/categorias/CategoriaForm';
import { useOffline } from '../hooks/useOffline';
import Alert from '../components/ui/Alert';

const CategoriaCreatePage: React.FC = () => {
  const isOffline = useOffline();

  return (
    <ContentLayout title="Nueva Categoría">
      {isOffline && (
        <Alert 
          type="warning" 
          message="Estás trabajando en modo sin conexión. Algunas funciones pueden no estar disponibles." 
        />
      )}
      <CategoriaForm isEditing={false} />
    </ContentLayout>
  );
};

export default CategoriaCreatePage;