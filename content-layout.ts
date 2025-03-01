import React, { useContext } from 'react';
import { ThemeContext } from '../../context/ThemeContext';
import { AlertsContext } from '../../context/AlertsContext';

interface ContentLayoutProps {
  children: React.ReactNode;
  title: string;
  breadcrumbs?: Array<{ label: string; path?: string }>;
  actions?: React.ReactNode;
}

const ContentLayout: React.FC<ContentLayoutProps> = ({
  children,
  title,
  breadcrumbs = [],
  actions
}) => {
  const { darkMode } = useContext(ThemeContext);
  const { alerts } = useContext(AlertsContext);

  return (
    <div className={`content-layout flex-grow p-6 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-800'}`}>
      {/* Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <nav className="text-sm mb-4">
          <ol className="list-none p-0 inline-flex">
            {breadcrumbs.map((crumb, index) => (
              <li key={index} className="flex items-center">
                {index > 0 && <span className="mx-2 text-gray-500">/</span>}
                {crumb.path ? (
                  <a 
                    href={crumb.path} 
                    className={`${darkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-800'}`}
                  >
                    {crumb.label}
                  </a>
                ) : (
                  <span className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>{crumb.label}</span>
                )}
              </li>
            ))}
          </ol>
        </nav>
      )}

      {/* Page header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
        {actions && <div className="flex space-x-2">{actions}</div>}
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="mb-6 space-y-2">
          {alerts.map((alert) => (
            <div 
              key={alert.id} 
              className={`p-4 rounded-md ${
                alert.type === 'success' ? 'bg-green-100 text-green-800 border-green-200' :
                alert.type === 'warning' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                alert.type === 'error' ? 'bg-red-100 text-red-800 border-red-200' :
                'bg-blue-100 text-blue-800 border-blue-200'
              } flex justify-between items-center`}
            >
              <div className="flex items-center">
                <span className="material-icons mr-2">
                  {alert.type === 'success' ? 'check_circle' :
                   alert.type === 'warning' ? 'warning' :
                   alert.type === 'error' ? 'error' : 'info'}
                </span>
                <span>{alert.message}</span>
              </div>
              <button 
                onClick={() => alert.onClose && alert.onClose(alert.id)} 
                className="text-gray-500 hover:text-gray-700"
              >
                <span className="material-icons">close</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Main content */}
      <div className={`content-container ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md p-6`}>
        {children}
      </div>
    </div>
  );
};

export default ContentLayout;
