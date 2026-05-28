// importacao do react
import React from 'react';
// importacao do arquivo de estilos css
import './PetDetailView.css';
import PetCarousel from "../../components/PetCarousel/PetCarousel";
import Footer from '../Footer/Footer';

// importacao dos icones utilizados no componente
import houseIcon from '../../assets/house.fill.svg';
import calendarIcon from '../../assets/calendar icon.svg';
import vaccineIcon from '../../assets/vaccine icon.svg';
import genderIcon from '../../assets/genger icon.svg';
import rulerIcon from '../../assets/ruler icon.svg';
import footprintIcon from '../../assets/footprint icon.svg';
import personIcon from '../../assets/person icon.png';
import contactIcon from '../../assets/contact icon.png';

// componente principal de visualizacao de detalhes do pet
const PetDetailView = () => {
    return (
        // container principal da pagina
        <div>
        <main className="pet-main-wrapper">
            {/* container que agrupa as duas colunas */}
            <div className="pet-container">

                {/* coluna esquerda: acoes, foto e nome */}
                <section className="pet-left-col">
                    {/* botoes de acao favoritar e adotar */}
                    <div className="pet-actions">
                        {/* botao para favoritar o pet */}
                        <button className="btn-favorite">
                            <img src={houseIcon} alt="Favorito"/>
                            Favorito
                        </button>
                        {/* botao para iniciar processo de adocao */}
                        <button className="btn-adopt">Quero adotar</button>
                    </div>

                    {/* container da imagem do pet com navegacao */}
                    <PetCarousel />

                    {/* nome do pet */}
                    <h1 className="pet-name">Paçoca</h1>
                </section>

                {/* coluna direita: cards de informacao */}
                <section className="pet-right-col">

                    {/* card 1: atributos e tags */}
                    <div className="pet-detail-card pet-stats-card">
                        {/* grid com informacoes basicas do pet */}
                        <div className="stats-grid">
                            {/* informacao de idade */}
                            <div className="stat-item">
                                <img src={calendarIcon} alt="Idade" className="stat-icon"/>
                                <div>
                                    <p className="stat-label">Idade</p>
                                    <p className="stat-value">1 ano</p>
                                </div>
                            </div>
                            {/* informacao de vacinas */}
                            <div className="stat-item">
                                <img src={vaccineIcon} alt="Vacinas" className="stat-icon"/>
                                <div>
                                    <p className="stat-label">Vacinas</p>
                                    <p className="stat-value">Em dia</p>
                                </div>
                            </div>
                            {/* informacao de sexo */}
                            <div className="stat-item">
                                <img src={genderIcon} alt="Sexo" className="stat-icon"/>
                                <div>
                                    <p className="stat-label">Sexo</p>
                                    <p className="stat-value">Macho</p>
                                </div>
                            </div>
                            {/* informacao de porte */}
                            <div className="stat-item">
                                <img src={rulerIcon} alt="Porte" className="stat-icon"/>
                                <div>
                                    <p className="stat-label">Porte</p>
                                    <p className="stat-value">Pequeno</p>
                                </div>
                            </div>
                            {/* informacao de castracao */}
                            <div className="stat-item">
                                <img src={footprintIcon} alt="Castrado" className="stat-icon"/>
                                <div>
                                    <p className="stat-label">Castrado</p>
                                    <p className="stat-value">Sim</p>
                                </div>
                            </div>
                        </div>

                        {/* tags de caracteristicas do pet */}
                        <div className="tags-container">
                            <span className="tag">Brincalhão</span>
                            <span className="tag">Protetor</span>
                            <span className="tag">Calmo</span>
                            <span className="tag">Energético</span>
                            <span className="tag">Barulhento</span>
                            <span className="tag">Amoroso</span>
                        </div>
                    </div>

                    {/* card 2: sobre */}
                    <div className="pet-detail-card pet-about-card">
                        {/* titulo da secao sobre */}
                        <h2>Sobre o Paçoca</h2>
                        {/* descricao do pet */}
                        <p>
                            Diga olá para o Paçoca! Um cãozinho de coração gigante que adora brincar e receber carinho.
                            Ele está ansioso para encontrar o seu humano favorito. Será que é você?
                        </p>
                    </div>

                    {/* card 3: contatos */}
                    <div className="pet-contact-row">
                        {/* informacoes do responsavel */}
                        <div className="pet-detail-card contact-info">
                            <img src={personIcon} alt="Responsável" className="contact-icon"/>
                            <div>
                                <p className="contact-label">Responsável</p>
                                <p className="contact-value">Lar temporário alecrim</p>
                            </div>
                        </div>

                        {/* botao para entrar em contato */}
                        <button className="pet-detail-card btn-contact-action">
                            <img src={contactIcon} alt="Entrar em contato" className="contact-icon"/>
                            Entrar em contato
                        </button>
                    </div>

                </section>
            </div>
        </main>
        <Footer />
    </div>
    );
};

// exportacao do componente
export default PetDetailView;