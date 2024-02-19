// RankingBox.js
import { NavLink } from 'react-router-dom';
import React from 'react';
import './RankingBox.css'; // Create a new CSS file for styling

const RankingBox = ({ rank, imageUrl, title, Season, TotalEpisodes, paraid }) => {
  return (
        <NavLink className="rank-link" to={`/VideoPage/${encodeURIComponent(title)}/${paraid}`} >
    <div className="ranking-box">
        <div className="rank-number"> <img src={`/images/rank${rank}.png`} alt="Show Poster" className="show-image" /></div>
        <img src={imageUrl} alt="Show Poster" className="show-image" />
        <div className="show-details">
          <div className="show-title">{title}</div>
          <div className="rank-episode-info">
            <div className="rank-season-number"><i className="fas fa-book icons"></i> {Season}</div>
            <div className="rank-total-episodes"><i className="fas fa-cat icons"></i> {TotalEpisodes}</div>
            <div className="rank-bookmark">
              <i className="fas fa-bookmark" aria-hidden="true"></i>
            </div>
          </div>
        </div>
      </div>
    </NavLink>
  );
};

export default RankingBox;
