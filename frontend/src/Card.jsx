import React, { useState } from 'react';
import './Card.css';
import { NavLink } from 'react-router-dom';
const Card = ({ videoid, Title, Season, Episode, Summary, OtherName, Scores, Date, Duration, Status, Genre, Image, TotalEpisodes }) => {

  const [showMore, setShowMore] = useState(false);
  return (
    <>
      {/* Card 2 */}
      <div className=" custom-card">
        <div className="card-image">
          <img src={Image} className=" custom-image" alt="Image" />
          <NavLink className="" to={`/VideoPage/${encodeURIComponent(Title)}/${videoid}`} >
          <div className="play-button">
            {/* Your play button image */}
            <img src="/images/play.png" alt="Play Button" />
          </div>
            </NavLink>
          <div className="show-card">
            <h3 className="title">{Title}</h3>
            <div className="episode-info">
              <div className="episode-number"><i className="fas fa-microphone icons"></i> {Episode}</div>
              <div className="season-number"><i className="fas fa-book icons"></i> {Season}</div>
              <div className="total-episodes"><i className="fas fa-cat icons"></i> {TotalEpisodes}</div>
              <div className="bookmark">
                <i className="fas fa-bookmark" aria-hidden="true"></i>
              </div>
            </div>

            {/* Anime Summary */}
            <p className={`summary ${showMore ? 'show-more' : ''}`}>
              {Summary}
            </p>
            {Summary.length > 100 && (
              <span
                className="show-more-btn"
                onClick={() => setShowMore(!showMore)}
              >
                {showMore ? 'Show less' : 'Show more'}
              </span>
            )}
            {/* Other Anime Details */}
            <div className="show-details">
              <h6><strong>OtherName:</strong> {OtherName}</h6>
              <h6><strong>Scores:</strong> {Scores}</h6>
              <h6><strong>Date Aired:</strong> {Date}</h6>
              <h6><strong>Duration:</strong> {Duration}</h6>
              <h6><strong>Status:</strong> {Status}</h6>
            </div>
            <div className="genre"><strong>Genre:</strong> {Genre.replace(/,/g, ', ')}</div>


            {/* Watch Button */}
            <NavLink className="watch-link " to={`/VideoPage/${encodeURIComponent(Title)}/${videoid}`} >
            <button className="watch-button"><i className="fas fa-play icons"></i> Watch Now</button>
            </NavLink>
          </div>

        </div>
        <div className="card-body">



          <div className="episode-info">
            <div className="episode-number"><i className="fas fa-microphone icons"></i> {Episode}</div>
            <div className="season-number"><i className="fas fa-book icons"></i> {Season}</div>
            <div className="total-episodes"><i className="fas fa-cat icons"></i> {TotalEpisodes}</div>
            <div className="bookmark">
              <i className="fas fa-bookmark" aria-hidden="true"></i>
            </div>
          </div>
          <div className="card-title">{Title}</div>
        </div>

      </div>

      {/* Add more cards as needed */}


    </>

  );
};
export default Card;