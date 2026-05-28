import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import PetCarousel from "../../components/PetCarousel/PetCarousel";
import "./Playground.css";

const Playground = () => {
  return (
    <div className="playground-container">
      <Header />

      <main className="playground-layout">
        
        <div className="playground-content">
          
          <div className="pet-details-card">
            
            {/* Lado Esquerdo: Botões, Carrossel e Nome */}
            <section className="pet-column-left">
        
              <PetCarousel />

            </section>

            <section className="pet-column-right">
              

            </section>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Playground;