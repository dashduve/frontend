import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ThemeContext } from '../../context/ThemeContext';

interface MenuItem {
  label: string;
  path: string;
  icon: string;
  roles: string[];
}

const Sidebar: React.FC = () => {
  const { user } = useContext(AuthContext);
  const { darkMode } = useContext(ThemeContext);

  const menuItems: MenuItem[] = [
    { label: 'Dashboard', path: '/dashboard', icon: 'dashboard', roles: ['Administrador', 'Inventario', 'Ventas', 'Reportes'] },
    { label: 'Productos', path: '/productos', icon: 'inventory_2', roles: ['Administrador', 'Inventario'] },
    { label: 'Categorías', path: '/categorias', icon: 'category', roles: ['Administrador', 'Inventario'] },
    { label: 'Proveedores', path: '/proveedores', icon: 'local_shipping', roles: ['Administrador', 'Inventario'] },
    { label: 'Inventario', path: '/inventario', icon: 'inventory', roles: ['Administrador', 'Inventario'] },
    { label: 'Movimientos', path: '/inventario/movimientos', icon: 'sync_alt', roles: ['Administrador', 'Inventario'] },
    { label: 'Pedidos', path: '/pedidos', icon: 'shopping_cart', roles: ['Administrador', 'Ventas'] },
    { label: 'Alertas', path: '/alertas', icon: 'notifications', roles: ['Administrador', 'Inventario', 'Ventas'] },
    { label: 'Reportes', path: '/reportes', icon: 'assessment', roles: ['Administrador', 'Reportes'] },
    { label: 'Configuración', path: '/settings', icon: 'settings', roles: ['Administrador'] },
  ];

  // Filter menu items based on user roles
  const filteredMenuItems = menuItems.filter(item => 
    user?.roles?.some(role => item.roles.includes(role))
  );

  return (
    <div className={`sidebar ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} h-screen w-64 fixed left-0 top-0 pt-16 shadow-md`}>
      <div className="p-4">
        <div className="company-info mb-6 text-center">
          <h3 className="text-lg font-semibold">{user?.empresa?.nombre || 'Mi Empresa'}</h3>
          <p className="text-sm opacity-75">Sistema de Inventario</p>
        </div>

        <nav>
          <ul className="space-y-2">
            {filteredMenuItems.map((item) => (
              <li key={item.path}>
                <NavLink 
                  to={item.path}
                  className={({ isActive }) => 
                    `flex items-center p-2 rounded-md transition-colors ${
                      isActive 
                        ? (darkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800') 
                        : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')
                    }`
                  }
                >
                  <span className="material-icons mr-3 text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className={`absolute bottom-0 w-full p-4 text-center ${darkMode ? 'border-t border-gray-700' : 'border-t border-gray-200'}`}>
        <div className="text-sm opacity-75">
          <p>Versión 1.0.0</p>
          <p>© 2025 PWA Inventario</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
