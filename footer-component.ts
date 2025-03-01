import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';

const Footer: React.FC = () => {
  const { darkMode } = useContext(ThemeContext);
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`p-4 mt-auto ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-600'}`}>
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-sm">
          © {currentYear} PWA Inventario. Todos los derechos reservados.
        </div>
        <div className="mt-2 md:mt-0">
          <span className="text-sm">
            Versión 1.0.0 | 
            <a 
              href="/terminos" 
              className={`ml-2 ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
            >
              Términos de Uso
            </a> | 
            <a 
              href="/privacidad" 
              className={`ml-2 ${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
            >
              Política de Privacidad
            </a>
          </span>
        </div>
      </div>

      <div className="text-center mt-2 text-xs opacity-75">
        <p>Desarrollado para gestión de inventarios en PYMES</p>
        <p>Estado de conexión: <span id="connection-status" className="font-semibold text-green-500">En línea</span></p>
      </div>
    </footer>
  );
};

export default Footer;
