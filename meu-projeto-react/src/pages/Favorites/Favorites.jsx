import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import PetCard from "../../components/Cards/PetCard";
import Footer from "../../components/Footer/Footer";
import "./Favorites.css";

const Favorites = ({
  onCardClick,
  onNavigate,
  onFavoritesClick,
  onRegisterPetClick,
  onLoginClick,
  isLoggedIn,
  onLogoutClick,
}) => {
  const [favoritePets, setFavoritePets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loggedUser = JSON.parse(localStorage.getItem("user")) || null;
  const userId = loggedUser?.id;

  useEffect(() => {
    if (!userId) {
      setError("Você precisa estar logado para ver seus favoritos.");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");

    fetch(`http://localhost:3001/favoritos/${userId}`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao carregar a lista de favoritos.");
        }
        return response.json();
      })
      .then((data) => {
        setFavoritePets(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro no fetch de favoritos:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [userId]);

  return (
    <div className="favorites-container">
      <Header
        onNavigate={onNavigate}
        onFavoritesClick={onFavoritesClick}
        onRegisterPetClick={onRegisterPetClick}
        onLoginClick={onLoginClick}
        isLoggedIn={isLoggedIn}
        onLogoutClick={onLogoutClick}
      />
      <h1 className="page-name">Minha Casinha</h1>
      
      <main className="favorites-layout">
        <div className="favorites-content">
          <div className="pets-grid">
            {loading && <p>Carregando seus pets favoritos...</p>}

            {error && <p className="error-message">{error}</p>}

            {!loading && !error && favoritePets.length === 0 && (
              <p>Sua casinha está vazia. Favorite alguns pets para vê-los aqui!</p>
            )}

            {!loading && !error && favoritePets.length > 0 &&
              favoritePets.map((petItem) => (
                <PetCard
                  key={petItem.id_pet}
                  pet={petItem}
                  onClick={() => onCardClick && onCardClick(petItem.id_pet)}
                />
              ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Favorites;