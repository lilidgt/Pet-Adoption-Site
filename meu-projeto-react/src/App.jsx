import React, { useState } from 'react';
import PetsParaAdocao from './pages/PetsParaAdocao/PetsParaAdocao';
import PetDetail from './pages/PetDetail/PetDetail';
import Login from './pages/Login/Login';
import SignUp from './pages/SignUp/SignUp';
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

  const goToSignUp = () => {
    setCurrentPage('signup');
  };

  return (
    <div className="App">
      {currentPage === 'login' && (
        <Login onLogin={goToList} onSignUpClick={goToSignUp} />
      )}
      {currentPage === 'signup' && (
        <SignUp onSignUp={goToList} onLoginClick={goToLogin} />
      )}
      {currentPage === 'list' && (
        <PetsParaAdocao 
          onCardClick={goToDetails} 
          onNavigate={goToList} 
          onLoginClick={goToLogin} 
        />
      )}
      {currentPage === 'details' && (
        <PetDetail 
          onBackClick={goToList} 
          onNavigate={goToList} 
          onLoginClick={goToLogin} 
        />
      )}
    </div>
  );
}

export default App;
