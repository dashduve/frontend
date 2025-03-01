
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import * as serviceWorkerRegistration from './service-worker/serviceWorkerRegistration';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { AlertsProvider } from './context/AlertsContext';
import './assets/styles/index.css';

// Inicializar la base de datos IndexedDB al arrancar
import { appStorage } from './utils/storage';
appStorage.init().catch(error => {
  console.error('Error al inicializar la base de datos IndexedDB:', error);
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AlertsProvider>
            <App />
          </AlertsProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// Registrar el service worker para funcionalidades PWA
serviceWorkerRegistration.register();

// Gestión de sincronización cuando la aplicación recupera la conexión
window.addEventListener('online', async () => {
  // Intentar sincronizar datos pendientes cuando recuperamos conexión
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    try {
      const registration = await navigator.serviceWorker.ready;
      // Solicitar sincronización de datos pendientes
      if ('sync' in registration) {
        await registration.sync.register('sync-pending-operations');
        console.log('Sincronización solicitada después de recuperar conexión');
      }
    } catch (error) {
      console.error('Error al registrar sync después de recuperar conexión:', error);
    }
  }
});