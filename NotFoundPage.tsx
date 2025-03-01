import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-blue-600">404</h1>
        <h2 className="text-4xl font-medium mt-4 mb-6">Página no encontrada</h2>
        <p className="text-lg text-gray-600 mb-8">Lo sentimos, la página que estás buscando no existe o ha sido movida.</p>
        
        <Link to="/">
          <Button type="primary" size="large">
            Volver al inicio
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;