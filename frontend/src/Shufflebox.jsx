// RankingBox.js
import React from 'react';
import './Shufflebox.css'; // Create a new CSS file for styling
import { NavLink } from 'react-router-dom';
const Shufflebox = ({ imageUrl, title, Episode,Season,TotalEpisodes, Date, paraid,isSelected  }) => {
  return (
    <NavLink className="rank-link" to={`/VideoPage/${encodeURIComponent(title)}/${paraid}`} >
    <div className={`shuffle-box ${isSelected ? 'selected' : ''}`}>
      <img src={imageUrl} alt="Show Poster" className="show-image" />
      <div className="show-details">
        <div className="show-title">{title}</div>
        <div className="shuffle-episode-info">
              <div className="episode-number"><i className="fas fa-microphone icons"></i>   {Episode}</div>
              <div className="season-number"><i className="fas fa-book icons"></i> {Season}</div>
              <div className="total-episodes"><i className="fas fa-cat icons"></i> {TotalEpisodes}</div>    
              <div className="shuffle-date">{Date}</div>
             
            </div>
           
        </div>
      </div>
      </NavLink>
  );
};

export default Shufflebox;
