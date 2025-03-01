import React, { createContext, useState, useEffect, useCallback } from 'react';
import alertasService from '../api/alertasService';
import useWebSocket from '../hooks/useWebSocket';
import useAuth from '../hooks/useAuth';

export interface Alerta {
  id_alerta: number;
  id_producto: number;
  nombre_producto: string;
  nivel_minimo: number;
  estado: 'Activo' | 'Inactivo';
  fecha_creacion: string;
  stock_actual: number;
}

interface AlertsContextType {
  alertas: Alerta[];
  alertasCount: number;
  loading: boolean;
  error: string | null;
  fetchAlertas: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
}

export const AlertsContext = createContext<AlertsContextType>({
  alertas: [],
  alertasCount: 0,
  loading: false,
  error: null,
  fetchAlertas: async () => {},
  markAsRead: async () => {},
});

export const AlertsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [alertas, setAlertas] = useState<Alerta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();
  
  // Conexión a WebSocket para alertas en tiempo real
  const { lastMessage } = useWebSocket(
    isAuthenticated ? `/alertas/${user?.id_empresa}` : null
  );

  // Obtener alertas del servidor
  const fetchAlertas = useCallback(async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await alertasService.getAlertas();
      setAlertas(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error desconocido al cargar alertas');
      }
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Marcar alerta como leída/inactiva
  const markAsRead = useCallback(async (id: number) => {
    try {
      await alertasService.updateAlerta(id, { estado: 'Inactivo' });
      setAlertas(prev => prev.filter(alerta => alerta.id_alerta !== id));
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error al actualizar la alerta');
      }
    }
  }, []);

  // Cargar alertas iniciales al montar el componente
  useEffect(() => {
    if (isAuthenticated) {
      fetchAlertas();
    }
  }, [isAuthenticated, fetchAlertas]);

  // Procesar mensajes de WebSocket
  useEffect(() => {
    if (lastMessage) {
      try {
        const newAlerta = JSON.parse(lastMessage.data);
        setAlertas(prev => [newAlerta, ...prev]);
      } catch (err) {
        console.error('Error al procesar mensaje de WebSocket:', err);
      }
    }
  }, [lastMessage]);

  const value = {
    alertas,
    alertasCount: alertas.length,
    loading,
    error,
    fetchAlertas,
    markAsRead,
  };

  return <AlertsContext.Provider value={value}>{children}</AlertsContext.Provider>;
};
