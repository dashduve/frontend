import React from 'react';
import ProductoForm from '../components/productos/ProductoForm';

const ProductoCreatePage: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Crear Nuevo Producto</h1>
      <ProductoForm />
    </div>
  );
};

export default ProductoCreatePage;