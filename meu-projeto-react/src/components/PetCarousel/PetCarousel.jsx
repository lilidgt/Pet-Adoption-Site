import React, { useState } from 'react';
import './PetCarousel.css';
import leftArrow from '../../assets/left arrow.svg';

const PetCarousel = ({ petPhotos }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Valida se vieram fotos do componente pai
    const images = petPhotos && petPhotos.length > 0 ? petPhotos : [];

    // FUNÇÃO MÁGICA DO VITE: Transforma o nome/caminho do banco em um arquivo local válido
    const getLocalImageUrl = (imagePath) => {
        if (!imagePath) return "https://via.placeholder.com/600x400?text=Sem+Foto";

        // Se o banco trouxer o caminho completo, pegamos apenas o nome do arquivo final (ex: dog_1.png)
        const fileName = imagePath.split(/[/\\]/).pop();

        // Procura o arquivo dinamicamente dentro da sua pasta de assets/photos locais
        // O caminho relativo abaixo parte de ONDE ESTÁ este arquivo do carrossel até a pasta das fotos
        return new URL(`../../assets/photos/${fileName}`, import.meta.url).href;
    };

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => 
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    return (
        <div className="pet-carousel-container">
            {images.length > 0 ? (
                <img 
                    key={currentIndex}
                    // Passa o caminho do banco pela função para o Vite conseguir ler seu PC
                    src={getLocalImageUrl(images[currentIndex])} 
                    alt={`Pet ${currentIndex + 1}`} 
                    className="pet-image" 
                />
            ) : (
                <img 
                    src="https://via.placeholder.com/600x400?text=Sem+Foto" 
                    alt="Sem foto disponível" 
                    className="pet-image" 
                />
            )}
            
            {/* Só exibe os botões de navegação se houver mais de uma foto */}
            {images.length > 1 && (
                <>
                    <button className="carousel-button-left" aria-label="Anterior" onClick={prevSlide}>
                        <img src={leftArrow} className="arrow-icon" alt="Seta esquerda" />
                    </button>
                    <button className="carousel-button-right" aria-label="Próximo" onClick={nextSlide}>
                        <img src={leftArrow} className="arrow-icon arrow-right" alt="Seta direita" />
                    </button>
                </>
            )}
        </div>
    );
};

export default PetCarousel;