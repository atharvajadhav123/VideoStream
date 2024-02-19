import React from 'react';
import './ShowInfo.css'
import { useState } from 'react';
const ShowInfo = ({name, description,imageid, type, ratings, date,genre,status}) => {
    const initialMaxHeight = 4.8; // 4.8rem * 16px (line-height)
  const [isExpanded, setIsExpanded] = useState(false);
  const [maxHeight, setMaxHeight] = useState(initialMaxHeight);
  const [lineClamp, setLineClamp] = useState(3); // Initial line clamp value
  const toggleContent = () => {
    setIsExpanded(!isExpanded);
    setMaxHeight(isExpanded ? initialMaxHeight : 16.8); // Adjust as needed
    setLineClamp(isExpanded ? 3 : 10); // Adjust as needed
  };
    return (
        <div id="w-info">
            <div className="binfo">
                {/* Poster Section */}
                <div className="poster">
                    <span>
                        <img
                            itemProp="image"
                            src={`/images/card-poster${imageid}.jpg`}
                            alt="ONE PIECE"
                        />
                    </span>
                </div>

                {/* Information Section */}
                <div className="info">
                    <h1  className="title d-title" >
                        {name}
                    </h1>
                    <div className="names font-italic mb-2">{name}</div>

                    {/* Meta Information */}
                    <div className="meta icons mb-3"> <i className="rating">PG 13</i> <i className="quality">HD</i><i className="sub fas fa-closed-captioning"></i> <i className="dub fas fa-microphone"></i> </div>

                    {/* Synopsis Section */}
                    <div className="synopsis mb-3">
                        {/* Shortening Section */}
                        <div className="shorting">
                            <div className="content"style={{ maxHeight: `${maxHeight}rem`, WebkitLineClamp: lineClamp }}>{description}</div>
                            <div className="toggle" onClick={toggleContent}>{isExpanded ? '[less]' : '[more]'}</div>
                        </div>
                    </div>

                    {/* Additional Meta Information */}
                    <div className="bmeta"> <div className="meta"> <div>Type: <span><a href="tv">{type}</a></span> </div><div>Country: <span> <a href="/country/japan">Japan</a> </span> </div><div>Premiered: <span> <a href="filter?season=fall&amp;year=1999">{date}</a> </span> </div><div> Date aired: <span> <span itemProp="dateCreated">Oct 20, 1999</span> to ? </span> </div><div> Broadcast: <span>Sundays at 09:30 JST</span> </div> <div>Status: <span>{status}</span> </div><div>Genres: <span> <a href="">{genre.replace(/,/g, ', ')}</a> </span> </div></div><div className="meta">
                        <div>MAL: <span>{ratings} <span className="text-muted">by 1,296,064 reviews</span> </span> </div> <div>Duration: <span>24 min</span> </div><div>Episodes: <span>?</span> </div><div>Studios: <span> <a ><span >Toei Animation</span></a> </span> </div> <div>Producers: <span> <a itemProp="director" itemScope="" itemType="https://schema.org/Person" href="/producer/shueisha"><span itemProp="name">Shueisha</span></a>, <a itemProp="director" itemScope="" itemType="https://schema.org/Person" href="/producer/fuji-tv"><span itemProp="name">Fuji TV</span></a>, <a itemProp="director" itemScope="" itemType="https://schema.org/Person" href="/producer/tap"><span itemProp="name">TAP</span></a> </span> </div> </div> </div>
                </div>
            </div>

            {/* Rating Section */}
            <div className="brating"> <div className="rating" id="w-rating" ><div className="score"> <span className="value"> <span >{ratings}</span>/<span >10</span> </span> <span className="by"> <span >342928</span> reviews </span> </div> <div className="stars"> <span></span> <span></span> <span></span> <span></span> <span></span> </div> <div className="message">What do you think about this anime?</div> </div> </div>
        </div>
    );
};

export default ShowInfo;
