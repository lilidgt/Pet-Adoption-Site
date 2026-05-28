import React from "react";
import "./PetCard.css";
import imagemExemplo from "../../assets/imagemExemplo.jpg";

const PetCard = ({ pet = {} }) => {
  //Se estiver vazio, só pro exemplo
  const mockDefault = {
    image: imagemExemplo,
    city: "Curitiba",
    state: "PR",
    name: "Cowboy",
    age: 2,
    species: "Tartaruga",
    gender: "Macho",
    isCastrated: true,
    isVaccinated: true,
    personalities: ["Brincalhão", "Protetor", "Calmo", "Enérgico"],
  };

  const finalPet = { ...mockDefault, ...pet };

  const {
    image,
    city,
    state,
    name,
    age,
    species,
    gender,
    isCastrated,
    isVaccinated,
    personalities,
  } = finalPet;

  return (
    <article className="pet-card">
      <div className="pet-card-image-container">
        <img
          src={image}
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
            {age} {age === 1 ? "ano" : "anos"}
          </span>
          <span className="divider">•</span>
          <span>{species}</span>
          <span className="divider">•</span>
          <span>{gender}</span>
        </div>

        <div className="pet-card-status-container">
          {isCastrated && (
            <span className="status-tag status-castrado">Castrado</span>
          )}
          {isVaccinated && (
            <span className="status-tag status-vacina">Vacina em dia</span>
          )}
        </div>

        <div className="pet-card-personalities-container">
          {personalities.map((trait, index) => (
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
