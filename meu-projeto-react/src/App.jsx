import React, { useState } from "react";
import PetsParaAdocao from "./pages/PetsParaAdocao/PetsParaAdocao";
import PetDetail from "./pages/PetDetail/PetDetail";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
import Favorites from "./pages/Favorites/Favorites";
import RegisterPet from "./pages/RegisterPet/RegisterPet";
import EditPet from "./pages/EditPet/EditPet";
import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("login");
  const [selectedPetId, setSelectedPetId] = useState(null);

  // 1. [MUDANÇA] Adicionado o estado para controlar se está logado
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('user') !== null;
  });

  // 2. [MUDANÇA] Função para quando o login der certo
  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setCurrentPage("list");
  };

  // 3. [MUDANÇA] Função para limpar os dados ao sair
  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setCurrentPage("login");
  };

  const goToDetails = (id) => {
    setSelectedPetId(id);
    setCurrentPage("details");
  };

  const goToEdit = (id) => {
    setSelectedPetId(id);
    setCurrentPage("edit");
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
      {/* 4. [MUDANÇA] Trocado goToList por handleLoginSuccess */}
      {currentPage === "login" && (
        <Login onLogin={handleLoginSuccess} onSignUpClick={goToSignUp} />
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
          // 5. [MUDANÇA] Repassando as props de login para a página
          isLoggedIn={isLoggedIn}
          onLogoutClick={handleLogout}
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
          onEditClick={goToEdit}
          // 5. [MUDANÇA] Repassando as props de login para a página
          isLoggedIn={isLoggedIn}
          onLogoutClick={handleLogout}
        />
      )}
      {currentPage === "favorites" && (
        <Favorites
          onCardClick={goToDetails}
          onNavigate={goToList}
          onFavoritesClick={goToFavorites}
          onLoginClick={goToLogin}
          onRegisterPetClick={goToRegisterPet}
          // 5. [MUDANÇA] Repassando as props de login para a página
          isLoggedIn={isLoggedIn}
          onLogoutClick={handleLogout}
        />
      )}
      {currentPage === "register" && (
        <RegisterPet
          onNavigate={goToList} 
          onFavoritesClick={goToFavorites}
          onLoginClick={goToLogin}
          onRegisterPetClick={goToRegisterPet}
          // 5. [MUDANÇA] Repassando as props de login para a página
          isLoggedIn={isLoggedIn}
          onLogoutClick={handleLogout}
        />
      )}
      {currentPage === "edit" && (
        <EditPet
          petId={selectedPetId}
          onNavigate={goToDetails}
          onFavoritesClick={goToFavorites}
          onLoginClick={goToLogin}
          onRegisterPetClick={goToRegisterPet}
          // 5. [MUDANÇA] Repassando as props de login para a página
          isLoggedIn={isLoggedIn}
          onLogoutClick={handleLogout}
        />
      )}
    </div>
  );
}

export default App;