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
  // 1. Criamos um estado para guardar o ID do pet selecionado
  const [selectedPetId, setSelectedPetId] = useState(null);

  // 2. Ajustamos a função para receber o ID do pet que foi clicado
  const goToDetails = (id) => {
    setSelectedPetId(id); // Agora ele salva dinamicamente o ID correto!
    setCurrentPage("details"); // Muda para a tela de detalhes
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
          onNavigate={goToDetails} // Após editar, volta para os detalhes do pet
          onFavoritesClick={goToFavorites}
          onLoginClick={goToLogin}
          onRegisterPetClick={goToRegisterPet}
        />
      )}
    </div>
  );
}

export default App;