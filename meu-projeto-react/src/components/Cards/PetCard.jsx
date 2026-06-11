import React from "react";
import "./PetCard.css";
import imagemExemplo from "../../assets/imagemExemplo.jpg";

const PetCard = ({ pet = {}, onClick }) => {
  // Configuração do Mock de segurança
  const mockDefault = {
    profile_photo: "",
    city: "Curitiba",
    state: "PR",
    name: "Cowboy",
    age: 2,
    species: "Tartaruga",
    gender: "Macho",
    castrated: "Não",
    vaccine: "Não vacinado",
    personality: "Dócil",
  };

  const finalPet = { ...mockDefault, ...pet };

  const {
    profile_photo,
    city,
    state,
    name,
    age,
    species,
    gender,
    castrated,
    vaccine,
    personality,
  } = finalPet;

  // --- LÓGICA DA IMAGEM DINÂMICA ---
  let finalImage = imagemExemplo;
  if (profile_photo && profile_photo.trim() !== "") {
    try {
      finalImage = new URL(`../../assets/photos/${profile_photo}`, import.meta.url).href;
    } catch (error) {
      console.error("Erro ao carregar a imagem do pet:", error);
      finalImage = imagemExemplo;
    }
  }

  // --- TRATAMENTO DAS PERSONALIDADES ---
  const personalitiesArray = personality
    ? personality
        .split(",")
        .map((trait) => trait.trim())
        .filter((trait) => trait.length > 0)
    : [];

  return (
    <article 
      className="pet-card" 
      onClick={onClick} 
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <div className="pet-card-image-container">
        <img
          src={finalImage}
          alt={`Foto do pet ${name}`}
          className="pet-card-image"
        />
      </div>

      <div className="pet-card-content">
        <div className="pet-card-location-row">
          <span className="pet-card-location">
            {city}, {state}
          </span>
          <div className="pet-card-home-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="currentColor"
            >
              <path d="M19 21H5a1 1 0 0 1-1-1v-9H1l10.327-9.352a1 1 0 0 1 1.346 0L23 11h-3v9a1 1 0 0 1-1 1zm-6-2h4v-7.5l-5-4.5-5 4.5V19h4v-5h2v5z" />
            </svg>
          </div>
        </div>

        <h3 className="pet-card-name">{name}</h3>

        <div className="pet-card-specs">
          <span>
            {age} {Number(age) === 1 ? "ano" : "anos"}
          </span>
          <span className="divider">•</span>
          <span>{species}</span>
          <span className="divider">•</span>
          <span>{gender}</span>
        </div>

        <div className="pet-card-status-container">
          {/* Validação de Castração */}
          {castrated && castrated.trim() !== "" && (
            <span className="status-tag status-castrado">
              {castrated.trim().toLowerCase() === "sim" ? "Castrado" : "Não castrado"}
            </span>
          )}
          
          {/* Validação de Vacina */}
          {vaccine && vaccine.trim() !== "" && (
            <span className="status-tag status-vacina">
              {(() => {
                const v = vaccine.trim().toLowerCase();
                if (v === "em dia") return "Vacina em dia";
                if (v === "incompleto") return "Vacina incompleta";
                return "Não vacinado"; // Para o caso de 'não vacinado' ou qualquer outro valor
              })()}
            </span>
          )}
        </div>

        <div className="pet-card-personalities-container">
          {personalitiesArray.map((trait, index) => (
            <span key={index} className="personality-tag">
              {trait}
            </span>
          ))}
          <button type="button" className="personality-tag-more">
            +
          </button>
        </div>
      </div>
    </article>
  );
};

export default PetCard;