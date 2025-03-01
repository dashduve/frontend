// Estructura del proyecto ReactJS
/*
/public
  /icons                     - Iconos para PWA
  /images                    - Imágenes estáticas
  manifest.json              - Manifiesto PWA
  robots.txt                 - Configuración para robots
  
/src
  /assets                    - Activos estáticos
    /images                  - Imágenes
    /styles                  - Estilos globales
  
  /components                - Componentes reutilizables
    /ui                      - Componentes de UI básicos
      Button.tsx             - Componente de botón
      Card.tsx               - Componente de tarjeta
      Input.tsx              - Componente de entrada
      Modal.tsx              - Componente de modal
      Table.tsx              - Componente de tabla
      Alert.tsx              - Componente de alerta
    
    /layout                  - Componentes de diseño
      AppLayout.tsx          - Layout principal
      Sidebar.tsx            - Barra lateral
      Header.tsx             - Cabecera
      Footer.tsx             - Pie de página
      ContentLayout.tsx      - Layout de contenido
    
    /auth                    - Componentes de autenticación
      LoginForm.tsx          - Formulario de inicio de sesión
      RegisterForm.tsx       - Formulario de registro
    
    /dashboards              - Componentes de dashboard
      DashboardStats.tsx     - Estadísticas de dashboard
      InventarioResumen.tsx  - Resumen de inventario
    
    /productos               - Componentes de productos
      ProductosList.tsx      - Lista de productos
      ProductoForm.tsx       - Formulario de producto
      ProductoDetail.tsx     - Detalle de producto
      
    /categorias              - Componentes de categorías
      CategoriasList.tsx     - Lista de categorías
      CategoriaForm.tsx      - Formulario de categoría
    
    /proveedores             - Componentes de proveedores
      ProveedoresList.tsx    - Lista de proveedores
      ProveedorForm.tsx      - Formulario de proveedor
    
    /inventario              - Componentes de inventario
      MovimientosList.tsx    - Lista de movimientos
      MovimientoForm.tsx     - Formulario de movimiento
      StockActual.tsx        - Estado actual del stock
    
    /alertas                 - Componentes de alertas
      AlertasList.tsx        - Lista de alertas
      AlertaDetail.tsx       - Detalle de alerta
    
    /reportes                - Componentes de reportes
      ReportesList.tsx       - Lista de reportes
      ReporteForm.tsx        - Formulario de reporte
      
    /pedidos                 - Componentes de pedidos
      PedidosList.tsx        - Lista de pedidos
      PedidoForm.tsx         - Formulario de pedido
      PedidoDetail.tsx       - Detalle de pedido
  
  /context                   - Contextos de React
    AuthContext.tsx          - Contexto de autenticación
    AlertsContext.tsx        - Contexto de alertas
    ThemeContext.tsx         - Contexto de tema
  
  /hooks                     - Custom hooks
    useAuth.ts               - Hook de autenticación
    useFetch.ts              - Hook para peticiones HTTP
    useOffline.ts            - Hook para detectar estado offline
    useWebSocket.ts          - Hook para WebSockets
  
  /pages                     - Páginas de la aplicación
    /auth                    - Páginas de autenticación
      LoginPage.tsx          - Página de inicio de sesión
      RegisterPage.tsx       - Página de registro
    
    /dashboard               - Páginas de dashboard
      DashboardPage.tsx      - Página principal de dashboard
    
    /productos               - Páginas de productos
      ProductosPage.tsx      - Página de listado de productos
      ProductoEditPage.tsx   - Página de edición de producto
      ProductoCreatePage.tsx - Página de creación de producto
    
    /categorias              - Páginas de categorías
      CategoriasPage.tsx     - Página de listado de categorías
    
    /proveedores             - Páginas de proveedores
      ProveedoresPage.tsx    - Página de listado de proveedores
    
    /inventario              - Páginas de inventario
      InventarioPage.tsx     - Página principal de inventario
      MovimientosPage.tsx    - Página de movimientos
    
    /alertas                 - Páginas de alertas
      AlertasPage.tsx        - Página de alertas
    
    /reportes                - Páginas de reportes
      ReportesPage.tsx       - Página de reportes
    
    /pedidos                 - Páginas de pedidos
      PedidosPage.tsx        - Página de listado de pedidos
      PedidoCreatePage.tsx   - Página de creación de pedido
    
    /settings                - Páginas de configuración
      SettingsPage.tsx       - Página de configuración
    
    NotFoundPage.tsx         - Página 404
  
  /api                       - Servicios de API
    axiosInstance.ts         - Instancia configurada de Axios
    authService.ts           - Servicio de autenticación
    productosService.ts      - Servicio de productos
    categoriasService.ts     - Servicio de categorías
    proveedoresService.ts    - Servicio de proveedores
    inventarioService.ts     - Servicio de inventario
    alertasService.ts        - Servicio de alertas
    reportesService.ts       - Servicio de reportes
    pedidosService.ts        - Servicio de pedidos
  
  /utils                     - Utilidades
    formatters.ts            - Funciones de formato
    validators.ts            - Funciones de validación
    storage.ts               - Funciones para almacenamiento local
    
  /types                     - Definiciones de tipos
    models.ts                - Modelos de datos
    
  /service-worker            - Configuración del Service Worker
    service-worker.ts        - Implementación del Service Worker
    serviceWorkerRegistration.ts - Registro del Service Worker
  
  App.tsx                    - Componente principal
  index.tsx                  - Punto de entrada
  routes.tsx                 - Definición de rutas
*/
