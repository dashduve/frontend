import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Lazy loading de páginas
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'));
const ProductosPage = lazy(() => import('./pages/productos/ProductosPage'));
const ProductoCreatePage = lazy(() => import('./pages/productos/ProductoCreatePage'));
const ProductoEditPage = lazy(() => import('./pages/productos/ProductoEditPage'));
const CategoriasPage = lazy(() => import('./pages/categorias/CategoriasPage'));
const ProveedoresPage = lazy(() => import('./pages/proveedores/ProveedoresPage'));
const InventarioPage = lazy(() => import('./pages/inventario/InventarioPage'));
const MovimientosPage = lazy(() => import('./pages/inventario/MovimientosPage'));
const AlertasPage = lazy(() => import('./pages/alertas/AlertasPage'));
const ReportesPage = lazy(() => import('./pages/reportes/ReportesPage'));
const PedidosPage = lazy(() => import('./pages/pedidos/PedidosPage'));
const PedidoCreatePage = lazy(() => import('./pages/pedidos/PedidoCreatePage'));
const SettingsPage = lazy(() => import('./pages/settings/SettingsPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const LoadingFallback = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <CircularProgress />
  </Box>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Rutas protegidas */}
        <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          
          <Route path="productos">
            <Route index element={<ProductosPage />} />
            <Route path="crear" element={<ProductoCreatePage />} />
            <Route path="editar/:id" element={<ProductoEditPage />} />
          </Route>
          
          <Route path="categorias" element={<CategoriasPage />} />
          <Route path="proveedores" element={<ProveedoresPage />} />
          
          <Route path="inventario">
            <Route index element={<InventarioPage />} />
            <Route path="movimientos" element={<MovimientosPage />} />
          </Route>
          
          <Route path="alertas" element={<AlertasPage />} />
          <Route path="reportes" element={<ReportesPage />} />
          
          <Route path="pedidos">
            <Route index element={<PedidosPage />} />
            <Route path="crear" element={<PedidoCreatePage />} />
          </Route>
          
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        
        {/* Ruta 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
