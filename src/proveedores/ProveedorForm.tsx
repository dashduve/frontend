import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getOne, create, update } from '../../api/proveedoresService';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Alert from '../ui/Alert';
import { Proveedor } from '../../types/models';
import { useOffline } from '../../hooks/useOffline';

interface ProveedorFormProps {
  isEditing?: boolean;
}

const ProveedorForm: React.FC<ProveedorFormProps> = ({ isEditing = false }) => {
  const [formData, setFormData] = useState<Partial<Proveedor>>({
    nombre: '',
    contacto: '',
    telefono: '',
    email: '',
    direccion: ''
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isOffline = useOffline();

  useEffect(() => {
    if (isEditing && id) {
      const fetchProveedor = async () => {
        try {
          setLoading(true);
          const data = await getOne(parseInt(id));
          setFormData(data);
        } catch (err) {
          setError('Error al cargar los datos del proveedor');
          console.error(err);
        } finally {
          setLoading(false);
        }
      };

      fetchProveedor();
    }
  }, [isEditing, id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateEmail = (email: string) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.nombre) {
      setError('El nombre del proveedor es obligatorio');
      return;
    }

    if (formData.email && !validateEmail(formData.email)) {
      setError('El formato del correo electrónico no es válido');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      if (isEditing && id) {
        await update(parseInt(id), formData as Proveedor);
        setSuccess('Proveedor actualizado correctamente');
      } else {
        await create(formData as Proveedor);
        setSuccess('Proveedor creado correctamente');
        setFormData({ nombre: '', contacto: '', telefono: '', email: '', direccion: '' });
      }
      
      // Redirigir después de un breve retraso para que el usuario vea el mensaje de éxito
      setTimeout(() => {
        navigate('/proveedores');
      }, 1500);
      
    } catch (err) {
      setError('Error al guardar el proveedor. Inténtelo de nuevo más tarde.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) {
    return <p>Cargando datos del proveedor...</p>;
  }

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4">
        {isEditing ? 'Editar Proveedor' : 'Nuevo Proveedor'}
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
            label="Contacto"
            name="contacto"
            value={formData.contacto || ''}
            onChange={handleChange}
            disabled={loading || isOffline}
          />
        </div>
        
        <div>
          <Input
            label="Teléfono"
            name="telefono"
            value={formData.telefono || ''}
            onChange={handleChange}
            disabled={loading || isOffline}
          />
        </div>
        
        <div>
          <Input
            label="Email"
            name="email"
            type="email"
            value={formData.email || ''}
            onChange={handleChange}
            disabled={loading || isOffline}
          />
        </div>
        
        <div>
          <Input
            label="Dirección"
            name="direccion"
            value={formData.direccion || ''}
            onChange={handleChange}
            multiline
            rows={3}
            disabled={loading || isOffline}
          />
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button 
            type="button" 
            onClick={() => navigate('/proveedores')} 
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

export default ProveedorForm;