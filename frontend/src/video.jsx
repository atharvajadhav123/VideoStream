import '@fortawesome/fontawesome-free/css/all.min.css';
/*import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import './video.css';

function VideoGrid({ video_id, thumbnail_id, video_name, duration, episode_number, video_date }) {
  const video = {
    video_id: video_id,
    thumbnail_id: thumbnail_id,
    video_name: video_name,
    duration: duration,
    episode_number: episode_number,
    video_date: video_date,
  };

  return (
      <VideoThumbnail key={video.video_id} video={video} />
    
  );
}

function VideoThumbnail({ video }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasShownThumbnail, setHasShownThumbnail] = useState(false);

  const handleVideoClick = () => {
    setIsPlaying(true);
    setHasShownThumbnail(true); // Mark that the thumbnail has been shown
  };
  const handleVideoPause = () => {
    setIsPlaying(false);
  };

  // Assuming your API provides URLs for video and thumbnail
  const videoUrl = `/videos/video${video.video_id}.mp4`;
  const thumbnailUrl = `/images/${video.thumbnail_id}.jpg`;

  return (
    <div className="video-thumbnail">
      {(!isPlaying && !hasShownThumbnail) ? (
        <div>
          <div className='play-icon' onClick={handleVideoClick}>
            <i className="fas fa-play"></i>
          </div>
          <img className='thumbnail-image'
            src={thumbnailUrl}
            alt={video.video_name}
            width="100%"
            height="100%"
            onClick={handleVideoClick}
          />
        </div>
      )  : (
        <ReactPlayer
          url={videoUrl}
          controls
          width="100%"
          height="100%"
          playing={isPlaying}
          onPause={handleVideoPause}
        />
      )}
    </div>
  );
}

export default VideoGrid;

*/
import React, { useState } from 'react';
import ReactPlayer from 'react-player';
import './video.css';

function VideoGrid({video_id }) {
  const video = {
    video_id : video_id,
   
  };
 
  return (
    <div className="video-container">
      <VideoThumbnail key={video.video_id} video={video} />
    </div>
  );
}

function VideoThumbnail({ video }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handleVideoClick = () => {
    setIsPlaying(true);
  };

  // Assuming your API provides URLs for video and thumbnail
  const videoUrl = `http://localhost:8081/video/${video.video_id}`; // Endpoint for streaming video
  const thumbnailUrl = `/images/${'thumb'}.jpg`;

  return (
    <div className="video-thumbnail">
      {!isPlaying ? (
        <div onClick={handleVideoClick} className="thumbnail-image-container">
           <div className='play-icon' onClick={handleVideoClick}>
            <i className="fas fa-play"></i>
          </div>
          <img
            className="thumbnail-image"
            src={thumbnailUrl}
          />
         
        </div>
      ) : (
        <ReactPlayer
          url={videoUrl}
          controls
          width="100%"
          height="100%"
          playing={isPlaying}
        />
      )}
    </div>
  );
}

export default VideoGrid;
