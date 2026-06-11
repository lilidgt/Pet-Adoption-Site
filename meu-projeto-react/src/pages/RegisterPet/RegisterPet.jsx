import React, { useState, useRef, useEffect } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./RegisterPet.css";

// Ícone de upload (câmera)
const CameraIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="32" height="32">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

// Ícone de arquivo (documentos)
const FileIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

// Ícone de imagem
const ImageIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

//card de anexo
const AttachCard = ({ label, accept, icon, onFileSelect }) => {
  const [fileName, setFileName] = useState(null);
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const name = file.name.length > 16 ? file.name.slice(0, 14) + "…" : file.name;
    setFileName(name);
    if (onFileSelect) onFileSelect(file);
  };

  return (
    <div
      className={`attach-card ${fileName ? "attach-card--filled" : ""}`}
      onClick={() => inputRef.current.click()}
    >
      <span className="attach-card__label">{label}</span>
      <div className="attach-card__icon">{icon}</div>
      {fileName && <span className="attach-card__filename">{fileName}</span>}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        style={{ display: "none" }}
      />
    </div>
  );
};

// miniatura da foto/video
const ThumbSlot = ({ isEmpty, preview: previewProp, onChange }) => {
  const [preview, setPreview] = useState(previewProp || null);
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    if (onChange) onChange(file);
  };

  useEffect(() => {
    setPreview(previewProp || null);
  }, [previewProp]);

  return (
    <div
      className={`thumb-slot ${preview ? "thumb-slot--filled" : ""}`}
      onClick={() => inputRef.current.click()}
    >
      {preview ? (
        <img src={preview} alt="Miniatura" className="thumb-slot__img" />
      ) : (
        <span className="thumb-slot__plus">{isEmpty ? <CameraIcon /> : "+"}</span>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        style={{ display: "none" }}
      />
    </div>
  );
};

//pagina principal de cadastro do pet
const RegisterPet = ({ onNavigate, onFavoritesClick, onRegisterPetClick, onLoginClick }) => {
  const [form, setForm] = useState({
    nome: "",
    especie: "",
    idade: "",
    porte: "",
    cidade: "",
    estado: "",
    genero: "",
    vacinacao: "",
    castrado: "",
    contato: "",
    descricao: "",
    personalidade: "",
  });
  const [personalityTags, setPersonalityTags] = useState([]);
  const [mainPhoto, setMainPhoto] = useState(null);
  const [mediaPreviews, setMediaPreviews] = useState([null, null, null]);
  const [toast, setToast] = useState(null);
  const mainPhotoRef = useRef(null);
  const [mainPhotoFile, setMainPhotoFile] = useState(null);
  const [mediaFiles, setMediaFiles] = useState([null, null, null]);

  const handleField = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const addPersonalityTag = () => {
    const tag = form.personalidade.trim();
    if (!tag) return;
    if (!personalityTags.includes(tag)) {
      setPersonalityTags((prev) => [...prev, tag]);
    }
    setForm((prev) => ({ ...prev, personalidade: "" }));
  };

  const handlePersonalityKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addPersonalityTag();
    }
  };

  const removePersonalityTag = (tagToRemove) => {
    setPersonalityTags((prev) => prev.filter((tag) => tag !== tagToRemove));
  };

  const handleMainPhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setMainPhotoFile(file);                        // guarda o File
    setMainPhoto(URL.createObjectURL(file));        // guarda a URL só pro preview
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nome.trim()) { showToast("⚠️ Por favor, insira o nome do pet."); return; }

    const data = new FormData();

    // campos de texto
    data.append('name', form.nome);
    data.append('species', form.especie);
    data.append('age', form.idade);
    data.append('size', form.porte);
    data.append('city', form.cidade);
    data.append('state', form.estado);
    data.append('gender', form.genero);
    data.append('vaccine', form.vacinacao);
    data.append('castrated', form.castrado);
    data.append('description', form.descricao);
    data.append('personality', personalityTags.join(','));
    data.append('contact', form.contato);
    data.append('fk_user', 1);

    // foto principal (você precisa guardar o File, não só a URL)
    if (mainPhotoFile) data.append('profile_photo', mainPhotoFile);

    // outras fotos
    mediaFiles.forEach(file => {
      if (file) data.append('others_photos_videos', file);
    });

  const response = await fetch('http://localhost:3001/pets', {
    method: 'POST',
    body: data
  });

  const result = await response.json();
  showToast(`🐾 Pet "${form.nome}" cadastrado com sucesso!`);
  setTimeout(() => onNavigate('home'), 1500);
};

