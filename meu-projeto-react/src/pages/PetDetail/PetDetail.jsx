import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import PetCarousel from "../../components/PetCarousel/PetCarousel";
import "./PetDetail.css";

import houseIcon from "../../assets/house.fill.svg";
import calendarIcon from "../../assets/calendar icon.svg";
import vaccineIcon from "../../assets/vaccine icon.svg";
import genderIcon from "../../assets/gender icon.svg";
import rulerIcon from "../../assets/ruler icon.svg";
import footprintIcon from "../../assets/footprint icon.svg";
import personIcon from "../../assets/person icon.svg";
import leftArrow from "../../assets/left arrow.svg";

const PetDetail = ({
  petId,
  onBackClick,
  onNavigate,
  onLoginClick,
  onEditClick,
}) => {
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3001/pets/${petId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Pet não encontrado no banco");
        }
        return response.json();
      })
      .then((data) => {
        setPet(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro detalhado no fetch:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [petId]);

  if (loading)
    return <div className="loading">Carregando detalhes do pet...</div>;
  if (error) return <div className="error">Erro: {error}</div>;
  if (!pet) return <div className="error">Nenhum pet encontrado.</div>;

  return (
    <div className="pet-detail-page">
      <Header onNavigate={onNavigate} onLoginClick={onLoginClick} />

      <main className="pet-detail-main">
        {/* NOVO CABEÇALHO COM BOTÃO VOLTAR E AÇÕES */}
        <div className="pet-detail-top-bar">
          <button className="btn-back" onClick={onBackClick}>
            <img src={leftArrow} alt="Voltar" />
            Voltar
          </button>

          <div className="admin-action-buttons">
            <button
              className="btn-admin btn-edit"
              onClick={() => {
                if (onEditClick) onEditClick(petId);
              }}
            >
              Editar
            </button>
            <button
              className="btn-admin btn-delete"
              onClick={() => {
                if (
                  window.confirm(
                    "Tem certeza que deseja excluir este pet da plataforma?",
                  )
                ) {
                  // Chama a nova rota DELETE do backend
                  fetch(`http://localhost:3001/pets/${petId}`, {
                    method: "DELETE",
                  })
                    .then((response) => {
                      if (!response.ok) throw new Error("Erro ao deletar");
                      alert("Pet excluído com sucesso!");
                      onNavigate(); // Volta para a tela de lista de pets
                    })
                    .catch((err) => {
                      console.error(err);
                      alert("Erro ao tentar excluir o pet.");
                    });
                }
              }}
            >
              Excluir
            </button>
          </div>
        </div>
        <div className="pet-detail-container">
          <section className="pet-left-column">
            <div className="pet-action-buttons">
              <button className="btn-favorite-action">
                <img src={houseIcon} alt="Favorito" />
                Favorito
              </button>
              <button
                className="btn-adopt-action"
                onClick={() => {
                  if (pet?.contact) {
                    const apenasNumeros = pet.contact.replace(/\D/g, "");
                    const numeroFormatado = apenasNumeros.startsWith("55")
                      ? apenasNumeros
                      : `55${apenasNumeros}`;
                    const mensagem = encodeURIComponent(
                      `Olá! Vi o anúncio do ${pet.name} no site de adoção e gostaria de saber mais informações.`,
                    );
                    window.open(
                      `https://wa.me/${numeroFormatado}?text=${mensagem}`,
                      "_blank",
                    );
                  } else {
                    alert(
                      "Este responsável não cadastrou um número de contato.",
                    );
                  }
                }}
              >
                Quero adotar
              </button>
            </div>

            {(() => {
              const listaFotos = [];
              if (pet.profile_photo) {
                listaFotos.push(pet.profile_photo);
              }
              if (pet.others_photos_videos) {
                const adicionais = pet.others_photos_videos
                  .split(",")
                  .map((img) => img.trim());
                listaFotos.push(...adicionais);
              }
              return <PetCarousel petPhotos={listaFotos} />;
            })()}

            <h1 className="pet-display-name">{pet.name}</h1>
          </section>

          <section className="pet-right-column">
            <div className="info-card stats-card">
              <div className="stats-grid-display">
                <div className="stat-display-item">
                  <img
                    src={calendarIcon}
                    alt="Idade"
                    className="stat-display-icon"
                  />
                  <div>
                    <p className="stat-display-label">Idade</p>
                    <p className="stat-display-value">{pet.age}</p>
                  </div>
                </div>
                <div className="stat-display-item">
                  <img
                    src={vaccineIcon}
                    alt="Vacinas"
                    className="stat-display-icon"
                  />
                  <div>
                    <p className="stat-display-label">Vacinas</p>
                    <p className="stat-display-value">{pet.vaccine}</p>
                  </div>
                </div>
                <div className="stat-display-item">
                  <img
                    src={genderIcon}
                    alt="Sexo"
                    className="stat-display-icon"
                  />
                  <div>
                    <p className="stat-display-label">Sexo</p>
                    <p className="stat-display-value">{pet.gender}</p>
                  </div>
                </div>
                <div className="stat-display-item">
                  <img
                    src={rulerIcon}
                    alt="Porte"
                    className="stat-display-icon"
                  />
                  <div>
                    <p className="stat-display-label">Porte</p>
                    <p className="stat-display-value">{pet.size}</p>
                  </div>
                </div>
                <div className="stat-display-item">
                  <img
                    src={footprintIcon}
                    alt="Castrado"
                    className="stat-display-icon"
                  />
                  <div>
                    <p className="stat-display-label">Castrado</p>
                    <p className="stat-display-value">
                      {pet.castrated ? "Sim" : "Não"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pet-tags-list">
                {pet.personality ? (
                  pet.personality
                    .replace(/"/g, "")
                    .split(",")
                    .map((trait, index) => (
                      <span key={index} className="pet-tag-item">
                        {trait.trim()}{" "}
                      </span>
                    ))
                ) : (
                  <span className="pet-tag-item">
                    Sem personalidade definida
                  </span>
                )}
              </div>
            </div>

            <div className="info-card about-card">
              <h2>Sobre o Paçoca</h2>
              <p>{pet.description}</p>
              <div className="responsible-info">
                <img
                  src={personIcon}
                  alt="Responsável"
                  className="contact-display-icon"
                />
                <div>
                  <p className="contact-display-label">Responsável</p>
                  <p className="contact-display-value">{pet.nome_dono}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PetDetail;
