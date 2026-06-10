import React, { useState } from "react";
import PetsParaAdocao from "./pages/PetsParaAdocao/PetsParaAdocao";
import PetDetail from "./pages/PetDetail/PetDetail";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
import Favorites from "./pages/Favorites/Favorites";
import RegisterPet from "./pages/RegisterPet/RegisterPet";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("login");
  // 1. Criamos um estado para guardar o ID do pet selecionado
  const [selectedPetId, setSelectedPetId] = useState(null);

  // 2. Ajustamos a função para receber o ID do pet que foi clicado
  const goToDetails = (id) => {
    setSelectedPetId(1); // Guarda o ID (ex: 1) no estado
    setCurrentPage("details"); // Muda para a tela de detalhes
  };

  const goToList = () => {
    setCurrentPage("list");
  };

  const goToLogin = () => {
    setCurrentPage("login");
  };

  const goToSignUp = () => {
    setCurrentPage("signup");
  };

  const goToFavorites = () => {
    setCurrentPage("favorites");
    };

  const goToRegisterPet = () => {
    setCurrentPage("register");
  };

  return (
    <div className="App">
      {currentPage === "login" && (
        <Login onLogin={goToList} onSignUpClick={goToSignUp} />
      )}
      {currentPage === "signup" && (
        <SignUp onSignUp={goToList} onLoginClick={goToLogin} />
      )}
      {currentPage === "list" && (
        <PetsParaAdocao
          onCardClick={goToDetails} // Agora essa função captura o ID enviado pelo card
          onNavigate={goToList}
          onLoginClick={goToLogin}
          onFavoritesClick={goToFavorites}
          onRegisterPetClick={goToRegisterPet}
        />
      )}
      {currentPage === "details" && (
        <PetDetail
          petId={selectedPetId} // 3. PASSAMOS O ID SALVO PARA O COMPONENTE DETALHES!
          onBackClick={goToList}
          onNavigate={goToList}
          onLoginClick={goToLogin}
          onFavoritesClick={goToFavorites}
          onRegisterPetClick={goToRegisterPet}
        />
      )}
      {currentPage === "favorites" && (
        <Favorites
          onCardClick={goToDetails}
          onNavigate={goToList}
          onFavoritesClick={goToFavorites}
          onLoginClick={goToLogin}
          onRegisterPetClick={goToRegisterPet}
        />
      )}
      {currentPage === "register" && (
        <RegisterPet
          onNavigate={goToList} 
          onFavoritesClick={goToFavorites}
          onLoginClick={goToLogin}
          onRegisterPetClick={goToRegisterPet}
        />
      )}
    </div>
  );
}

export default App;