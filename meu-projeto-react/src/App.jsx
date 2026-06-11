import React, { useState } from "react";
import PetsParaAdocao from "./pages/PetsParaAdocao/PetsParaAdocao";
import PetDetail from "./pages/PetDetail/PetDetail";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
import Favorites from "./pages/Favorites/Favorites";
import RegisterPet from "./pages/RegisterPet/RegisterPet";
import EditPet from "./pages/EditPet/EditPet"; // Importando a nova tela de edição
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("login");
  const [selectedPetId, setSelectedPetId] = useState(null);

  const goToDetails = (id) => {
    setSelectedPetId(id);
    setCurrentPage("details");
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

  // Nova função para ir para a tela de edição
  const goToEditPet = (id) => {
    setSelectedPetId(id);
    setCurrentPage("edit");
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
          onCardClick={goToDetails}
          onNavigate={goToList}
          onLoginClick={goToLogin}
          onFavoritesClick={goToFavorites}
          onRegisterPetClick={goToRegisterPet}
        />
      )}

      {currentPage === "details" && (
        <PetDetail
          petId={selectedPetId}
          onBackClick={goToList}
          onNavigate={goToList}
          onLoginClick={goToLogin}
          onFavoritesClick={goToFavorites}
          onRegisterPetClick={goToRegisterPet}
          onEditClick={goToEditPet} // Passando a função para o botão de editar
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

      {/* Nova Rota para Edição */}
      {currentPage === "edit" && (
        <EditPet
          petId={selectedPetId}
          onNavigate={goToList}
          onFavoritesClick={goToFavorites}
          onLoginClick={goToLogin}
          onRegisterPetClick={goToRegisterPet}
          onBackClick={() => goToDetails(selectedPetId)} // O voltar da edição volta pro detalhe
        />
      )}
    </div>
  );
}

export default App;
