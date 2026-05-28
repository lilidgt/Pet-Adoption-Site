import React, { useState } from 'react';
import './PetCarousel.css';
import leftArrow from '../../assets/left arrow.svg';

import dog1 from '../../assets/photos/dog_1.png'; 
import dog2 from '../../assets/photos/dog_2.jpg'; 
import dog3 from '../../assets/photos/dog_3.jpg'; 

const PetCarousel = () => {
    const images = [dog1, dog2, dog3];
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextSlide = () => {
    // Se estiver na última foto, volta para a primeira (0). Se não, avança uma.
        setCurrentIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
        );
    };
    const prevSlide = () => {
        // Se estiver na primeira foto (0), vai para a última. Se não, volta uma.
        setCurrentIndex((prevIndex) => 
        prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

  

  return (
    <div className="pet-carousel-container">
        <img 
        key={currentIndex}
        src={images[currentIndex]} 
        alt={`Pet ${currentIndex + 1}`} 
        className="pet-image" 
      />
        <button className="carousel-button-left" aria-label="Anterior" onClick={prevSlide}>
            <img src={leftArrow}  className="arrow-icon" />
        </button>
        <button className="carousel-button-right" aria-label="Próximo" onClick={nextSlide}>
            <img src={leftArrow}  className="arrow-icon" />
        </button>
    </div>
  );
};

export default PetCarousel;
