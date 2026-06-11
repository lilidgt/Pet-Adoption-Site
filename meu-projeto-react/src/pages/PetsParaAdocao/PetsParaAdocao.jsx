import React, { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import Filters from "../../components/Filters/Filters";
import PetCard from "../../components/Cards/PetCard";
import Footer from "../../components/Footer/Footer";
import "./PetsParaAdocao.css";

const PetsParaAdocao = ({
  onCardClick, // Esta função será responsável por levar o ID para a tela de detalhes
  onNavigate,
  onFavoritesClick,
  onRegisterPetClick,
  onLoginClick,
}) => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado para armazenar quais filtros estão ativos no momento
  const [activeFilters, setActiveFilters] = useState({});

  useEffect(() => {
    const urlApi = "http://localhost:3001/pets"; 

    fetch(urlApi)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro ao buscar os pets do banco de dados");
        }
        return response.json();
      })
      .then((data) => {
        setPets(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro na requisição:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // --- FUNÇÃO QUE FILTRA OS PETS EM TEMPO REAL ---
  const filteredPets = pets.filter((petItem) => {
    // 1. Filtro de Estado (compara siglas/nomes ignorando case e espaços)
    if (activeFilters.state && petItem.state) {
      const filterState = activeFilters.state.toLowerCase().trim();
      const petState = petItem.state.toLowerCase().trim();
      if (petState !== filterState && !petState.includes(filterState)) return false;
    }

    // 2. Filtro de Cidade
    if (activeFilters.city && petItem.city) {
      if (!petItem.city.toLowerCase().trim().includes(activeFilters.city.toLowerCase().trim())) return false;
    }

    // 3. Filtro de Espécie
    if (activeFilters.species && petItem.species) {
      if (petItem.species !== activeFilters.species) return false;
    }

    // 4. Filtro de Castração (Se o checkbox estiver ativo, só mostra os que são "Sim")
    if (activeFilters.castrated) {
      if (petItem.castrated !== "Sim") return false;
    }

    // 5. Filtro de Vacinação
    if (activeFilters.vaccine && petItem.vaccine) {
      if (petItem.vaccine !== activeFilters.vaccine) return false;
    }

    // 6. Filtro de Idade Máxima
    if (activeFilters.maxAge && petItem.age) {
      if (Number(petItem.age) > activeFilters.maxAge) return false;
    }

    // 7. Filtro de Personalidades (Se selecionar tags, o pet precisa ter TODAS as selecionadas)
    if (activeFilters.personalities && activeFilters.personalities.length > 0) {
      if (!petItem.personality) return false;
      
      const petTraits = petItem.personality.split(",").map(t => t.trim().toLowerCase());
      const hasAllTraits = activeFilters.personalities.every(trait => 
        petTraits.includes(trait.toLowerCase())
      );
      
      if (!hasAllTraits) return false;
    }

    return true; // Passou em todas as regras!
  });

  return (
    <div className="pets-adocao-container">
      <Header
        onNavigate={onNavigate}
        onFavoritesClick={onFavoritesClick}
        onRegisterPetClick={onRegisterPetClick}
        onLoginClick={onLoginClick}
      />

      <main className="pets-adocao-layout">
        <Filters onFilterChange={(filters) => setActiveFilters(filters)} />

        <div className="pets-adocao-content">
          <div className="pets-grid">
            {error && <p className="error-message">Erro: {error}</p>}
            
            {loading && <p>Carregando os pets...</p>}

            {!loading && filteredPets.length === 0 && (
              <p>Nenhum pet corresponde aos filtros selecionados.</p>
            )}

            {!loading &&
              filteredPets.map((petItem) => (
                <PetCard
                  key={petItem.id_pet}
                  pet={petItem}
                  // Ao clicar, executa a prop onCardClick enviando o ID real do banco
                  onClick={() => onCardClick && onCardClick(petItem.id_pet)}
                />
              ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PetsParaAdocao;