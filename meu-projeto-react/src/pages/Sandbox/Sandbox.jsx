import React from 'react';
import Header from '../../components/Header/Header';
import Filters from '../../components/Filters/Filters';
import './Sandbox.css';

const Sandbox = () => {
  return (
    <div className="sandbox-container">
      <Header />
      
      <main className="sandbox-layout">
        <Filters />
        
        <div className="sandbox-content">
          {/* Espaço para futuros componentes como cards de pets */}
          <h2 style={{ padding: '40px', color: '#888' }}>
            Main Content Area
          </h2>
        </div>
      </main>
    </div>
  );
};

export default Sandbox;
