import React, { useState, useEffect } from 'react';
import './Filters.css';

const Filters = ({ onFilterChange }) => {
  const [personalities] = useState(['Brincalhão', 'Calmo', 'Protetor', 'Tímido', 'Enérgico']);
  const [selectedTags, setSelectedTags] = useState([]);
  
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  
  // Guardamos a SIGLA internamente para a API do IBGE funcionar
  const [selectedStateSigla, setSelectedStateSigla] = useState('');
  const [selectedCityName, setSelectedCityName] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState('');
  const [isCastrated, setIsCastrated] = useState(false);
  const [selectedVaccine, setSelectedVaccine] = useState('');
  const [age, setAge] = useState(15);

  const [loadingCities, setLoadingCities] = useState(false);

  // Busca os estados do IBGE ao carregar o componente
  useEffect(() => {
    fetch('https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome')
      .then(res => res.json())
      .then(data => setStates(data))
      .catch(err => console.error(err));
  }, []);

  // Busca as cidades usando a SIGLA (ex: PR)
  useEffect(() => {
    if (selectedStateSigla) {
      setLoadingCities(true);
      setSelectedCityName('');
      fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedStateSigla}/municipios?orderBy=nome`)
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
  }, [selectedStateSigla]);

  // DISPARAR FILTROS EM TEMPO REAL (Envia o nome completo do estado por extenso)
  useEffect(() => {
    if (onFilterChange) {
      // Encontra o estado pelo valor da sigla selecionada
      const estadoObjeto = states.find(s => s.sigla === selectedStateSigla);
      // Extrai o nome completo por extenso (ex: "Paraná")
      const nomeCompletoEstado = estadoObjeto ? estadoObjeto.nome : '';

      onFilterChange({
        state: nomeCompletoEstado, // Envia o Nome Completo para a tela de busca
        city: selectedCityName,
        species: selectedSpecies,
        castrated: isCastrated,
        vaccine: selectedVaccine,
        maxAge: Number(age),
        personalities: selectedTags
      });
    }
  }, [selectedStateSigla, selectedCityName, selectedSpecies, isCastrated, selectedVaccine, age, selectedTags, states]);

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  // 1. [NOVO] Função para resetar todos os inputs de filtros
  const clearFilters = () => {
    setSelectedStateSigla('');
    setSelectedCityName('');
    setSelectedSpecies('');
    setIsCastrated(false);
    setSelectedVaccine('');
    setAge(15);
    setSelectedTags([]);
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
          value={selectedStateSigla} // Controlado pela Sigla
          onChange={(e) => setSelectedStateSigla(e.target.value)}
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
          placeholder={loadingCities ? "Carregando..." : (selectedStateSigla ? "Digite a cidade..." : "Selecione o estado")} 
          disabled={!selectedStateSigla || loadingCities}
          autoComplete="off"
        />
        <datalist id="cities-list">
          {cities.map(c => <option key={c.id} value={c.nome} />)}
        </datalist>
      </div>

      {/* Espécie */}
      <div className="filter-group">
        <label htmlFor="species">Espécie</label>
        <select 
          id="species" 
          className="filter-input"
          value={selectedSpecies}
          onChange={(e) => setSelectedSpecies(e.target.value)}
        >
          <option value="">Selecione a espécie</option>
          <option value="Cachorro">Cachorro</option>
          <option value="Gato">Gato</option>
          <option value="Roedor">Roedor</option>
        </select>
      </div>

      {/* Castração */}
      <div className="filter-group-row">
        <label htmlFor="castration">Apenas Castrados</label>
        <input 
          type="checkbox" 
          id="castration" 
          className="filter-checkbox" 
          checked={isCastrated}
          onChange={(e) => setIsCastrated(e.target.checked)}
        />
      </div>

      {/* Vacinação */}
      <div className="filter-group">
        <label htmlFor="vaccination">Vacinação</label>
        <select 
          id="vaccination" 
          className="filter-input"
          value={selectedVaccine}
          onChange={(e) => setSelectedVaccine(e.target.value)}
        >
          <option value="">Status da vacina</option>
          <option value="Em dia">Em dia</option>
          <option value="Incompleto">Incompleto</option>
          <option value="Não vacinado">Não vacinado</option>
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

      <button 
        type="button" 
        className="clear-filters-button" 
        onClick={clearFilters}
      >
        Limpar Filtros
      </button>

    </aside>
  );
};

export default Filters;