
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEdit, FaTrash, FaPlus, FaSearch, FaFileExport } from 'react-icons/fa';
import { AlertsContext } from '../../context/AlertsContext';
import ContentLayout from '../../components/layout/ContentLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

interface Producto {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  categoria: string;
  proveedor: string;
}

const ProductosList: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  
  const { showAlert } = useContext(AlertsContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        // Simulación de llamada a API
        setTimeout(() => {
          const mockProductos: Producto[] = Array.from({ length: 25 }, (_, i) => ({
            id: i + 1,
            codigo: `PROD-${1000 + i}`,
            nombre: `Producto ${i + 1}`,
            descripcion: `Descripción del producto ${i + 1}`,
            precio: Math.floor(Math.random() * 1000) + 10,
            stock: Math.floor(Math.random() * 100),
            categoria: ['Electrónica', 'Oficina', 'Hogar', 'Ropa', 'Accesorios'][Math.floor(Math.random() * 5)],
            proveedor: ['Proveedor A', 'Proveedor B', 'Proveedor C'][Math.floor(Math.random() * 3)]
          }));
          setProductos(mockProductos);
          setLoading(false);
        }, 1000);
      } catch (error) {
        showAlert('Error al cargar los productos', 'error');
        setLoading(false);
      }
    };

    fetchProductos();
  }, [showAlert]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de eliminar este producto?')) {
      try {
        // Simulación de eliminación
        setProductos(productos.filter(producto => producto.id !== id));
        showAlert('Producto eliminado correctamente', 'success');
      } catch (error) {
        showAlert('Error al eliminar el producto', 'error');
      }
    }
  };

  const handleExport = () => {
    // Lógica para exportar a CSV o Excel
    showAlert('Exportando productos...', 'info');
    // En un caso real, aquí se generaría y descargaría un archivo
  };

  // Filtrar productos
  const filteredProductos = productos.filter(producto => 
    producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
    producto.proveedor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Paginar productos
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProductos.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProductos.length / productsPerPage);

  if (loading) {
    return (
      <ContentLayout title="Productos">
        <div className="animate-pulse space-y-4">
          <div className="h-12 bg-gray-200 rounded"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout title="Productos">
      <Card className="mb-6">
        <div className="p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-grow max-w-md">
            <Input
              type="text"
              placeholder="Buscar producto..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => navigate('/productos/nuevo')}
              variant="primary"
              className="flex items-center"
            >
              <FaPlus className="mr-2" /> Nuevo Producto
            </Button>
            <Button
              onClick={handleExport}
              variant="secondary"
              className="flex items-center"
            >
              <FaFileExport className="mr-2" /> Exportar
            </Button>
          </div>
        </div>
      </Card>

      <Card>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proveedor</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentProducts.length > 0 ? (
                currentProducts.map((producto) => (
                  <tr key={producto.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{producto.codigo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{producto.nombre}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{producto.categoria}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${producto.precio.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        producto.stock > 20 
                          ? 'bg-green-100 text-green-800' 
                          : producto.stock > 5 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                      }`}>
                        {producto.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{producto.proveedor}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => navigate(`/productos/editar/${producto.id}`)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <FaEdit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(producto.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <FaTrash size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    No se encontraron productos
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        {filteredProductos.length > 0 && (
          <div className="px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <Button
                onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
                disabled={currentPage === 1}
                variant="secondary"
              >
                Anterior
              </Button>
              <Button
                onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
                disabled={currentPage === totalPages}
                variant="secondary"
              >
                Siguiente
              </Button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Mostrando <span className="font-medium">{indexOfFirstProduct + 1}</span> a{' '}
                  <span className="font-medium">
                    {Math.min(indexOfLastProduct, filteredProductos.length)}
                  </span>{' '}
                  de <span className="font-medium">{filteredProductos.length}</span> productos
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    Anterior
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                        page === currentPage
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
                    disabled={currentPage === totalPages}
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    Siguiente
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </Card>
    </ContentLayout>
  );
};

export default ProductosList;

// pages/productos/ProductoForm.tsx
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertsContext } from '../../context/AlertsContext';
import ContentLayout from '../../components/layout/ContentLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

interface ProductoFormData {
  codigo: string;
  nombre: string;
  descripcion: string;
  precio: string;
  stock: string;
  categoria: string;
  proveedor: string;
}

const initialForm: ProductoFormData = {
  codigo: '',
  nombre: '',
  descripcion: '',
  precio: '',
  stock: '',
  categoria: '',
  pr