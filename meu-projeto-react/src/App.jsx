import React, { useState } from 'react';
import PetsParaAdocao from './pages/PetsParaAdocao/PetsParaAdocao';
import PetDetail from './pages/PetDetail/PetDetail';
import Login from './pages/Login/Login';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('login');

  const goToDetails = () => {
    setCurrentPage('details');
  };

  const goToList = () => {
    setCurrentPage('list');
  };

  const goToLogin = () => {
    setCurrentPage('login');
  };

  return (
    <div className="App">
      {currentPage === 'login' && (
        <Login onLogin={goToList} />
      )}
      {currentPage === 'list' && (
        <PetsParaAdocao onCardClick={goToDetails} onNavigate={goToList} />
      )}
      {currentPage === 'details' && (
        <PetDetail onBackClick={goToList} onNavigate={goToList} />
      )}
    </div>
  );
}

export default App;
