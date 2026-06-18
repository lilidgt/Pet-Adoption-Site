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
  onFavoritesClick,
  onRegisterPetClick,
  isLoggedIn,
  onLogoutClick,
}) => {
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorited, setIsFavorited] = useState(false);

  const loggedUser = JSON.parse(localStorage.getItem("user")) || null;
  const userId = loggedUser?.id;

  useEffect(() => {
    setLoading(true);

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

    if (userId) {
      const token = localStorage.getItem("token");
      fetch(
        `http://localhost:3001/favoritos/check?id_user=${userId}&id_pet=${petId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
        .then((res) => res.json())
        .then((data) => setIsFavorited(data.isFavorited))
        .catch((err) => console.error("Erro ao checar favorito:", err));
    }
  }, [petId, userId]);

  const handleFavoriteClick = () => {
    if (!userId) {
      alert("Você precisa estar logado para favoritar um pet!");
      return;
    }

    const token = localStorage.getItem("token");
    fetch("http://localhost:3001/favoritos/toggle", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id_user: userId, id_pet: petId }),
    })
      .then((res) => res.json())
      .then((data) => {
        setIsFavorited(data.isFavorited);
        alert(data.message);
      })
      .catch((err) => console.error("Erro ao alternar favorito:", err));
  };

  const handleDeleteClick = () => {
    if (
      window.confirm(`Tem certeza que deseja excluir o anúncio do ${pet.name}?`)
    ) {
      fetch(`http://localhost:3001/pets/${petId}`, {
        method: "DELETE",
      })
        .then((res) => {
          if (res.ok) {
            alert("Pet excluído com sucesso!");
            onBackClick();
          } else {
            alert("Erro ao excluir pet.");
          }
        })
        .catch((err) => console.error("Erro ao excluir pet:", err));
    }
  };

  if (loading)
    return <div className="loading">Carregando detalhes do pet...</div>;
  if (error) return <div className="error">Erro: {error}</div>;
  if (!pet) return <div className="error">Nenhum pet encontrado.</div>;

  return (
    <div className="pet-detail-page">
      <Header
        onNavigate={onNavigate}
        onLoginClick={onLoginClick}
        onFavoritesClick={onFavoritesClick}
        onRegisterPetClick={onRegisterPetClick}
        isLoggedIn={isLoggedIn}
        onLogoutClick={onLogoutClick}
      />

      <main className="pet-detail-main">
        <div className="pet-detail-header">
          <button className="btn-back" onClick={onBackClick}>
            <img src={leftArrow} alt="Voltar" />
            Voltar
          </button>
          <div className="admin-actions">
            <button
              className="btn-edit-admin"
              onClick={() => onEditClick(petId)}
            >
              Editar
            </button>
            <button className="btn-delete-admin" onClick={handleDeleteClick}>
              Excluir
            </button>
          </div>
        </div>
        <div className="pet-detail-container">
          <section className="pet-left-column">
            <div className="pet-action-buttons">
              <button
                className={`btn-favorite-action ${isFavorited ? "active" : ""}`}
                onClick={handleFavoriteClick}
              >
                <img src={houseIcon} alt="Favorito" />
                {isFavorited ? "Na minha Casinha!" : "Favorito"}
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
                    <p className="stat-display-value">
                      {pet.age} {pet.age === 1 ? "ano" : "anos"}
                    </p>
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
                    <p className="stat-display-value">{pet.castrated}</p>
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
                        {trait.trim()}
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
              <h2>Sobre o {pet.name}</h2>
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