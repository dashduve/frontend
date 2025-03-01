

// Verifica si los service workers son soportados
export function register() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
      registerServiceWorker(swUrl);
      
      // Registrar para eventos de sincronización periódica si está disponible
      registerPeriodicSync();
    });
  }
}

function registerServiceWorker(swUrl: string) {
  navigator.serviceWorker
    .register(swUrl)
    .then(registration => {
      console.log('Service Worker registrado con éxito:', registration.scope);
      
      // Comprobar actualizaciones cada cierto tiempo
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // En este punto, el antiguo contenido habrá sido purgado y
              // el nuevo contenido habrá sido agregado al caché.
              console.log('Nuevo contenido disponible; refresca para actualizar.');
              
              // Opcionalmente, notificar al usuario para que actualice
              if (window.confirm('Nueva versión disponible. ¿Desea actualizar?')) {
                window.location.reload();
              }
            } else {
              // En este punto, todo se ha precargado.
              console.log('Contenido en caché para uso offline.');
            }
          }
        };
      };
      
      // Registrar para eventos de push si está disponible
      subscribeUserToPush(registration);
    })
    .catch(error => {
      console.error('Error durante el registro del Service Worker:', error);
    });
}

// Registrar sincronización periódica si el navegador lo soporta
async function registerPeriodicSync() {
  if ('periodicSync' in navigator.serviceWorker) {
    try {
      const status = await navigator.permissions.query({
        name: 'periodic-background-sync' as any,
      });
      
      if (status.state === 'granted') {
        const registration = await navigator.serviceWorker.ready;
        if ('periodicSync' in registration) {
          await (registration as any).periodicSync.register('sync-pending-operations', {
            // Sincronizar al menos cada 12 horas
            minInterval: 12 * 60 * 60 * 1000,
          });
          console.log('Sincronización periódica registrada');
        }
      }
    } catch (error) {
      console.error('Error al registrar sincronización periódica:', error);
    }
  }
}

// Suscribir al usuario a notificaciones push
async function subscribeUserToPush(registration: ServiceWorkerRegistration) {
  try {
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.REACT_APP_VAPID_PUBLIC_KEY || ''
      )
    });
    
    console.log('Usuario suscrito a notificaciones push:', subscription);
    
    // Aquí normalmente se enviaría la suscripción al servidor
    // para guardarla y poder enviar notificaciones a este dispositivo
  } catch (error) {
    console.error('No se pudo suscribir a notificaciones push:', error);
  }
}

// Convertir clave VAPID de base64 a Uint8Array para la API de Push
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Desregistrar el service worker
export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then(registration => {
        registration.unregister();
      })
      .catch(error => {
        console.error('Error al desregistrar el service worker:', error);
      });
  }
}