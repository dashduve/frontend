
/**
 * Utilidades para gestionar el almacenamiento local
 * Soporta localStorage y IndexedDB para funcionamiento offline
 */

// Claves para localStorage
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'app_theme',
  OFFLINE_DATA: 'offline_data',
  LAST_SYNC: 'last_sync',
};

// LocalStorage básico
export const localStorageService = {
  /**
   * Almacena un valor en localStorage
   * @param key Clave
   * @param value Valor a almacenar (se convierte a JSON)
   */
  setItem: (key: string, value: any): void => {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error('Error al guardar en localStorage:', error);
    }
  },

  /**
   * Obtiene un valor de localStorage
   * @param key Clave
   * @param defaultValue Valor por defecto si no existe
   */
  getItem: <T>(key: string, defaultValue: T | null = null): T | null => {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue;
      }
      return JSON.parse(item);
    } catch (error) {
      console.error('Error al leer de localStorage:', error);
      return defaultValue;
    }
  },

  /**
   * Elimina un valor de localStorage
   * @param key Clave
   */
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error al eliminar de localStorage:', error);
    }
  },

  /**
   * Limpia todo el localStorage
   */
  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error al limpiar localStorage:', error);
    }
  }
};

// IndexedDB para datos offline más complejos
const DB_NAME = 'pwa_inventario_db';
const DB_VERSION = 1;
const STORES = {
  PRODUCTOS: 'productos',
  MOVIMIENTOS: 'movimientos',
  PEDIDOS: 'pedidos',
  PENDIENTES_SYNC: 'pendientes_sync',
};

export const indexedDBService = {
  _db: null as IDBDatabase | null,

  /**
   * Inicializa la base de datos IndexedDB
   * @returns Promise que se resuelve cuando la DB está lista
   */
  initDB: (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
      if (indexedDBService._db) {
        resolve(indexedDBService._db);
        return;
      }

      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Crear object stores si no existen
        if (!db.objectStoreNames.contains(STORES.PRODUCTOS)) {
          db.createObjectStore(STORES.PRODUCTOS, { keyPath: 'id_producto' });
        }

        if (!db.objectStoreNames.contains(STORES.MOVIMIENTOS)) {
          db.createObjectStore(STORES.MOVIMIENTOS, { keyPath: 'id_movimiento', autoIncrement: true });
        }

        if (!db.objectStoreNames.contains(STORES.PEDIDOS)) {
          db.createObjectStore(STORES.PEDIDOS, { keyPath: 'id_pedido', autoIncrement: true });
        }

        if (!db.objectStoreNames.contains(STORES.PENDIENTES_SYNC)) {
          db.createObjectStore(STORES.PENDIENTES_SYNC, { keyPath: 'id', autoIncrement: true });
        }
      };

      request.onsuccess = (event) => {
        indexedDBService._db = (event.target as IDBOpenDBRequest).result;
        resolve(indexedDBService._db);
      };

      request.onerror = (event) => {
        console.error('Error al abrir IndexedDB:', (event.target as IDBOpenDBRequest).error);
        reject((event.target as IDBOpenDBRequest).error);
      };
    });
  },

  /**
   * Almacena un objeto en el store especificado
   * @param storeName Nombre del store
   * @param data Datos a guardar
   */
  saveItem: <T>(storeName: string, data: T): Promise<IDBValidKey> => {
    return new Promise(async (resolve, reject) => {
      try {
        const db = await indexedDBService.initDB();
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.put(data);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      } catch (error) {
        reject(error);
      }
    });
  },

  /**
   * Guarda múltiples objetos en un store
   * @param storeName Nombre del store
   * @param items Array de items a guardar
   */
  saveItems: <T>(storeName: string, items: T[]): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      try {
        const db = await indexedDBService.initDB();
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);

        for (const item of items) {
          store.put(item);
        }

        transaction.oncomplete = () => resolve();
        transaction.onerror = () => reject(transaction.error);
      } catch (error) {
        reject(error);
      }
    });
  },

  /**
   * Obtiene un item por su id
   * @param storeName Nombre del store
   * @param id Identificador
   */
  getItem: <T>(storeName: string, id: IDBValidKey): Promise<T | null> => {
    return new Promise(async (resolve, reject) => {
      try {
        const db = await indexedDBService.initDB();
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.get(id);

        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
      } catch (error) {
        reject(error);
      }
    });
  },

  /**
   * Obtiene todos los items de un store
   * @param storeName Nombre del store
   */
  getAllItems: <T>(storeName: string): Promise<T[]> => {
    return new Promise(async (resolve, reject) => {
      try {
        const db = await indexedDBService.initDB();
        const transaction = db.transaction(storeName, 'readonly');
        const store = transaction.objectStore(storeName);
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      } catch (error) {
        reject(error);
      }
    });
  },

  /**
   * Elimina un item por su id
   * @param storeName Nombre del store
   * @param id Identificador
   */
  deleteItem: (storeName: string, id: IDBValidKey): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      try {
        const db = await indexedDBService.initDB();
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.delete(id);

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      } catch (error) {
        reject(error);
      }
    });
  },

  /**
   * Limpia todos los registros de un store
   * @param storeName Nombre del store
   */
  clearStore: (storeName: string): Promise<void> => {
    return new Promise(async (resolve, reject) => {
      try {
        const db = await indexedDBService.initDB();
        const transaction = db.transaction(storeName, 'readwrite');
        const store = transaction.objectStore(storeName);
        const request = store.clear();

        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
      } catch (error) {
        reject(error);
      }
    });
  },

  /**
   * Agrega una operación pendiente de sincronización
   * @param operation Operación a sincronizar cuando haya conexión
   */
  addPendingSync: (operation: {
    endpoint: string;
    method: string;
    data: any;
    timestamp: number;
  }): Promise<IDBValidKey> => {
    return indexedDBService.saveItem(STORES.PENDIENTES_SYNC, operation);
  },

  /**
   * Obtiene todas las operaciones pendientes de sincronización
   */
  getPendingSyncOperations: () => {
    return indexedDBService.getAllItems(STORES.PENDIENTES_SYNC);
  },

  /**
   * Elimina una operación pendiente después de sincronizarla
   * @param id ID de la operación sincronizada
   */
  removePendingSyncOperation: (id: number) => {
    return indexedDBService.deleteItem(STORES.PENDIENTES_SYNC, id);
  }
};

