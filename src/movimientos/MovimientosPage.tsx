import React, { useState } from 'react';
import { ContentLayout } from '../components/layout/ContentLayout';
import MovimientosList from '../components/inventario/MovimientosList';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const MovimientosPage: React.FC = () => {
  const navigate = useNavigate();
  const [filtroTipo, setFiltroTipo] = useState<string>('');
  const [fechaInicio, setFechaInicio] = useState<string>('');
  const [fechaFin, setFechaFin] = useState<string>('');

  const handleFiltroChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFiltroTipo(e.target.value);
  };

  const handleNuevoMovimiento = () => {
    navigate('/inventario/movimientos/nuevo');
  };

  return (
    <ContentLayout title="Movimientos de Inventario">
      <Card>
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Registro de Movimientos</h5>
            <Button variant="primary" onClick={handleNuevoMovimiento}>
              Registrar Nuevo Movimiento
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="row mb-3">
            <div className="col-md-3">
              <label htmlFor="filtroTipo" className="form-label">Tipo de Movimiento</label>
              <select
                id="filtroTipo"
                className="form-select"
                value={filtroTipo}
                onChange={handleFiltroChange}
              >
                <option value="">Todos</option>
                <option value="Entrada">Entradas</option>
                <option value="Salida">Salidas</option>
                <option value="Ajuste">Ajustes</option>
              </select>
            </div>
            <div className="col-md-3">
              <label htmlFor="fechaInicio" className="form-label">Fecha Inicio</label>
              <input
                id="fechaInicio"
                type="date"
                className="form-control"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <label htmlFor="fechaFin" className="form-label">Fecha Fin</label>
              <input
                id="fechaFin"
                type="date"
                className="form-control"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>
            <div className="col-md-3 d-flex align-items-end">
              <Button variant="outline-secondary" className="w-100">
                Limpiar Filtros
              </Button>
            </div>
          </div>
          
          <MovimientosList filtroTipo={filtroTipo ? filtroTipo : undefined} />
        </Card.Body>
      </Card>
    </ContentLayout>
  );
};

export default MovimientosPage;