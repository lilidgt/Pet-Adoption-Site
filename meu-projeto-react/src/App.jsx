import React, { useState } from 'react';
import PetsParaAdocao from './pages/PetsParaAdocao/PetsParaAdocao';
import PetDetail from './pages/PetDetail/PetDetail';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = useState('list');

  const goToDetails = () => {
    setCurrentPage('details');
  };

  const goToList = () => {
    setCurrentPage('list');
  };

  return (
    <div className="App">
      {currentPage === 'list' ? (
        <PetsParaAdocao onCardClick={goToDetails} />
      ) : (
        <PetDetail onBackClick={goToList} />
      )}
    </div>
  );
}

export default App;
