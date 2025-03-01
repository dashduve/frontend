import { useEffect, useRef, useState, useCallback } from 'react';
import { useAuth } from './useAuth';

interface WebSocketOptions {
  onOpen?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
  onError?: (event: Event) => void;
  reconnectAttempts?: number;
  reconnectInterval?: number;
  autoReconnect?: boolean;
}

export function useWebSocket(
  url: string,
  options: WebSocketOptions = {}
) {
  const {
    onOpen,
    onClose,
    onError,
    reconnectAttempts = 5,
    reconnectInterval = 5000,
    autoReconnect = true,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectCountRef = useRef(0);
  const reconnectTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const { getToken } = useAuth();

  // Función para conectar el WebSocket
  const connect = useCallback(async () => {
    // Cerrar la conexión existente si hay una
    if (wsRef.current) {
      wsRef.current.close();
    }

    try {
      // Obtener el token para autenticación
      const token = await getToken();
      const fullUrl = token ? `${url}?token=${token}` : url;
      
      // Crear nueva conexión WebSocket
      const ws = new WebSocket(fullUrl);
      wsRef.current = ws;
      
      ws.onopen = (event) => {
        setIsConnected(true);
        setError(null);
        reconnectCountRef.current = 0;
        if (onOpen) onOpen(event);
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          setMessages((prev) => [...prev, data]);
        } catch (e) {
          console.error('Error parsing WebSocket message:', e);
        }
      };
      
      ws.onclose = (event) => {
        setIsConnected(false);
        if (onClose) onClose(event);
        
        // Intentar reconectar si está habilitado
        if (autoReconnect && reconnectCountRef.current < reconnectAttempts) {
          reconnectTimerRef.current = setTimeout(() => {
            reconnectCountRef.current += 1;
            connect();
          }, reconnectInterval);
        }
      };
      
      ws.onerror = (event) => {
        setError(new Error('WebSocket error'));
        if (onError) onError(event);
      };
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to connect to WebSocket'));
    }
  }, [url, getToken, onOpen, onClose, onError, autoReconnect, reconnectAttempts, reconnectInterval]);

  // Función para enviar mensajes
  const sendMessage = useCallback((data: any) => {
    if (wsRef.current && isConnected) {
      wsRef.current.send(typeof data === 'string' ? data : JSON.stringify(data));
      return true;
    }
    return false;
  }, [isConnected]);

  // Función para desconectar manualmente
  const disconnect = useCallback(() => {
    if (reconnectTimerRef.current) {
      clearTimeout(reconnectTimerRef.current);
      reconnectTimerRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  // Conectar al montar el componente
  useEffect(() => {
    connect();
    
    // Limpiar al desmontar
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    isConnected,
    error,
    messages,
    sendMessage,
    connect,
    disconnect,
    clearMessages: () => setMessages([]),
  };
}