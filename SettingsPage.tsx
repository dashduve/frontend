import React, { useEffect, useState } from 'react';
import ContentLayout from '../components/layout/ContentLayout';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import Alert from '../components/ui/Alert';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../api/authService';
import { useOffline } from '../hooks/useOffline';
import { useTheme } from '../context/ThemeContext';

const SettingsPage: React.FC = () => {
  const { user, updateUserInfo } = useAuth();
  const { isOffline } = useOffline();
  const { theme, setTheme } = useTheme();
  
  const [formData, setFormData] = useState({
    nombre_completo: '',
    email: '',
    telefono: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    if (user) {
      setFormData({
        nombre_completo: user.nombre_completo || '',
        email: user.email || '',
        telefono: user.telefono || '',
      });
    }
  }, [user]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isOffline) {
      setMessage({
        type: 'error',
        text: 'No se pueden guardar cambios en modo offline'
      });
      return;
    }

    try {
      setLoading(true);
      const updatedUser = await authService.updateProfile(formData);
      updateUserInfo(updatedUser);
      setMessage({
        type: 'success',
        text: 'Perfil actualizado correctamente'
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Error al actualizar el perfil'
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isOffline) {
      setMessage({
        type: 'error',
        text: 'No se pueden guardar cambios en modo offline'
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({
        type: 'error',
        text: 'Las contraseñas no coinciden'
      });
      return;
    }

    try {
      setLoading(true);
      await authService.changePassword(passwordData.currentPassword, passwordData.newPassword);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setMessage({
        type: 'success',
        text: 'Contraseña actualizada correctamente'
      });
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Error al actualizar la contraseña'
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
  };

  return (
    <ContentLayout title="Configuración">
      {message && <Alert type={message.type} message={message.text} />}
      
      <div className="space-y-6">
        <Card title="Información Personal">
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <Input
              label="Nombre Completo"
              name="nombre_completo"
              value={formData.nombre_completo}
              onChange={handleProfileChange}
              required
            />
            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleProfileChange}
              required
            />
            <Input
              label="Teléfono"
              name="telefono"
              value={formData.telefono}
              onChange={handleProfileChange}
            />
            <Button 
              type="primary" 
              htmlType="submit"
              loading={loading}
              disabled={isOffline}
            >
              Guardar Cambios
            </Button>
          </form>
        </Card>

        <Card title="Cambiar Contraseña">
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <Input
              label="Contraseña Actual"
              name="currentPassword"
              type="password"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              required
            />
            <Input
              label="Nueva Contraseña"
              name="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              required
            />
            <Input
              label="Confirmar Nueva Contraseña"
              name="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              required
            />
            <Button 
              type="primary" 
              htmlType="submit"
              loading={loading}
              disabled={isOffline}
            >
              Actualizar Contraseña
            </Button>
          </form>
        </Card>

        <Card title="Preferencias de Interfaz">
          <div className="space-y-4">
            <h3 className="font-medium">Tema</h3>
            <div className="flex space-x-4">
              <button
                onClick={() => handleThemeChange('light')}
                className={`px-4 py-2 rounded ${theme === 'light' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Claro
              </button>
              <button
                onClick={() => handleThemeChange('dark')}
                className={`px-4 py-2 rounded ${theme === 'dark' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Oscuro
              </button>
              <button
                onClick={() => handleThemeChange('system')}
                className={`px-4 py-2 rounded ${theme === 'system' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                Sistema
              </button>
            </div>
          </div>
        </Card>

        <Card title="Aplicación PWA">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-medium">Modo Offline</h3>
                <p className="text-sm text-gray-600">Estado actual: {isOffline ? 'Offline' : 'Online'}</p>
              </div>
              <div className={`px-3 py-1 rounded-full ${isOffline ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                {isOffline ? 'Offline' : 'Online'}
              </div>
            </div>
            <div>
              <h3 className="font-medium">Versión de la Aplicación</h3>
              <p className="text-sm text-gray-600">v1.0.0</p>
            </div>
          </div>
        </Card>
      </div>
    </ContentLayout>
  );
};

export default SettingsPage;