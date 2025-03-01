

// Versión del cache
const CACHE_VERSION = 'v1';
const CACHE_NAME = `pwa-inventario-cache-${CACHE_VERSION}`;

// Archivos a cachear durante la instalación
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/static/js/main.bundle.js',
  '/static/css/main.css',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/offline.html'
];

// Almacena el objeto self como variable para acceder al scope de service worker
const sw = self as unknown as ServiceWorkerGlobalScope;

// Evento de instalación
sw.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Cacheando archivos estáticos');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  
  // Forzar la activación inmediata
  sw.skipWaiting();
});

// Evento de activación
sw.addEventListener('activate', (event) => {
  // Eliminar caches antiguos
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return cacheName.startsWith('pwa-inventario-cache-') && cacheName !== CACHE_NAME;
          })
          .map((cacheName) => {
            console.log('Eliminando cache antiguo:', cacheName);
            return caches.delete(cacheName);
          })
      );
    })
  );
  
  // Asegurar que el service worker tome el control de todos los clientes inmediatamente
  sw.clients.claim();
});

// Estrategia de cache: Network first, fallback to cache
sw.addEventListener('fetch', (event) => {
  // Solo manejar peticiones GET
  if (event.request.method !== 'GET') return;
  
  // No cachear peticiones de API
  const isApiRequest = event.request.url.includes('/api/');
  
  if (isApiRequest) {
    // Estrategia para API: Intentar red, si falla guardar en IndexedDB para sincronizar después
    event.respondWith(
      fetch(event.request.clone())
        .catch((error) => {
          console.log('Error en petición de API, se procesará offline:', error);
          
          // Retornar respuesta vacía para operaciones POST/PUT
          if (event.request.method !== 'GET') {
            return new Response(JSON.stringify({ 
              success: false, 
              offline: true, 
              message: 'Operación guardada para sincronizar cuando se recupere la conexión' 
            }), {
              headers: { 'Content-Type': 'application/json' }
            });
          }
          
          // Para GET, intentar obtener de cache
          return caches.match(event.request);
        })
    );
    return;
  }
  
  // Estrategia para recursos estáticos: Cache first, network fallback
  event.respondWith(
    caches.match(event.request).then((cacheResponse) => {
      return cacheResponse || fetch(event.request.clone())
        .then((response) => {
          // Verificar si la respuesta es válida para cachear
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Cachear la respuesta nueva para futuras solicitudes
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // Si falla la red y no hay cache, mostrar página offline
          if (event.request.mode === 'navigate') {
            return caches.match('/offline.html');
          }
          
          // O retornar una respuesta de error para recursos
          return new Response('Error de conexión', { 
            status: 503, 
            statusText: 'Servicio no disponible' 
          });
        });
    })
  );
});

// Gestión de sincronización en segundo plano
sw.addEventListener('sync', (event) => {
  if (event.tag === 'sync-pending-operations') {
    event.waitUntil(syncPendingOperations());
  }
});

// Gestión de notificaciones push
sw.addEventListener('push', (event) => {
  if (!event.data) return;
  
  try {
    const data = event.data.json();
    
    const options = {
      body: data.message || 'Notificación del sistema de inventario',
      icon: '/icons/icon-192x192.png',
      badge: '/icons/badge-96x96.png',
      data: {
        url: data.url || '/'
      }
    };
    
    event.waitUntil(
      sw.registration.showNotification(data.title || 'Sistema de Inventario', options)
    );
  } catch (error) {
    console.error('Error al procesar notificación push:', error);
  }
});

// Al hacer clic en una notificación
sw.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      sw.clients.matchAll({ type: 'window' }).then((clientList) => {
        // Si ya hay una ventana abierta, enfócarla y navegar
        for (const client of clientList) {
          if (client.url === event.notification.data.url && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Si no hay ventana abierta, abrir una nueva
        if (sw.clients.openWindow) {
          return sw.clients.openWindow(event.notification.data.url);
        }
      })
    );
  }
});

// Función para sincronizar operaciones pendientes
async function syncPendingOperations() {
  try {
    // Obtener operaciones pendientes desde IndexedDB
    // Esto debe ser implementado junto con la infraestructura de IndexedDB
    // por ahora simplemente simulamos el proceso
    console.log('Sincronizando operaciones pendientes...');
    return Promise.resolve();
  } catch (error) {
    console.error('Error al sincronizar operaciones pendientes:', error);
    return Promise.reject(error);
  }
}