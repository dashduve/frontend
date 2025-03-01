import React from 'react';
import ContentLayout from '../components/layout/ContentLayout';
import CategoriaForm from '../components/categorias/CategoriaForm';
import { useOffline } from '../hooks/useOffline';
import Alert from '../components/ui/Alert';

const CategoriaEditPage: React.FC = () => {
  const isOffline = useOffline();

  return (
    <ContentLayout title="Editar Categoría">
      {isOffline && (
        <Alert 
          type="warning" 
          message="Estás trabajando en modo sin conexión. Algunas funciones pueden no estar disponibles." 
        />
      )}
      <CategoriaForm isEditing={true} />
    </ContentLayout>
  );
};

export default CategoriaEditPage;