import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ContentLayout } from '../../components/layout/ContentLayout';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAlerts } from '../../context/AlertsContext';

interface Categoria {
  id: number;
  nombre: string;
  descripcion: string;
  estado: 'activo' | 'inactivo';
}

export const CategoriaDetalle = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showAlert } = useAlerts();
  const [loading, setLoading] = useState(true);
  const [categoria, setCategoria] = useState<Categoria>({
    id: 0,
    nombre: '',
    descripcion: '',
    estado: 'activo'
  });

  useEffect(() => {
    const fetchCategoria = async () => {
      if (id === 'nueva') {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await axios.get(`/api/categorias/${id}`);
        setCategoria(res.data);
      } catch (error) {
        showAlert('Error al cargar la categoría', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchCategoria();
  }, [id, showAlert]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCategoria(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (id === 'nueva') {
        await axios.post('/api/categorias', categoria);
        showAlert('Categoría creada exitosamente', 'success');
      } else {
        await axios.put(`/api/categorias/${id}`, categoria);
        showAlert('Categoría actualizada exitosamente', 'success');
      }
      navigate('/categorias');
    } catch (error) {
      showAlert('Error al guardar la categoría', 'error');
    }
  };

  if (loading) {
    return (
      <ContentLayout title="Cargando categoría...">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </ContentLayout>
    );
  }

  return (
    <ContentLayout title={id === 'nueva' ? 'Nueva Categoría' : 'Editar Categoría'}>
      <Card className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Input
              label="Nombre"
              name="nombre"
              value={categoria.nombre}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={categoria.descripcion}
              onChange={handleChange}
              rows={4}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              name="estado"
              value={categoria.estado}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate('/categorias')}
            >
              Cancelar
            </Button>
            <Button type="submit">
              {id === 'nueva' ? 'Crear Categoría' : 'Actualizar Categoría'}
            </Button>
          </div>
        </form>
      </Card>
    </ContentLayout>
  );
};

export default CategoriaDetalle;
