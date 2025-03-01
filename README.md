# Sistema de Gestión de Inventario - Frontend

Este repositorio contiene la aplicación frontend del Sistema de Gestión de Inventario, desarrollada con React y TypeScript. La aplicación proporciona una interfaz de usuario completa para administrar productos, proveedores, categorías, movimientos de inventario, pedidos y reportes.

## Características

- **Gestión de Productos**: Crear, editar, eliminar y visualizar productos.
- **Catálogo de Categorías**: Administración de categorías para productos.
- **Directorio de Proveedores**: Gestión completa de proveedores.
- **Control de Inventario**: Seguimiento de movimientos y estado actual del stock.
- **Gestión de Pedidos**: Creación y seguimiento de pedidos.
- **Sistema de Alertas**: Notificaciones para stock bajo y otros eventos importantes.
- **Reportes Personalizables**: Generación de reportes para análisis de datos.
- **Panel de Control**: Visualización de estadísticas clave e indicadores.
- **Diseño Responsive**: Adaptable a dispositivos móviles y de escritorio.
- **Modo Offline**: Funcionalidad básica sin conexión a internet.
- **PWA Ready**: Instalable como aplicación progresiva web.

## Requisitos Previos

- Node.js (v14.0.0 o superior)
- npm (v6.0.0 o superior) o yarn (v1.22.0 o superior)

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/tu-usuario/sistema-inventario-frontend.git
   cd sistema-inventario-frontend
   ```

2. Instalar dependencias:
   ```bash
   npm install
   # o con yarn
   yarn install
   ```

3. Configurar variables de entorno:
   - Copia el archivo `.env.example` a `.env.local`
   - Ajusta las variables según tu entorno

4. Iniciar la aplicación en modo desarrollo:
   ```bash
   npm start
   # o con yarn
   yarn start
   ```

## Estructura del Proyecto

```
proyecto-inventario-frontend/
├── public/                 # Archivos públicos y estáticos
├── src/                    # Código fuente
│   ├── assets/             # Activos estáticos (imágenes, estilos)
│   ├── components/         # Componentes reutilizables
│   ├── context/            # Contextos de React
│   ├── hooks/              # Custom hooks
│   ├── pages/              # Páginas de la aplicación
│   ├── api/                # Servicios de API
│   ├── utils/              # Utilidades
│   ├── types/              # Definiciones de tipos
│   ├── service-worker/     # Configuración del Service Worker
│   ├── App.tsx             # Componente principal
│   ├── index.tsx           # Punto de entrada
│   └── routes.tsx          # Definición de rutas
```

## Scripts Disponibles

- `npm start`: Inicia el servidor de desarrollo
- `npm run build`: Compila la aplicación para producción
- `npm test`: Ejecuta las pruebas
- `npm run eject`: Expone la configuración de webpack (¡usar con precaución!)

## Tecnologías Principales

- **React**: Biblioteca para construir interfaces de usuario
- **TypeScript**: Superconjunto tipado de JavaScript
- **React Router**: Navegación entre páginas
- **Axios**: Cliente HTTP para realizar peticiones
- **Context API**: Gestión de estado global
- **PWA**: Funcionalidades de Progressive Web App
- **Service Workers**: Soporte offline y caché
- **Tailwind CSS**: Framework de utilidades CSS para el diseño

## Integración con Backend

La aplicación se comunica con una API RESTful desarrollada en Node.js/Express. Todos los servicios de API se encuentran en la carpeta `src/api/`.

## Despliegue

Para compilar la aplicación para producción:

```bash
npm run build
# o con yarn
yarn build
```

Los archivos generados se colocarán en la carpeta `build/` y estarán listos para ser desplegados en cualquier servidor web estático.

## Consideraciones para Desarrollo

- Utiliza componentes funcionales y hooks de React
- Sigue las mejores prácticas de TypeScript
- Mantén la separación de responsabilidades entre componentes
- Utiliza los contextos para estado global compartido
- Implementa lazy loading para optimizar el rendimiento
