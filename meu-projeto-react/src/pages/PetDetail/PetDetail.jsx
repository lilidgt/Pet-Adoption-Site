import React from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import PetCarousel from "../../components/PetCarousel/PetCarousel";
import "./PetDetail.css";

// importacao dos icones utilizados no componente
import houseIcon from "../../assets/house.fill.svg";
import calendarIcon from "../../assets/calendar icon.svg";
import vaccineIcon from "../../assets/vaccine icon.svg";
import genderIcon from "../../assets/gender icon.svg";
import rulerIcon from "../../assets/ruler icon.svg";
import footprintIcon from "../../assets/footprint icon.svg";
import personIcon from "../../assets/person icon.svg";
import contactIcon from "../../assets/contact icon.png";
import { useState, useEffect } from "react";

import leftArrow from "../../assets/left arrow.svg";

const PetDetail = ({ petId, onBackClick, onNavigate, onLoginClick }) => {
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Usamos o petId recebido por propriedade em vez do useParams
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
  }, [petId]); // Executa toda vez que o petId mudar

  // 4. Telas de transição (Carregando ou Erro)
  if (loading)
    return <div className="loading">Carregando detalhes do pet...</div>;
  if (error) return <div className="error">Erro: {error}</div>;
  if (!pet) return <div className="error">Nenhum pet encontrado.</div>;
  return (
    <div className="pet-detail-page">
      <Header onNavigate={onNavigate} onLoginClick={onLoginClick} />

      <main className="pet-detail-main">
        <button className="btn-back" onClick={onBackClick}>
          <img src={leftArrow} alt="Voltar" />
          Voltar
        </button>
        <div className="pet-detail-container">
          {/* Coluna Esquerda: Ações, Carrossel e Nome */}
          {/* Coluna Esquerda: Ações, Carrossel e Nome */}
          <section className="pet-left-column">
            <div className="pet-action-buttons">
              <button className="btn-favorite-action">
                <img src={houseIcon} alt="Favorito" />
                Favorito
              </button>
              <button
                className="btn-adopt-action"
                onClick={() => {
                  // Mudado para testar e usar "contact", que é o nome real da coluna do banco
                  if (pet?.contact) {
                    // Limpa os caracteres usando a variável correta
                    const apenasNumeros = pet.contact.replace(/\D/g, "");

                    // Se o número não tiver o código do país (55), nós adicionamos automaticamente
                    const numeroFormatado = apenasNumeros.startsWith("55")
                      ? apenasNumeros
                      : `55${apenasNumeros}`;

                    // Mensagem padrão opcional codificada para a URL
                    const mensagem = encodeURIComponent(
                      `Olá! Vi o anúncio do ${pet.name} no site de adoção e gostaria de saber mais informações.`,
                    );

                    // Abre o WhatsApp em uma nova aba
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

            {/* JUNTANDO OS DOIS CAMPOS DE IMAGEM DO BANCO */}
            {(() => {
              const listaFotos = [];

              // Se existir a foto de perfil, adiciona primeiro
              if (pet.profile_photo) {
                listaFotos.push(pet.profile_photo);
              }

              // Se existirem outras fotos, quebra a string por vírgula e adiciona na lista
              if (pet.others_photos_videos) {
                const adicionais = pet.others_photos_videos
                  .split(",")
                  .map((img) => img.trim());
                listaFotos.push(...adicionais);
              }

              // Passa a lista completa combinada para o carrossel
              return <PetCarousel petPhotos={listaFotos} />;
            })()}

            <h1 className="pet-display-name">{pet.name}</h1>
          </section>

          {/* Coluna Direita: Cards de Informação */}
          <section className="pet-right-column">
            {/* Card de Atributos */}
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
                  // 1. Limpa as aspas extras que estão no banco
                  // 2. Quebra a string por vírgula para virar uma lista (Array)
                  pet.personality
                    .replace(/"/g, "")
                    .split(",")
                    .map((trait, index) => (
                      <span key={index} className="pet-tag-item">
                        {trait.trim()}{" "}
                        {/* .trim() remove espaços em branco invisíveis */}
                      </span>
                    ))
                ) : (
                  <span className="pet-tag-item">
                    Sem personalidade definida
                  </span>
                )}
              </div>
            </div>

            {/* Card Sobre */}
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
