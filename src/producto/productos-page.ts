import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ContentLayout } from '../../components/layout/ContentLayout';
import { Button } from '../../components/ui/Button';
import { ProductosList } from '../../components/productos/ProductosList';
import { productosService } from '../../api/productosService';
import { Alert } from '../../components/ui/Alert';
import { useOffline } from '../../hooks/useOffline';
import { ProductoModel } from '../../types/models';
import { Modal } from '../../components/ui/Modal';
import { ProductoForm } from '../../components/productos/ProductoForm';

const ProductosPage: React.FC = () => {
  const navigate = useNavigate();
  const { isOffline } = useOffline();
  const [productos, setProductos] = useState<ProductoModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filteredProductos, setFilteredProductos] = useState<ProductoModel[]>([]);
  
  useEffect(() => {
    fetchProductos();
  }, [currentPage]);
  
  const fetchProductos = async () => {
    try {
      setLoading(true);
      const response = await productosService.getProductos({
        page: currentPage,
        limit: 10,
        search: searchTerm
      });
      
      setProductos(response.data);
      setTotalPages(response.totalPages);
      setFilteredProductos(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar los productos');
      setLoading(false);
      console.error(err);
    }
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (isOffline) {
      // Búsqueda local en modo offline
      const filtered = productos.filter(producto => 
        producto.nombre.toLowerCase().includes(term.toLowerCase()) ||
        (producto.codigo_barras && producto.codigo_barras.toLowerCase().includes(term.toLowerCase())) ||
        (producto.descripcion && producto.descripcion.toLowerCase().includes(term.toLowerCase()))
      );
      setFilteredProductos(filtered);
    } else {
      // Reiniciar a página 1 cuando se busca
      setCurrentPage(1);
      fetchProductos();
    }
  };
  
  const handleCreateProducto = () => {
    if (isOffline) {
      setError('No puedes crear productos en modo offline');
      return;
    }
    setShowModal(true);
  };
  
  const handleSaveProducto = async (producto: ProductoModel) => {
    try {
      await productosService.createProducto(producto);
      setShowModal(false);
      fetchProductos();
    } catch (err) {
      setError('Error al guardar el producto');
      console.error(err);
    }
  };
  
  const handleEditProducto = (id: number) => {
    navigate(`/productos/editar/${id}`);
  };
  
  const handleDeleteProducto = async (id: number) => {
    if (isOffline) {
      setError('No puedes eliminar productos en modo offline');
      return;
    }
    
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        await productosService.deleteProducto(id);
        fetchProductos();
      } catch (err) {
        setError('Error al eliminar el producto');
        console.error(err);
      }
    }
  };
  
  return (
    <ContentLayout title="Gestión de Productos">
      {isOffline && (
        <Alert 
          type="warning" 
          message="Estás trabajando en modo offline. Algunas funciones no están disponibles." 
        />
      )}
      
      {error && (
        <Alert 
          type="error" 
          message={error} 
          onClose={() => setError(null)} 
        />
      )}
      
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <div className="w-full sm:w-auto mb-4 sm:mb-0">
          <input
            type="text"
            placeholder="Buscar productos..."
            className="px-4 py-2 border rounded-lg w-full"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        
        <Button 
          onClick={handleCreateProducto}
          disabled={isOffline}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Nuevo Producto
        </Button>
      </div>
      
      <ProductosList 
        productos={filteredProductos}
        loading={loading}
        onEdit={handleEditProducto}
        onDelete={handleDeleteProducto}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Crear Nuevo Producto"
      >
        <ProductoForm onSave={handleSaveProducto} onCancel={() => setShowModal(false)} />
      </Modal>
    </ContentLayout>
  );
};

export default ProductosPage;
