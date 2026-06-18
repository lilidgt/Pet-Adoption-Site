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
  // ALTERAÇÃO: Verifica se já existe um token salvo para definir a página inicial
  const [currentPage, setCurrentPage] = useState(() => {
    const token = localStorage.getItem("token");
    return token ? "list" : "login";
  });

  const [selectedPetId, setSelectedPetId] = useState(null);

  const goToDetails = (id) => {
    setSelectedPetId(id); 
    setCurrentPage("details"); 
  };

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
  const user = localStorage.getItem('user');
  const loginTimestamp = localStorage.getItem('loginTimestamp');

  if (!user || !loginTimestamp) {
    return false;
  }

  // Define o tempo limite (24 horas em milissegundos)
  // 24 horas * 60 minutos * 60 segundos * 1000 milissegundos
  const TEMPO_LIMITE = 24 * 60 * 60 * 1000; 
  const agora = Date.now();
  const tempoDecorrido = agora - Number(loginTimestamp);

  // Se o tempo passou do limite, limpa o lixo do localStorage e retorna falso
  if (tempoDecorrido > TEMPO_LIMITE) {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('loginTimestamp');
    return false;
  }

  return true;
});

  const goToEdit = (id) => {
    setSelectedPetId(id);
    setCurrentPage("edit");
  };

  const goToList = () => {
    setCurrentPage("list");
  };

  const goToLogin = () => {
    // ALTERAÇÃO: Ao ir para a tela de login (Logout), limpamos os dados salvos
    localStorage.removeItem("token");
    localStorage.removeItem("user");
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
          onEditClick={goToEdit}
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
      {currentPage === "edit" && (
        <EditPet
          petId={selectedPetId}
          onNavigate={goToDetails} 
          onFavoritesClick={goToFavorites}
          onLoginClick={goToLogin}
          onRegisterPetClick={goToRegisterPet}
        />
      )}
    </div>
  );
}

export default App;