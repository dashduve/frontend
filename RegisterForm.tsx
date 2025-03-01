import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Alert from '../ui/Alert';
import { useAuth } from '../../hooks/useAuth';

const RegisterForm: React.FC = () => {
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    email: '',
    telefono: '',
    password: '',
    confirmPassword: '',
    empresa: '',
    ruc: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      await register({
        nombreCompleto: formData.nombreCompleto,
        email: formData.email,
        telefono: formData.telefono,
        password: formData.password,
        empresa: formData.empresa,
        ruc: formData.ruc,
      });
      navigate('/login', { state: { message: 'Registro exitoso, ahora puedes iniciar sesión' } });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && <Alert variant="error" message={error} />}
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <Input
              label="Nombre Completo"
              type="text"
              id="nombreCompleto"
              name="nombreCompleto"
              value={formData.nombreCompleto}
              onChange={handleChange}
              required
              placeholder="Juan Pérez"
            />
          </div>
          
          <div>
            <Input
              label="Teléfono"
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              placeholder="+51 999 888 777"
            />
          </div>
        </div>
        
        <div>
          <Input
            label="Correo Electrónico"
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="nombre@empresa.com"
          />
        </div>
        
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <Input
              label="Contraseña"
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </div>
          
          <div>
            <Input
              label="Confirmar Contraseña"
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </div>
        </div>
        
        <div className="border-t border-gray-200 pt-6">
          <h3 className="mb-4 text-lg font-medium">Información de la Empresa</h3>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <Input
                label="Nombre de la Empresa"
                type="text"
                id="empresa"
                name="empresa"
                value={formData.empresa}
                onChange={handleChange}
                required
                placeholder="Mi Empresa S.A.C."
              />
            </div>
            
            <div>
              <Input
                label="RUC"
                type="text"
                id="ruc"
                name="ruc"
                value={formData.ruc}
                onChange={handleChange}
                required
                placeholder="20123456789"
              />
            </div>
          </div>
        </div>
        
        <div>
          <Button
            type="submit"
            fullWidth
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Registrarse'}
          </Button>
        </div>
        
        <div className="text-center text-sm">
          ¿Ya tienes una cuenta?{' '}
          <a href="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Inicia sesión
          </a>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;