// Funciones de alto nivel para la aplicación
export const appStorage = {
  // Autenticación
  saveAuthToken: (token: string) => localStorageService.setItem(STORAGE_KEYS.AUTH_TOKEN, token),
  getAuthToken: () => localStorageService.getItem<string>(STORAGE_KEYS.AUTH_TOKEN, null),
  clearAuth: () => {
    localStorageService.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorageService.removeItem(STORAGE_KEYS.USER_DATA);
  },

  // Datos de usuario
  saveUserData: (userData: any) => localStorageService.setItem(STORAGE_KEYS.USER_DATA, userData),
  getUserData: () => localStorageService.getItem(STORAGE_KEYS.USER_DATA, null),

  // Tema
  saveTheme: (theme: string) => localStorageService.setItem(STORAGE_KEYS.THEME, theme),
  getTheme: () => localStorageService.getItem<string>(STORAGE_KEYS.THEME, 'light'),

  // Último sincronizado
  updateLastSync: () => localStorageService.setItem(STORAGE_KEYS.LAST_SYNC, Date.now()),
  getLastSync: () => localStorageService.getItem<number>(STORAGE_KEYS.LAST_SYNC, 0),

  // Gestión de productos en modo offline
  saveProductosOffline: (productos: any[]) => indexedDBService.saveItems(STORES.PRODUCTOS, productos),
  getProductosOffline: () => indexedDBService.getAllItems(STORES.PRODUCTOS),
  
  // Gestión de movimientos en modo offline
  saveMovimientoOffline: (movimiento: any) => {
    // Guarda el movimiento en IndexedDB y agrega operación pendiente
    return Promise.all([
      indexedDBService.saveItem(STORES.MOVIMIENTOS, movimiento),
      indexedDBService.addPendingSync({
        endpoint: '/api/inventario/movimientos',
        method: 'POST',
        data: movimiento,
        timestamp: Date.now()
      })
    ]);
  },
  
  // Gestión de pedidos en modo offline
  savePedidoOffline: (pedido: any) => {
    // Guarda el pedido en IndexedDB y agrega operación pendiente
    return Promise.all([
      indexedDBService.saveItem(STORES.PEDIDOS, pedido),
      indexedDBService.addPendingSync({
        endpoint: '/api/pedidos',
        method: 'POST',
        data: pedido,
        timestamp: Date.now()
      })
    ]);
  },

  // Sincronización
  getPendingOperations: () => indexedDBService.getPendingSyncOperations(),
  removeSyncedOperation: (id: number) => indexedDBService.removePendingSyncOperation(id),
  
  // Inicialización
  init: () => indexedDBService.initDB()
};