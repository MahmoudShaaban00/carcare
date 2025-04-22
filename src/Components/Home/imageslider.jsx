import React, { useState } from "react";
import toyota from '../../assets/toyota.jpg';
import bmw from '../../assets/BMW.jpg';
import bentley from '../../assets/bentley.jpg';
import fiat from '../../assets/fiat.jpg';
import kia from '../../assets/kia.jpg';
import bugatti from '../../assets/bugatti.jpg';
import chevrolet from '../../assets/chevrolet.jpg';
import ferrari from '../../assets/ferrari.jpg';
import hyundai from '../../assets/hyundai.jpg';
import skoda from '../../assets/skoda.jpg';
import pagani from '../../assets/pagani.jpg';
import nissan from '../../assets/nissan.jpg';
import mercedes from '../../assets/mercedes.jpg';

const ImageSlider = () => {
  const images = [
    toyota,
    bmw,
    bentley,
    fiat,
    kia,
    bugatti,
    chevrolet,
    ferrari,
    hyundai,
    skoda,
    pagani,
    nissan,
    mercedes,
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex + 3 < images.length) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto overflow-hidden">
      {/* Slider */}
      <div className="flex w-full">
        <div
          className="flex transition-transform duration-500"
          style={{
            transform: `translateX(-${currentIndex * (100 / 3)}%)`,
            width: `${(images.length / 3) * 100}%`,
          }}
        >
          {images.map((image, index) => (
            <div key={index} className="w-1/3 flex-shrink-0 flex justify-center items-center p-2" >
              <img src={image} alt={`Slide ${index + 1}`} className="w-[170px] h-auto rounded-lg"/>
            </div>
          ))}
        </div>
      </div>

      {/* Left Button */}
      <button
        className="absolute top-1/2 -translate-y-1/2 left-4 bg-gray-800 text-white p-2 rounded-full"
        onClick={handlePrev}
        disabled={currentIndex === 0}
      >
        {"<"}
      </button>

      {/* Right Button */}
      <button
        className="absolute top-1/2 -translate-y-1/2 right-4 bg-gray-800 text-white p-2 rounded-full"
        onClick={handleNext}
        disabled={currentIndex + 3 >= images.length}
      >
        {">"}
      </button>
    </div>
  );
};

export default ImageSlider;
