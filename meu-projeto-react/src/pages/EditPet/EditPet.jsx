import React, { useState, useRef, useEffect } from "react";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./EditPet.css";

import leftArrow from "../../assets/left arrow.svg";

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

const EditPet = ({
  petId,
  onNavigate,
  onFavoritesClick,
  onRegisterPetClick,
  onLoginClick,
  isLoggedIn,
  onLogoutClick,
}) => {
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
  const [statesList, setStatesList] = useState([]);
  const [citiesList, setCitiesList] = useState([]);
  const [loadingCities, setLoadingCities] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mainPhoto, setMainPhoto] = useState(null);
  const [mediaPreviews, setMediaPreviews] = useState([null, null, null]);
  const [toast, setToast] = useState(null);
  const mainPhotoRef = useRef(null);
  const [mainPhotoFile, setMainPhotoFile] = useState(null);
  const [mediaFiles, setMediaFiles] = useState([null, null, null]);

  useEffect(() => {
    if (!petId) return;

    fetch(`http://localhost:3001/pets/${petId}`)
      .then((res) => res.json())
      .then((data) => {
        setForm({
          nome: data.name || "",
          especie: data.species || "",
          idade: data.age || "",
          porte: data.size || "",
          cidade: data.city || "",
          estado: data.state || "",
          genero: data.gender || "",
          vacinacao: data.vaccine || "",
          castrado: data.castrated || "",
          contato: data.contact || "",
          descricao: data.description || "",
          personalidade: "",
        });

        if (data.personality) {
          const tags = data.personality
            .replace(/"/g, "")
            .split(",")
            .map((t) => t.trim())
            .filter((t) => t);
          setPersonalityTags(tags);
        }

        if (data.profile_photo) {
          try {
            setMainPhoto(new URL(`../../assets/photos/${data.profile_photo}`, import.meta.url).href);
          } catch (e) {
            console.error("Erro ao carregar foto principal:", e);
          }
        }

        if (data.others_photos_videos) {
          const others = data.others_photos_videos
            .split(",")
            .map((img) => img.trim());
          const newPreviews = [null, null, null];
          others.forEach((img, i) => {
            if (i < 3) {
              try {
                newPreviews[i] = new URL(`../../assets/photos/${img}`, import.meta.url).href;
              } catch (e) {
                console.error(`Erro ao carregar miniatura ${i}:`, e);
              }
            }
          });
          setMediaPreviews(newPreviews);
        }
      })
      .catch((err) => console.error("Erro ao carregar dados do pet:", err));
  }, [petId]);

  const handleField = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleStateChange = (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, estado: value, cidade: "" }));
  };

  useEffect(() => {
    fetch(
      "https://servicodados.ibge.gov.br/api/v1/localidades/estados?orderBy=nome",
    )
      .then((res) => res.json())
      .then((data) => setStatesList(data))
      .catch((err) => console.error("Erro ao carregar estados IBGE:", err));
  }, []);

  useEffect(() => {
    if (!form.estado) {
      setCitiesList([]);
      return;
    }

    setLoadingCities(true);
    fetch(
      `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${form.estado}/municipios?orderBy=nome`,
    )
      .then((res) => res.json())
      .then((data) => setCitiesList(data))
      .catch((err) => {
        console.error("Erro ao carregar cidades IBGE:", err);
        setCitiesList([]);
      })
      .finally(() => setLoadingCities(false));
  }, [form.estado]);

  const addPersonalityTag = () => {
    const tag = form.personalidade.trim();
    if (!tag) return;
    if (!personalityTags.includes(tag)) {
      setPersonalityTags((prev) => [...prev, tag]);
    }
    setForm((prev) => ({ ...prev, personalidad: "" }));
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
    setMainPhotoFile(file);
    setMainPhoto(URL.createObjectURL(file));
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nome.trim()) {
      showToast("Por favor, insira o nome do pet.");
      return;
    }

    setIsSubmitting(true);

    const data = new FormData();

    data.append("name", form.nome);
    data.append("species", form.especie);
    data.append("age", form.idade);
    data.append("size", form.porte);
    data.append("city", form.cidade);
    data.append("state", form.estado);
    data.append("gender", form.genero);
    data.append("vaccine", form.vacinacao);
    data.append("castrated", form.castrado);
    data.append("description", form.descricao);
    data.append("personality", personalityTags.join(","));

    const contatoNumeros = form.contato.trim().replace(/\D/g, "");
    const contatoFormatado = contatoNumeros
      ? contatoNumeros.startsWith("55")
        ? contatoNumeros
        : `55${contatoNumeros}`
      : "";
    data.append("contact", contatoFormatado);

    if (mainPhotoFile) {
      data.append("profile_photo", mainPhotoFile);
    }

    mediaFiles.forEach((file) => {
      if (file) data.append("others_photos_videos", file);
    });

    try {
      const response = await fetch(`http://localhost:3001/pets/${petId}`, {
        method: "PUT",
        body: data,
      });

      if (!response.ok) {
        throw new Error("Resposta inválida do servidor");
      }

      await response.json();
      showToast(`Pet "${form.nome}" atualizado com sucesso!`);
      setTimeout(() => onNavigate(petId), 1500);
    } catch (error) {
      console.error("Erro ao conectar ou processar requisição:", error);
      showToast(
        "Não foi possível conectar ao servidor. Certifique-se de que o back-end está rodando.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMediaAttach = (file, idx) => {
    if (!file) return;
    setMediaFiles((prev) => {
      const c = [...prev];
      c[idx] = file;
      return c;
    });
    setMediaPreviews((prev) => {
      const c = [...prev];
      c[idx] = URL.createObjectURL(file);
      return c;
    });
  };

  return (
    <div className="edit-pet-container">
      <Header
        onNavigate={onNavigate}
        onFavoritesClick={onFavoritesClick}
        onRegisterPetClick={onRegisterPetClick}
        onLoginClick={onLoginClick}
        isLoggedIn={isLoggedIn}
        onLogoutClick={onLogoutClick}
        activePage="edit-pet"
      />

      <main className="edit-pet-main">
        <div className="edit-pet-header">
          <button className="btn-back" onClick={() => onNavigate(petId)}>
            <img src={leftArrow} alt="Voltar" />
            Voltar
          </button>
        </div>
        <h1 className="edit-pet-title">Editar seu pet!</h1>

        <div className="edit-pet-grid">
          <aside className="edit-pet-preview">
            <p
              className={`preview-name ${form.nome ? "preview-name--active" : ""}`}
            >
              {form.nome || "{Nome pet}"}
            </p>

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

          <form className="edit-pet-form" onSubmit={handleSubmit} noValidate>
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
                  className="field-input"
                  placeholder="Insira a idade do pet"
                  value={form.idade}
                  onChange={handleField}
                />
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
                    list="cidade-list"
                    placeholder={
                      loadingCities
                        ? "Carregando cidades..."
                        : form.estado
                          ? "Selecione ou digite a cidade"
                          : "Selecione o estado primeiro"
                    }
                    disabled={!form.estado || loadingCities}
                    autoComplete="off"
                  />
                  <datalist id="cidade-list">
                    {citiesList.map((city) => (
                      <option key={city.id} value={city.nome} />
                    ))}
                  </datalist>
                </div>
              </div>
            </div>

            <div className="form-row form-row--2">
              <div className="field-group">
                <label htmlFor="estado">Estado</label>
                <select
                  id="estado"
                  name="estado"
                  className="field-input"
                  value={form.estado}
                  onChange={handleStateChange}
                >
                  <option value="">Selecione</option>
                  {statesList.map((state) => (
                    <option key={state.id} value={state.sigla}>
                      {state.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field-group">
                <label htmlFor="contato">Contato</label>
                <input
                  id="contato"
                  name="contato"
                  type="tel"
                  inputMode="tel"
                  className="field-input"
                  placeholder="WhatsApp com DDD"
                  value={form.contato}
                  onChange={handleField}
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn-salvar"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Salvando... 🐾" : "Salvar alterações 🐾"}
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />

      {toast && <div className="edit-pet-toast">{toast}</div>}
    </div>
  );
};

export default EditPet;