import React from 'react';
import ContentLayout from '../components/layout/ContentLayout';
import CategoriasList from '../components/categorias/CategoriasList';
import { useOffline } from '../hooks/useOffline';
import Alert from '../components/ui/Alert';

const CategoriasPage: React.FC = () => {
  const isOffline = useOffline();

  return (
    <ContentLayout title="Gestión de Categorías">
      {isOffline && (
        <Alert 
          type="warning" 
          message="Estás trabajando en modo sin conexión. Algunas funciones pueden no estar disponibles." 
        />
      )}
      <CategoriasList />
    </ContentLayout>
  );
};

export default CategoriasPage;