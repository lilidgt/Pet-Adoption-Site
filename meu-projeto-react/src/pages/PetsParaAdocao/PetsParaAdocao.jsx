import React from "react";
import Header from "../../components/Header/Header";
import Filters from "../../components/Filters/Filters";
import PetCard from "../../components/Cards/PetCard";
import Footer from "../../components/Footer/Footer";
import "./PetsParaAdocao.css";

const PetsParaAdocao = ({
  onCardClick,
  onNavigate,
  onFavoritesClick,
  onRegisterPetClick,
  onLoginClick,
}) => {
  return (
    <div className="pets-adocao-container">
      <Header
        onNavigate={onNavigate}
        onFavoritesClick={onFavoritesClick}
        onRegisterPetClick={onRegisterPetClick}
        onLoginClick={onLoginClick}
      />

      <main className="pets-adocao-layout">
        <Filters />

        <div className="pets-adocao-content">
          <div className="pets-grid">
            {/* Simulando a listagem de pets como no Sandbox */}
            <PetCard onClick={onCardClick} />
            <PetCard onClick={onCardClick} />
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

export default PetsParaAdocao;
