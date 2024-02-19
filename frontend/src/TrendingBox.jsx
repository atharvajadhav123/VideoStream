import React from 'react';
import './TrendingBox.css'; // Create a new CSS file for styling
import { NavLink } from 'react-router-dom';
const TrendingBox = ({ imageUrl, title, ratings, Date, paraid }) => {
  return (
    <NavLink className="trend-link" to={`/VideoPage/${encodeURIComponent(title)}/${paraid}`} >
    <div className="  trending-box">
      <img src={imageUrl} alt="Show Poster" className="show-image" />
      <div className="show-details">
        <div className="trend-title">{title}</div>
        <div className="trending-episode-info">
              <div className="rating-number"><i className="fas fa-star icons"></i>   {ratings}</div>

             <div className="trending-date">{Date}</div>
              <div className="rank-bookmark"><i className="fas fa-bookmark" aria-hidden="true"></i></div>
             
            </div>
           
        </div>
      </div>
      </NavLink>
  );
};

export default TrendingBox;
