import React, { useState, useEffect } from 'react';
import './Filters.css';

const Filters = () => {
  const [personalities] = useState(['Brincalhão', 'Calmo', 'Protetor', 'Tímido', 'Enérgico']);
  const [selectedTags, setSelectedTags] = useState([]);
  
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  
  const [selectedState, setSelectedState] = useState('');
  const [selectedCityName, setSelectedCityName] = useState('');
  
  const [loadingCities, setLoadingCities] = useState(false);
  
  // Estado para o Slider de Idade
  const [age, setAge] = useState(12);

  useEffect(() => {
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then(res => res.json())
      .then(data => setStates(data))
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (selectedState) {
      setLoadingCities(true);
      setSelectedCityName('');
      fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedState}/municipios?orderBy=nome`)
        .then(res => res.json())
        .then(data => {
          setCities(data);
          setLoadingCities(false);
        })
        .catch(() => setLoadingCities(false));
    } else {
      setCities([]);
      setSelectedCityName('');
    }
  }, [selectedState]);

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <aside className="filters-container">
      <h2 className="filters-title">Filtros</h2>
      
      {/* Estado */}
      <div className="filter-group">
        <label htmlFor="state">Estado</label>
        <select 
          id="state" 
          className="filter-input"
          value={selectedState} 
          onChange={(e) => setSelectedState(e.target.value)}
        >
          <option value="">Selecione o estado</option>
          {states.map(s => <option key={s.id} value={s.sigla}>{s.nome}</option>)}
        </select>
      </div>

      {/* Cidade */}
      <div className="filter-group">
        <label htmlFor="city">Cidade</label>
        <input 
          list="cities-list" 
          id="city" 
          className="filter-input"
          value={selectedCityName}
          onChange={(e) => setSelectedCityName(e.target.value)}
          placeholder={loadingCities ? "Carregando..." : (selectedState ? "Digite a cidade..." : "Selecione o estado")} 
          disabled={!selectedState || loadingCities}
          autoComplete="off"
        />
        <datalist id="cities-list">
          {cities.map(c => <option key={c.id} value={c.nome} />)}
        </datalist>
      </div>

      {/* Espécie */}
      <div className="filter-group">
        <label htmlFor="species">Espécie</label>
        <select id="species" className="filter-input">
          <option value="">Selecione a espécie</option>
          <option value="dog">Cachorro</option>
          <option value="cat">Gato</option>
        </select>
      </div>

      {/* Castração */}
      <div className="filter-group-row">
        <label htmlFor="castration">Castrado</label>
        <input type="checkbox" id="castration" className="filter-checkbox" />
      </div>

      {/* Vacinação */}
      <div className="filter-group">
        <label htmlFor="vaccination">Vacinação</label>
        <select id="vaccination" className="filter-input">
          <option value="">Status da vacina</option>
          <option value="up-to-date">Em dia</option>
          <option value="incomplete">Incompleto</option>
          <option value="not-vaccinated">Não vacinado</option>
        </select>
      </div>

      {/* Idade com Slider */}
      <div className="filter-group">
        <label htmlFor="age-range">Idade máxima: {age} anos</label>
        <input 
          type="range" 
          id="age-range" 
          className="filter-range"
          min="1" 
          max="15" 
          value={age} 
          onChange={(e) => setAge(e.target.value)}
        />
        <div className="range-labels">
          <span>1 ano</span>
          <span>15+ anos</span>
        </div>
      </div>

      {/* Personalidade */}
      <div className="filter-group">
        <label>Personalidade</label>
        <div className="tags-container">
          {personalities.map(tag => (
            <button 
              key={tag}
              type="button"
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
