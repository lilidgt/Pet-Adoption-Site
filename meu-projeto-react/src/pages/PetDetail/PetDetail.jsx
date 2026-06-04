import React from 'react';
import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';
import PetCarousel from '../../components/PetCarousel/PetCarousel';
import './PetDetail.css';

// importacao dos icones utilizados no componente
import houseIcon from '../../assets/house.fill.svg';
import calendarIcon from '../../assets/calendar icon.svg';
import vaccineIcon from '../../assets/vaccine icon.svg';
import genderIcon from '../../assets/genger icon.svg';
import rulerIcon from '../../assets/ruler icon.svg';
import footprintIcon from '../../assets/footprint icon.svg';
import personIcon from '../../assets/person icon.png';
import contactIcon from '../../assets/contact icon.png';

import leftArrow from '../../assets/left arrow.svg';

const PetDetail = ({ onBackClick, onNavigate, onLoginClick }) => {
    return (
        <div className="pet-detail-page">
            <Header onNavigate={onNavigate} onLoginClick={onLoginClick} />
            
            <main className="pet-detail-main">
                <button className="btn-back" onClick={onBackClick}>
                    <img src={leftArrow} alt="Voltar" />
                    Voltar
                </button>
                <div className="pet-detail-container">
                    
                    {/* Coluna Esquerda: Ações, Carrossel e Nome */}
                    <section className="pet-left-column">
                        <div className="pet-action-buttons">
                            <button className="btn-favorite-action">
                                <img src={houseIcon} alt="Favorito"/>
                                Favorito
                            </button>
                            <button className="btn-adopt-action">Quero adotar</button>
                        </div>

                        <PetCarousel />

                        <h1 className="pet-display-name">Paçoca</h1>
                    </section>

                    {/* Coluna Direita: Cards de Informação */}
                    <section className="pet-right-column">
                        
                        {/* Card de Atributos */}
                        <div className="info-card stats-card">
                            <div className="stats-grid-display">
                                <div className="stat-display-item">
                                    <img src={calendarIcon} alt="Idade" className="stat-display-icon"/>
                                    <div>
                                        <p className="stat-display-label">Idade</p>
                                        <p className="stat-display-value">1 ano</p>
                                    </div>
                                </div>
                                <div className="stat-display-item">
                                    <img src={vaccineIcon} alt="Vacinas" className="stat-display-icon"/>
                                    <div>
                                        <p className="stat-display-label">Vacinas</p>
                                        <p className="stat-display-value">Em dia</p>
                                    </div>
                                </div>
                                <div className="stat-display-item">
                                    <img src={genderIcon} alt="Sexo" className="stat-display-icon"/>
                                    <div>
                                        <p className="stat-display-label">Sexo</p>
                                        <p className="stat-display-value">Macho</p>
                                    </div>
                                </div>
                                <div className="stat-display-item">
                                    <img src={rulerIcon} alt="Porte" className="stat-display-icon"/>
                                    <div>
                                        <p className="stat-display-label">Porte</p>
                                        <p className="stat-display-value">Pequeno</p>
                                    </div>
                                </div>
                                <div className="stat-display-item">
                                    <img src={footprintIcon} alt="Castrado" className="stat-display-icon"/>
                                    <div>
                                        <p className="stat-display-label">Castrado</p>
                                        <p className="stat-display-value">Sim</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pet-tags-list">
                                <span className="pet-tag-item">Brincalhão</span>
                                <span className="pet-tag-item">Protetor</span>
                                <span className="pet-tag-item">Calmo</span>
                                <span className="pet-tag-item">Energético</span>
                                <span className="pet-tag-item">Barulhento</span>
                                <span className="pet-tag-item">Amoroso</span>
                            </div>
                        </div>

                        {/* Card Sobre */}
                        <div className="info-card about-card">
                            <h2>Sobre o Paçoca</h2>
                            <p>
                                Diga olá para o Paçoca! Um cãozinho de coração gigante que adora brincar e receber carinho.
                                Ele está ansioso para encontrar o seu humano favorito. Será que é você?
                            </p>
                        </div>

                        {/* Card de Contato */}
                        <div className="contact-row-display">
                            <div className="info-card responsible-info">
                                <img src={personIcon} alt="Responsável" className="contact-display-icon"/>
                                <div>
                                    <p className="contact-display-label">Responsável</p>
                                    <p className="contact-display-value">Lar temporário alecrim</p>
                                </div>
                            </div>

                            <button className="info-card btn-contact-submit">
                                <img src={contactIcon} alt="Entrar em contato" className="contact-display-icon"/>
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

export default PetDetail;
