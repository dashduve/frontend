import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';
import Card from '../components/ui/Card';
import Alert from '../components/ui/Alert';
import { useAuth } from '../hooks/useAuth';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  
  // Redireccionar si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-lg">
        <Card>
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Crear una Cuenta</h1>
            <p className="text-gray-600 mt-2">Registra tu empresa para comenzar a gestionar tu inventario</p>
          </div>
          
          {error && <Alert type="error" message={error} className="mb-4" />}
          
          <RegisterForm onError={setError} />
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              ¿Ya tienes una cuenta? 
              <button 
                onClick={() => navigate('/login')}
                className="ml-1 text-blue-600 hover:text-blue-800 font-medium"
              >
                Iniciar sesión
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;