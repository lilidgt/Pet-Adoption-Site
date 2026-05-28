import React, { useState } from "react";
import Header from "../../components/Header/Header";
import Filters from "../../components/Filters/Filters";
import PetCard from "../../components/Cards/PetCard";
import PetDetailView from "../../components/PetDetailView/PetDetailView";
import Footer from '../../components/Footer/Footer';
import "./Sandbox.css";

const Sandbox = () => {
  const [showDetail, setShowDetail] = useState(false);

  if (showDetail) {
    return (
      <div className="sandbox-container">
        <Header />
        <PetDetailView />
        {/* Adicione um botao de voltar no Header ou aqui se precisar no futuro, 
            mas o usuario pediu apenas direcionar ao clicar no card */}
      </div>
    );
  }
  return (
    <div className="sandbox-container">
      <Header />

      <main className="sandbox-layout">
        <Filters />

        <div className="sandbox-content">
          <div className="pets-grid">
            <PetCard onClick={() => setShowDetail(true)} />
            <PetCard onClick={() => setShowDetail(true)} />
            <PetCard onClick={() => setShowDetail(true)} />
            <PetCard onClick={() => setShowDetail(true)} />
            <PetCard onClick={() => setShowDetail(true)} />
            <PetCard onClick={() => setShowDetail(true)} />
          </div>
          <h2 style={{ padding: "40px", color: "#888" }}>Main Content Area</h2>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Sandbox;
