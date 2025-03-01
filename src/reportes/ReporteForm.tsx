import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Alert from '../ui/Alert';
import { reportesService } from '../../api/reportesService';
import { useOffline } from '../../hooks/useOffline';

type ReporteFormValues = {
  tipo: 'Inventario' | 'Ventas' | 'Perdidas';
  fechaInicio: string;
  fechaFin: string;
  incluirProductosInactivos: boolean;
  formatoSalida: 'PDF' | 'Excel';
};

const ReporteForm: React.FC = () => {
  const [values, setValues] = useState<ReporteFormValues>({
    tipo: 'Inventario',
    fechaInicio: '',
    fechaFin: '',
    incluirProductosInactivos: false,
    formatoSalida: 'PDF',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { isOffline } = useOffline();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      setValues((prev) => ({ ...prev, [name]: checkbox.checked }));
    } else {
      setValues((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isOffline) {
      setError('No puedes generar reportes en modo sin conexión');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await reportesService.generarReporte(values);
      setSuccess(true);
      setTimeout(() => {
        navigate('/reportes');
      }, 2000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Error al generar el reporte');
      }
    } finally {
      setLoading(false);
    }
  };

  if (isOffline) {
    return <Alert type="warning" message="No puedes generar reportes en modo sin conexión. Conéctate a internet e intenta nuevamente." />;
  }

  return (
    <Card>
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Generar Reporte</h2>
        
        {error && <Alert type="error" message={error} className="mb-4" />}
        {success && <Alert type="success" message="Reporte generado correctamente. Redirigiendo..." className="mb-4" />}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block mb-2 font-medium">Tipo de Reporte</label>
              <select
                name="tipo"
                value={values.tipo}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="Inventario">Inventario Actual</option>
                <option value="Ventas">Movimientos / Salidas</option>
                <option value="Perdidas">Productos Bajo Mínimo</option>
              </select>
            </div>
            
            <div>
              <label className="block mb-2 font-medium">Formato de Salida</label>
              <select
                name="formatoSalida"
                value={values.formatoSalida}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="PDF">PDF</option>
                <option value="Excel">Excel</option>
              </select>
            </div>
            
            <div>
              <label className="block mb-2 font-medium">Fecha Inicio</label>
              <Input
                type="date"
                name="fechaInicio"
                value={values.fechaInicio}
                onChange={handleChange}
                required
              />
            </div>
            
            <div>
              <label className="block mb-2 font-medium">Fecha Fin</label>
              <Input
                type="date"
                name="fechaFin"
                value={values.fechaFin}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="incluirProductosInactivos"
                checked={values.incluirProductosInactivos}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 rounded"
              />
              <span>Incluir productos sin movimiento</span>
            </label>
          </div>
          
          <div className="flex space-x-3">
            <Button
              type="button"
              onClick={() => navigate('/reportes')}
              variant="secondary"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading ? 'Generando...' : 'Generar Reporte'}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
};

export default ReporteForm;