const handleMediaAttach = (file, idx) => {
  if (!file) return;
  setMediaFiles(prev => { const c = [...prev]; c[idx] = file; return c; }); // guarda o File
  setMediaPreviews(prev => { const c = [...prev]; c[idx] = URL.createObjectURL(file); return c; });
};

  const DOC_LABELS = [
    "Carteirinha de vacinação",
    "Carteirinha de vacinação",
    "Carteirinha de vacinação",
    "Carteirinha de vacinação",
    "Carteirinha de vacinação",
    "Carteirinha de vacinação",
  ];

  const MEDIA_LABELS = [
    "Adicionar foto",
    "Adicionar foto",
    "Adicionar foto",
    "Adicionar foto",
    "Adicionar foto",
    "Adicionar foto",
  ];

  return (
    <div className="cadastre-container">
      <Header
        onNavigate={onNavigate}
        onFavoritesClick={onFavoritesClick}
        onRegisterPetClick={onRegisterPetClick}
        onLoginClick={onLoginClick}
        activePage="cadastre"
      />

      <main className="cadastre-main">
        <h1 className="cadastre-title">Cadastre seu pet!</h1>

        <div className="cadastre-grid">
          {/* ── Coluna esquerda: preview ── */}
          <aside className="cadastre-preview">
            <p className={`preview-name ${form.nome ? "preview-name--active" : ""}`}>
              {form.nome || "{Nome pet}"}
            </p>

            {/* Foto principal */}
            <div
              className={`main-photo ${mainPhoto ? "main-photo--filled" : ""}`}
              onClick={() => mainPhotoRef.current.click()}
            >
              {mainPhoto ? (
                <img src={mainPhoto} alt="Foto principal do pet" className="main-photo__img" />
              ) : (
                <div className="main-photo__hint">
                  <CameraIcon />
                  <span>Clique para adicionar foto principal</span>
                </div>
              )}
              <input
                ref={mainPhotoRef}
                type="file"
                accept="image/*"
                onChange={handleMainPhoto}
                style={{ display: "none" }}
              />
            </div>

            {/* Miniaturas */}
            <div className="thumb-row">
              {[0, 1, 2].map((i) => (
                <ThumbSlot
                  key={i}
                  preview={mediaPreviews && mediaPreviews[i]}
                  onChange={(file) => handleMediaAttach(file, i)}
                  isEmpty={i === 2}
                />
              ))}
            </div>
            {personalityTags.length > 0 && (
              <div className="personality-tags">
                {personalityTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className="personality-tag"
                    onClick={() => removePersonalityTag(tag)}
                  >
                    {tag}
                    <span className="personality-tag__remove">×</span>
                  </button>
                ))}
              </div>
            )}
          </aside>

          {/* formulario de cadastro pet */}
          <form className="cadastre-form" onSubmit={handleSubmit} noValidate>

            {/* linha 1: Nome / Espécie */}
            <div className="form-row form-row--2">
              <div className="field-group">
                <label htmlFor="nome">Nome</label>
                <input
                  id="nome"
                  name="nome"
                  type="text"
                  className="field-input"
                  placeholder="Insira o nome do pet"
                  value={form.nome}
                  onChange={handleField}
                />
              </div>
              <div className="field-group">
                <label htmlFor="especie">Espécie</label>
                <select
                  id="especie"
                  name="especie"
                  className="field-input"
                  value={form.especie}
                  onChange={handleField}
                >
                  <option value="">Selecione</option>
                  <option value="Cachorro">Cachorro</option>
                  <option value="Gato">Gato</option>
                  <option value="Roedor">Roedor</option>
                </select>
              </div>
            </div>

            {/* linha 2: Porte/Idade/Gênero e Personalidade */}
            <div className="form-row form-row--2">
              <div className="field-group">
                <label htmlFor="porte">Porte</label>
                <select
                  id="porte"
                  name="porte"
                  className="field-input"
                  value={form.porte}
                  onChange={handleField}
                >
                  <option value="">Selecione</option>
                  <option value="Pequeno">Pequeno</option>
                  <option value="Médio">Médio</option>
                  <option value="Grande">Grande</option>
                </select>
              </div>

              <div className="field-group">
                <label htmlFor="idade">Idade</label>
                <input
                  id="idade"
                  name="idade"
                  type="number"
                  min="0"
                  className="field-input"
                  placeholder="Insira a idade do pet"
                  value={form.idade}
                  onChange={handleField}
                >
                </input>
              </div>
            </div>

            <div className="form-row form-row--2">
              <div className="field-group">
                <label htmlFor="genero">Gênero</label>
                <select
                  id="genero"
                  name="genero"
                  className="field-input"
                  value={form.genero}
                  onChange={handleField}
                >
                  <option value="">Selecione</option>
                  <option value="Fêmea">Fêmea</option>
                  <option value="Macho">Macho</option>
                </select>
              </div>

              <div className="field-group">
                <label htmlFor="personalidade">Personalidade</label>
                <input
                  id="personalidade"
                  name="personalidade"
                  type="text"
                  className="field-input"
                  placeholder="Digite e pressione Enter"
                  value={form.personalidade}
                  onChange={handleField}
                  onKeyDown={handlePersonalityKeyDown}
                />
              </div>
            </div>

            {/* linha 3: Descrição e Vacinação/Castrado lado a lado */}
            <div className="form-row form-row--porte-desc">
              <div className="field-group field-group--desc">
                <label htmlFor="descricao">Descrição</label>
                <textarea
                  id="descricao"
                  name="descricao"
                  className="field-input field-input--textarea"
                  placeholder="Conte um pouco sobre a história do seu pet"
                  value={form.descricao}
                  onChange={handleField}
                />
              </div>

              {/* Coluna Direita: Vacinação e Castrado empilhados verticalmente */}
              <div className="form-fields-stack">
                <div className="field-group">
                  <label htmlFor="vacinacao">Vacinação</label>
                  <select
                    id="vacinacao"
                    name="vacinacao"
                    className="field-input"
                    value={form.vacinacao}
                    onChange={handleField}
                  >
                    <option value="">Selecione</option>
                    <option value="Em dia">Em dia</option>
                    <option value="Incompleto">Incompleto</option>
                    <option value="Não vacinado">Não vacinado</option>
                  </select>
                </div>

                <div className="field-group">
                  <label htmlFor="castrado">Castrado</label>
                  <select
                    id="castrado"
                    name="castrado"
                    className="field-input"
                    value={form.castrado}
                    onChange={handleField}
                  >
                    <option value="">Selecione</option>
                    <option value="Sim">Sim</option>
                    <option value="Não">Não</option>
                  </select>
                </div>

                <div className="field-group">
                <label htmlFor="cidade">Cidade</label>
                <input
                  id="cidade"
                  name="cidade"
                  type="text"
                  className="field-input"
                  value={form.cidade}
                  onChange={handleField}
                />
              </div>
              </div>
            </div>

            {/* linha 4: Cidade / Estado / Contato organizados em colunas */}
            <div className="form-row form-row--2">

              <div className="field-group">
                <label htmlFor="estado">Estado</label>
                <input
                  id="estado"
                  name="estado"
                  type="text"
                  className="field-input"
                  value={form.estado}
                  onChange={handleField}
                />
              </div>

              <div className="field-group">
                <label htmlFor="contato">Contato</label>
                <input
                  id="contato"
                  name="contato"
                  type="tel"
                  inputMode="tel"
                  className="field-input"
                  placeholder="Número para contato"
                  value={form.contato}
                  onChange={handleField}
                />
              </div>
            </div>

            {/* seções de anexo */}
            <div className="attach-sections">
              <div className="attach-section attach-section--documents">
                <h3 className="attach-section__title">Anexo de documentos</h3>
                <div className="attach-grid">
                  {DOC_LABELS.map((label, i) => (
                    <AttachCard
                      key={`doc-${i}`}
                      label={label}
                      accept=".pdf,.jpg,.jpeg,.png"
                      icon={<FileIcon />}
                    />
                  ))}
                </div>
              </div>

              <div className="attach-section attach-section--media">
                <h3 className="attach-section__title">Adicionar +foto/vídeo</h3>
                <div className="attach-grid">
                  {MEDIA_LABELS.map((label, i) => (
                    <AttachCard
                      key={`media-${i}`}
                      label={label}
                      accept="image/*,video/*"
                      icon={<ImageIcon />}
                      onFileSelect={(file) => handleMediaAttach(file, i)}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-cadastrar">
                Cadastrar pet 🐾
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />

      {toast && <div className="cadastre-toast">{toast}</div>}
    </div>
  );
};

export default RegisterPet;