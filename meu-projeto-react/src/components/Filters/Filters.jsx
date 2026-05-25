import React, { useState } from 'react';
import './Filters.css';

const Filters = () => {
  const [personalities, setPersonalities] = useState(['Brincalhão', 'Calmo', 'Protetor', 'Tímido', 'Enérgico']);
  const [selectedTags, setSelectedTags] = useState([]);

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <aside className="filters-container">
      <h2 className="filters-title">Filtros</h2>
      
      {/* Region */}
      <div className="filter-group">
        <label htmlFor="region">Região</label>
        <input list="regions" id="region" name="region" placeholder="Buscar região..." />
        <datalist id="regions">
          <option value="Curitiba" />
          <option value="São Paulo" />
          <option value="Rio de Janeiro" />
        </datalist>
      </div>

      {/* Species */}
      <div className="filter-group">
        <label htmlFor="species">Espécie</label>
        <input list="species-list" id="species" name="species" placeholder="Buscar espécie..." />
        <datalist id="species-list">
          <option value="Cachorro" />
          <option value="Gato" />
          <option value="Pássaro" />
        </datalist>
      </div>

      {/* Castration */}
      <div className="filter-group-row">
        <label htmlFor="castration">Castrado</label>
        <input type="checkbox" id="castration" name="castration" />
      </div>

      {/* Vaccination */}
      <div className="filter-group">
        <label htmlFor="vaccination">Vacinação</label>
        <input list="vaccinations" id="vaccination" name="vaccination" placeholder="Status da vacina..." />
        <datalist id="vaccinations">
          <option value="Em dia" />
          <option value="Pendente" />
          <option value="Desconhecido" />
        </datalist>
      </div>

      {/* Age */}
      <div className="filter-group">
        <label htmlFor="age">Idade</label>
        <select id="age" name="age">
          <option value="">Selecione a idade</option>
          <option value="puppy">Filhote</option>
          <option value="young">Jovem</option>
          <option value="adult">Adulto</option>
          <option value="senior">Idoso</option>
        </select>
      </div>

      {/* Personality Tags */}
      <div className="filter-group">
        <label>Personalidade</label>
        <div className="tags-container">
          {personalities.map(tag => (
            <button 
              key={tag}
              className={`tag-button ${selectedTags.includes(tag) ? 'active' : ''}`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Filters;
