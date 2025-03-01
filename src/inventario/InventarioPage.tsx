import React, { useState } from 'react';
import { Card, Tab, Nav } from 'react-bootstrap';
import StockActual from '../components/inventario/StockActual';
import MovimientosList from '../components/inventario/MovimientosList';
import { ContentLayout } from '../components/layout/ContentLayout';

const InventarioPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('stock');

  return (
    <ContentLayout title="Gestión de Inventario">
      <Card>
        <Card.Header>
          <Nav variant="tabs" defaultActiveKey="stock">
            <Nav.Item>
              <Nav.Link 
                eventKey="stock" 
                onClick={() => setActiveTab('stock')}
                active={activeTab === 'stock'}
              >
                Stock Actual
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link 
                eventKey="movimientos" 
                onClick={() => setActiveTab('movimientos')}
                active={activeTab === 'movimientos'}
              >
                Movimientos
              </Nav.Link>
            </Nav.Item>
          </Nav>
        </Card.Header>
        <Card.Body>
          {activeTab === 'stock' && <StockActual />}
          {activeTab === 'movimientos' && <MovimientosList />}
        </Card.Body>
      </Card>
    </ContentLayout>
  );
};

export default InventarioPage;