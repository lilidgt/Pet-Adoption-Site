import React, { useState, useRef, useEffect } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./EditPet.css";

// Ícone de upload (câmera)
const CameraIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    width="32"
    height="32"
  >
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

// Ícone de arquivo (documentos)
const FileIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    width="18"
    height="18"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

// Ícone de imagem
const ImageIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    width="18"
    height="18"
  >
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
    const name =
      file.name.length > 16 ? file.name.slice(0, 14) + "…" : file.name;
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

// CORREÇÃO 1: miniatura da foto/video simplificada e sem erro de useEffect
const ThumbSlot = ({ isEmpty, preview, onChange }) => {
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (onChange) onChange(file);
  };

  return (
    <div
      className={`thumb-slot ${preview ? "thumb-slot--filled" : ""}`}
      onClick={() => inputRef.current.click()}
    >
      {preview ? (
        <img src={preview} alt="Miniatura" className="thumb-slot__img" />
      ) : (
        <span className="thumb-slot__plus">
          {isEmpty ? <CameraIcon /> : "+"}
        </span>
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

//pagina principal de edição do pet
// CORREÇÃO 2: onBackClick removido dos parâmetros para evitar o erro de 'unused-vars'
const EditPet = ({
  petId,
  onNavigate,
  onFavoritesClick,
  onRegisterPetClick,
  onLoginClick,
}) => {
  const [form, setForm] = useState({
    nome: "",
    especie: "",
    porte: "",
    idade: "",
    genero: "",
    personalidade: "",
    contato: "",
    endereco: "",
    descricao: "",
  });
  const [personalityTags, setPersonalityTags] = useState([]);
  const [mainPhoto, setMainPhoto] = useState(null);
  const [mediaPreviews, setMediaPreviews] = useState([null, null, null]);
  const [toast, setToast] = useState(null);
  const mainPhotoRef = useRef(null);

  // CORREÇÃO 3: showToast movido para CIMA do useEffect para ele conseguir enxergá-la
  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Função auxiliar para arrumar a URL da imagem vinda do banco
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith("http") || imagePath.startsWith("data:")) {
      return imagePath;
    }
    const separator = imagePath.startsWith("/") ? "" : "/";
    return `http://localhost:3001${separator}${imagePath}`;
  };

  // Busca os dados do pet selecionado assim que a tela abre
  useEffect(() => {
    if (!petId) return;

    fetch(`http://localhost:3001/pets/${petId}`)
      .then((response) => response.json())
      .then((data) => {
        // Padroniza o gênero para bater com as opções do Select
        let generoDB = data.gender || "";
        if (
          generoDB.toLowerCase().includes("femea") ||
          generoDB.toLowerCase().includes("fêmea")
        ) {
          generoDB = "Fêmea";
        } else if (generoDB.toLowerCase().includes("macho")) {
          generoDB = "Macho";
        }

        setForm({
          nome: data.name || "",
          especie: data.species || "",
          porte: data.size || "",
          idade: data.age || "",
          genero: generoDB,
          personalidade: "",
          contato: data.contact || "",
          endereco: data.address || "",
          descricao: data.description || "",
        });

        if (data.personality) {
          setPersonalityTags(
            data.personality
              .replace(/"/g, "")
              .split(",")
              .map((t) => t.trim()),
          );
        }

        if (data.profile_photo) {
          setMainPhoto(getImageUrl(data.profile_photo));
        }

        if (data.others_photos_videos) {
          const adicionais = data.others_photos_videos
            .split(",")
            .map((img) => getImageUrl(img.trim()));

          setMediaPreviews([
            adicionais[0] || null,
            adicionais[1] || null,
            adicionais[2] || null,
          ]);
        }
      })
      .catch((err) => {
        console.error("Erro ao buscar dados do pet:", err);
        showToast("Erro ao carregar os dados do pet.");
      });
  }, [petId]);

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
    setMainPhoto(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.nome.trim()) {
      showToast("Por favor, insira o nome do pet.");
      return;
    }

    const updatedData = {
      ...form,
      personality: personalityTags.join(", "),
    };

    fetch(`http://localhost:3001/pets/${petId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    })
      .then((response) => {
        if (!response.ok) throw new Error("Erro ao salvar");
        showToast(`Pet "${form.nome}" atualizado com sucesso!`);
      })
      .catch((err) => {
        console.error(err);
        showToast("Erro ao atualizar o pet.");
      });
  };

  const handleMediaAttach = (file, idx) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setMediaPreviews((prev) => {
      const copy = [...prev];
      copy[idx] = url;
      return copy;
    });
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
        <h1 className="cadastre-title">Editar pet</h1>

        <div className="cadastre-grid">
          {/* ── Coluna esquerda: preview ── */}
          <aside className="cadastre-preview">
            <p
              className={`preview-name ${form.nome ? "preview-name--active" : ""}`}
            >
              {form.nome || "{Nome pet}"}
            </p>

            {/* Foto principal */}
            <div
              className={`main-photo ${mainPhoto ? "main-photo--filled" : ""}`}
              onClick={() => mainPhotoRef.current.click()}
            >
              {mainPhoto ? (
                <img
                  src={mainPhoto}
                  alt="Foto principal do pet"
                  className="main-photo__img"
                />
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

          {/* formulario de editar pet */}
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
                <input
                  id="especie"
                  name="especie"
                  type="text"
                  className="field-input"
                  placeholder="Insira a espécie do pet"
                  value={form.especie}
                  onChange={handleField}
                />
              </div>
            </div>

            {/* linha 2: Porte/Idade/Gênero e descrição e contato */}
            <div className="form-row form-row--porte-desc">
              <div className="form-fields-stack">
                <div className="field-group">
                  <label htmlFor="porte">Porte</label>
                  <input
                    id="porte"
                    name="porte"
                    type="text"
                    className="field-input"
                    placeholder="Insira o porte do pet"
                    value={form.porte}
                    onChange={handleField}
                  />
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
                  />
                </div>
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
              <div className="form-fields-stack">
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
                Salvar alterações 🐾
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

export default EditPet;
