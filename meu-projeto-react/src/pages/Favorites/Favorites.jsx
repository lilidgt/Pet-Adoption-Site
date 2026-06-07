import React from "react";
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
}) => {
  return (
    <div className="favorites-container">
      {" "}
      <Header
        onNavigate={onNavigate}
        onFavoritesClick={onFavoritesClick}
        onRegisterPetClick={onRegisterPetClick}
        onLoginClick={onLoginClick}
      />
      <h1 className="page-name">Minha Casinha</h1>
      <main className="favorites-layout">
        {" "}
        <div className="favorites-content">
          {" "}
          <div className="pets-grid">
            <PetCard onClick={onCardClick} />
            <PetCard onClick={onCardClick} />
            <PetCard onClick={onCardClick} />
            <PetCard onClick={onCardClick} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Favorites;
