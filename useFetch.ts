import { useState, useEffect, useCallback } from 'react';
import { useAuth } from './useAuth';
import { useOffline } from './useOffline';

interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: any;
  headers?: Record<string, string>;
  skipAuth?: boolean;
}

interface FetchState<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useFetch<T = any>(
  url: string,
  options: FetchOptions = {},
  initialFetch: boolean = true
) {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    loading: false,
    error: null,
  });
  const { getToken } = useAuth();
  const isOffline = useOffline();

  const fetchData = useCallback(
    async (overrideOptions?: FetchOptions) => {
      // No realizar la petición si estamos offline
      if (isOffline) {
        setState((prevState) => ({
          ...prevState,
          loading: false,
          error: new Error('No hay conexión a internet'),
        }));
        return null;
      }

      setState((prevState) => ({ ...prevState, loading: true, error: null }));
      
      const mergedOptions = { ...options, ...overrideOptions };
      const { method = 'GET', body, headers = {}, skipAuth = false } = mergedOptions;
      
      try {
        // Añadir token de autenticación si es necesario
        const authHeaders: Record<string, string> = {};
        if (!skipAuth) {
          const token = await getToken();
          if (token) {
            authHeaders['Authorization'] = `Bearer ${token}`;
          }
        }

        // Preparar headers
        const requestHeaders = {
          'Content-Type': 'application/json',
          ...authHeaders,
          ...headers,
        };

        // Preparar body si existe
        const requestBody = body ? JSON.stringify(body) : undefined;

        // Hacer la petición
        const response = await fetch(url, {
          method,
          headers: requestHeaders,
          body: requestBody,
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const responseData = await response.json();

        setState({
          data: responseData,
          loading: false,
          error: null,
        });

        return responseData;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
        setState({
          data: null,
          loading: false,
          error: new Error(errorMessage),
        });
        return null;
      }
    },
    [url, options, getToken, isOffline]
  );

  useEffect(() => {
    if (initialFetch) {
      fetchData();
    }
  }, [initialFetch, fetchData]);

  return { ...state, fetchData };
}