import React from 'react';
import './Carousel.css';
import { NavLink } from 'react-router-dom';

const Carousel = ({ title, date, description, imageSrc, index, totalItems, paraid}) => {
  const isActive = index === 0; // Replace this with your logic based on the current index

  return (
    <div className={`custom-carousel ${isActive ? 'active' : ''}`}>
      <div className="carousel-left">
        <h2 className="carousel-title">{title}</h2>
        <p className="carousel-date">{date}</p>
        <p className="carousel-description">{description}</p>
        <NavLink className="nav-link" to={`/VideoPage/${encodeURIComponent(title)}/${paraid}`} >
        <button className="carousel-play-button" ><i className="fas fa-play icons"></i> Watch</button>
        </NavLink>
        <div className="carousel-dots">
          {/* Dots will be added dynamically based on the number of carousel items */}
          {[...Array(totalItems).keys()].map((dotIndex) => (
            <span key={dotIndex} className={`dot ${dotIndex === index ? 'active' : ''}`}></span>
          ))}
        </div>
      </div>

      <div className="carousel-right">
        <img src={imageSrc} alt="Carousel Image" className="carousel-image" />
      </div>
    </div>
  );
};

export default Carousel;
