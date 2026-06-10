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
  onLoginClick,
}) => {

  // Força o envio do ID 1 de teste ao clicar
  const handleTestClick = () => {
    if (onCardClick) {
      onCardClick(1); 
    }
  };

  const petItemTeste = { id_pet: 1 };

  return (
    <div className="pets-adocao-container">
      <Header
        onNavigate={onNavigate}
        onFavoritesClick={onFavoritesClick}
        onLoginClick={onLoginClick}
      />

      <main className="pets-adocao-layout">
        <Filters />

        <div className="pets-adocao-content">
          <div className="pets-grid">
            <PetCard pet={petItemTeste} onClick={handleTestClick} />
            <PetCard pet={petItemTeste} onClick={handleTestClick} />
            <PetCard pet={petItemTeste} onClick={handleTestClick} />
            <PetCard pet={petItemTeste} onClick={handleTestClick} />
            <PetCard pet={petItemTeste} onClick={handleTestClick} />
            <PetCard pet={petItemTeste} onClick={handleTestClick} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PetsParaAdocao;