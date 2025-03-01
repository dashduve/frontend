import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getOne, create, update } from '../../api/categoriasService';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Alert from '../ui/Alert';
import { Categoria } from '../../types/models';
import { useOffline } from '../../hooks/useOffline';

interface CategoriaFormProps {
  isEditing?: boolean;
}

const CategoriaForm: React.FC<CategoriaFormProps> = ({ isEditing = false }) => {
  const [formData, setFormData] = useState<Partial<Categoria>>({
    nombre: '',
    descripcion: ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isOffline = useOffline();

  useEffect(() => {
    if (isEditing && id) {
      const fetchCategoria = async () => {
        try {
          setLoading(true);
          const data = await getOne(parseInt(id));
          setFormData(data);
        } catch (err) {
          setError('Error al cargar los datos de la categoría');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchCategoria();
    }
  }, [isEditing, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre) {
      setError('El nombre de la categoría es obligatorio');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      if (isEditing && id) {
        await update(parseInt(id), formData as Categoria);
        setSuccess('Categoría actualizada correctamente');
      } else {
        await create(formData as Categoria);
        setSuccess('Categoría creada correctamente');
        setFormData({ nombre: '', descripcion: '' });
      }
      
      // Redirigir después de un breve retraso para que el usuario vea el mensaje de éxito
      setTimeout(() => {
        navigate('/categorias');
      }, 1500);
      
    } catch (err) {
      setError('Error al guardar la categoría. Inténtelo de nuevo más tarde.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return <p>Cargando datos de la categoría...</p>;
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4">
        {isEditing ? 'Editar Categoría' : 'Nueva Categoría'}
      </h2>
      
      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
      {success && <Alert type="success" message={success} onClose={() => setSuccess(null)} />}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            label="Nombre"
            name="nombre"
            value={formData.nombre || ''}
            onChange={handleChange}
            required
            disabled={loading || isOffline}
          />
        </div>
        
        <div>
          <Input
            label="Descripción"
            name="descripcion"
            value={formData.descripcion || ''}
            onChange={handleChange}
            multiline
            rows={3}
            disabled={loading || isOffline}
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button 
            type="button" 
            onClick={() => navigate('/categorias')} 
            variant="secondary"
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            disabled={loading || isOffline}
            variant="primary"
          >
            {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default CategoriaForm;