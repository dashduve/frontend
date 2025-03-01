
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { AlertsContext } from '../../context/AlertsContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const { showAlert } = useContext(AlertsContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      showAlert('Por favor, complete todos los campos', 'error');
      return;
    }
    
    setLoading(true);
    
    try {
      await login(email, password);
      showAlert('Inicio de sesión exitoso', 'success');
      navigate('/dashboard');
    } catch (error) {
      showAlert('Credenciales incorrectas', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Iniciar Sesión</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              label="Correo Electrónico"
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <Input
              label="Contraseña"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            fullWidth
            loading={loading}
            className="mb-4"
          >
            Iniciar Sesión
          </Button>
          <p className="text-center text-sm">
            ¿No tienes una cuenta?{' '}
            <a
              href="/register"
              className="text-primary hover:underline"
              onClick={(e) => {
                e.preventDefault();
                navigate('/register');
              }}
            >
              Registrarse
            </a>
          </p>
        </form>
      </Card>
    </div>
  );
};

export default Login;

// pages/auth/Register.tsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { AlertsContext } from '../../context/AlertsContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

const Register: React.FC = () => {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useContext(AuthContext);
  const { showAlert } = useContext(AlertsContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nombre || !email || !password || !confirmPassword) {
      showAlert('Por favor, complete todos los campos', 'error');
      return;
    }
    
    if (password !== confirmPassword) {
      showAlert('Las contraseñas no coinciden', 'error');
      return;
    }
    
    setLoading(true);
    
    try {
      await register(nombre, email, password);
      showAlert('Registro exitoso', 'success');
      navigate('/login');
    } catch (error) {
      showAlert('Error al registrarse. Intente nuevamente.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Crear Cuenta</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              label="Nombre Completo"
              type="text"
              placeholder="Juan Pérez"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <Input
              label="Correo Electrónico"
              type="email"
              placeholder="correo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <Input
              label="Contraseña"
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <Input
              label="Confirmar Contraseña"
              type="password"
              placeholder="********"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            fullWidth
            loading={loading}
            className="mb-4"
          >
            Registrarse
          </Button>
          <p className="text-center text-sm">
            ¿Ya tienes una cuenta?{' '}
            <a
              href="/login"
              className="text-primary hover:underline"
              onClick={(e) => {
                e.preventDefault();
                navigate('/login');
              }}
            >
              Iniciar Sesión
            </a>
          </p>
        </form>
      </Card>
    </div>
  );
};

export default Register;

// pages/auth/ForgotPassword.tsx
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { AlertsContext } from '../../context/AlertsContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  const { forgotPassword } = useContext(AuthContext);
  const { showAlert } = useContext(AlertsContext);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      showAlert('Por favor, ingrese su correo electrónico', 'error');
      return;
    }
    
    setLoading(true);
    
    try {
      await forgotPassword(email);
      setEmailSent(true);
      showAlert('Se ha enviado un correo para restablecer su contraseña', 'success');
    } catch (error) {
      showAlert('Error al enviar el correo. Intente nuevamente.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Recuperar Contraseña</h1>
        {!emailSent ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <Input
                label="Correo Electrónico"
                type="email"
                placeholder="correo@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              fullWidth
              loading={loading}
              className="mb-4"
            >
              Enviar Correo de Recuperación
            </Button>
          </form>
        ) : (
          <div className="text-center">
            <p className="mb-4">
              Se ha enviado un correo a <strong>{email}</strong> con instrucciones para restablecer su contraseña.
            </p>
            <Button
              onClick={() => navigate('/login')}
              fullWidth
            >
              Volver al Inicio de Sesión
            </Button>
          </div>
        )}
        <p className="text-center text-sm mt-4">
          <a
            href="/login"
            className="text-primary hover:underline"
            onClick={(e) => {
              e.preventDefault();
              navigate('/login');
            }}
          >
            Volver al Inicio de Sesión
          </a>
        </p>
      </Card>
    </div>
  );
};

export default ForgotPassword;
